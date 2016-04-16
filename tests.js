var test = require('tape');
var scenario = require('.');

test('calls the test function once for each case', t => {
  var cases = { one: 1, two: 2, three: 3, four: 4, five: 5 };

  var timesCalled = 0;
  function fakeTest() {
    timesCalled++;
  }

  scenario(fakeTest, '', cases, () => {});

  t.equal(timesCalled, 5, 'called 5 times');
  t.end();
});

test('appends the right prefix to each case', t => {
  var cases = { one: 1 };
  var prefix = 'Testing the thing: ';

  function fakeTest(testName) {
    t.equal(testName, 'Testing the thing: one', 'used the right name');
  }

  scenario(fakeTest, prefix, cases, () => {});
  t.end();
});

test('passes the right value to the test body', t => {
  var cases = { one: [1, 2, 3] };

  function fakeTest(prefix, cb) {
    cb();
  }

  function fakeTestBody(t2, value) {
    t.deepEqual(value, [1, 2, 3], 'passed the right value');
  }

  scenario(fakeTest, '', cases, fakeTestBody);
  t.end();
});
