[![npm version](https://badge.fury.io/js/tape-scenario.svg)](https://badge.fury.io/js/tape-scenario)
[![Dependency Status](https://david-dm.org/ksmithbaylor/tape-scenario.svg)](https://david-dm.org/ksmithbaylor/tape-scenario)
[![devDependency Status](https://david-dm.org/ksmithbaylor/tape-scenario/dev-status.svg)](https://david-dm.org/ksmithbaylor/tape-scenario#info=devDependencies)
[![Build Status](https://travis-ci.org/ksmithbaylor/tape-scenario.svg?branch=master)](https://travis-ci.org/ksmithbaylor/tape-scenario)

# tape-scenario

This is a simple abstraction on top of
[`tape`](https://github.com/substack/tape). It allows you to reduce the
amount of code needed to create repetitive test cases.

# Installation

```
npm install --save-dev tape-scenario
```

# Examples

## Basic usage:

```javascript
import test from 'tape';
import scenario from 'tape-scenario';

// The function under test
function id(something) {
  return something;
}

// The test scenarios
scenario(test, 'Identity function for ', {
  'number 1': 1,
  'number 2': 2,
  'number 3': 3,
  'zero': 0,
  'null': null,
  'a string': 'hello world'
}, (t, testCase) => {
  t.equal(
    id(testCase),
    testCase
  );
  t.end();
});
```

This produces the following output when run using `tape`:

```
TAP version 13
# Identity function for number 1
ok 1 should be equal
# Identity function for number 2
ok 2 should be equal
# Identity function for number 3
ok 3 should be equal
# Identity function for zero
ok 4 should be equal
# Identity function for null
ok 5 should be equal
# Identity function for a string
ok 6 should be equal

1..6
# tests 6
# pass  6

# ok
```

## Using objects as the test case:

```javascript
import test from 'tape';
import scenario from 'tape-scenario';

// The function under test
function add(nums) {
  return nums.reduce((a, b) => a + b);
}

// The test scenarios
scenario(test, 'Adds numbers correctly when numbers are ', {
  'positive': {
    nums: [1, 2, 3, 4, 5],
    sum: 15
  },
  'negative': {
    nums: [-1, -2, -3, -4, -5],
    sum: -15
  }
}, (t, testCase) => {
  t.equal(
    add(testCase.nums),
    testCase.sum
  );
  t.end();
});
```

This produces the following output when run using `tape`:

```
TAP version 13
# Adds numbers correctly when numbers are positive
ok 1 should be equal
# Adds numbers correctly when numbers are negative
ok 2 should be equal

1..2
# tests 2
# pass  2

# ok
```

## More advanced example

```javascript
import test from 'tape';
import scenario from 'tape-scenario';

// The function under test
function numberWithCommas(number) {
  const isValidNumberOrString = ((
    typeof number === 'number'
    && !Number.isNaN(number)
  ) || (
    typeof number === 'string'
    && /^-?\d+$/.test(number)
  ));

  if (isValidNumberOrString) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return NULL_VALUE;
}

// The test scenarios
scenario(test, 'Util: numberWithCommas: ', {
  'positive numbers': { multiplier: 1, string: false },
  'negative numbers': { multiplier: -1, string: false },
  'positive strings': { multiplier: 1, string: true },
  'negative strings': { multiplier: -1, string: true },
}, (t, { multiplier, string }) => {
  const n = input => numberWithCommas(string ? input.toString() : input);
  const prefix = multiplier < 0 ? '-' : '';

  t.equal(n(multiplier * 0), '0', 'zero');
  t.equal(n(multiplier * 1), prefix + '1', 'one digit');
  t.equal(n(multiplier * 12), prefix + '12', 'two digits');
  t.equal(n(multiplier * 123), prefix + '123', 'three digits');
  t.equal(n(multiplier * 1234), prefix + '1,234', 'four digits');
  t.equal(n(multiplier * 12345), prefix + '12,345', 'five digits');
  t.equal(n(multiplier * 123456), prefix + '123,456', 'six digits');
  t.equal(n(multiplier * 1234567), prefix + '1,234,567', 'seven digits');
  t.end();
});
```

This produces the following output when run using `tape`:

```
TAP version 13
# Util: numberWithCommas: positive numbers
ok 1 zero
ok 2 one digit
ok 3 two digits
ok 4 three digits
ok 5 four digits
ok 6 five digits
ok 7 six digits
ok 8 seven digits
# Util: numberWithCommas: negative numbers
ok 9 zero
ok 10 one digit
ok 11 two digits
ok 12 three digits
ok 13 four digits
ok 14 five digits
ok 15 six digits
ok 16 seven digits
# Util: numberWithCommas: positive strings
ok 17 zero
ok 18 one digit
ok 19 two digits
ok 20 three digits
ok 21 four digits
ok 22 five digits
ok 23 six digits
ok 24 seven digits
# Util: numberWithCommas: negative strings
ok 25 zero
ok 26 one digit
ok 27 two digits
ok 28 three digits
ok 29 four digits
ok 30 five digits
ok 31 six digits
ok 32 seven digits

1..32
# tests 32
# pass  32

# ok
```

# API

`scenario(test, prefix, testCases, testBody);`

- `test` - The `tape` library itself; this is so that you can use other similar
    modules like `tape-catch` if you want.
- `prefix` - A prefix that gets applied to each test case that is generated.
- `testCases` - An object containing your test cases. The keys of this object
    are used in the names of the tests that are generated, and their values are
    passed one-by-one to the second argument of the `testBody` callback. Note
    that the values can be simple scalar values, arrays, objects, React
    components, or anything else you can think of. Just write your `testBody` to
    do the right thing with each value.
- `testBody` - A function similar to the callback you would pass to a `tape`
    test, but with an extra argument for the `testCase`.

# Contributing

For suggestions, bug reports, or contributions, please open an issue or pull
request on the project on GitHub! Feedback is very welcome.
