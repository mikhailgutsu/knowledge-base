# JavaScript Numbers — Methods

## TL;DR

- Prefer `Number.isNaN`, `Number.isFinite`, `Number.isInteger`, `Number.isSafeInteger`.
- Formatting: `toFixed`, `toPrecision`, `toExponential`, `toString(radix)`.

## Examples

```js
Number.isNaN(NaN); // true
Number.isFinite("42"); // false (no coercion)
isFinite("42"); // true  (global coerces)

(1234.567).toFixed(2); // "1234.57"
(1234.567).toPrecision(4); // "1235"
(255).toString(16); // "ff"
(10).toString(2); // "1010"
```
