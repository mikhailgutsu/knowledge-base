/**
 * A practical tour of: Arrays, Array Methods, Search, Sort, Iterations,
 * Reference & Const behavior, Typed Arrays (basics, methods, reference).
 */

const section = (title) => {
  const LINE = "-".repeat(92);
  console.log(`\n${LINE}\n${title}\n${LINE}`);
};
const run = (title, fn) => {
  console.group(`\n▶ ${title}`);
  try {
    fn();
  } catch (e) {
    console.log("⚠️", e?.name, e?.message);
  }
  console.groupEnd();
};

/* -------------------------------------------------------------------------- */
/* 1) ARRAYS — BASICS                                                         */
/* -------------------------------------------------------------------------- */
section("1) Arrays — literals, length, holes, Array.of/from");

run("Creation & basics", () => {
  const a = [1, 2, 3];
  const b = Array(3); // length=3 with holes (empty slots)
  const c = Array.of(3); // [3]
  const d = Array.from("abc"); // ["a","b","c"]
  console.log({ a, b, c, d, aLen: a.length, bLen: b.length });
  console.log("holes vs undefined:", [, ,].length, [undefined].length); // 2 vs 1

  // Sparse arrays: methods may skip holes
  const sparse = [1, , 3];
  console.log(
    "sparse.map(x=>x) ->",
    sparse.map((x) => x)
  ); // [1, , 3]
});

run("Push/pop, shift/unshift, splice (mutating)", () => {
  const arr = [1, 2, 3];
  arr.push(4); // add at end
  arr.unshift(0); // add at start
  console.log("after push/unshift ->", arr); // [0,1,2,3,4]
  arr.pop(); // remove end
  arr.shift(); // remove start
  console.log("after pop/shift ->", arr); // [1,2,3]

  // splice: add/remove in the middle
  arr.splice(1, 1, 9, 9); // at index 1 remove 1 item, insert 9,9
  console.log("after splice ->", arr); // [1,9,9,3]
});

run("Non-mutating copies: slice, concat, toReversed/toSorted (modern)", () => {
  const base = [3, 1, 2];
  console.log("slice(0)     ->", base.slice(0)); // copy
  console.log("concat([4])  ->", base.concat([4])); // new array
  if (Array.prototype.toReversed) {
    console.log("toReversed  ->", base.toReversed()); // non-mutating reverse
    console.log(
      "toSorted    ->",
      base.toSorted((a, b) => a - b)
    ); // non-mutating sort
  } else {
    console.log("toReversed/toSorted not available in this runtime.");
  }
});

/* -------------------------------------------------------------------------- */
/* 2) ARRAY METHODS — TRANSFORM/UTILS                                         */
/* -------------------------------------------------------------------------- */
section("2) Array Methods — transform/utils");

run("map, filter, reduce, flat, flatMap (non-mutating)", () => {
  const xs = [1, 2, 3, 4];
  console.log(
    "map *2      ->",
    xs.map((n) => n * 2)
  );
  console.log(
    "filter evens->",
    xs.filter((n) => n % 2 === 0)
  );
  console.log(
    "reduce sum  ->",
    xs.reduce((a, n) => a + n, 0)
  );
  console.log("flat        ->", [1, [2, [3]]].flat(2)); // [1,2,3]
  console.log(
    "flatMap     ->",
    xs.flatMap((n) => [n, n * 2])
  ); // [1,2,2,4,3,6,4,8]
});

run("fill, copyWithin (mutating)", () => {
  const xs = [1, 2, 3, 4, 5];
  console.log("fill(0,1,4)      ->", xs.slice().fill(0, 1, 4)); // [1,0,0,0,5]
  console.log("copyWithin(0,3)  ->", xs.slice().copyWithin(0, 3)); // [4,5,3,4,5]
});

run("join, toString, at, includes", () => {
  const xs = ["a", "b", "c"];
  console.log("join(',')  ->", xs.join(","));
  console.log("toString   ->", xs.toString());
  console.log("at(-1)     ->", xs.at(-1)); // "c"
  console.log("includes('b')->", xs.includes("b"));
});

