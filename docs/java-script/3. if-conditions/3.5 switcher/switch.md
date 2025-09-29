# 5. switch (Exact Matches, Grouped Cases, Ranges)

## TL;DR

- `switch` is good for discrete value matches;
- group cases by fall-through;
- for ranges, use `switch(true)` or prefer `if/else`;
- for simple lookups, use an object map.

## Basic switch

```js
const method = "PUT";
switch (method) {
  case "GET":
    console.log("read");
    break;
  case "POST":
  case "PUT":
    console.log("write/update");
    break;
  default:
    console.log("unknown");
}
```

## Range checks via -> switcher(true)

```js
const t = 31;
switch (true) {
  case t <= 0:
    console.log("freezing");
    break;
  case t <= 15:
    console.log("cold");
    break;
  case t <= 25:
    console.log("mild");
    break;
  default:
    console.log("hot");
}
```

## Dictionary alternative

```js
const op = "es";
const messages = { en: "Hello", es: "Hola", fr: "Bonjour" };
console.log(messages[op] ?? "Hello");
```
