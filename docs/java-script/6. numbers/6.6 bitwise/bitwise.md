# JavaScript Bitwise Operations

## TL;DR

- With **Number**: operators work on 32-bit signed lanes: `& | ^ ~ << >> >>>`.
- With **BigInt**: supported `& | ^ ~ << >>` (no `>>>`), operands must both be BigInt.
- Useful for flags, masks, low-level parsing.

## Number Examples

```js
const A = 0b1010,
  B = 0b1100;
(A & B).toString(2); // "1000"
(A | B).toString(2); // "1110"
(A ^ B).toString(2); // "0110"
(~A >>> 0).toString(2).padStart(32, "0"); // inverted view

1 << 5; // 32
-16 >> 2; // -4 (arithmetic)
16 >>> 2; // 4  (unsigned)
```

## BigInt Examples

```js
const x = 0b1010n,
  y = 0b1100n;
(x & y).toString(2); // "1000"
1n << 10n; // 1024n
// 1n >>> 1n // TypeError: unsigned shift not supported for BigInt
```
