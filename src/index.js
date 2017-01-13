import intercept from 'intercept-stdout';

////////////////////////////////////////////////////////////////////////////////
// Helpers

function pairs(object) {
  return Object.keys(object).map((key) => [key, object[key]]);
}

function onlyRunner(method) {
  return function only(test, prefix, testCases, testBody) {
    const sentinel = '__scenario.only__';
    const unhook = intercept(line => (line.includes(sentinel) ? '' : line));

    test.only(sentinel, t => {
      t.on('end', unhook);
      method(t.test, prefix, testCases, testBody);
      t.end();
    });
  };
}

////////////////////////////////////////////////////////////////////////////////
// Scenario

export function scenario(test, prefix, testCases, testBody) {
  Object.keys(testCases).forEach(key => {
    test(prefix + key, t => {
      testBody(t, testCases[key]);
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

export function scenarioOutline(test, prefix, outline, testBody) {
  scenario(test, prefix, combinations(outline), testBody);
}

scenarioOutline.only = onlyRunner(scenarioOutline);
