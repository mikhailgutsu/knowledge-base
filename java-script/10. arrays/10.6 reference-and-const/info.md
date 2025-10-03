# JavaScript Arrays — Reference & Const

## TL;DR

- Arrays are objects → **reference semantics**.
- Shallow copies (`slice`, spread) copy the array, not nested objects.
- `const` prevents rebinding, not element mutation.
- `Object.freeze` is shallow.

## Examples

```js
const a = [{ x: 1 }];
const b = a; // same ref
const c = a.slice(); // shallow copy
b[0].x = 99;
c[0].x; // 99 (shared nested)

const xs = [1, 2];
xs.push(3); // allowed with const
Object.freeze(xs); // prevents structural changes (shallow)
```
