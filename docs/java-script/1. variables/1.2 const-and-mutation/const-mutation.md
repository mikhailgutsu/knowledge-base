# 1.2 Const and Mutation

**const** prevents reassignment, not mutation.

```js
const user = { name: "Alex" };
user.name = "Maria"; // ✅ allowed

// user = { name: "John" }; ❌ Error
```
