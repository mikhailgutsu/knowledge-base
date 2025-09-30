# JavaScript Numbers — Basics

## TL;DR

- JS `number` is a 64-bit IEEE-754 floating-point value.
- Literal forms: decimal, binary `0b`, octal `0o`, hex `0x`, scientific `1.23e4`.
- Numeric separators improve readability: `1_000_000`.

## Examples

```js
const dec = 1_234.56;
const bin = 0b1010; // 10
const oct = 0o755; // 493
const hex = 0xff; // 255
const exp = 6.022e23; // 6.022 × 10^23
```

## Floating-point gotcha

```js
0.1 + 0.2; // 0.30000000000000004
const approxEqual = (a, b, eps = Number.EPSILON) =>
  Math.abs(a - b) < eps * Math.max(1, Math.abs(a), Math.abs(b));
approxEqual(0.1 + 0.2, 0.3); // true
```

## Parsing

```js
Number("42"); // 42
Number("42px"); // NaN
parseInt("FF", 16); // 255
parseFloat("3.14x"); // 3.14
```
