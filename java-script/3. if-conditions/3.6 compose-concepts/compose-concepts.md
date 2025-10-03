# 6. Mini Practice (Compose Concepts)

## Tasks

- compute average and decide pass/fail;
- implement a safe display name with nullish checks;
- use short-circuiting for optional behavior.

## Reference Solutions

```js
// average + comparison
function passStatus(scores, pass = 8.5) {
  let sum = 0;
  for (let i = 0; i < scores.length; i++) sum += scores[i];
  const avg = sum / scores.length;
  return avg >= pass ? `Passed (${avg})` : `Failed (${avg})`;
}

// safe name
const getName = (u) => u?.name ?? "Guest";

// optional tracking
const track = (ev) => console.log("tracked:", ev);
const featureEnabled = true;
featureEnabled && track("experiment-start");
```
