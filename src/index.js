(function () {
  var global = typeof window !== 'undefined' ? window : this || Function('return this')();
  var nx = global.nx || require('@jswork/next');
  var defaults = { responseType: 'json' };
  var Taro = global.Taro || require('@tarojs/taro');

  var normalize = function (inOptions) {
    var headers = inOptions.headers;
    var responseType = inOptions.responseType;
    headers['content-type'] = headers['Content-Type'];
    inOptions.data = inOptions.body;
    inOptions.header = headers;
    /**
     * 注意这里特别混淆
     * 1. 正常的 dataType: 是会决定 content-type + fetch(res.json()) 这两个条件的
     * 2. 在 wx.request 中，responseType 只能是 text/arraybuffer，所以这里不用设置
     */
    inOptions.responseType = responseType === 'json' ? 'text' : responseType;
    delete headers['Content-Type'];
    delete inOptions.headers;
    delete inOptions.body;
    return inOptions;
  };

  nx.taroRequest = function (inUrl, inOptions) {
    var options = nx.mix(null, { url: inUrl }, defaults, inOptions);
    options = normalize(options);
    return new Promise(function (resolve, reject) {
      Taro.request(nx.mix({ success: resolve, fail: reject }, options));
    });
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = nx.taroRequest;
  }
})();
