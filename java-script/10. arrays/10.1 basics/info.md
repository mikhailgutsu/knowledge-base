# JavaScript Arrays — Basics

## TL;DR

- Arrays hold ordered elements and have dynamic length.
- Literal `[]`, `Array.of(...)`, `Array.from(iterable, mapFn?)`.
- Beware **holes** (empty slots) vs explicit `undefined`.

## Examples

```js
const a = [1, 2, 3];
const b = Array(3); // [ <3 empty items> ]
const c = Array.of(3); // [3]
const d = Array.from("abc"); // ["a","b","c"]
```
