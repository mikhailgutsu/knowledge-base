# JavaScript Arrays — Search

## TL;DR

- Value checks: `includes`, `indexOf`, `lastIndexOf` (strict equality).
- Predicate searches: `find`, `findIndex`, `findLast`, `findLastIndex` (modern).

## Examples

```js
const xs = [5, 12, 8, 130, 44];
xs.includes(12); // true
xs.indexOf(8); // 2
xs.find((n) => n > 100); // 130
xs.findIndex((n) => n % 2 === 0); // 1 (12)

xs.findLast?.((n) => n < 50); // 44 (if supported)
```
