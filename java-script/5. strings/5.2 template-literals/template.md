# JS Strings — Template Literals

## TL;DR

- Backticks `` `...` `` support: interpolation `${expr}`, multi-line, tagged templates;
- `String.raw` preserves escape sequences.

## Examples

```js
const name = "Alex",
  n = 3,
  price = 19.9;
`Hello ${name}, total: ${(n * price).toFixed(2)} €`;

const multi = `Line 1
Line 2`;

const raw = String.raw`C:\path\to\file\next`; // backslash saved

// Tag simplu anti-XSS
const esc = (strings, ...vals) =>
  strings.reduce(
    (a, s, i) =>
      a +
      s +
      (i < vals.length
        ? String(vals[i]).replace(
            /[&<>"']/g,
            (m) =>
              ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
              }[m])
          )
        : ""),
    ""
  );
esc`Hello ${`<script>`}`; // escaped
```
