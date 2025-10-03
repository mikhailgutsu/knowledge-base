# JavaScript Objects — JSON Serialization

## TL;DR

- `JSON.stringify(value, replacer?, space?)`
- `JSON.parse(text, reviver?)`
- `toJSON()` on an object customizes how it’s stringified.

## Examples

```js
const data = { id: 1, pwd: "secret", at: new Date() };
JSON.stringify(data, (k, v) => (k === "pwd" ? "***" : v), 2);

const json = `{"at":"2025-01-01T00:00:00.000Z"}`;
const obj = JSON.parse(json, (k, v) => (k === "at" ? new Date(v) : v));
obj.at instanceof Date; // true

const account = {
  id: 7,
  balance: 19.95,
  toJSON() {
    return { id: this.id, balance: this.balance };
  },
};
JSON.stringify(account); // uses toJSON
```
