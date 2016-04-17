import test from 'tape';
import { scenario, combinations } from './index';

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

test('combinations: works correctly for basic usage', t => {
  t.deepEqual(
    combinations({
      a: [1, 2],
      b: [4, 5],
      c: [7, 8]
    }),
    {
      'a[0] b[0] c[0]': { a: 1, b: 4, c: 7 },
      'a[0] b[0] c[1]': { a: 1, b: 4, c: 8 },
      'a[0] b[1] c[0]': { a: 1, b: 5, c: 7 },
      'a[0] b[1] c[1]': { a: 1, b: 5, c: 8 },
      'a[1] b[0] c[0]': { a: 2, b: 4, c: 7 },
      'a[1] b[0] c[1]': { a: 2, b: 4, c: 8 },
      'a[1] b[1] c[0]': { a: 2, b: 5, c: 7 },
      'a[1] b[1] c[1]': { a: 2, b: 5, c: 8 }
    },
    'produces the right test cases'
  );
  t.end();
});
