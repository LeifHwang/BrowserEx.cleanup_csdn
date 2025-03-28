chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && changeInfo.url?.startsWith('https://www.bing.com/search?')) {
    const idx = changeInfo.url.indexOf('&q=');
    if (!idx) {
      return;
    }

    const q = changeInfo.url.substring(idx, changeInfo.url.indexOf('&', idx + 1));
    if (!q.endsWith('+-csdn')) {
      const url = changeInfo.url.replace(q, q + '+-csdn');

      chrome.tabs.update(tab.id!, { url });
    }
  }
});
