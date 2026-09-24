# Scraper Extension Hub

A Chrome scraper hub featuring:
- Omni-Harvester Pro — Google Maps lead harvesting.
- Go4Database Smart Exporter — Go4Database lead extraction, deduplication, IndexedDB storage and CSV export.

## Website

The root index.html provides a simple selector so users can choose the scraper they need and download its Chrome extension.

## Chrome installation

1. Download the scraper ZIP from the website.
2. Extract it.
3. Open chrome://extensions.
4. Enable Developer mode.
5. Click Load unpacked and choose the extracted extension folder.

## Google Apps Script

Omni-Harvester Pro includes a separate Apps Script receiver at:
extensions/omni-harvester-pro/google-apps-script/Code.gs

Deploy it as a Google Apps Script Web App connected to the destination spreadsheet, then paste the Web App URL into Omni-Harvester Pro's sync settings.

## GitHub Pages

Enable Settings → Pages → Deploy from a branch → main → / (root) to publish the selector website.
