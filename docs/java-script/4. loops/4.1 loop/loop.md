# JS Loops — Topic 1: Loop Basics

## TL;DR

- Use a loop for: iteration, transformation, searching, aggregation.
- For arrays: classic `for` or `for...of`; for objects: `for...in` (keys).
- Avoid infinite loops; define clear conditions.

## Exemple

```js
const arr = [3, 7, 2, 9, 4];
let sum = 0;
for (let i = 0; i < arr.length; i++) sum += arr[i];

const doubled = [];
for (let i = 0; i < arr.length; i++) doubled.push(arr[i] * 2);

let firstOver5 = null;
for (let i = 0; i < arr.length; i++) {
  if (arr[i] > 5) {
    firstOver5 = arr[i];
    break;
  }
}
```