run("from with map & of", () => {
  console.log(
    "Array.from({length:5}, (_,i)=>i*i) ->",
    Array.from({ length: 5 }, (_, i) => i * i)
  );
  console.log("Array.of(1,'a',null) ->", Array.of(1, "a", null));
});

/* -------------------------------------------------------------------------- */
/* 3) SEARCH — indexOf/lastIndexOf/includes, find/findIndex/findLast          */
/* -------------------------------------------------------------------------- */
section("3) Search — indexOf/lastIndexOf/includes, find/findIndex/findLast");

run("indexOf/lastIndexOf/includes (strict equality)", () => {
  const xs = [1, 2, 3, 2];
  console.log("indexOf(2)        ->", xs.indexOf(2)); // 1
  console.log("lastIndexOf(2)    ->", xs.lastIndexOf(2)); // 3
  console.log("includes(3)       ->", xs.includes(3)); // true
});

run("find / findIndex / findLast / findLastIndex (predicate)", () => {
  const xs = [5, 12, 8, 130, 44];
  console.log(
    "find > 10         ->",
    xs.find((n) => n > 10)
  ); // 12
  console.log(
    "findIndex > 13    ->",
    xs.findIndex((n) => n > 13)
  ); // 3
  if (Array.prototype.findLast) {
    console.log(
      "findLast < 50    ->",
      xs.findLast((n) => n < 50)
    ); // 44
    console.log(
      "findLastIndex <50->",
      xs.findLastIndex((n) => n < 50)
    ); // 4
  } else {
    console.log("findLast/findLastIndex not available in this runtime.");
  }
});

/* -------------------------------------------------------------------------- */
/* 4) SORT — lexical vs numeric, custom compare, stable, locale               */
/* -------------------------------------------------------------------------- */
section("4) Sort — lexical vs numeric, custom compare, stability, locale");

run("Default sort is lexicographic on strings", () => {
  const xs = [10, 2, 5, 1];
  console.log("default sort ->", xs.slice().sort()); // ["1","10","2","5"] -> coerced to strings
});

run("Numeric sort with comparator (ascending/descending)", () => {
  const xs = [10, 2, 5, 1];
  console.log(
    "asc ->",
    xs.slice().sort((a, b) => a - b)
  ); // [1,2,5,10]
  console.log(
    "desc->",
    xs.slice().sort((a, b) => b - a)
  ); // [10,5,2,1]
});

run("Sort objects by key; stable since ES2019", () => {
  const people = [
    { name: "Alex", age: 31 },
    { name: "Maria", age: 31 },
    { name: "Bob", age: 22 },
  ];
  const byAgeThenName = people
    .slice()
    .sort((a, b) => a.age - b.age || a.name.localeCompare(b.name));
  console.log("byAgeThenName ->", byAgeThenName);
});

run("Locale-aware string sort", () => {
  const words = ["ä", "z", "a"];
  console.log(
    "localeCompare('de') ->",
    words.slice().sort((a, b) => a.localeCompare(b, "de"))
  );
});

/* -------------------------------------------------------------------------- */
/* 5) ITERATIONS — for/of, forEach vs map, some/every                         */
/* -------------------------------------------------------------------------- */
section("5) Iterations — for/of, forEach vs map, some/every");

run("for...of vs forEach vs map", () => {
  const xs = [1, 2, 3];
  const out = [];
  for (const x of xs) out.push(x * 2); // build new array manually
  console.log("for...of ->", out);

  const doubled = [];
  xs.forEach((x) => doubled.push(x * 2)); // forEach side-effects
  console.log("forEach ->", doubled);

  console.log(
    "map ->",
    xs.map((x) => x * 2)
  ); // pure transform (returns new array)
});

