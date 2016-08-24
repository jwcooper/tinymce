define(
  'ephox.katamari.api.LazyValue',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Option',
    'global!setTimeout'
  ],

  function (Arr, Option, setTimeout) {
    var nu = function (lazyGet) {
      var data = Option.none();
      var callbacks = [];

      var map = function (f) {
        return nu(function (nCallback) {
          get(function (data) {
            nCallback(f(data));
          });
        });
      };

      var get = function (nCallback) {
        if (isReady()) call(nCallback);
        else callbacks.push(nCallback);
      };

      var set = function (x) {
        data = Option.some(x);
        run(callbacks);
        callbacks = [];
      };

      var isReady = function () {
        return data.isSome();
      };

      var run = function (cbs) {
        Arr.each(cbs, call);
      };

      var call = function(cb) {
        data.each(function(x) {
          setTimeout(function() {
            cb(x);
          }, 0);
        });
      };

      // Lazy values cache the value and kick off immediately
      lazyGet.get(set);

      return {
        get: get,
        map: map,
        isReady: isReady
      };
    };

    return {
      nu: nu
    };
  }
);