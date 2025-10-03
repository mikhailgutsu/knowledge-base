# JavaScript Objects — Cloning, Merging, Immutability

## TL;DR

- Spread/Object.assign are **shallow**.
- `structuredClone(obj)` deep-clones most things; JSON clone loses Dates/functions.
- `Object.freeze` / `seal` / `preventExtensions` control mutability (shallow).

## Examples

```js
const src = { a: 1, nested: { z: 9 } };
const shallow = { ...src }; // shallow
shallow.nested.z = 100; // affects src.nested

const deep = structuredClone(src); // if available
// JSON clone fallback (limitations)
// const deep = JSON.parse(JSON.stringify(src));

Object.freeze(src); // no add/remove/change (shallow)
```
