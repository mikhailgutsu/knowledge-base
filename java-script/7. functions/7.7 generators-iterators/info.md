# JS Functions — Generators & Iterators

## TL;DR

- `function*` yields values over time with `yield`.
- Custom iterables implement `[Symbol.iterator]`.
- Async generators (`async function*`) work with `for await...of`.

## Examples

```js
function* range(a, b, step = 1) {
  for (let n = a; n <= b; n += step) yield n;
}
[...range(1, 5)]; // [1,2,3,4,5]

const countdown = {
  from: 3,
  to: 1,
  *[Symbol.iterator]() {
    for (let n = this.from; n >= this.to; n--) yield n;
  },
};

async function* ticker(times, ms) {
  for (let i = 1; i <= times; i++) {
    await new Promise((r) => setTimeout(r, ms));
    yield i;
  }
}
```
