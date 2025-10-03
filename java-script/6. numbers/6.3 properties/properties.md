# JavaScript Numbers — Properties

## TL;DR

- `Number.MAX_VALUE`, `MIN_VALUE` (smallest positive > 0).
- `Number.MAX_SAFE_INTEGER` = 2^53−1; `MIN_SAFE_INTEGER` = −(2^53−1).
- `Number.EPSILON` ~ 2.22e−16 (precision step near 1).
- `Number.NaN`, `POSITIVE_INFINITY`, `NEGATIVE_INFINITY`.

## Examples

```js
Number.MAX_VALUE * 2; // Infinity (overflow)
Number.MIN_VALUE / 2; // 0 (underflow to subnormal/zero)
Number.isSafeInteger(2 ** 53); // false
```
