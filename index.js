var keys = Object.keys || require('object-keys');

module.exports = function scenario(test, prefix, config, testBody) {
  keys(config).forEach(function (key) {
    test(prefix + key, function (t) {
      testBody(t, config[key]);
    });
  });
}