run("some/every for predicates", () => {
  const xs = [2, 4, 6];
  console.log(
    "every even ->",
    xs.every((n) => n % 2 === 0)
  );
  console.log(
    "some > 5   ->",
    xs.some((n) => n > 5)
  );
});

/* -------------------------------------------------------------------------- */
/* 6) REFERENCE & CONST — shallow vs deep, const mutation, freeze             */
/* -------------------------------------------------------------------------- */
section("6) Reference & Const — shallow copy, deep copy, const, freeze");

run("Reference semantics & shallow clone", () => {
  const a = [{ id: 1 }, { id: 2 }];
  const b = a; // same reference
  const c = a.slice(); // shallow copy
  b[0].id = 99; // mutates shared object
  console.log("a[0].id ->", a[0].id, "c[0].id ->", c[0].id); // 99, 99 (shallow copy shares nested)
});

run("Deep clone (structuredClone if available)", () => {
  const x = [{ id: 1 }, { id: 2 }];
  const deep = global.structuredClone
    ? structuredClone(x)
    : JSON.parse(JSON.stringify(x));
  x[0].id = 123;
  console.log("deep[0].id stays ->", deep[0].id);
});

run("const arrays: content is mutable; binding is not", () => {
  const xs = [1, 2];
  xs.push(3); // allowed
  // xs = [9]; // TypeError if uncommented: cannot reassign constant
  console.log("xs ->", xs);

  Object.freeze(xs); // shallow freeze (prevents push/splice)
  try {
    xs.push(4);
  } catch {}
  console.log("after freeze ->", xs);
});

/* -------------------------------------------------------------------------- */
/* 7) TYPED ARRAYS — BASICS (ArrayBuffer, views, constructors)                */
/* -------------------------------------------------------------------------- */
section("7) Typed Arrays — basics (ArrayBuffer, views, constructors)");

run("Create buffer and views (Uint8Array / Int16Array / Float32Array)", () => {
  const buf = new ArrayBuffer(8); // 8 bytes
  const u8 = new Uint8Array(buf); // 8 elements (1 byte each)
  const i16 = new Int16Array(buf); // 4 elements (2 bytes each), shares same buffer
  const f32 = new Float32Array(buf); // 2 elements (4 bytes each)
  console.log({
    byteLength: buf.byteLength,
    u8Len: u8.length,
    i16Len: i16.length,
    f32Len: f32.length,
  });

  u8.set([1, 2, 3, 4]); // write bytes
  console.log("i16 view after u8 writes ->", Array.from(i16)); // same memory, reinterpreted
});

run("Construct from length / array / Array.from; from normal array", () => {
  const a = new Uint16Array(4); // zero-filled
  const b = Uint16Array.from([1, 70000]); // 70000 wraps (mod 65536) -> 4464
  const c = new Uint16Array([10, 20, 30]); // from array
  console.log({ a: Array.from(a), b: Array.from(b), c: Array.from(c) });
});

/* -------------------------------------------------------------------------- */
/* 8) TYPED METHODS — set, subarray, slice, map/filter/reduce (typed)         */
/* -------------------------------------------------------------------------- */
section("8) Typed Methods — set, subarray/view, slice/copy, map/filter/reduce");

run("set (copy from array/typed array) & subarray (no copy)", () => {
  const u8 = new Uint8Array(8);
  u8.set([1, 2, 3, 4], 2); // write starting at index 2
  const view = u8.subarray(2, 6); // view into same buffer (no copy)
  view[0] = 99; // modifies u8[2]
  console.log("u8 ->", Array.from(u8), "view ->", Array.from(view));
});

run("slice returns a copy (same type)", () => {
  const u8 = Uint8Array.from([1, 2, 3, 4, 5]);
  const copy = u8.slice(1, 4); // [2,3,4], copied
  copy[0] = 99;
  console.log("u8 ->", Array.from(u8), "copy ->", Array.from(copy));
});

