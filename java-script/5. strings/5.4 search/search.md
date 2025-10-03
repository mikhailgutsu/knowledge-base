# JS Strings — Search (Plain & RegExp)

## TL;DR

- plain: `includes`, `startsWith`, `endsWith`, `indexOf/lastIndexOf`;
- RegExp: `test`, `match`, `matchAll`, `replace` with groups;
- for case-insensitive search: `i` or `toLowerCase()`.

## Examples

```js
const s = "Hello world, hello JS.";
s.includes("world"); // true
s.startsWith("Hell"); // true
s.endsWith("JS."); // true
s.indexOf("hello"); // 13 (case-sens)

const re = /\b(\w+)@([\w.-]+\.\w{2,})\b/gi;
re.test("a@b.com"); // true
"Emails: a@b.com c@x.io".match(re); // ["a@b.com","c@x.io"]

for (const m of "a@b.com c@x.io".matchAll(re)) {
  // m[1] user, m[2] host
}

"John Smith".replace(/(\w+)\s+(\w+)/, "$2, $1"); // "Smith, John"
```
