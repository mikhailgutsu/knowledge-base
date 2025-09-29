# 4. Types of Values

JavaScript has **primitive types** (immutable) and **reference types** (objects).

- primitives: `string`, `number`, `boolean`, `null`, `undefined`, `bigint`, `symbol`;
- reference types: `object`, `array`, `function`, `date`, etc.

```js
let x = "Hello"; // primitive
let arr = [1, 2, 3]; // reference
```

## Difference :

```js
let a = 10;
let b = a; // copy by value
b = 20;
console.log(a); // 10

let obj1 = { val: 10 };
let obj2 = obj1; // copy by reference
obj2.val = 20;
console.log(obj1.val); // 20
```
