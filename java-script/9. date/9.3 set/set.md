# JavaScript Dates — Set (Mutating parts)

## TL;DR

- Local setters: `setFullYear`, `setMonth`, `setDate`, `setHours`, etc.
- UTC setters: `setUTCFullYear`, `setUTCMonth`, `setUTCDate`, `setUTCHours`, etc.
- Setters **roll over** out-of-range values (Feb 30 → Mar 1/2 depending on year).

## Examples

```js
const d = new Date(2025, 0, 31); // Jan 31 (local)
d.setMonth(1); // sets to February → rolls into March depending on month length

const u = new Date("2025-09-30T12:00:00Z");
u.setUTCDate(u.getUTCDate() + 1); // +1 UTC day
```

## Arithmetic Patterns

```js
// DST-sensitive (local): may jump by 23/25 hours across transitions
const addDaysLocal = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

// DST-safe (UTC): add milliseconds
const addDaysUTC = (d, n) => new Date(d.getTime() + n * 24 * 60 * 60 * 1000);
```
