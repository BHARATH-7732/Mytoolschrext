document.getElementById('show').addEventListener('click', async () => {
  const status = document.getElementById('status');
  status.textContent = 'Injecting...';
  try {
    const [tab] = await chrome.tabs.query({active:true, currentWindow:true});
    if (!tab || !tab.id) throw new Error('No active tab');
    if (!/^https:\/\/app\.go4database\.com\//.test(tab.url || '')) {
      throw new Error('Open app.go4database.com first');
    }
    await chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['content.js']
    });
    status.textContent = 'Panel injected. Refresh the page if needed.';
  } catch (e) {
    status.textContent = 'Error: ' + e.message;
  }
});