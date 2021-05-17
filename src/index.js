(function () {
  var global = typeof window !== 'undefined' ? window : this || Function('return this')();
  var nx = global.nx || require('@jswork/next');
  var NxAbstractRequest = nx.AbstractRequest || require('@jswork/next-abstract-request');
  var NxInterceptor = nx.Interceptor || require('@jswork/next-interceptor');
  var Taro = require('@tarojs/taro');
  var DEFAULT_OPTIONS = {
    method: 'get',
    dataType: 'json',
    responseType: 'text',
    interceptors: [],
    transformRequest: nx.stubValue,
    transformResponse: nx.stubValue
  };

  var NxTaroRequest = nx.declare('nx.TaroRequest', {
    extends: NxAbstractRequest,
    methods: {
      init: function (inOptions) {
        var parent = this.$base;
        parent.init.call(this, inOptions);
        this.interceptor = new NxInterceptor({ items: this.options.interceptors });
      },
      defaults: function () {
        return DEFAULT_OPTIONS;
      },
      request: function (inOptions) {
        var self = this;
        var options = this.interceptor.compose(inOptions, 'request');
        options.data = options.transformRequest(options.data);
        return new Promise(function (resolve, reject) {
          self
            .__request__(options)
            .then(function (res) {
              var composeRes = self.interceptor.compose(res, 'response');
              var transformResponse = options.transformResponse(composeRes);
              resolve(transformResponse);
            })
            .catch(reject);
        });
      },
      __request__: function (inOptions) {
        var options = nx.mix(null, this.options, inOptions);
        return new Promise(function (resolve, reject) {
          try {
            Taro.request(
              nx.mix(
                {
                  url: inUrl,
                  method: inMethod,
                  data: inData,
                  success: function (res) {
                    resolve({ code: 0, detail: res.data, data: res });
                  },
                  fail: function (res) {
                    resolve({ code: 1, detail: null, data: res });
                  },
                  complete: function (res) {
                    resolve({ code: -1, detail: null, data: res });
                  }
                },
                options
              )
            );
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
