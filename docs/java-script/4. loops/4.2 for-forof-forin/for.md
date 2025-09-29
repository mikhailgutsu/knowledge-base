# JS Loops — Topic 2: for, for...of, for...in

## TL;DR

- Classic `for`: fine control over the index, easy `break`/`continue`;
- `for...of`: values from iterables (array, string, Map), preferred on arrays;
- `for...in`: object keys; avoid it on arrays.

## Exemple

```js
for (let i = 0; i < items.length; i++) {
  console.log(i, items[i]);
}

// for...of (vals)
for (const v of items) {
  console.log(v);
}

// for...in (key_obj)
for (const k in obj) {
  if (Object.hasOwn(obj, k)) console.log(k, obj[k]);
}
```
