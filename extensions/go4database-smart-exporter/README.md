# Go4Database Smart Exporter v3

This version uses Manifest V3 with:
- `scripting` + `activeTab` for reliable manual injection
- automatic content-script injection on Go4Database
- retries for SPA navigation/page replacement
- the original IndexedDB/deduplication/CSV/export workflow

Install:
1. Remove older Go4Database Smart Exporter versions from chrome://extensions.
2. Enable Developer mode.
3. Load this unpacked folder.
4. Open https://app.go4database.com/leads/list
5. If the panel is not visible, click the extension icon and choose **Show Exporter Panel**.

The supplied userscript's API endpoint is `https://app.go4database.com/api/leads`.
