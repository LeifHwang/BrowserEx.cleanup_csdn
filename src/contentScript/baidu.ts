import { OptionStorage } from '../core/optionStorage';
import { autoAppendSuffix, trimSuffix } from '../utils/textUtils';

const options = new OptionStorage({ watch: true });
options.ready();

// 搜索输入框
document.getElementById('su')?.addEventListener(
  'click',
  () => {
    if (!options.inputFilter) {
      return;
    }

    const inputEl = document.getElementById('kw') as HTMLInputElement;
    if (inputEl) {
      // 最后一个字符是减号时，加上*，避免后续减号指令失效
      let text = inputEl.value.trimEnd();
      if (text.endsWith('-')) {
        text += '*';
      }

      const newVal = autoAppendSuffix(text);
      if (newVal) {
        inputEl.value = newVal;

        console.log(`[${chrome?.i18n?.getMessage('pluginTitle')}] content_script rewrite search input!`);
      }
    }
  },
  false
);
// 搜索输入框获取输入焦点时，去掉尾部[ -csdn]，方便重新录入
document.getElementById('kw')?.addEventListener('focus', (ev) => {
  const el = ev.target as HTMLInputElement;
  el.value = trimSuffix(el.value);
});

// 搜索框提示条目
const formObs = new MutationObserver((m) => {
  if (!options.autoCplFilter) {
    return;
  }

  m.forEach(({ addedNodes }, idx) => {
    if (!options.autoCplFilter) {
      return;
    }

    if (addedNodes.length != 1) {
      return;
    }

    const newDom = addedNodes[0] as HTMLElement;
    if (newDom.tagName !== 'UL') {
      return;
    }

    const list = newDom.getElementsByTagName('li');
    for (const li of list) {
      const data = autoAppendSuffix(li.getAttribute('data-key'));
      if (data) {
        li.setAttribute('data-key', data);
      }
    }
  });
});
formObs.observe(document.getElementById('form')!, { childList: true, subtree: true });

// 相关搜索链接或其他推荐链接
document.addEventListener(
  'click',
  (ev) => {
    if (!options.urlFilter) {
      return;
    }

    const linkEl = ev.target as HTMLLinkElement;
    let href = linkEl?.href;
    if (!href) {
      // 判断parent
      const pLink = linkEl.parentElement as HTMLLinkElement;
      if (pLink?.href) {
        href = pLink.href;
      }
    }

    if (!href) {
      return;
    }

    const urlObj = new URL(href);
    if (urlObj.host !== 'www.baidu.com' && urlObj.pathname !== '/s') {
      return;
    }

    const wd = urlObj.searchParams.get('wd');
    if (wd) {
      const newWd = autoAppendSuffix(wd);
      if (newWd) {
        ev.preventDefault();
        ev.stopImmediatePropagation();

        urlObj.searchParams.set('wd', newWd);
        window.location.assign(urlObj.href);

        console.log(`[${chrome.i18n.getMessage('pluginTitle')}] content_script redirect!`);
      }
    }
  },
  { capture: true }
);
