(function () {
  var global = typeof window !== 'undefined' ? window : this || Function('return this')();
  var nx = global.nx || require('@jswork/next');
  var NxAbstractRequest = nx.AbstractRequest || require('@jswork/next-abstract-request');
  var NxInterceptor = nx.Interceptor || require('@jswork/next-interceptor');
  var Taro = require('@tarojs/taro');
  var TYPES = ['request', 'response', 'error'];
  var DEFAULT_OPTIONS = {
    method: 'get',
    dataType: 'json',
    responseType: 'text',
    interceptors: [],
    transformRequest: nx.stubValue,
    transformResponse: nx.stubValue,
    transformError: nx.stubValue
  };

  var normalizeHeaders = function (inOptions) {
    var headers = inOptions.headers;
    headers['content-type'] = headers['Content-Type'];
    delete headers['Content-Type'];
    delete inOptions.headers;
    inOptions.header = headers;
    return inOptions;
  };

  var NxTaroRequest = nx.declare('nx.TaroRequest', {
    extends: NxAbstractRequest,
    methods: {
      init: function (inOptions) {
        var parent = this.$base;
        parent.init.call(this, inOptions);
        this.interceptor = new NxInterceptor({ items: this.options.interceptors, types: TYPES });
      },
      defaults: function () {
        return DEFAULT_OPTIONS;
      },
      request: function (inMethod, inUrl, inData, inOptions) {
        var self = this;
        var baseOptions = { method: inMethod, url: inUrl, data: inData };
        var options = nx.mix(null, this.options, baseOptions, inOptions);
        var { url, ...config } = options;
        options = options.transformRequest(this.interceptor.compose({ url, config }, 'request'));
        return new Promise(function (resolve, reject) {
          self
            .__request__({ url, ...config })
            .then(function (res) {
              var composeRes = options.transformResponse(
                self.interceptor.compose({ url, config, data: res }, 'response')
              );
              resolve(composeRes);
            })
            .catch(function (error) {
              var composeError = options.transformResponse(
                self.interceptor.compose(error, 'error')
              );
              reject(composeError);
            });
        });
      },
      __request__: function (inOptions) {
        var options = normalizeHeaders(inOptions);
        return new Promise(function (resolve, reject) {
          try {
            Taro.request(nx.mix({ success: resolve, fail: reject }, options));
          } catch (e) {
            reject(e);
          }
        });
      }
    }
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxTaroRequest;
  }
})();
