////////////////////////////////////////////////////////////////////////////////
// Helpers

function pairs(object) {
  return Object.keys(object).map((key) => [key, object[key]]);
}

function onlyRunner(method) {
  return function only(...args) {
    method(...args, it.only);
  };
}

////////////////////////////////////////////////////////////////////////////////
// Scenario

export function scenario(prefix, testCases, testBody, testFunction = it) {
  describe(prefix, () => {
    Object.keys(testCases).forEach(title => {
      testFunction(title, () => {
        testBody(testCases[title]);
      });
    });
  });
}

scenario.only = onlyRunner(scenario);

////////////////////////////////////////////////////////////////////////////////
// Scenario Outline

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
  ), { '': {} });
}

export function scenarioOutline(prefix, outline, testBody, testFunction = it) {
  scenario(prefix, combinations(outline), testBody, testFunction);
}

scenarioOutline.only = onlyRunner(scenarioOutline);
