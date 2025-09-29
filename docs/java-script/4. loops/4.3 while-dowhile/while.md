# JS Loops — Topic 3: while & do...while

## TL;DR

- `while` runs as long as the condition is true (may run 0 times);
- `do...while` runs at least once;
- useful for queues, pooling, retries.

## Exemple

```js
const q = ["t1", "t2", "t3"];
while (q.length) {
  const job = q.shift();
}

// do...while: min one execution
let ok = false,
  tries = 0;
do {
  tries++;
  ok = tries >= 3;
} while (!ok);
```
