# JavaScript Objects — Prototypes & Inheritance

## TL;DR

- Every object has an internal **[[Prototype]]** (its parent in the chain).
- `Object.create(proto)` creates an object with an explicit prototype.
- `class` is syntactic sugar over prototypes.

## Examples

```js
const proto = {
  greet() {
    return `Hi ${this.name}`;
  },
};
const o = Object.create(proto, {
  name: { value: "Alex", enumerable: true, writable: true },
});
o.greet(); // "Hi Alex"

class A {
  speak() {
    return "A";
  }
}
class B extends A {
  speak() {
    return super.speak() + " -> B";
  }
}
new B().speak(); // "A -> B"
```
