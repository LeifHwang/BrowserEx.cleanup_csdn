import { logInfo } from '../utils/logUtils';
import { trimSuffix } from '../utils/textUtils';

// 搜索输入框获取输入焦点时，去掉尾部[ -csdn]，方便重新录入
document.addEventListener(
  'focus',
  (ev) => {
    const el = ev.target as HTMLInputElement;
    if (el.value) {
      el.value = trimSuffix(el.value);

      logInfo(`content_script auto trim end " -csdn"!`);
    }
  },
  true
);
