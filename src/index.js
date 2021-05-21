(function () {
  var global = typeof window !== 'undefined' ? window : this || Function('return this')();
  var nx = global.nx || require('@jswork/next');
  var defaults = { pipeStyle: 'request', responseType: 'text' };
  var Taro = globa.Taro || require('@tarojs/taro');

  var normalize = function (inOptions) {
    var headers = inOptions.headers;
    headers['content-type'] = headers['Content-Type'];
    inOptions.body = inOptions.data;
    delete headers['Content-Type'];
    delete inOptions.headers;
    delete inOptions.data;
    inOptions.header = headers;
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
