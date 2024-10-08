import { OptionStorage } from '../../core/optionStorage';

const inputFilter = document.getElementById('inputFilter') as HTMLInputElement;
const autoCplFilter = document.getElementById('autoCplFilter') as HTMLInputElement;
const urlFilter = document.getElementById('urlFilter') as HTMLInputElement;
const saveBtn = document.getElementById('save-btn') as HTMLButtonElement;

const options = new OptionStorage({ watch: true });
options.ready().then(() => {
  inputFilter.checked = options.inputFilter;
  autoCplFilter.checked = options.autoCplFilter;
  urlFilter.checked = options.urlFilter;

  saveBtn.disabled = false;
});

let timer = 0;
saveBtn.addEventListener('click', () => {
  options.save({
    inputFilter: inputFilter.checked,
    autoCplFilter: autoCplFilter.checked,
    urlFilter: urlFilter.checked,
  });

  const snackbar = document.getElementById('snackbar');
  if (snackbar) {
    snackbar.className = snackbar.className.replace('show', '');
    clearTimeout(timer);

    snackbar.innerText = '提交成功！';
    snackbar.className = 'show';

    timer = setTimeout(function () {
      snackbar.className = snackbar.className.replace('show', '');
    }, 3000);
  }
});

const title = `${chrome.i18n.getMessage('pluginTitle')} 选项`;
document.title = title;
document.querySelector('h1')!.innerText = title;
