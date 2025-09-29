# 1. Booleans & Truthy/Falsy

## TL;DR

- 8 falsy values: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`;
- everything else is truthy;
- use `Boolean(x)` or `!!x` to coerce to a boolean.

## Quick Table

- falsy: `false`; `0`; `-0`; `0n`; `""`; `null`; `undefined`; `NaN`;
- truthy: `"0"`; `"false"`; `[]`; `{}`; functions; dates; all non-empty strings; all non-zero numbers.

## Examples

```js
Boolean(false); // false
Boolean(0); // false
Boolean(""); // false

Boolean("0"); // true
Boolean("false"); // true
Boolean([]); // true
Boolean({}); // true

!0; // true
!!"hi"; // true
```
