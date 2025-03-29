import { logInfo } from './utils/logUtils';

const filter = '-csdn';
const badFilter = '--csdn'; // --csdn结尾时，也会使过滤失效，需要调整

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'loading' || !changeInfo.url) {
    return;
  }

  if (['https://www.bing.com/search?', 'https://cn.bing.com/search?'].some((i) => changeInfo.url?.startsWith(i))) {
    const idx = changeInfo.url.indexOf('&q=');
    if (!idx) {
      return;
    }

    const q = changeInfo.url.substring(idx, changeInfo.url.indexOf('&', idx + 1));
    if (q.endsWith(`+${filter}`)) {
      return;
    }

    let newQ = `${q}+${filter}`;
    if (q.endsWith(`+${badFilter}`)) {
      newQ = `${q.substring(0, q.length - badFilter.length - 1)}+${filter}`;
    }

    chrome.tabs.update(tab.id!, { url: changeInfo.url.replace(q, newQ) });
    logInfo(`redirect bing search q append [-csdn]!`);
  }

  if (changeInfo.url.startsWith('https://www.baidu.com/s?')) {
    const idx = changeInfo.url.indexOf('&wd=');
    if (!idx) {
      return;
    }

    const wd = changeInfo.url.substring(idx, changeInfo.url.indexOf('&', idx + 1));
    if (wd.endsWith(`%20${filter}`)) {
      return;
    }

    let newWd = `${wd}%20${filter}`;
    if (wd.endsWith(`%20${badFilter}`)) {
      newWd = `${wd.substring(0, wd.length - 6)}${filter}`;
    }

    chrome.tabs.update(tab.id!, { url: changeInfo.url.replace(wd, newWd) });
    logInfo(`redirect baidu search wd append [-csdn]!`);
  }
});
