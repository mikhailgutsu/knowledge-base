# JS Functions — Higher-Order & FP

## TL;DR

- Higher-order functions take/return functions.
- Prefer `map`, `filter`, `reduce` for array transforms.
- Compose and curry to build reusable pipelines.

## Examples

```js
const curry2 = (fn) => (a) => (b) => fn(a, b);
const add = (a, b) => a + b;
const add10 = curry2(add)(10);

const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);
const mul2 = (n) => n * 2,
  square = (n) => n * n;
const pipeline = pipe(add10, mul2, square);
pipeline(5); // 900
```
