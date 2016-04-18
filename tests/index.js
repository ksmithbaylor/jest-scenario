import test from 'tape';
import { scenario, combinations } from '../src';

test('calls the test function once for each case', t => {
  const cases = { one: 1, two: 2, three: 3, four: 4, five: 5 };

  let timesCalled = 0;
  function fakeTest() {
    timesCalled++;
  }

  scenario(fakeTest, '', cases, () => {});

  t.equal(timesCalled, 5, 'called 5 times');
  t.end();
});

test('appends the right prefix to each case', t => {
  const cases = { one: 1 };
  const prefix = 'Testing the thing: ';

  function fakeTest(testName) {
    t.equal(testName, 'Testing the thing: one', 'used the right name');
  }

  scenario(fakeTest, prefix, cases, () => {});
  t.end();
});

test('passes the right value to the test body', t => {
  const cases = { one: [1, 2, 3] };

  function fakeTest(prefix, cb) {
    cb();
  }

  function fakeTestBody(t2, value) {
    t.deepEqual(value, [1, 2, 3], 'passed the right value');
  }

  scenario(fakeTest, '', cases, fakeTestBody);
  t.end();
});

test('combinations: multiple values in sets', t => {
  t.deepEqual(
    combinations({ a: [1, 2], }),
    {
      'a[0]': { a: 1 },
      'a[1]': { a: 2 },
    },
    '2x1 input'
  );
  t.deepEqual(
    combinations({ a: [1, 2], b: [4, 5], c: [7, 8] }),
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
    '2x3 input'
  );
  t.end();
});

test('combinations: single value in sets', t => {
  t.deepEqual(
    combinations({ a: [1], }),
    {
      'a[0]': { a: 1 }
    },
    '1x1 input'
  );
  t.deepEqual(
    combinations({ a: [1], b: [4], }),
    {
      'a[0] b[0]': { a: 1, b: 4 }
    },
    '1x2 input'
  );
  t.end();
});

test('combinations: empty sets', t => {
  t.deepEqual(
    combinations({ a: [], }),
    {},
    '0x1 input'
  );
  t.deepEqual(
    combinations({ a: [], b: [], }),
    {},
    '0x2 input'
  );
  t.deepEqual(
    combinations({ a: [], b: [1], c: [] }),
    {},
    '0x3 input with an extra friend'
  );
  t.end();
});
