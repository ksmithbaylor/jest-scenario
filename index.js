var keys = Object.keys || require('object-keys');

module.exports.scenario = function scenario(test, prefix, testCases, testBody) {
  keys(testCases).forEach(function (key) {
    test(prefix + key, function (t) {
      testBody(t, testCases[key]);
    });
  });
}

function pairs(object) {
  return keys(object).map(function (key) {
    return [key, object[key]];
  });
}

module.exports.combinations = function combinations(sets) {
  return pairs(sets).reduceRight((oldResults, [setName, setValues]) => (
    setValues.reduce((newResults, setValue, index) => ({
      ...newResults,
      ...pairs(oldResults).reduce((newTestCases, [oldName, oldValues]) => ({
        ...newTestCases,
        [`${setName}[${index}] ${oldName}`.trimRight()]: {
          [setName]: setValue,
          ...oldValues
        }
      }), [])
    }), {})
  ), {'': {}});
};
