# JavaScript Objects — Basics

## TL;DR

- Objects map **string/symbol keys** to values.
- Dot access for identifier-like keys; bracket access for dynamic/non-identifier keys.
- Use **computed property names** and **method shorthand**.
- Symbols make **non-colliding** keys (not listed by `Object.keys`).

## Examples

```js
const key = "score";
const user = {
  name: "Alex",
  "likes-js": true,
  [key]: 100,
  sayHi() {
    return `Hi, I'm ${this.name}`;
  },
};

user.name; // dot
user["likes-js"]; // bracket
user[key]; // computed
user.sayHi();

const ID = Symbol("id");
user[ID] = 123;
// Object.keys(user) -> ["name","likes-js","score"]
// Object.getOwnPropertySymbols(user) -> [Symbol(id)]
```
