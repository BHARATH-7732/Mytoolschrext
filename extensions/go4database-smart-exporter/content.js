(() => {
  "use strict";

  const API_URL = "https://app.go4database.com/api/leads";
  const DB_NAME = "GO4DB_GUI_ENGINE";
  const DB_VERSION = 1;
  const STORE_RECORDS = "records";

  const PAGE_SIZE = 100;
  const REQUEST_TIMEOUT = 30000;
  const MAX_RETRIES = 4;
  const RETRY_DELAY = 2000;
  const PAGE_DELAY = 1200;

  const HEADERS = [
    "Company",
    "Job Title",
    "Person Name",
    "First Name",
    "Last Name",
    "Email1",
    "Email2",
    "Website",
    "Industry"
  ];

  let running = false;
  let stopRequested = false;
  let seenKeys = new Set();
  let collectedRecords = [];

  /******************************************************************
   * INDEXEDDB STORAGE
   ******************************************************************/

  function getDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_RECORDS)) {
          db.createObjectStore(STORE_RECORDS, { keyPath: "key" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function storeLead(lead) {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_RECORDS, "readwrite");
      const store = tx.objectStore(STORE_RECORDS);
      store.put(lead);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function loadAllStoredLeads() {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_RECORDS, "readonly");
      const store = tx.objectStore(STORE_RECORDS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result.map(r => r.data));
      req.onerror = () => reject(req.error);
    });
  }

  async function clearStoredLeads() {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_RECORDS, "readwrite");
      const store = tx.objectStore(STORE_RECORDS);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  /******************************************************************
   * NORMALIZATION & PARSING
   ******************************************************************/

  function clean(val) {
    return (val === undefined || val === null) ? "" : String(val).trim();
  }

  function firstValue(obj, keys) {
    if (!obj || typeof obj !== "object") return "";
    for (const k of keys) {
      if (obj[k] !== undefined && obj[k] !== null && clean(obj[k]) !== "") {
        return clean(obj[k]);
      }
    }
    return "";
  }

  function extractEmails(rec) {
    const list = [];
    const keys = ["email", "Email", "email1", "work_email", "business_email", "email2"];
    for (const k of keys) {
      const v = rec[k];
      if (Array.isArray(v)) v.forEach(item => clean(item) && list.push(clean(item)));
      else if (clean(v)) list.push(clean(v));
    }
    try {
      const str = JSON.stringify(rec);
      const matches = str.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
      list.push(...matches);
    } catch {}

    const uniq = [];
    for (const e of list) {
      const norm = clean(e).toLowerCase();
      if (norm && !uniq.includes(norm)) uniq.push(norm);
    }
    return uniq.slice(0, 2);
  }

  function normalizeRecord(rec) {
    if (!rec || typeof rec !== "object") return null;

    const firstName = firstValue(rec, ["first_name", "firstName", "First Name", "firstname"]);
    const lastName = firstValue(rec, ["last_name", "lastName", "Last Name", "lastname"]);
    let personName = firstValue(rec, ["person_name", "personName", "contact_name", "full_name", "name"]);
    if (!personName) personName = [firstName, lastName].filter(Boolean).join(" ");

    let company = firstValue(rec, ["company", "company_name", "business_name"]);
    if (!company && rec.company && typeof rec.company === "object") {
      company = firstValue(rec.company, ["name", "company_name"]);
    }

    let website = firstValue(rec, ["website", "company_website", "url", "domain"]);
    if (!website && rec.company && typeof rec.company === "object") {
      website = firstValue(rec.company, ["website", "url", "domain"]);
    }

    const emails = extractEmails(rec);

    return {
      Company: company,
      "Job Title": firstValue(rec, ["title", "job_title", "designation", "position"]),
      "Person Name": personName,
      "First Name": firstName,
      "Last Name": lastName,
      Email1: emails[0] || "",
      Email2: emails[1] || "",
      Website: website,
      Industry: firstValue(rec, ["industry_business", "industry", "industry_name"])
    };
  }

  function recordKey(row) {
    const e1 = clean(row.Email1).toLowerCase();
    const e2 = clean(row.Email2).toLowerCase();
    if (e1) return "email:" + e1;
    if (e2) return "email:" + e2;
    return [clean(row.Company), clean(row["Person Name"]), clean(row.Website)].join("|").toLowerCase();
  }

  function extractRecords(data) {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== "object") return [];
    const keys = ["data", "results", "leads", "records", "items", "rows"];
    for (const k of keys) {
      if (Array.isArray(data[k])) return data[k];
    }
    for (const k of keys) {
      if (data[k] && typeof data[k] === "object") {
        const nested = extractRecords(data[k]);
        if (nested.length) return nested;
      }
    }
    return [];
  }

  function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  /******************************************************************
   * CSV EXPORT
   ******************************************************************/

  function escapeCSV(val) {
    val = clean(val);
    if (val.includes('"') || val.includes(",") || val.includes("\n") || val.includes("\r")) {
      return '"' + val.replace(/"/g, '""') + '"';
    }
    return val;
  }

  function downloadCSV(rows, filename) {
    if (!rows.length) return;
    const lines = [HEADERS.map(escapeCSV).join(",")];
    for (const r of rows) {
      lines.push(HEADERS.map(h => escapeCSV(r[h] || "")).join(","));
    }
    const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "go4database_export.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  /******************************************************************
   * NETWORK CALLS
   ******************************************************************/

  async function fetchPage(filters, from, to) {
    const params = new URLSearchParams();
    if (filters.industry) params.set("industry_business", filters.industry);
    if (filters.title) params.set("title", filters.title);
    if (filters.location) params.set("location", filters.location);
    if (filters.company) params.set("company", filters.company);
    params.set("from", String(from));
    params.set("to", String(to));

    const url = API_URL + "?" + params.toString();

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      if (stopRequested) return null;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
        const res = await fetch(url, {
          method: "GET",
          headers: { "Accept": "application/json" },
          signal: controller.signal,
          credentials: "include"
        });
        clearTimeout(timeout);

        if (res.status === 429) {
          updateStatus("Rate limited (429). Pausing 10s...", "#f59e0b");
          await sleep(10000);
          throw new Error("HTTP 429");
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        if (attempt < MAX_RETRIES && !stopRequested) {
          await sleep(RETRY_DELAY * attempt);
        }
      }
    }
    throw new Error("Failed after retries.");
  }

  /******************************************************************
   * UI CREATION & LOGIC
   ******************************************************************/

  function injectGUI() {
    if (document.getElementById("go4db-panel")) return;

    const panel = document.createElement("div");
    panel.id = "go4db-panel";
    panel.innerHTML = `
      <div id="go4db-header">
        <span style="font-weight:700;">🚀 Go4DB Exporter</span>
        <button id="go4db-min-btn" style="background:none;border:none;color:#fff;cursor:pointer;font-size:14px;">_</button>
      </div>
      <div id="go4db-body">
        <div class="go4db-field">
          <label>Industry *</label>
          <input type="text" id="go4db-industry" placeholder="e.g. Information Technology" />
        </div>
        <div class="go4db-field">
          <label>Job Title *</label>
          <input type="text" id="go4db-title" placeholder="e.g. CEO, Founder, VP" />
        </div>
        <div class="go4db-field">
          <label>Location *</label>
          <input type="text" id="go4db-location" placeholder="e.g. United States" />
        </div>
        <div class="go4db-field">
          <label>Target Count *</label>
          <input type="number" id="go4db-target" value="500" min="10" />
        </div>

        <div id="go4db-progress-box">
          <div id="go4db-bar-bg"><div id="go4db-bar-fill"></div></div>
          <div id="go4db-counter">Ready (0 collected)</div>
        </div>

        <div id="go4db-status">Status: Idle</div>

        <div class="go4db-btn-row">
          <button id="go4db-start-btn" class="go4db-btn go4db-primary">Start Export</button>
          <button id="go4db-stop-btn" class="go4db-btn go4db-danger" disabled>Stop</button>
        </div>
        <div class="go4db-btn-row" style="margin-top:6px;">
          <button id="go4db-dl-btn" class="go4db-btn go4db-secondary">Download CSV</button>
          <button id="go4db-clear-btn" class="go4db-btn go4db-secondary">Clear DB</button>
        </div>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      #go4db-panel {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 310px;
        background: #1e293b;
        color: #f8fafc;
        border-radius: 10px;
        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 12px;
        z-index: 999999;
        overflow: hidden;
        border: 1px solid #334155;
      }
      #go4db-header {
        background: #0f172a;
        padding: 10px 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #334155;
      }
      #go4db-body { padding: 12px 14px; }
      .go4db-field { margin-bottom: 8px; }
      .go4db-field label { display: block; margin-bottom: 3px; color: #94a3b8; font-size: 11px; }
      .go4db-field input {
        width: 100%;
        box-sizing: border-box;
        background: #0f172a;
        border: 1px solid #334155;
        color: #fff;
        padding: 6px 8px;
        border-radius: 6px;
        font-size: 12px;
      }
      #go4db-progress-box { margin: 10px 0; }
      #go4db-bar-bg { width: 100%; height: 7px; background: #334155; border-radius: 4px; overflow: hidden; }
      #go4db-bar-fill { width: 0%; height: 100%; background: #10b981; transition: width 0.3s ease; }
      #go4db-counter { font-size: 11px; color: #cbd5e1; margin-top: 4px; text-align: right; }
      #go4db-status { font-size: 11px; color: #94a3b8; margin-bottom: 10px; min-height: 16px; }
      .go4db-btn-row { display: flex; gap: 6px; }
      .go4db-btn {
        flex: 1;
        padding: 7px 0;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        border: none;
      }
      .go4db-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      .go4db-primary { background: #3b82f6; color: #fff; }
      .go4db-primary:hover:not(:disabled) { background: #2563eb; }
      .go4db-danger { background: #ef4444; color: #fff; }
      .go4db-secondary { background: #334155; color: #cbd5e1; }
      .go4db-secondary:hover:not(:disabled) { background: #475569; }
    `;

    document.head.appendChild(style);
    document.body.appendChild(panel);

    // Event Bindings
    const minBtn = panel.querySelector("#go4db-min-btn");
    const body = panel.querySelector("#go4db-body");
    minBtn.addEventListener("click", () => {
      body.style.display = body.style.display === "none" ? "block" : "none";
    });

    panel.querySelector("#go4db-start-btn").addEventListener("click", startWorkflow);
    panel.querySelector("#go4db-stop-btn").addEventListener("click", () => { stopRequested = true; });
    panel.querySelector("#go4db-dl-btn").addEventListener("click", () => downloadCSV(collectedRecords));
    panel.querySelector("#go4db-clear-btn").addEventListener("click", async () => {
      if (confirm("Wipe all local stored leads?")) {
        await clearStoredLeads();
        collectedRecords = [];
        seenKeys.clear();
        updateProgress(0, 1);
        updateStatus("Database cleared", "#94a3b8");
      }
    });

    // Pre-populate previously fetched records
    loadAllStoredLeads().then(leads => {
      if (leads.length) {
        collectedRecords = leads;
        leads.forEach(l => seenKeys.add(recordKey(l)));
        updateProgress(leads.length, leads.length);
        updateStatus(`Restored ${leads.length} leads from DB`, "#10b981");
      }
    });
  }

  function updateStatus(text, color = "#94a3b8") {
    const el = document.getElementById("go4db-status");
    if (el) {
      el.textContent = text;
      el.style.color = color;
    }
  }

  function updateProgress(current, target) {
    const fill = document.getElementById("go4db-bar-fill");
    const counter = document.getElementById("go4db-counter");
    const pct = Math.min(100, Math.round((current / (target || 1)) * 100));
    if (fill) fill.style.width = pct + "%";
    if (counter) counter.textContent = `${current.toLocaleString()} / ${target.toLocaleString()} leads (${pct}%)`;
  }

  /******************************************************************
   * MAIN WORKFLOW EXECUTION
   ******************************************************************/

  async function startWorkflow() {
    if (running) return;

    const filters = {
      industry: clean(document.getElementById("go4db-industry").value),
      title: clean(document.getElementById("go4db-title").value),
      location: clean(document.getElementById("go4db-location").value),
      target: Number(document.getElementById("go4db-target").value) || 100
    };

    if (!filters.industry || !filters.title || !filters.location) {
      alert("Industry, Job Title, and Location are mandatory.");
      return;
    }

    running = true;
    stopRequested = false;

    document.getElementById("go4db-start-btn").disabled = true;
    document.getElementById("go4db-stop-btn").disabled = false;

    updateStatus("Running extraction...", "#3b82f6");

    let from = 0;
    let to = PAGE_SIZE;

    try {
      while (!stopRequested && collectedRecords.length < filters.target) {
        updateStatus(`Fetching offset ${from} to ${to}...`, "#3b82f6");
        const data = await fetchPage(filters, from, to);

        if (stopRequested) break;

        const raw = extractRecords(data);
        if (!raw.length) {
          updateStatus("No more leads returned by server.", "#94a3b8");
          break;
        }

        let newInPage = 0;
        for (const item of raw) {
          const row = normalizeRecord(item);
          if (!row) continue;

          const key = recordKey(row);
          if (!key || seenKeys.has(key)) continue;

          seenKeys.add(key);
          collectedRecords.push(row);
          await storeLead({ key, data: row });
          newInPage++;

          if (collectedRecords.length >= filters.target) break;
        }

        updateProgress(collectedRecords.length, filters.target);
        updateStatus(`+${newInPage} leads added. Throttling...`, "#10b981");

        from += PAGE_SIZE;
        to += PAGE_SIZE;

        await sleep(PAGE_DELAY);
      }

      if (collectedRecords.length >= filters.target) {
        updateStatus("Target reached! Auto-downloading...", "#10b981");
        downloadCSV(collectedRecords.slice(0, filters.target));
      }
    } catch (err) {
      updateStatus("Export stopped: " + err.message, "#ef4444");
    } finally {
      running = false;
      document.getElementById("go4db-start-btn").disabled = false;
      document.getElementById("go4db-stop-btn").disabled = true;
    }
  }

  // Chrome extension boot: run immediately and retry for SPA navigation.
  function bootGo4DB() {
    try { injectGUI(); } catch (e) { console.error("[Go4DB Exporter] GUI injection failed:", e); }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootGo4DB, { once: true });
  } else {
    bootGo4DB();
  }
  [500, 1500, 3000, 6000].forEach(ms => setTimeout(bootGo4DB, ms));
  let __go4dbLastUrl = location.href;
  setInterval(() => {
    if (location.href !== __go4dbLastUrl) {
      __go4dbLastUrl = location.href;
      setTimeout(bootGo4DB, 100);
      setTimeout(bootGo4DB, 1000);
    }
    if (!document.getElementById("go4db-panel")) bootGo4DB();
  }, 1000);
})();