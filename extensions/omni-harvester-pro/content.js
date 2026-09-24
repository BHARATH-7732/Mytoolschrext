(async () => {
  "use strict";

  const existingPanel = document.getElementById("gmaps-omni-suite");
  if (existingPanel) existingPanel.remove();

  const COUNTRY_PRESETS = {
    US: [
      "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
      "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "Jacksonville, FL",
      "Austin, TX", "Fort Worth, TX", "San Jose, CA", "Columbus, OH", "Charlotte, NC",
      "Indianapolis, IN", "San Francisco, CA", "Seattle, WA", "Denver, CO", "Oklahoma City, OK",
      "Nashville, TN", "El Paso, TX", "Washington, DC", "Las Vegas, NV", "Boston, MA",
      "Portland, OR", "Louisville, KY", "Memphis, TN", "Detroit, MI", "Baltimore, MD",
      "Milwaukee, WI", "Albuquerque, NM", "Tucson, AZ", "Fresno, CA", "Sacramento, CA",
      "Mesa, AZ", "Kansas City, MO", "Atlanta, GA", "Colorado Springs, CO", "Omaha, NE",
      "Raleigh, NC", "Virginia Beach, VA", "Long Beach, CA", "Miami, FL", "Oakland, CA",
      "Minneapolis, MN", "Tulsa, OK", "Bakersfield, CA", "Tampa, FL", "Wichita, KS",
      "Arlington, TX", "Aurora, CO", "New Orleans, LA", "Cleveland, OH", "Anaheim, CA",
      "Henderson, NV", "Honolulu, HI", "Riverside, CA", "Santa Ana, CA", "Corpus Christi, TX",
      "Lexington, KY", "San Juan, PR", "Stockton, CA", "St. Paul, MN", "Cincinnati, OH",
      "Irvine, CA", "Greensboro, NC", "Pittsburgh, PA", "Lincoln, NE", "St. Louis, MO",
      "Orlando, FL", "Durham, NC", "Plano, TX", "Anchorage, AK", "Newark, NJ",
      "Chula Vista, CA", "Fort Wayne, IN", "St. Petersburg, FL", "Laredo, TX", "Jersey City, NJ",
      "Chandler, AZ", "Madison, WI", "Lubbock, TX", "Scottsdale, AZ", "Reno, NV",
      "Buffalo, NY", "Gilbert, AZ", "Glendale, AZ", "North Las Vegas, NV", "Winston-Salem, NC",
      "Chesapeake, VA", "Norfolk, VA", "Fremont, CA", "Garland, TX", "Irving, TX",
      "Hialeah, FL", "Richmond, VA", "Boise, ID", "Spokane, WA", "Baton Rouge, LA",
      "Tacoma, WA", "San Bernardino, CA", "Modesto, CA", "Fontana, CA", "Des Moines, IA",
      "Moreno Valley, CA", "Santa Clarita, CA", "Fayetteville, NC", "Birmingham, AL", "Oxnard, CA",
      "Rochester, NY", "Port St. Lucie, FL", "Grand Rapids, MI", "Huntsville, AL", "Salt Lake City, UT",
      "Frisco, TX", "Yonkers, NY", "Amarillo, TX", "Glendale, CA", "Huntington Beach, CA",
      "McKinney, TX", "Montgomery, AL", "Augusta, GA", "Aurora, IL", "Akron, OH",
      "Little Rock, AR", "Tempe, AZ", "Columbus, GA", "Overland Park, KS", "Grand Prairie, TX",
      "Tallahassee, FL", "Cape Coral, FL", "Mobile, AL", "Knoxville, TN", "Shreveport, LA",
      "Worcester, MA", "Ontario, CA", "Vancouver, WA", "Sioux Falls, SD", "Chattanooga, TN",
      "Brownsville, TX", "Fort Lauderdale, FL", "Providence, RI", "Newport News, VA", "Rancho Cucamonga, CA",
      "Santa Rosa, CA", "Peoria, AZ", "Oceanside, CA", "Elk Grove, CA", "Salem, OR",
      "Pembroke Pines, FL", "Eugene, OR", "Garden Grove, CA", "Cary, NC", "Fort Collins, CO",
      "Corona, CA", "Springfield, MO", "Jackson, MS", "Alexandria, VA", "Hayward, CA",
      "Clarksville, TN", "Lakewood, CO", "Lancaster, CA", "Salinas, CA", "Palmdale, CA",
      "Hollywood, FL", "Springfield, MA", "Macon, GA", "Sunnyvale, CA", "Pomona, CA",
      "Killeen, TX", "Escondido, CA", "Pasadena, TX", "Naperville, IL", "Bellevue, WA",
      "Joliet, IL", "Murfreesboro, TN", "Midland, TX", "Rockford, IL", "Paterson, NJ",
      "Savannah, GA", "Bridgeport, CT", "Torrance, CA", "McAllen, TX", "Syracuse, NY",
      "Surprise, AZ", "Denton, TX", "Roseville, CA", "Thornton, CO", "Miramar, FL",
      "Pasadena, CA", "Mesquite, TX", "Olathe, KS", "Dayton, OH", "Carrollton, TX",
      "Waco, TX", "Orange, CA", "Fullerton, CA", "Charleston, SC", "West Valley City, UT",
      "Visalia, CA", "Hampton, VA", "Gainesville, FL", "Warren, MI", "Coral Springs, FL",
      "Round Rock, TX", "Sterling Heights, MI", "Kent, WA", "Columbia, SC", "Santa Clara, CA",
      "New Haven, CT", "Stamford, CT", "Concord, CA", "Elizabeth, NJ", "Athens, GA",
      "Thousand Oaks, CA", "Lafayette, LA", "Simi Valley, CA", "Topeka, KS", "Norman, OK",
      "Fargo, ND", "Wilmington, NC", "Abilene, TX", "Odessa, TX", "Pearland, TX",
      "Victorville, CA", "Hartford, CT", "Vallejo, CA", "Allentown, PA", "Berkeley, CA",
      "Richardson, TX", "Arvada, CO", "Ann Arbor, MI", "Rochester, MN", "Cambridge, MA",
      "Sugar Land, TX", "Lansing, MI", "Evansville, IN", "College Station, TX", "Fairfield, CA",
      "Clearwater, FL", "Beaumont, TX", "Independence, MO", "Provo, UT", "West Jordan, UT",
      "Murrieta, CA", "Palm Bay, FL", "El Monte, CA", "Carlsbad, CA", "North Charleston, SC",
      "Temecula, CA", "Clovis, CA", "Meridian, ID", "Westminster, CO", "League City, TX",
      "Pueblo, CO", "Gresham, OR", "High Point, NC", "Billings, MT", "Waterbury, CT",
      "Antioch, CA", "Everett, WA", "Downey, CA", "Green Bay, WI", "Centennial, CO",
      "Broken Arrow, OK", "Richmond, CA", "Inglewood, CA", "Burbank, CA", "Sandy Springs, GA",
      "Pompano Beach, FL", "Costa Mesa, CA", "Daly City, CA", "Manchester, NH", "Miami Gardens, FL",
      "Norwalk, CA", "West Palm Beach, FL", "Wichita Falls, TX", "Greenville, NC", "Lakeland, FL",
      "San Mateo, CA", "Rialto, CA", "Boulder, CO", "Edison, NJ", "Davenport, IA",
      "Hillsboro, OR", "Woodbridge, NJ", "Kenosha, WI", "South Bend, IN", "El Cajon, CA",
      "Renton, WA", "Tyler, TX", "Jurupa Valley, CA", "Allen, TX", "Sparks, NV",
      "Santa Maria, CA", "Lee's Summit, MO", "New Bedford, MA", "Concord, NC", "Davie, FL"
    ],
    UK: [
      "London", "Birmingham", "Manchester", "Glasgow", "Liverpool",
      "Bristol", "Edinburgh", "Sheffield", "Leeds", "Leicester",
      "Coventry", "Bradford", "Cardiff", "Belfast", "Nottingham",
      "Newcastle upon Tyne", "Hull", "Southampton", "Reading", "Derby",
      "Plymouth", "Stoke-on-Trent", "Wolverhampton", "Swansea", "Milton Keynes",
      "Aberdeen", "Northampton", "Luton", "Portsmouth", "Norwich"
    ],
    AU: [
      "Sydney, NSW", "Melbourne, VIC", "Brisbane, QLD", "Perth, WA", "Adelaide, SA",
      "Gold Coast, QLD", "Newcastle, NSW", "Canberra, ACT", "Sunshine Coast, QLD", "Wollongong, NSW",
      "Geelong, VIC", "Hobart, TAS", "Townsville, QLD", "Cairns, QLD", "Toowoomba, QLD",
      "Darwin, NT", "Ballarat, VIC", "Bendigo, VIC", "Albury, NSW", "Launceston, TAS"
    ],
    CA: [
      "Toronto, ON", "Montreal, QC", "Vancouver, BC", "Calgary, AB", "Edmonton, AB",
      "Ottawa, ON", "Winnipeg, MB", "Quebec City, QC", "Hamilton, ON", "Kitchener, ON",
      "London, ON", "Victoria, BC", "Halifax, NS", "Oshawa, ON", "Windsor, ON",
      "Saskatoon, SK", "Regina, SK", "St. John's, NL", "Kelowna, BC", "Barrie, ON"
    ]
  };

  const AGGREGATOR_DOMAINS = [
    "yelp.com", "yellowpages.com", "healthgrades.com", "zocdoc.com",
    "mapquest.com", "facebook.com", "instagram.com", "twitter.com",
    "linkedin.com", "bbb.org", "solvhealth.com", "webmd.com", "tripadvisor.com"
  ];

  const STORAGE_KEY_DATA = "__gmaps_omni_leads__";
  const STORAGE_KEY_IDX = "__gmaps_omni_idx__";
  const STORAGE_KEY_KW = "__gmaps_omni_kw__";
  const STORAGE_KEY_CTRY = "__gmaps_omni_country__";
  const STORAGE_KEY_WH = "__gmaps_omni_webhook__";
  const STORAGE_KEY_MAX_CITIES = "__gmaps_omni_max_cities__";
  const SETTLE_DELAY_SEC = 5;

  let recoveredRecords = [];
  let savedIdx = 0;
  let savedKeyword = "";
  let savedCountry = "US";
  let savedWebhook = "";
  let savedMaxCities = 50;

  try {
    const rawData = localStorage.getItem(STORAGE_KEY_DATA);
    if (rawData) {
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) recoveredRecords = parsed;
    }
    savedIdx = parseInt(localStorage.getItem(STORAGE_KEY_IDX) || "0", 10);
    if (isNaN(savedIdx) || savedIdx < 0) savedIdx = 0;
    savedKeyword = localStorage.getItem(STORAGE_KEY_KW) || "";
    savedCountry = localStorage.getItem(STORAGE_KEY_CTRY) || "US";
    savedWebhook = localStorage.getItem(STORAGE_KEY_WH) || "";
    savedMaxCities = parseInt(localStorage.getItem(STORAGE_KEY_MAX_CITIES) || "50", 10);
    if (isNaN(savedMaxCities) || savedMaxCities <= 0) savedMaxCities = 50;
  } catch (e) {
    console.warn("Session restore skipped:", e);
  }

  let BASE_KEYWORD = savedKeyword || "Healthcare Network";

  window.__gmapsOmni = {
    keyword: BASE_KEYWORD,
    country: savedCountry,
    locations: COUNTRY_PRESETS[savedCountry] || COUNTRY_PRESETS.US,
    currentIdx: savedIdx,
    maxCitiesToCollect: savedMaxCities,
    records: new Map(recoveredRecords),
    isRunning: false,
    requireWebsite: true,
    filterAggregators: true,
    minRating: 0,
    minReviews: 0,
    autoBackupBatch: 500,
    lastBackupMilestone: Math.floor(recoveredRecords.length / 500) * 500,
    webhookUrl: savedWebhook
  };

  const state = window.__gmapsOmni;

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const randomSleep = (min, max) => new Promise(r => setTimeout(r, Math.floor(Math.random() * (max - min + 1)) + min));

  function persistData() {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(Array.from(state.records.entries())));
      localStorage.setItem(STORAGE_KEY_IDX, state.currentIdx.toString());
      localStorage.setItem(STORAGE_KEY_KW, state.keyword);
      localStorage.setItem(STORAGE_KEY_CTRY, state.country);
      localStorage.setItem(STORAGE_KEY_WH, state.webhookUrl);
      localStorage.setItem(STORAGE_KEY_MAX_CITIES, state.maxCitiesToCollect.toString());
    } catch (e) {
      console.warn("Storage quota warning:", e);
    }
  }

  function playBeep(freq = 600, duration = 0.3) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  function playCaptchaAlarm() {
    playBeep(900, 0.2);
    setTimeout(() => playBeep(1200, 0.3), 250);
  }

  function cleanDomain(rawUrl) {
    if (!rawUrl) return "";
    try {
      let target = rawUrl.includes("google.com/url") ? new URL(rawUrl).searchParams.get("q") || rawUrl : rawUrl;
      return new URL(target.startsWith("http") ? target : `https://${target}`).origin;
    } catch {
      return rawUrl;
    }
  }

  function sanitizePhone(raw) {
    if (!raw) return "";
    const digits = raw.replace(/[^\d+]/g, "");
    return digits.length >= 7 ? digits : raw.trim();
  }

  function parseAddress(fullText) {
    if (!fullText) return { Street: "", City: "", StateCode: "", Zip: "" };
    const zipMatch = fullText.match(/\b\d{4,5}(-\d{4})?\b/);
    const zip = zipMatch ? zipMatch[0] : "";
    const stateMatch = fullText.match(/\b([A-Z]{2,3})\b\s*\d{4,5}/);
    const stateCode = stateMatch ? stateMatch[1] : "";
    const parts = fullText.split(",").map(p => p.trim());
    return {
      Street: parts[0] || fullText,
      City: parts.length >= 3 ? parts[parts.length - 2].replace(/\b[A-Z]{2,3}\b/, "").trim() : (parts[0] || ""),
      StateCode: stateCode,
      Zip: zip
    };
  }

  function checkCaptcha() {
    const isCaptcha = document.body.innerText.includes("unusual traffic") || 
                      document.body.innerText.includes("solve the challenge below") ||
                      document.querySelector('iframe[src*="recaptcha"]');
    if (isCaptcha) {
      playCaptchaAlarm();
      console.warn("CAPTCHA detected. Complete the verification manually.");
      return true;
    }
    return false;
  }

  // --- Dynamic DOM selectors for both desktop sidebars and floating panel feeds ---
  function findFeed() {
    const primary = document.querySelector('div[role="feed"]');
    if (primary && primary.scrollHeight > 100) return primary;

    const mainPane = document.querySelector('div[role="main"]');
    if (mainPane) {
      const scrollable = mainPane.querySelector('div.m6QErb.DxyBCb, div.m6QErb[aria-label]');
      if (scrollable && scrollable.scrollHeight > 100) return scrollable;
    }

    const labeled = document.querySelector('div[aria-label*="Results for" i], div[aria-label*="Search results" i]');
    if (labeled && labeled.scrollHeight > 100) return labeled;

    const sampleCard = document.querySelector('.Nv2PK, div[jsaction*="mouseover:pane"]');
    if (sampleCard) {
      let parent = sampleCard.parentElement;
      while (parent && parent !== document.body) {
        if (parent.scrollHeight > parent.clientHeight && parent.clientHeight > 150) {
          return parent;
        }
        parent = parent.parentElement;
      }
    }

    return null;
  }

  async function triggerSearch(queryText) {
    const targetPath = `/maps/search/${encodeURIComponent(queryText).replace(/%20/g, "+")}`;
    
    // Internal state routing
    window.history.pushState({}, "", targetPath);
    window.dispatchEvent(new PopStateEvent("popstate"));

    // DOM search bar trigger
    const input = document.querySelector('input#searchboxinput, input[name="q"], input.searchboxinput');
    if (input) {
      input.focus();
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      nativeSetter.call(input, queryText);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));

      await sleep(250);

      const searchBtn = document.querySelector('button#searchbox-searchbutton, button[aria-label="Search"], button.oya7nb');
      if (searchBtn) {
        searchBtn.click();
      } else {
        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", keyCode: 13, code: "Enter", which: 13, bubbles: true }));
      }
    }
  }

  const panel = document.createElement("div");
  panel.id = "gmaps-omni-suite";
  panel.style.cssText = `
    position: fixed;
    top: 15px;
    right: 15px;
    z-index: 9999999;
    background: #0f172a;
    color: #f8fafc;
    padding: 14px;
    border-radius: 12px;
    box-shadow: 0 16px 36px rgba(0,0,0,0.6);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 12px;
    width: 320px;
    border: 1px solid #334155;
  `;

  panel.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
      <span style="font-weight:700; font-size:13px; color:#38bdf8;">Omni-Harvester Pro</span>
      <span id="p-status" style="background:#ef4444; color:#fff; font-size:10px; padding:2px 6px; border-radius:999px; font-weight:700;">PAUSED</span>
    </div>

    <div style="display:flex; gap:6px; margin-bottom:6px;">
      <div style="flex:1;">
        <label style="font-size:10px; color:#94a3b8;">Country:</label>
        <select id="p-country-select" style="width:100%; background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; padding:3px; font-size:11px;">
          <option value="US" ${state.country === "US" ? "selected" : ""}>USA (${COUNTRY_PRESETS.US.length})</option>
          <option value="UK" ${state.country === "UK" ? "selected" : ""}>UK (${COUNTRY_PRESETS.UK.length})</option>
          <option value="AU" ${state.country === "AU" ? "selected" : ""}>Australia (${COUNTRY_PRESETS.AU.length})</option>
          <option value="CA" ${state.country === "CA" ? "selected" : ""}>Canada (${COUNTRY_PRESETS.CA.length})</option>
        </select>
      </div>
      <div style="flex:2;">
        <label style="font-size:10px; color:#94a3b8;">Keyword:</label>
        <input id="p-keyword-input" value="${state.keyword}" style="width:90%; background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; padding:3px 5px; font-size:11px;"/>
      </div>
    </div>

    <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
      <label style="font-size:10px; color:#94a3b8;">Start:</label>
      <select id="p-location-select" style="flex:1; background:#1e293b; color:#f8fafc; border:1px solid #475569; border-radius:4px; font-size:11px; padding:3px;">
        ${state.locations.map((c, i) => `<option value="${i}" ${i === state.currentIdx ? "selected" : ""}>[${i + 1}/${state.locations.length}]${c}</option>`).join("")}
      </select>
      <button id="p-skip-btn" style="background:#475569; color:#fff; border:none; border-radius:4px; padding:3px 8px; cursor:pointer; font-size:11px;">Go</button>
    </div>

    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; background:#1e293b; padding:5px 8px; border-radius:6px;">
      <label style="font-size:10px; color:#cbd5e1; font-weight:600;">Cities to Collect:</label>
      <input type="number" id="inp-max-cities" value="${state.maxCitiesToCollect}" min="1" max="${state.locations.length}" style="width:60px; background:#0f172a; color:#38bdf8; border:1px solid #475569; border-radius:4px; font-size:11px; padding:2px 4px; font-weight:700; text-align:center;">
    </div>

    <div style="background:#1e293b; border-radius:6px; padding:8px; margin-bottom:8px; font-size:11px; color:#cbd5e1;">
      <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
        <label><input type="checkbox" id="chk-website" ${state.requireWebsite ? "checked" : ""}> Must Have Site</label>
        <label><input type="checkbox" id="chk-aggregators" ${state.filterAggregators ? "checked" : ""}> No Directories</label>
      </div>
      <div style="display:flex; gap:8px; align-items:center; margin-top:4px;">
        <span>Min ★:</span>
        <input type="number" id="inp-rating" value="0" min="0" max="5" step="0.5" style="width:40px; background:#0f172a; color:#fff; border:1px solid #475569; border-radius:3px; font-size:10px; padding:2px;">
        <span>Min Reviews:</span>
        <input type="number" id="inp-reviews" value="0" min="0" step="5" style="width:46px; background:#0f172a; color:#fff; border:1px solid #475569; border-radius:3px; font-size:10px; padding:2px;">
      </div>
    </div>

    <div style="background:#1e293b; border-radius:6px; padding:6px 8px; margin-bottom:8px; font-size:11px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:700; color:#f1f5f9;">Captured Leads: <b id="p-counter" style="color:#4ade80;">${state.records.size}</b></span>
        <span style="font-size:10px; color:#94a3b8;">Sync @ <b id="p-next-backup" style="color:#38bdf8;">${state.lastBackupMilestone + state.autoBackupBatch}</b></span>
      </div>
    </div>

    <div style="margin-bottom:8px;">
      <input id="p-webhook-input" placeholder="Google Apps Script Web App URL" value="${state.webhookUrl}" style="width:94%; background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; padding:3px 5px; font-size:10px;"/>
    </div>

    <div id="p-timer" style="font-size:11px; color:#38bdf8; margin-bottom:8px; display:none;">
      ⏳ Settling: <span id="p-timer-sec">5</span>s
    </div>

    <div style="display:flex; gap:6px; margin-bottom:6px;">
      <button id="p-toggle" style="flex:1; padding:7px; background:#22c55e; color:#fff; border:none; border-radius:6px; font-weight:700; cursor:pointer;">▶ Start</button>
      <button id="p-download" style="flex:1; padding:7px; background:#3b82f6; color:#fff; border:none; border-radius:6px; font-weight:700; cursor:pointer;">⬇ CSV</button>
      <button id="p-sync-webhook" style="padding:7px 10px; background:#8b5cf6; color:#fff; border:none; border-radius:6px; font-weight:700; cursor:pointer;" title="Sync to Sheet Now">⚡</button>
    </div>

    <button id="p-reset" style="width:100%; padding:3px; background:transparent; color:#64748b; border:1px solid #334155; border-radius:4px; font-size:10px; cursor:pointer;">Reset Memory</button>
  `;

  document.body.appendChild(panel);

  const statusEl = document.getElementById("p-status");
  const countrySelect = document.getElementById("p-country-select");
  const locationSelect = document.getElementById("p-location-select");
  const skipBtn = document.getElementById("p-skip-btn");
  const counterEl = document.getElementById("p-counter");
  const nextBackupEl = document.getElementById("p-next-backup");
  const inpMaxCities = document.getElementById("inp-max-cities");
  const chkWebsite = document.getElementById("chk-website");
  const chkAggregators = document.getElementById("chk-aggregators");
  const inpRating = document.getElementById("inp-rating");
  const inpReviews = document.getElementById("inp-reviews");
  const webhookInput = document.getElementById("p-webhook-input");
  const syncWebhookBtn = document.getElementById("p-sync-webhook");
  const timerEl = document.getElementById("p-timer");
  const timerSec = document.getElementById("p-timer-sec");
  const toggleBtn = document.getElementById("p-toggle");
  const downloadBtn = document.getElementById("p-download");
  const resetBtn = document.getElementById("p-reset");
  const kwInput = document.getElementById("p-keyword-input");

  countrySelect.addEventListener("change", e => {
    state.country = e.target.value;
    state.locations = COUNTRY_PRESETS[state.country] || COUNTRY_PRESETS.US;
    state.currentIdx = 0;
    locationSelect.innerHTML = state.locations.map((c, i) => `<option value="${i}">[${i + 1}/${state.locations.length}] ${c}</option>`).join("");
    inpMaxCities.max = state.locations.length.toString();
    persistData();
  });

  kwInput.addEventListener("change", e => {
    state.keyword = e.target.value.trim();
    persistData();
  });

  webhookInput.addEventListener("change", e => {
    state.webhookUrl = e.target.value.trim();
    persistData();
  });

  inpMaxCities.addEventListener("change", e => {
    const val = parseInt(e.target.value, 10);
    state.maxCitiesToCollect = (!isNaN(val) && val > 0) ? val : 50;
    inpMaxCities.value = state.maxCitiesToCollect.toString();
    persistData();
  });

  chkWebsite.addEventListener("change", e => { state.requireWebsite = e.target.checked; });
  chkAggregators.addEventListener("change", e => { state.filterAggregators = e.target.checked; });
  inpRating.addEventListener("change", e => { state.minRating = parseFloat(e.target.value) || 0; });
  inpReviews.addEventListener("change", e => { state.minReviews = parseInt(e.target.value, 10) || 0; });

  skipBtn.addEventListener("click", () => {
    state.currentIdx = parseInt(locationSelect.value, 10);
    console.log(`Jumped to: [${state.currentIdx + 1}/${state.locations.length}] ${state.locations[state.currentIdx]}`);
  });

  resetBtn.addEventListener("click", () => {
    if (window.confirm("Clear all gathered records and progress?")) {
      try {
        localStorage.removeItem(STORAGE_KEY_DATA);
        localStorage.removeItem(STORAGE_KEY_IDX);
        localStorage.removeItem(STORAGE_KEY_KW);
        localStorage.removeItem(STORAGE_KEY_MAX_CITIES);
      } catch {}
      state.records.clear();
      state.currentIdx = 0;
      state.lastBackupMilestone = 0;
      counterEl.innerText = "0";
      nextBackupEl.innerText = state.autoBackupBatch.toString();
      locationSelect.value = "0";
      console.log("Memory cleared.");
    }
  });

  async function pushToWebhook(recordsList, isSilent = false) {
    if (!state.webhookUrl) {
      if (!isSilent) alert("Please enter your Apps Script Web App URL first.");
      return;
    }
    syncWebhookBtn.innerText = "⏳";
    try {
      await fetch(state.webhookUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          source: "GoogleMapsHarvester",
          country: state.country,
          keyword: state.keyword,
          timestamp: new Date().toISOString(),
          leads: recordsList
        })
      });
      console.log(`Dispatched ${recordsList.length} leads to Google Sheet.`);
      if (!isSilent) playBeep(880, 0.2);
    } catch (err) {
      console.error("Webhook push failed:", err);
      if (!isSilent) alert("Webhook sync failed. Verify script deployment URL.");
    } finally {
      syncWebhookBtn.innerText = "⚡";
    }
  }

  syncWebhookBtn.addEventListener("click", () => pushToWebhook(Array.from(state.records.values()), false));

  function downloadCSV() {
    const list = Array.from(state.records.values());
    if (!list.length) {
      alert("No records collected to export.");
      return;
    }

    const headers = [
      "Country", "TargetCity", "Query", "CompanyName", "Category", 
      "PriceTier", "Status", "Website", "Phone", "Rating", 
      "ReviewCount", "Street", "City", "StateCode", "ZipCode", 
      "Latitude", "Longitude", "GoogleMapsUrl"
    ];
    const esc = val => `"${String(val ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;

    const csvRows = [
      headers.join(","),
      ...list.map(r => headers.map(h => esc(r[h])).join(","))
    ];

    const blob = new Blob(["\ufeff" + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const dlUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = dlUrl;
    a.download = `${state.country}_${state.keyword.replace(/\s+/g, "_")}_${list.length}leads.csv`.toLowerCase();
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(dlUrl), 2000);
  }

  function checkSyncThreshold() {
    const count = state.records.size;
    if (count >= state.lastBackupMilestone + state.autoBackupBatch) {
      state.lastBackupMilestone = Math.floor(count / state.autoBackupBatch) * state.autoBackupBatch;
      nextBackupEl.innerText = (state.lastBackupMilestone + state.autoBackupBatch).toString();
      if (state.webhookUrl) {
        pushToWebhook(Array.from(state.records.values()), true);
      }
    }
  }

  function parseCards(feed, currentCity) {
    if (!feed) return;
    const cards = feed.querySelectorAll(".Nv2PK");

    cards.forEach(card => {
      try {
        const anchor = card.querySelector('a.hfpxzc, a[href*="/maps/place/"]');
        const placeUrl = anchor ? anchor.href : "";
        if (!placeUrl) return;

        let latitude = "", longitude = "";
        const coordMatch = placeUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
        if (coordMatch) {
          latitude = coordMatch[1];
          longitude = coordMatch[2];
        }

        const placeToken = (placeUrl.match(/1s(0x[0-9a-f:]+)/) || [])[1] || placeUrl;
        if (state.records.has(placeToken)) return;

        const nameEl = card.querySelector(".qBF1Pd, .fontHeadlineSmall, [role='heading']");
        const companyName = nameEl ? nameEl.textContent.trim() : "";
        if (!companyName) return;

        const siteAnchor = card.querySelector('a[data-value="Website"], a[aria-label*="website" i], a.lcr4fd');
        let website = siteAnchor ? cleanDomain(siteAnchor.href) : "";

        if (state.filterAggregators && website) {
          const isAggregator = AGGREGATOR_DOMAINS.some(d => website.toLowerCase().includes(d));
          if (isAggregator) website = "";
        }

        if (state.requireWebsite && !website) return;

        const ratingEl = card.querySelector(".MW4etd, span[aria-hidden='true']");
        const rating = ratingEl ? parseFloat(ratingEl.textContent.replace(",", ".")) || 0 : 0;

        const reviewsEl = card.querySelector(".UY7F9, span[aria-label*='reviews']");
        let reviewCount = 0;
        if (reviewsEl) {
          const rawReviews = (reviewsEl.getAttribute("aria-label") || reviewsEl.textContent).replace(/[^\d]/g, "");
          reviewCount = parseInt(rawReviews, 10) || 0;
        }

        if (rating < state.minRating || reviewCount < state.minReviews) return;

        const textContainers = card.querySelectorAll(".W4Efsd");
        let rawAddress = "";
        let phone = "";
        let category = "";
        let priceTier = "";
        let openStatus = "";

        textContainers.forEach(container => {
          const text = container.textContent.trim();

          const priceMatch = text.match(/[$€£¥]{1,4}/);
          if (priceMatch && !priceTier) priceTier = priceMatch[0];

          const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);
          if (phoneMatch && !phone) phone = sanitizePhone(phoneMatch[0]);

          if (/open|closed|opens soon|closing soon/i.test(text) && !openStatus) {
            const statusMatch = text.match(/(Open 24 hours|Open ⋅ Closes [^·]+|Closed ⋅ Opens [^·]+|Closed)/i);
            if (statusMatch) openStatus = statusMatch[0];
          }

          const segments = text.split("·").map(s => s.trim());
          if (segments.length > 1) {
            if (!category && isNaN(segments[0])) category = segments[0];
            const addressCandidate = segments.find(s => /\d+/.test(s) && !s.includes("$") && s !== phone);
            if (addressCandidate && !rawAddress) rawAddress = addressCandidate;
          }
        });

        const addressData = parseAddress(rawAddress);

        const record = {
          Country: state.country,
          TargetCity: currentCity,
          Query: `${state.keyword} in ${currentCity}`,
          CompanyName: companyName,
          Category: category,
          PriceTier: priceTier,
          Status: openStatus,
          Website: website,
          Phone: phone,
          Rating: rating,
          ReviewCount: reviewCount,
          Street: addressData.Street,
          City: addressData.City || currentCity,
          StateCode: addressData.StateCode,
          ZipCode: addressData.Zip,
          Latitude: latitude,
          Longitude: longitude,
          GoogleMapsUrl: placeUrl
        };

        state.records.set(placeToken, record);
        counterEl.innerText = state.records.size.toString();
        checkSyncThreshold();
      } catch (err) {
        console.debug("Card extraction skipped:", err);
      }
    });

    persistData();
  }

  async function scrollFeedUntilEnd(feed, currentCity) {
    let lastHeight = 0;
    let staleCount = 0;

    while (state.isRunning) {
      if (checkCaptcha()) {
        state.isRunning = false;
        updateRunStateUI();
        break;
      }

      parseCards(feed, currentCity);

      feed.scrollTop = feed.scrollHeight;
      await randomSleep(1200, 1800);

      const endNotice = document.body.innerText.includes("You've reached the end of the list");
      if (endNotice) break;

      if (feed.scrollHeight === lastHeight) {
        staleCount++;
        if (staleCount >= 4) break;
      } else {
        staleCount = 0;
        lastHeight = feed.scrollHeight;
      }
    }
  }

  function updateRunStateUI() {
    if (state.isRunning) {
      statusEl.innerText = "RUNNING";
      statusEl.style.background = "#22c55e";
      toggleBtn.innerText = "⏸ Pause";
      toggleBtn.style.background = "#eab308";
    } else {
      statusEl.innerText = "PAUSED";
      statusEl.style.background = "#ef4444";
      toggleBtn.innerText = "▶ Start";
      toggleBtn.style.background = "#22c55e";
      timerEl.style.display = "none";
    }
  }

  async function runOrchestrator() {
    let citiesProcessedThisRun = 0;

    while (state.isRunning && state.currentIdx < state.locations.length) {
      if (citiesProcessedThisRun >= state.maxCitiesToCollect) {
        state.isRunning = false;
        updateRunStateUI();
        playBeep(1000, 0.4);
        alert(`Target reached: Finished harvesting ${citiesProcessedThisRun} cities!`);
        break;
      }

      const currentCity = state.locations[state.currentIdx];
      locationSelect.value = state.currentIdx.toString();
      const query = `${state.keyword} in ${currentCity}`;

      console.log(`Searching [${state.currentIdx + 1}/${state.locations.length}] (${citiesProcessedThisRun + 1}/${state.maxCitiesToCollect} in this session): ${query}`);
      await triggerSearch(query);

      timerEl.style.display = "block";
      for (let sec = SETTLE_DELAY_SEC; sec > 0; sec--) {
        if (!state.isRunning) break;
        timerSec.innerText = sec.toString();
        await sleep(1000);
      }
      timerEl.style.display = "none";

      if (!state.isRunning) break;

      let feed = null;
      for (let attempt = 0; attempt < 5; attempt++) {
        feed = findFeed();
        if (feed) break;
        await sleep(1000);
      }

      if (feed) {
        await scrollFeedUntilEnd(feed, currentCity);
      } else {
        console.warn("Feed container not found for this view.");
      }

      state.currentIdx++;
      citiesProcessedThisRun++;
      persistData();
      await randomSleep(2000, 3500);
    }

    if (state.currentIdx >= state.locations.length) {
      state.isRunning = false;
      updateRunStateUI();
      playBeep(1000, 0.5);
      alert("Finished harvesting all preset cities in the list!");
    }
  }

  toggleBtn.addEventListener("click", () => {
    if (!state.isRunning) {
      const userInput = window.prompt(
        `How many cities do you want to collect in this session? (Available remaining: ${state.locations.length - state.currentIdx})`,
        state.maxCitiesToCollect.toString()
      );

      if (userInput === null) return;

      const parsedNum = parseInt(userInput, 10);
      if (!isNaN(parsedNum) && parsedNum > 0) {
        state.maxCitiesToCollect = parsedNum;
        inpMaxCities.value = parsedNum.toString();
        persistData();
      }

      state.isRunning = true;
      updateRunStateUI();
      runOrchestrator();
    } else {
      state.isRunning = false;
      updateRunStateUI();
    }
  });

  downloadBtn.addEventListener("click", downloadCSV);
})();