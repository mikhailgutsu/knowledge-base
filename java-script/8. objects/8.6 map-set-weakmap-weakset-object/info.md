# JS Collections — Map, Set, WeakMap, WeakSet vs Object

## TL;DR

- **Map**: keys of any type, ordered iteration, size, better for lookups with object keys.
- **Set**: unique values.
- **WeakMap/WeakSet**: keys are objects held weakly (GC-friendly); not iterable.
- **Object**: string/symbol keys only; great for plain records/JSON.

## Examples

```js
const k = { id: 1 };
const map = new Map([[k, "value"]]);
map.get(k); // "value"

const set = new Set([1, 2, 2, 3]); // {1,2,3}

const priv = new WeakMap();
const obj = {};
priv.set(obj, "secret");
priv.get(obj); // "secret"
```
