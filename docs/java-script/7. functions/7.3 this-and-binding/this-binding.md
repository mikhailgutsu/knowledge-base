# JS Functions — `this` & Binding

## TL;DR

- Arrow functions capture `this` lexically (cannot be re-bound).
- Regular functions’ `this` depends on **call site**; control with `call/apply/bind`.
- Extracting a method loses its `this` unless you bind it.

## Examples

```js
const user = {
  name: "Alex",
  hello() {
    return `Hi, I'm ${this.name}`;
  },
};
const fn = user.hello;
fn(); // TypeError / or "Hi, I'm undefined"
const bound = user.hello.bind(user);
bound(); // "Hi, I'm Alex"

function intro(city) {
  return `${this.name} from ${city}`;
}
intro.call({ name: "Maria" }, "Chisinau");
intro.apply({ name: "Maria" }, ["Chisinau"]);
const introMd = intro.bind({ name: "Maria" }, "Chisinau");
introMd();
```
