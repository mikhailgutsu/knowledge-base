# JavaScript Variables (let, const, var) and Types

## 1. `var` vs `let` vs `const`

- **`var`**
  - Function-scoped (visible inside the whole function).
  - Hoisted **and initialized as `undefined`**.
  - Can be redeclared.
- **`let`**
  - Block-scoped (`{ ... }`).
  - Hoisted but **not initialized** (TDZ — Temporal Dead Zone).
  - Cannot be redeclared in same scope.
- **`const`**
  - Same rules as `let`, but **must be assigned immediately**.
  - You can still mutate objects/arrays declared with `const`.

```js
{
  var a = 1;
  let b = 2;
  const c = 3;
}
console.log(a); // ✅ will-works
console.log(b); // ❌ ReferenceError
console.log(c); // ❌ ReferenceError
```
