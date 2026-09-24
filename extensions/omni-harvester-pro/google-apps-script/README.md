# Google Apps Script receiver

`Code.gs` is the separate Google Apps Script Web App receiver for Omni-Harvester Pro.

## Deploy
1. Create/open the Google Sheet that should receive the leads.
2. Open **Extensions → Apps Script**.
3. Paste the contents of `Code.gs` into the Apps Script project and save.
4. Click **Deploy → New deployment**.
5. Select **Web app**.
6. Choose an execution/access setting that allows the Chrome extension to POST to the Web App URL.
7. Copy the deployed `/exec` URL.
8. Paste that URL into the Omni-Harvester Pro **Google Apps Script Web App URL** field.

The receiver creates a `Leads` sheet when needed and de-duplicates incoming leads by Google Maps URL.
