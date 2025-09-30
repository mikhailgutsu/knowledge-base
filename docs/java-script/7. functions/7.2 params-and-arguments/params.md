# JS Functions — Parameters & Arguments

## TL;DR

- Use default params and rest params instead of manual checks or `arguments`.
- Destructure objects in params for **named arguments** with defaults.
- Use spread `...` to pass arrays as argument lists.

## Examples

```js
// Defaults
const inc = (x, step = 1) => x + step;

// Rest
const sum = (...xs) => xs.reduce((a, b) => a + b, 0);

// Destructuring with defaults (named args)
const draw = ({ x = 0, y = 0, size = 10 } = {}) => `(${x},${y}) size=${size}`;

// Spread to call
const nums = [2, 3, 5];
multiply(...nums);
```
