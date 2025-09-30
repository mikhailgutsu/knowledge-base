# JavaScript Typed Arrays — Reference & Endianness

## TL;DR

- Multiple views over the same `ArrayBuffer` share bytes.
- Use `DataView` for explicit endianness reads/writes.
- `subarray` is a view; `slice` copies.

## Examples

```js
const buf = new ArrayBuffer(4);
const dv = new DataView(buf);
dv.setUint32(0, 0x12345678, true); // little-endian
dv.getUint32(0, true).toString(16); // "12345678"
dv.getUint32(0, false).toString(16); // "78563412"
```
