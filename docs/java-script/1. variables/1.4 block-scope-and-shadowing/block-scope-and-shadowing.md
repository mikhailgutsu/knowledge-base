# 1.4 Block Scope & Shadowing

You can “shadow” variables inside a block.

```js
let x = 1;
{
  let x = 2; // shadows outer x
  console.log(x); // 2
}
console.log(x); // 1
```
