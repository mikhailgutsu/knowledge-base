# JavaScript Typed Arrays — Methods

## TL;DR

- Copy in: `.set(array, offset)`.
- Views: `.subarray(start, end)` (no copy).
- Copies: `.slice(start, end)` returns a **new** typed array.
- Iteration helpers: `.map`, `.filter`, `.reduce` exist and return typed arrays (for map/filter).

## Examples

```js
const u8 = new Uint8Array(8);
u8.set([1, 2, 3, 4], 2);
const view = u8.subarray(2, 6); // shares buffer
const copy = u8.slice(2, 6); // new buffer

Array.from(u8.map((x) => x * 2));
Array.from(u8.filter((x) => x > 2));
u8.reduce((a, x) => a + x, 0);
```
