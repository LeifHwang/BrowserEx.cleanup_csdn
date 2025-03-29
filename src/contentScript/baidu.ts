import { OptionStorage } from '../core/optionStorage';
import { logInfo } from '../utils/logUtils';
import { trimSuffix } from '../utils/textUtils';

const options = new OptionStorage({ watch: true });
options.ready();

// 搜索输入框获取输入焦点时，去掉尾部[ -csdn]，方便重新录入或复制
document.getElementById('kw')?.addEventListener('focus', (ev) => {
  const el = ev.target as HTMLInputElement;
  el.value = trimSuffix(el.value);

  logInfo(`content_script auto trim end " -csdn"!`);
});
