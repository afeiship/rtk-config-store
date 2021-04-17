(function () {
  var global = typeof window !== 'undefined' ? window : this || Function('return this')();
  var nx = global.nx || require('@jswork/next');
  var NxAbstractRequest = nx.AbstractRequest || require('@jswork/next-abstract-request');
  var Taro = require('@tarojs/taro');
  var DEFAULT_OPTIONS = {
    dataType: 'json',
    responseType: 'text'
  };

  var NxTaroRequest = nx.declare('nx.TaroRequest', {
    extends: NxAbstractRequest,
    methods: {
      defaults: function () {
        return DEFAULT_OPTIONS;
      },
      request: function (inMethod, inUrl, inData, inOptions) {
        var options = nx.mix(null, this.options, inOptions);
        return new Promise(function (resolve, reject) {
          Taro.request(
            nx.mix(
              {
                url: inUrl,
                method: inMethod,
                data: inData,
                success: function (res) {
                  resolve({ code: 0, data: res });
                },
                fail: function (res) {
                  resolve({ code: 1, data: res });
                },
                complete: function (res) {
                  resolve({ code: -1, data: res });
                }
              },
              options
            )
          );
        });
      }
    }
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxTaroRequest;
  }
})();
