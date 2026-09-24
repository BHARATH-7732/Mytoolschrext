/**
 * Google Apps Script Web App receiver for Google Maps Harvester
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  
  if (!lock.tryLock(30000)) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: "Server busy" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const rawContent = e.postData.contents;
    if (!rawContent) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: "No data received" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const payload = JSON.parse(rawContent);
    const leads = payload.leads || [];

    if (!Array.isArray(leads) || leads.length === 0) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "success", message: "No leads to append" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Leads");

    if (!sheet) {
      sheet = ss.insertSheet("Leads");
      const headers = [
        "Synced At", "Country", "Target City", "Search Query",
        "Company Name", "Category", "Price Tier", "Status",
        "Website", "Phone", "Rating", "Review Count",
        "Street", "City", "State Code", "Zip Code",
        "Latitude", "Longitude", "Google Maps URL"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length)
        .setFontWeight("bold")
        .setBackground("#0f172a")
        .setFontColor("#f8fafc");
      sheet.setFrozenRows(1);
    }

    const lastRow = sheet.getLastRow();
    const existingUrlSet = new Set();

    if (lastRow > 1) {
      const existingUrls = sheet.getRange(2, 19, lastRow - 1, 1).getValues();
      for (let i = 0; i < existingUrls.length; i++) {
        const url = existingUrls[i][0];
        if (url) existingUrlSet.add(url);
      }
    }

    const syncTime = new Date().toISOString();
    const rows = [];

    leads.forEach(lead => {
      const gMapsUrl = lead.GoogleMapsUrl || "";
      if (gMapsUrl && existingUrlSet.has(gMapsUrl)) return;

      rows.push([
        syncTime,
        lead.Country || "",
        lead.TargetCity || "",
        lead.Query || "",
        lead.CompanyName || "",
        lead.Category || "",
        lead.PriceTier || "",
        lead.Status || "",
        lead.Website || "",
        lead.Phone ? "'" + lead.Phone : "",
        lead.Rating || 0,
        lead.ReviewCount || 0,
        lead.Street || "",
        lead.City || "",
        lead.StateCode || "",
        lead.ZipCode ? "'" + lead.ZipCode : "",
        lead.Latitude || "",
        lead.Longitude || "",
        gMapsUrl
      ]);

      if (gMapsUrl) existingUrlSet.add(gMapsUrl);
    });

    if (rows.length > 0) {
      sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        appended: rows.length,
        skippedDuplicates: leads.length - rows.length
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("Endpoint operational.")
    .setMimeType(ContentService.MimeType.TEXT);
}
