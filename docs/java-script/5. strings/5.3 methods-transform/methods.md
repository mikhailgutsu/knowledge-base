# JS Strings — Methods (Transform)

## TL;DR

- frequent transformations: `trim`, `toUpperCase/toLowerCase`, `padStart/padEnd`, `repeat`;
- extractions: `slice`, `substring`, `at`;
- replacements & compositions: `replace/replaceAll`, `split/join`.

## Examples

```js
"  hi  ".trim(); // "hi"
"7".padStart(3, "0"); // "007"
"A".repeat(3); // "AAA"

const s = "JavaScript";
s.slice(0, 4); // "Java"
s.slice(-6); // "Script"
s.substring(4, 0); // "Java" (auto invert)
s.at(-1); // "t"

"one, two, two".replace("two", "2"); // "one, 2, two"
"one, two, two".replaceAll("two", "2"); // "one, 2, 2"

"alpha|beta".split("|"); // ["alpha","beta"]
["a", "b"].join(","); // "a,b"
```
