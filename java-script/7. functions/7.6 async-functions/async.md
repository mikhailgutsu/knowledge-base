# JS Functions — Async

## TL;DR

- Prefer Promises and `async/await` over raw callbacks.
- Use `try/catch` with `await`; use `Promise.all` for parallel; `allSettled` for resilience.

## Examples

```js
// Promisify a callback
const doAsync = (x) =>
  new Promise((res, rej) =>
    setTimeout(() => (x < 0 ? rej(new Error("x<0")) : res(x * 2)), 20)
  );

(async () => {
  try {
    const v = await doAsync(21);
    const [a, b, c] = await Promise.all([doAsync(1), doAsync(2), doAsync(3)]);
  } catch (e) {
    // handle
  }
})();
```