run("Iteration helpers exist on typed arrays too", () => {
  const u16 = Uint16Array.from([1, 2, 3, 4]);
  console.log("map *2      ->", Array.from(u16.map((x) => x * 2))); // Uint16Array -> to Array for printing
  console.log("filter even ->", Array.from(u16.filter((x) => x % 2 === 0)));
  console.log(
    "reduce sum  ->",
    u16.reduce((a, x) => a + x, 0)
  );
});

/* -------------------------------------------------------------------------- */
/* 9) TYPED REFERENCE — sharing buffers, DataView, endianness                 */
/* -------------------------------------------------------------------------- */
section("9) Typed Reference — shared ArrayBuffer, DataView, endianness");

run("Multiple views share one buffer", () => {
  const buf = new ArrayBuffer(4);
  const u8 = new Uint8Array(buf);
  const u32 = new Uint32Array(buf);
  u8.set([0x78, 0x56, 0x34, 0x12]); // write bytes
  console.log(
    "u32[0] ->",
    u32[0],
    "(value depends on platform endianness when reinterpreting)"
  );
});

run("DataView for explicit endianness reads/writes", () => {
  const buf = new ArrayBuffer(4);
  const dv = new DataView(buf);
  dv.setUint32(0, 0x12345678, true); // little endian
  console.log(
    "getUint8 bytes ->",
    dv.getUint8(0),
    dv.getUint8(1),
    dv.getUint8(2),
    dv.getUint8(3)
  ); // 0x78 0x56 0x34 0x12
  console.log("getUint32 LE   ->", dv.getUint32(0, true).toString(16)); // "12345678"
  console.log("getUint32 BE   ->", dv.getUint32(0, false).toString(16)); // "78563412"
});

/* -------------------------------------------------------------------------- */
/* 10) MINI PRACTICE                                                          */
/* -------------------------------------------------------------------------- */
section("10) Mini practice — combine everything");

run(
  "Remove duplicates (Set) and stable-sort by length then lexicographically",
  () => {
    const words = ["pear", "apple", "banana", "apple", "fig", "fig"];
    const unique = Array.from(new Set(words));
    const sorted = unique
      .slice()
      .sort((a, b) => a.length - b.length || a.localeCompare(b));
    console.log({ unique, sorted });
  }
);

run("Chunk array (size k) and flatten back", () => {
  const chunk = (arr, k) =>
    Array.from({ length: Math.ceil(arr.length / k) }, (_, i) =>
      arr.slice(i * k, i * k + k)
    );
  const xs = Array.from({ length: 10 }, (_, i) => i + 1);
  const chunks = chunk(xs, 3);
  console.log("chunks ->", chunks);
  console.log("flatten ->", chunks.flat());
});

run("Typed: copy image row into a larger buffer using set/subarray", () => {
  const row = Uint8Array.from([10, 20, 30, 40]); // 4 pixels (pretend grayscale)
  const canvas = new Uint8Array(4 * 3); // 3 rows canvas
  // copy row into each row of canvas
  for (let r = 0; r < 3; r++) {
    canvas.set(row, r * 4);
  }
  console.log("canvas ->", Array.from(canvas)); // [10,20,30,40,10,20,30,40,10,20,30,40]
});

/* -------------------------------------------------------------------------- */
/* 11) TAKEAWAYS                                                               */
/* -------------------------------------------------------------------------- */
section("11) Takeaways");
console.log(
  [
    "- Arrays: choose non-mutating methods (slice/concat/map/filter) for purity; know which ones mutate.",
    "- Search: use includes/indexOf for values; find/findIndex for predicates; findLast in modern runtimes.",
    "- Sort: default is lexicographic; pass a comparator for numeric or custom order; sort is stable (ES2019+).",
    "- Iteration: map returns new array; forEach is side-effect only; some/every for boolean checks.",
    "- Reference: arrays are objects (reference semantics); shallow copies share nested objects.",
    "- const protects the binding, not contents; freeze is shallow.",
    "- Typed arrays share ArrayBuffers; subarray is a view (no copy); slice copies; use DataView for endianness.",
  ].join("\n")
);
