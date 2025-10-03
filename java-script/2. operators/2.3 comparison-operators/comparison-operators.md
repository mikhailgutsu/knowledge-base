# 3. Comparison Operators

Return boolean values (`true` / `false`).

- `==` equal (loose, does type coercion — ⚠️ avoid in modern code);
- `===` strict equal (no coercion, recommended);
- `!=` not equal (loose);
- `!==` strict not equal;
- `>` greater than;
- `<` less than;
- `>=` greater or equal;
- `<=` less or equal.

```js
console.log(5 == "5"); // true  (type coercion)
console.log(5 === "5"); // false (different types)

console.log(10 != "10"); // false (coerced)
console.log(10 !== "10"); // true

console.log(7 > 3); // true
console.log(7 < 3); // false
console.log(5 >= 5); // true
console.log(4 <= 5); // true
```
