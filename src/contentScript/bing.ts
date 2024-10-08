import { OptionStorage } from '../core/optionStorage';
import { autoAppendSuffix, trimSuffix } from '../utils/textUtils';

const options = new OptionStorage({ watch: true });
options.ready();

// 搜索输入框(表单)
const formEl = document.getElementById('sb_form') as HTMLFormElement;
const searchInputEl = document.getElementById('sb_form_q') as HTMLInputElement;
if (formEl && searchInputEl && options.inputFilter) {
  formEl.addEventListener('submit', (ev) => {
    const text = searchInputEl.value.trimEnd();
    const newVal = autoAppendSuffix(text);
    if (newVal) {
      ev.preventDefault();

      searchInputEl.value = newVal;
      formEl.submit();

      console.log(`[${chrome.i18n.getMessage('pluginTitle')}] content_script rewrite search input!`);
    }
  });

  // 搜索输入框获取输入焦点时，去掉尾部[ -csdn]，方便重新录入
  searchInputEl.addEventListener('focus', (ev) => (searchInputEl.value = trimSuffix(searchInputEl.value)));
}

const checkBingSearchUrl = (url?: string | null) => {
  if (!url) {
    return undefined;
  }

  const urlObj = new URL(url, document.location.origin);
  if (urlObj.host === 'cn.bing.com' && urlObj.pathname === '/search') {
    return urlObj;
  }
  return undefined;
};

// 相关搜索链接或其他推荐链接
document.addEventListener(
  'click',
  (ev) => {
    if (!options.urlFilter) {
      return;
    }

    let linkEl = ev.target as HTMLLinkElement;
    let href = linkEl?.href;

    do {
      if (href) {
        break;
      }

      linkEl = linkEl.parentElement as HTMLLinkElement;
      href = linkEl?.href;
    } while (linkEl);

    const urlObj = checkBingSearchUrl(href);
    if (!urlObj) {
      return;
    }

    const q = urlObj.searchParams.get('q');
    const newQ = autoAppendSuffix(q);
    if (newQ) {
      ev.preventDefault();
      ev.stopImmediatePropagation();

      urlObj.searchParams.set('q', newQ);
      window.location.assign(urlObj.href);

      console.log(`[${chrome?.i18n?.getMessage('pluginTitle')}] content_script redirect!`);
    }
  },
  { capture: true }
);
