# JavaScript Arrays — Methods (Transform & Utils)

## TL;DR

- Transform: `map`, `filter`, `reduce`, `flat`, `flatMap`.
- Utilities: `slice`, `concat`, `join`, `toString`, `fill`, `copyWithin`, `at`, `Array.of`, `Array.from`.

## Examples

```js
[1, 2, 3].map((x) => x * 2); // [2,4,6]
[1, 2, 3, 4].filter((x) => x % 2 === 0); // [2,4]
[1, 2, 3].reduce((a, x) => a + x, 0); // 6
[1, [2, [3]]].flat(2); // [1,2,3]
[1, 2, 3].flatMap((x) => [x, x * 2]); // [1,2,2,4,3,6]

["a", "b", "c"].join(","); // "a,b,c"
["a", "b", "c"].at(-1); // "c"
```
