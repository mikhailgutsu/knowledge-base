# JavaScript Dates — Format

## TL;DR

- Prefer ISO 8601 for interchange: `"YYYY-MM-DDTHH:mm:ss.sssZ"` (UTC) or with an offset (e.g., `+02:00`).
- `toISOString()` and `toJSON()` always output **UTC**.
- For user-facing formatting, use `Intl.DateTimeFormat` with an explicit `timeZone`.

## Quick Recipes

```js
const d = new Date("2025-09-30T08:15:30.123Z");

// ISO / machine
d.toISOString(); // "2025-09-30T08:15:30.123Z"
d.toJSON(); // same as toISOString

// Locale / human (explicit zone for stability)
new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Chisinau",
}).format(d);

// Custom pattern (UTC parts)
const pad = (n, w = 2) => String(n).padStart(w, "0");
`${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
```
