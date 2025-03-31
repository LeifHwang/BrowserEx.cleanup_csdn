import { logInfo } from './utils/logUtils';

const bingUrls = ['https://www.bing.com/search?', 'https://cn.bing.com/search?'];
const baiduUrl = 'https://www.baidu.com/s?';

const filter = '-csdn';
const badFilter = '--csdn'; // --csdn结尾时，也会使过滤失效，需要调整

const offTabs: Array<number> = [];

function _queryValAppendFilter(origin: string, hyphen: string) {
  if (origin.endsWith(`${hyphen}${filter}`)) {
    return undefined;
  }

  let newVal = `${origin}${hyphen}${filter}`;
  if (origin.endsWith(`${hyphen}${badFilter}`)) {
    newVal = `${origin.slice(0, -badFilter.length)}${filter}`;
  }

  return newVal;
}
function _queryValTrimFilter(origin: string, hyphen: string) {
  if (origin.endsWith(`${hyphen}${filter}`)) {
    return origin.slice(0, -hyphen.length - filter.length);
  }

  return undefined;
}

function _updateTabUrl(tabId: number, tab: { url: string }, action: 'append' | 'trim') {
  if (bingUrls.some((i) => tab.url?.startsWith(i))) {
    const idx = tab.url.indexOf('q=');
    if (idx < 0) {
      return;
    }

    const q = tab.url.substring(idx, tab.url.indexOf('&', idx + 1));
    const newQ = action === 'append' ? _queryValAppendFilter(q, '+') : _queryValTrimFilter(q, '+');
    if (newQ) {
      chrome.tabs.update(tabId, { url: tab.url.replace(q, newQ) });
      logInfo(`redirect bing search q ${action} [-csdn]!`);
    }
  }

  if (tab.url.startsWith(baiduUrl)) {
    const idx = tab.url.indexOf('wd=');
    if (idx < 0) {
      return;
    }

    const wd = tab.url.substring(idx, tab.url.indexOf('&', idx + 1));
    const newWd = action === 'append' ? _queryValAppendFilter(wd, '%20') : _queryValTrimFilter(wd, '%20');
    if (newWd) {
      chrome.tabs.update(tabId, { url: tab.url.replace(wd, newWd) });
      logInfo(`redirect baidu search wd ${action} [-csdn]!`);
    }
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (offTabs.includes(tabId)) {
    chrome.action.setBadgeText({ tabId, text: 'Off' });
    chrome.action.setBadgeBackgroundColor({ tabId, color: 'gray' });
    return;
  }

  if (changeInfo.status !== 'loading' || !changeInfo.url) {
    return;
  }

  _updateTabUrl(tabId, { url: changeInfo.url }, 'append');

  chrome.action.setIcon({ tabId, path: 'icons/icon_32.png' });
  chrome.action.setBadgeText({ tabId, text: '' });
});
chrome.tabs.onRemoved.addListener((tabId) => {
  const idx = offTabs.indexOf(tabId);
  if (idx >= 0) {
    offTabs.splice(idx, 1);
  }
});

chrome.action.onClicked.addListener((tab) => {
  if (!tab.url || ![...bingUrls, baiduUrl].some((i) => tab.url?.startsWith(i))) {
    return;
  }

  const tabId = tab.id!;
  const idx = offTabs.indexOf(tabId);
  if (idx >= 0) {
    offTabs.splice(idx, 1);

    _updateTabUrl(tabId, { url: tab.url }, 'append');
  } else {
    offTabs.push(tabId);

    _updateTabUrl(tabId, { url: tab.url }, 'trim');
  }
});
