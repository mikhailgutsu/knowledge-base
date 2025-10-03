# JS Loops — Topic 4: continue & break

## TL;DR

- `continue` skips the current iteration;
- `break` stops the current loop;
- labeled `break` can exit nested loops.

## Exemple

```js
const evens = [];
for (const n of [1, 2, 3, 4, 5, 6]) {
  if (n % 2) continue;
  evens.push(n);
}

let first;
for (const n of [1, 2, 3, 4, 5, 6]) {
  if (n > 4) {
    first = n;
    break;
  }
}

outer: for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 3; c++) {
    if (r === 1 && c === 1) break outer;
  }
}
```
