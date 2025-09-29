# 1.1 Hoisting

All declarations (**var**, **let**, **const**, functions) are hoisted to the top of their scope.

- only **var** is initialized as `undefined`;
- **let** and **const** stay in the _Temporal Dead Zone (TDZ)_ until execution reaches them.

```js
console.log(x); // undefined
var x = 5;

console.log(y); // ❌ ReferenceError
let y = 10;
```
