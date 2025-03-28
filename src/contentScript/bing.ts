import { OptionStorage } from '../core/optionStorage';
import { autoAppendSuffix, trimSuffix } from '../utils/textUtils';

const options = new OptionStorage({ watch: true });
options.ready();

// 搜索输入框(表单)
document.getElementById('sb_form')?.addEventListener('submit', (ev) => {
  if (!options.inputFilter) {
    return;
  }

  const formEl = ev.target as HTMLFormElement;
  const searchInputEl = document.getElementById('sb_form_q') as HTMLInputElement;
  const text = searchInputEl?.value.trimEnd();
  const newVal = autoAppendSuffix(text);
  if (newVal) {
    ev.preventDefault();

    searchInputEl.value = newVal;
    formEl.submit();

    console.log(`[Cleanup! CSDN] content_script rewrite search input!`);
  }
});

// 搜索输入框获取输入焦点时，去掉尾部[ -csdn]，方便重新录入
document.addEventListener(
  'focus',
  (ev) => {
    const el = ev.target as HTMLInputElement;
    if (el.value) {
      el.value = trimSuffix(el.value);

      console.log(`[Cleanup! CSDN] content_script auto trim end " -csdn"!`);
    }
  },
  true
);

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

    if (!href) {
      return;
    }

    const urlObj = new URL(href, document.location.origin);
    if ((urlObj.host !== 'cn.bing.com' && urlObj.host !== 'www.bing.com') || urlObj.pathname !== '/search') {
      return;
    }

    const q = urlObj.searchParams.get('q');
    const newQ = autoAppendSuffix(q);
    if (newQ) {
      ev.preventDefault();
      ev.stopImmediatePropagation();

      urlObj.searchParams.set('q', newQ);
      window.location.assign(urlObj.href);

      console.log(`[Cleanup! CSDN] content_script redirect!`);
    }
  },
  { capture: true }
);

// suggestions
if (options.urlFilter) {
  const xhrInterceptor = document.createElement('script');
  xhrInterceptor.src = chrome.runtime.getURL('scripts/xhrInterceptor.js');

  (document.head || document.documentElement).appendChild(xhrInterceptor);

  console.log(`[Cleanup! CSDN] append xhrInterceptor!`);
}
