# JavaScript Typed Arrays — Basics

## TL;DR

- `ArrayBuffer` is raw binary; TypedArrays are **views** over it: `Uint8Array`, `Int16Array`, `Float32Array`, etc.
- All views on the same buffer share memory.

## Examples

```js
const buf = new ArrayBuffer(8);
const u8 = new Uint8Array(buf);
const i16 = new Int16Array(buf);
u8.set([1, 2, 3, 4]); // writes bytes
Array.from(i16); // same memory, reinterpreted as 16-bit ints
```
