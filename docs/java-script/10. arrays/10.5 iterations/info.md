# JavaScript Arrays — Iterations

## TL;DR

- `for...of` for values; `forEach` for side-effects; `map` for pure transform.
- `some`/`every` return booleans for predicates.

## Examples

```js
const xs = [1,2,3];
for (const x of xs) { /* use x */ }
xs.forEach(x => /* side effects */);
xs.map(x => x*2);       // returns new array
xs.some(x => x>10);     // boolean
xs.every(x => x>0);     // boolean
```
