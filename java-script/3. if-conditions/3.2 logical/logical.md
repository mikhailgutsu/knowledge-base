# 2. Logical Operators (&&, ||, !, ??, ?. , ||=, &&=, ??=)

## TL;DR

- `&&` returns first falsy or last value;
- `||` returns first truthy value;
- `!x` negates; `!!x` coerces to boolean;
- `??` uses right side only when left is `null` or `undefined`;
- `?.` safely accesses properties and calls;
- logical assignment: `x ||= y`; `x &&= y`; `x ??= y`.

## Cheatsheet

- `A && B`: if A is truthy → B; else → A;
- `A || B`: if A is truthy → A; else → B;
- `A ?? B`: if A is nullish (`null`/`undefined`) → B; else → A;
- `obj?.prop`, `obj?.fn?.()` to avoid crashes on missing paths.

## Examples

```js
"A" && "B"; // "B"
0 && "B"; // 0
"A" || "B"; // "A"
"" || "B"; // "B"

0 || 42; // 42  (maybe not desired)
0 ?? 42; // 0   (keeps valid 0)

const data = { user: { name: "Alex", getId: () => 123 } };
data.user?.name; // "Alex"
data.user?.getId?.(); // 123
({}).user?.name; // undefined

let title = "";
title ||= "Untitled"; // "Untitled" ('' is falsy)

let ok = true;
ok &&= false; // false

let count = 0;
count ??= 10; // 0 (kept, not nullish)
```
