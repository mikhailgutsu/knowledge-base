# 4. Ternary Operator (?:)

## TL;DR

- `cond ? a : b` is an expression version of `if/else`;
- keep ternaries short; prefer `if/else` when nested or long.

## Syntax

- `const result = condition ? whenTrue : whenFalse;`.

## Examples

```js
const age = 19;
const access = age >= 18 ? "granted" : "denied";

const score = 86;
const grade =
  score >= 90
    ? "A"
    : score >= 80
    ? "B"
    : score >= 70
    ? "C"
    : score >= 60
    ? "D"
    : "F"; // prefer if/else if this grows
```
