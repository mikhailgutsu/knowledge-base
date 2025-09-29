**Type coercion with `==`:**

```js
console.log(false == 0); // true
console.log(false === 0); // false
console.log(null == undefined); // true
console.log(null === undefined); // false
```

## 👉 Always prefer === and !== to avoid surprises.

Comparisons with strings:

```js
console.log("a" < "b"); // true (lexical comparison)
console.log("apple" > "ant"); // true (compares character by character)
```
