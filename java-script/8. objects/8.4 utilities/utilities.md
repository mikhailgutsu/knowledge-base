# JavaScript Objects — Utilities

## TL;DR

- `Object.keys/values/entries` enumerate **own enumerable** props.
- `Object.fromEntries` builds objects from `[key, value]` pairs.
- `Object.hasOwn(obj, key)` reliably checks own props.
- `Object.getOwnPropertyNames/Symbols/Descriptors` inspect internals.

## Examples

```js
const o = { a: 1, b: 2 };
Object.keys(o); // ["a","b"]
Object.values(o); // [1,2]
Object.entries(o); // [["a",1],["b",2]]
Object.fromEntries([["x", 10]]); // { x:10 }

const proto = { p: 1 };
const child = Object.create(proto);
Object.hasOwn(child, "p"); // false
"p" in child; // true
```
