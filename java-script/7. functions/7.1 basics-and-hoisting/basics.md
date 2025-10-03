# JS Functions — Basics & Hoisting

## TL;DR

- Declarations are hoisted **with their body**.
- Expressions and arrow functions are hoisted as **bindings only** (TDZ until initialized).
- Functions are objects: `.name`, `.length`, `.toString()`.

## Examples

```js
// Declaration (hoisted body)
console.log(add(2, 3)); // 5
function add(a, b) {
  return a + b;
}

// Expression / Arrow (TDZ until init)
try {
  mul(2, 3);
} catch (e) {
  /* ReferenceError */
}
const mul = (a, b) => a * b;

function greet(name, title) {
  return `Hello, ${title} ${name}`;
}
greet.name; // "greet"
greet.length; // 2
```
