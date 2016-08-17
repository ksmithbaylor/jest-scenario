[![npm version](https://badge.fury.io/js/tape-scenario.svg)](https://badge.fury.io/js/tape-scenario)
[![npm](https://img.shields.io/npm/dm/tape-scenario.svg?maxAge=2592000)]()
[![Build Status](https://travis-ci.org/ksmithbaylor/tape-scenario.svg?branch=master)](https://travis-ci.org/ksmithbaylor/tape-scenario)
[![Dependency Status](https://david-dm.org/ksmithbaylor/tape-scenario.svg)](https://david-dm.org/ksmithbaylor/tape-scenario)
[![devDependency Status](https://david-dm.org/ksmithbaylor/tape-scenario/dev-status.svg)](https://david-dm.org/ksmithbaylor/tape-scenario#info=devDependencies)

# tape-scenario

A small (30 lines of code) and simple abstraction on top of [`tape`](https://github.com/substack/tape) that reduces the amount of code needed to create repetitive test cases.

## installation

```
npm install --save-dev tape-scenario
```

## overview

This library has just two functions: `scenario` and `scenarioOutline`. `scenario` is a simple way to name a bunch of test cases one-by-one and execute the same test body for each of them. `scenarioOutline` is much more powerful and lets you run the same test body for each and every combination of the sets of values you pass in. If that's confusing, don't worry! Check out the examples below.

The api for both functions is pretty similar:

```javascript
function scenario(test, prefix, testCases, testBody) { ... }
function scenarioOutline(test, prefix, outline, testBody) { ... }
```

- `test`: The instance of `tape` you're using, which allows you to use wrappers
  like `tape-catch` or `blue-tape`.
- `prefix`: The string each test case title should start with, if you're using
  a reporter that shows you the names of your tests.
- `testCases`/`outline`: An object that describes your test cases. See the
  examples and full API below for more details.
- `testBody`: The actual test you want to execute for your test cases. It is
  identical to what you would pass to `test` in a normal `tape` test, but it
  takes an extra argument for the test case itself. See the examples and full
  API below for more details.

### scenario

`scenario` is the simplest way to specify your test cases. You give each test case a name and some value (could be a primitive, an array, an object, or whatever else you want) to use in your test body.

Keep in mind that these are just examples, you can use whatever you want as your test cases! It's completely up to you; all this function does is pass each test case blindly as the second argument to your test body.

Basic usage, naming each test case and passing a single value:

```javascript
import test from 'tape';
import { scenario } from 'tape-scenario';

scenario(test, 'value is truthy: ', {
  'a non-empty string': 'hello world',
  'a symbol': Symbol(),
  'an empty object': {}
}, (t, input) => {
  t.assert(Boolean(input), 'the value is truthy');
  t.end();
});
```

The test body gets run once for each key in the `testCases` object. The first
argument is a `tape` test object like usual, but it gets an additional argument which
is whatever value you gave to the test case. So in the example above, the test would
be run three times with the values `'hello world'`, `Symbol()`, and `{}`.

Testing a function with expected input and output:

```javascript
function square(x) {
  if (typeof x !== 'number') throw new Error('invalid input');
  return x * x;
}

scenario(test, 'square: correct output for ', {
  'a positive number': [7, 49],
  'a negative number': [-3, 9],
  'zero': [0, 0],
  'infinity': [Infinity, Infinity]
}, (t, [input, expectedOutput]) => {
  t.equal(square(input), expectedOutput);
  t.end();
});
```

In this example, instead of a simple value, we gave each test case an array.  We're using the first element in the array as the input to the `square` function, and the second element as the expected output. If you're using ES6, you can destructure the array in the argument list of the test body function, or just call it `testCase` and grab the values out manually using ES5.

More advanced test cases with a "configuration" object:

```javascript
var textField = document.getElementById('text-field');
var display = document.getElementById('display');

function sillyChangeHandler(event) {
  var previous = textField.value;
  var next = event.target.value;
  if (next.length < previous.length) {
    display.textContent = 'deleted some text';
  } else {
    display.textContent = 'added some text';
  }
}

scenario(test, 'sillyChangeHandler: ', {
  'adding one character': {
    previous: 'asd',
    next: 'asdf',
    expectedDisplay: 'added some text'
  },
  'adding multiple characters': {
    previous: 'asdf',
    next: 'asdfqwer',
    expectedDisplay: 'added some text'
  },
  'removing a character': {
    previous: 'asdf',
    next: 'asd',
    expectedDisplay: 'deleted some text'
  },
}, (t, { previous, next, expectedDisplay }) => {
  textField.textContent = previous;
  sillyChangeHandler({ target: { value: next } });
  t.equal(display.textContent, expectedDisplay);
  t.end();
});
```

In this super-contrived example, we are giving an object for each test case. The object configures each test case with the value the text field should previously hold, the next value the text field should change to, and the expected content of the "display".

Again using ES6 destructuring, we're grabbing those configuration values out of the object in the argument list of the test body, and then running the test with those values. Keep in mind that there's nothing special about `previous`, `next`, or `expectedDisplay`. We made them up because they were useful for this set of tests, but we could have added more or different values to this object.

### scenarioOutline

`scenarioOutline` is much more powerful than `scenario`. You would use it when you want to test all possible combinations of a few things, without naming each individual test case. Before looking at code, imagine you had a set of colors, numbers, and shapes. They might look like this:

```javascript
var colors = ['red', 'blue', 'green', 'black'];
var numbers = [42, 12, 7, 18, -53];
var shapes = ['triangle', 'circle', 'square']
```

Say you wanted to test some function that combined these three things. You could do this by specifying a test case for each combination:

|test case name|Color|Number|Shape|
|---|---|---|---|
|test 1|red|42|triangle|
|test 2|red|42|circle|
|test 3|red|42|square|
|test 4|red|12|triangle|
|test 5|red|12|circle|
|...|...|...|...|
|test 6|black|-53|square|

But this would get very tedious. There are a total of 60 possible combinations! And since you don't care about what each test case is "called", you're forced to make up names like "test 1", "test 2", and so on.

This is exactly the work that `scenarioOutline` does for you. Let's look at an example:

```javascript
scenarioOutline(test, 'colorNumberShape: does not throw for ', {
  color: ['red', 'blue', 'green', 'black'],
  number: [42, 12, 7, 18, -53],
  shape: ['triangle', 'circle', 'square']
}, (t, { color, number, shape }) => {
  t.doesNotThrow(() => {
    colorNumberShape(color, number, shape);
  });
  t.end();
});
```

And in 10 lines of code, you've written 60 test cases and ensured that every possible combination is tested! The test cases will be named using indices into each array you give it, like so:

|test case name|Color|Number|Shape|
|---|---|---|---|
|colorNumberShape: does not throw for color[0] number[0] shape[0]|red|42|triangle|
|colorNumberShape: does not throw for color[0] number[0] shape[1]|red|42|circle|
|colorNumberShape: does not throw for color[0] number[0] shape[2]|red|42|square|
|colorNumberShape: does not throw for color[0] number[1] shape[0]|red|12|triangle|
|colorNumberShape: does not throw for color[0] number[2] shape[0]|red|12|circle|
|...|...|...|...|
|colorNumberShape: does not throw for color[3] number[4] shape[2]|black|-53|square|

Going back to our `square` example from earlier, here's another example that avoids the problem of having to name each test case:

```javascript
import test from 'tape';
import { scenarioOutline } from 'tape-scenario';

scenarioOutline(test, 'square: invalid ', {
  input: [undefined, 'hello', Symbol(), null]
}, (t, { input }) => {
  t.throws(() => {
    square(input);
  });
  t.end();
});

// Generated test cases:
//   square: invalid input[0]
//   square: invalid input[1]
//   square: invalid input[2]
//   square: invalid input[3]
```

Here's a crazy example usage of `scenarioOutline` that I pulled verbatim from a project at work:

```javascript
// The function under test. For the input, it needs to both positive and
// negative numbers, either as strings or as numbers.
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

  return '- -';
}

scenarioOutline(test, 'Util: numberWithCommas: ', {
  'multiplier': [1, -1],
  'string': [true, false],
  'expectedResults': [
    [0, '0'],
    [1, '1'],
    [12, '12'],
    [123, '123'],
    [1234, '1,234'],
    [12345, '12,345'],
    [123456, '123,456'],
    [1234567, '1,234,567']
  ]
}, (t, { multiplier, string, expectedResults: [value, asString] }) => {
  const n = input => numberWithCommas(string ? input.toString() : input);
  const prefix = multiplier < 0 ? '-' : '';
  const expected = (asString === '0') ? '0' : prefix + asString; // no -0

  t.equal(n(multiplier * value), expected, `produces ${expected} correctly`);
  t.end();
});
```

The above code produces 32 test cases (`2 * 2 * 8`). They test positive and
negative numbers, passed as both strings or as numbers, to make sure the output
of the function is correct. There's a special case for zero, as negative zero
isn't a valid expected output. But the cool thing is that we were able to test
all those cases with a single test body that contains only one assertion.

## full api

### `scenario(test, prefix, testCases, testBody);`

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

### `scenarioOutline(test, prefix, outline, testBody);`

Same as `scenario`, except `outline` has keys which are "sets" to combine. The
`testBody` will be run once for each possible combination using one value from
each set.

## contributing

For suggestions, bug reports, or contributions, please open an issue or pull
request on the project on GitHub! Feedback is very welcome.
