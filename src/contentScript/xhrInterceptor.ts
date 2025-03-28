const _open = XMLHttpRequest.prototype.open;

XMLHttpRequest.prototype.open = function (method: string, url: string | URL, async: boolean = true, user?: string, password?: string) {
  let _onreadystatechange = this.onreadystatechange;
  const xhr = this;

  xhr.onreadystatechange = function (...args) {
    if (xhr.readyState === 4 && xhr.status === 200) {
      try {
        const urlObj = new URL(xhr.responseURL);
        if (!['cn.bing.com', 'www.bing.com'].includes(urlObj.host) || urlObj.pathname !== '/AS/Suggestions') {
          return;
        }

        const suggestObj = JSON.parse(xhr.responseText) as { s: { id: string; q: string; t: string; u: string }[] };
        if (suggestObj.s?.length) {
          Object.defineProperty(xhr, 'responseText', {
            writable: true,
            value: JSON.stringify({
              ...suggestObj,
              s: suggestObj.s.map((i) => {
                const query = i.u.substring(8).split('&');
                for (let i = 0; i < query.length; i++) {
                  const item = query[i];
                  if (item.startsWith('q=')) {
                    query[i] = item + '+-csdn';
                  }
                }

                return { ...i, u: `/search?${query.join('&')}` };
              }),
            }),
          });
        }
      } catch (error) {
        // ignore
      }
    }

    // call original callback
    if (_onreadystatechange) {
      _onreadystatechange.apply(xhr, args);
    }
  };

  Object.defineProperty(xhr, 'onreadystatechange', {
    get: function () {
      return _onreadystatechange;
    },
    set: function (value) {
      _onreadystatechange = value;
    },
  });

  return _open.apply(xhr, [method, url, async, user, password]);
};
