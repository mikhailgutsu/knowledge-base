# JS Functions — Closures & Scope

## TL;DR

- Closures capture variables from their lexical scope.
- Use closures to create **private state** and factories.
- IIFE and module patterns encapsulate implementation details.

## Examples

```js
function createCounter(initial = 0) {
  let value = initial;
  return {
    inc() {
      value++;
    },
    get() {
      return value;
    },
  };
}
const c = createCounter(10);
c.inc();
c.get(); // 11

// IIFE module
const store = (() => {
  const data = new Map();
  return { set: (k, v) => data.set(k, v), get: (k) => data.get(k) };
})();
store.set("token", "abc");
store.get("token"); // "abc"
```
