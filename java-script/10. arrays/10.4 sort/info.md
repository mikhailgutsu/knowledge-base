# JavaScript Arrays — Sort

## TL;DR

- Default `sort()` converts to strings (lexicographic).
- Provide a comparator `(a,b) => a-b` for numeric ascending.
- Sorting is **stable** since ES2019.

## Examples

```js
[10, 2, 5, 1].sort(); // ["1","10","2","5"]
[10, 2, 5, 1].sort((a, b) => a - b); // [1,2,5,10]

people.sort((a, b) => a.age - b.age || a.name.localeCompare(b.name));
["ä", "z", "a"].sort((a, b) => a.localeCompare(b, "de"));
```
