# 3. if / else if / else (Guard Clauses)

## TL;DR

- use guard clauses to return early and reduce nesting;
- prefer strict checks and meaningful conditions.

## Patterns

- guard clauses;
- linear branching with `if / else if / else`;
- avoid assignment in conditions.

## Examples

```js
function canAccess(user) {
  if (!user) return false;
  if (!user.active) return false;
  return user.role === "admin" || user.role === "editor";
}

const n = 7;
if (n > 10) {
  console.log("big");
} else if (n > 5) {
  console.log("medium");
} else {
  console.log("small");
}

// avoid:
let ok = false;
if ((ok = true)) {
  /* assignment, bug */
} // do not do this
```
