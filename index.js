import objectKeys from 'object-keys';

const keys = Object.keys || objectKeys;

function pairs(object) {
  return keys(object).map((key) => [key, object[key]]);
}

export function scenario(test, prefix, testCases, testBody) {
  keys(testCases).forEach(key => {
    test(prefix + key, t => {
      testBody(t, testCases[key]);
    });
  });
}

export function combinations(sets) {
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
