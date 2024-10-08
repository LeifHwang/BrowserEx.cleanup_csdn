class OptionStorage {
  inputFilter = true;
  autoCplFilter = true;
  urlFilter = true;

  constructor(op?: { watch: boolean }) {
    if (op?.watch) {
      chrome.storage.local.onChanged.addListener((changes) => {
        const inputVal = changes['inputFilter'];
        if (inputVal) {
          this.inputFilter = inputVal.newValue;
        }

        const autoCplVal = changes['autoCplFilter'];
        if (autoCplVal) {
          this.autoCplFilter = autoCplVal.newValue;
        }

        const urlVal = changes['urlFilter'];
        if (urlVal) {
          this.urlFilter = urlVal.newValue;
        }
      });
    }
  }

  async ready() {
    const res = await chrome.storage.local.get(['inputFilter', 'autoCplFilter', 'urlFilter']);

    this.inputFilter = res.inputFilter ?? true;
    this.autoCplFilter = res.autoCplFilter ?? true;
    this.urlFilter = res.urlFilter ?? true;
  }

  async save(data: { inputFilter: boolean; autoCplFilter: boolean; urlFilter: boolean }) {
    const { inputFilter, autoCplFilter, urlFilter } = data;

    await chrome.storage.local.set({
      inputFilter,
      autoCplFilter,
      urlFilter,
    });
  }
}

export { OptionStorage };
