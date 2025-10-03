# JS Strings — Basics & Unicode

## TL;DR

- Strings are **immutable**.
- `length` counts **UTF-16 units**, not necessarily characters.
- For composite emoji/diacritics, use `Array.from(str)` or `[...str]` to count characters.

## Common Tasks

- reading: indexing `s[i]`, `charAt(i)`, `at(-1)`;
- concatenation: `+`, template literals;
- Unicode handling: `codePointAt`, `fromCodePoint`, `normalize(‘NFC’)`.

## Examples

```js
const s = "Hello";
s[0] = "h"; // (immutable)
const t = s + " " + "World"; // "Hello World"

const heart = "💙";
heart.length; // 2 (UTF-16)
[...heart].length; // (cod point)
heart.codePointAt(0); // 128153
String.fromCodePoint(0x1f499); // "💙"

// Normalization for visual equality
"é" === "e\u0301"; // false
"é".normalize("NFC") === "e\u0301".normalize("NFC"); // true
```
