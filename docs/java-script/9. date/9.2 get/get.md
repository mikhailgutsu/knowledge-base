# JavaScript Dates — Get (Reading parts)

## TL;DR

- Local getters: `getFullYear`, `getMonth` (0–11), `getDate` (1–31), `getDay` (0–Sun), `getHours`, `getMinutes`, `getSeconds`, `getMilliseconds`.
- UTC variants: same names prefixed with `getUTC...`.
- Epoch time: `getTime()` or `Number(date)` → **ms since 1970-01-01T00:00:00Z**.

## Examples

```js
const d = new Date("2025-09-30T12:34:56.789Z");
d.getFullYear(); // local
d.getMonth(); // 0-based
d.getDate(); // 1..31
d.getDay(); // 0..6 (Sun..Sat)
d.getTime(); // ms epoch

d.getUTCFullYear(); // UTC
d.getUTCHours(); // 0..23
```
