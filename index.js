var keys = Object.keys || require('object-keys');

module.exports = function scenario(test, prefix, testCases, testBody) {
  keys(testCases).forEach(function (key) {
    test(prefix + key, function (t) {
      testBody(t, testCases[key]);
    });
  });
}
