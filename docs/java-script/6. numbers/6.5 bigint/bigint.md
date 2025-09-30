# JavaScript BigInt

## TL;DR

- Arbitrary-precision integers: create with `123n` or `BigInt(123)`.
- Cannot mix `BigInt` and `Number` in operations (TypeError).
- Integer division truncates toward zero.

## Examples

```js
const a = 9_007_199_254_740_991n; // > Number.MAX_SAFE_INTEGER boundary use-case
const b = a + 9n; // works

// Mixing types -> error
// 1n + 1  // TypeError
1n + BigInt(1); // 2n
Number(1n) + 1; // 2

5n / 2n; // 2n (truncates)
0xffn.toString(16); // "ff"
```
