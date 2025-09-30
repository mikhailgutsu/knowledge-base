# JavaScript Numbers — Primitive vs Number Object

## TL;DR

- Use primitive numbers; **avoid** `new Number(...)` (it creates an object).
- `typeof 0` → `"number"`; `typeof new Number(0)` → `"object"`.
- `Boolean(new Number(0))` is **true** (pitfall), while `Boolean(0)` is false.

## Examples

```js
const p = 0;
const o = new Number(0);

o.valueOf() === 0; // true
o === 0; // false (object vs primitive)
Boolean(o); // true  (!!)
```
