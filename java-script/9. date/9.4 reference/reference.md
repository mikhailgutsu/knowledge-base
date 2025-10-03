# JavaScript Dates — Reference (Objects, equality, JSON)

## TL;DR

- `Date` is a **mutable object** wrapping a timestamp (ms since epoch).
- Copy dates with `new Date(old)` or `new Date(old.getTime())` before mutating.
- Compare **instants** via `getTime()` (or `valueOf()`), not `===`.

## Examples

```js
const a = new Date("2025-09-30T12:00:00Z");
const b = new Date(a); // copy
b.setUTCMinutes(30);

a === b; // false (different objects)
a.getTime() === b.getTime(); // false here (different instants)

// JSON
const json = JSON.stringify({ when: a }); // Date -> ISO string
const revived = JSON.parse(json, (k, v) => (k === "when" ? new Date(v) : v));
revived.when instanceof Date; // true
```
