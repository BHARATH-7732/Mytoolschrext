# Scraper Extension Hub

A single website for two Chrome lead-scraper extensions:

1. **Omni-Harvester Pro** — Google Maps scraper
2. **Go4Database Smart Exporter** — Go4Database scraper

## Website

`index.html` is the selector/download website.

It links to:

- `downloads/omni-harvester-pro.zip`
- `downloads/go4database-smart-exporter.zip`

## Repository structure

```text
scraper-extension-hub/
├── index.html
├── README.md
├── .gitignore
├── downloads/
│   ├── omni-harvester-pro.zip
│   └── go4database-smart-exporter.zip
└── extensions/
    ├── omni-harvester-pro/
    │   ├── manifest.json
    │   ├── content.js
    │   ├── icons/
    │   └── google-apps-script/
    │       ├── Code.gs
    │       └── README.md
    └── go4database-smart-exporter/
        ├── manifest.json
        ├── content.js
        ├── popup.html
        ├── popup.js
        └── README.md
```

## Chrome extension installation

Download one of the extension ZIP files from the website, extract it, then:

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the extracted extension folder containing `manifest.json`

## Google Apps Script

Omni-Harvester Pro includes a separate Google Apps Script receiver:

`extensions/omni-harvester-pro/google-apps-script/Code.gs`

Deploy that script as a Google Apps Script Web App and use its Web App URL in Omni-Harvester Pro's webhook/sync settings.
