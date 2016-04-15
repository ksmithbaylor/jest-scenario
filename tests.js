var test = require('tape');
var scenario = require('.');

test('scenario calls the test function once for each case', t => {
  var cases = { one: 1, two: 2, three: 3, four: 4, five: 5 };

  var timesCalled = 0;
  function fakeTest() {
    timesCalled++;
  }

  scenario(fakeTest, '', cases, () => {});

  t.equal(timesCalled, 5);
  t.end();
});

test('scenario appends the right prefix to each case', t => {
  var cases = { one: 1 };
  var prefix = 'Testing the thing: ';

  function fakeTest(testName) {
    t.equal(testName, 'Testing the thing: one');
  }

  scenario(fakeTest, prefix, cases, () => {});
  t.end();
});

test('scenario passes the right value to the test body', t => {
  var cases = { one: [1, 2, 3] };

  function fakeTest(prefix, cb) {
    cb();
  }

  function fakeTestBody(t2, value) {
    t.deepEqual(value, [1, 2, 3]);
  }

  scenario(fakeTest, '', cases, fakeTestBody);
  t.end();
});
