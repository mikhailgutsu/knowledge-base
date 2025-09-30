# JavaScript Objects — Descriptors, Getters, Setters

## TL;DR

- Control **enumerable/writable/configurable** via `Object.defineProperty`.
- Accessor properties: `get`/`set` compute or validate values.
- Inspect descriptors with `Object.getOwnPropertyDescriptor(s)`.

## Examples

```js
const o = {};
Object.defineProperty(o, "hidden", { value: 42, enumerable: false });

const person = {
  first: "Alex",
  last: "Bircu",
  get full() {
    return `${this.first} ${this.last}`;
  },
  set full(v) {
    [this.first, this.last] = String(v).split(" ");
  },
};
```
