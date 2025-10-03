/**
 * JS Variables Deep-Dive: var vs let vs const + Hoisting + Mutation + Types + Scope/Shadowing
 */

const section = (title) => {
  const LINE = "-".repeat(60);
  console.log(`\n${LINE}\n${title}\n${LINE}`);
};

const run = (title, fn) => {
  console.group(`\n▶ ${title}`);
  try {
    fn();
  } catch (e) {
    console.log("⚠️ Caught error:", e?.name, e?.message);
  }
  console.groupEnd();
};

// 1) var vs let vs const
section("1) var vs let vs const — scope & redeclaration");

run("var is function-scoped and can be redeclared", () => {
  function demoVar() {
    var x = 1;
    console.log("initial x =", x); // 1
    if (true) {
      var x = 2; // same function scope
      console.log("inside block x =", x); // 2
    }
    console.log("after block x =", x); // 2
    var x = 3; // redeclare OK
    console.log("redeclared x =", x); // 3
  }
  demoVar();
});

run("let is block-scoped and cannot be redeclared in same scope", () => {
  let y = 10;
  console.log("initial y =", y); // 10
  if (true) {
    let y = 20; // shadows outer y
    console.log("block y =", y); // 20
  }
  console.log("after block y =", y); // 10

  // Redeclaration in same scope would throw:
  // let y = 30; // SyntaxError (commented out to keep file runnable)
});

run("const is block-scoped, must be initialized, no reassignment", () => {
  const z = 100;
  console.log("z =", z); // 100
  if (true) {
    const z = 200; // new binding in block
    console.log("block z =", z); // 200
  }
  console.log("after block z =", z); // 100

  // z = 300; // TypeError (commented out)
});

// 2) Hoisting & TDZ
section("2) Hoisting & the Temporal Dead Zone (TDZ)");

run("var hoists and initializes to undefined", () => {
  console.log("a before declaration =", a); // undefined
  var a = 5;
  console.log("a after assignment =", a); // 5
});

run("let hoists but is not initialized (TDZ)", () => {
  try {
    console.log("b before declaration =", b); // ReferenceError
  } catch (e) {
    console.log("expected ReferenceError accessing `b` in TDZ:", e.message);
  }
  let b = 10;
  console.log("b after declaration =", b); // 10
});

run("const also has TDZ and must be initialized", () => {
  try {
    console.log("c before declaration =", c); // ReferenceError
  } catch (e) {
    console.log("expected ReferenceError accessing `c` in TDZ:", e.message);
  }
  const c = 99;
  console.log("c after declaration =", c); // 99
});

// 3) Const and Mutation (objects/arrays are still mutable)
section("3) const prevents reassignment, not mutation");

run("Mutating an object held by const", () => {
  const user = { name: "Alex", skills: ["JS"] };
  console.log("initial user =", user); // { name: 'Alex', skills: ['JS'] }

  user.name = "Maria";
  user.skills.push("React");
  console.log("after mutation =", user); // mutated OK

  // user = { name: 'Bob' }; // TypeError: reassignment not allowed (commented)
});

run("Object.freeze to (shallow-)lock an object", () => {
  const config = Object.freeze({
    api: "https://example.com",
    opts: { retries: 3 },
  });

  console.log("frozen config =", config);
  // These will silently fail in non-strict mode or throw in strict mode for top-level props:
  // config.api = "https://evil.com";
  console.log("config.api still =", config.api); // unchanged

  // Note: freeze is shallow:
  config.opts.retries = 99; // nested object is still mutable unless frozen too
  console.log("config.opts.retries =", config.opts.retries); // 99
});

// 4) Types of values: primitives vs references
section("4) Types — primitives vs references");

run("Primitives copy by value", () => {
  let n1 = 42;
  let n2 = n1; // copy value
  n2 = 100;
  console.log("n1 =", n1); // 42
  console.log("n2 =", n2); // 100
});

run("Objects/Arrays copy references", () => {
  const o1 = { val: 10 };
  const o2 = o1; // reference copy
  o2.val = 20;
  console.log("o1.val =", o1.val); // 20
  console.log("o2.val =", o2.val); // 20
});

run("Shallow cloning with spread", () => {
  const src = { a: 1, nested: { z: 9 } };
  const clone = { ...src };
  clone.a = 2; // affects only clone
  clone.nested.z = 100; // affects both (shallow clone!)
  console.log("src =", src); // nested.z changed!
  console.log("clone =", clone);
});

run(
  "Deep-ish clone example (JSON) — caution: loses functions/Date/etc.",
  () => {
    const src = { d: new Date("2020-01-01"), arr: [1, 2], fn: () => 1 };
    const deep = JSON.parse(JSON.stringify(src));
    console.log("src.d instanceof Date =", src.d instanceof Date); // true
    console.log("deep.d instanceof Date =", deep.d instanceof Date); // false (string)
    console.log("src.fn type =", typeof src.fn, "deep.fn =", deep.fn); // function vs undefined
  }
);

// 5) Block scope & shadowing
section("5) Block scope & shadowing");

run("Shadowing with let/const", () => {
  let value = "outer";
  console.log("before block value =", value); // outer
  {
    let value = "inner";
    console.log("inside block value =", value); // inner
  }
  console.log("after block value =", value); // outer
});

run("Prefer const, use let only if you must reassign", () => {
  const items = [1, 2, 3];
  // we don't need to rebind `items`, so const is perfect
  const doubled = items.map((n) => n * 2);
  console.log("doubled =", doubled);

  // Loop counters typically need reassignment:
  let sum = 0;
  for (let i = 0; i < items.length; i++) {
    sum += items[i];
  }
  console.log("sum =", sum);
});

// 6) Practical patterns: pick let vs const wisely
section("6) Practical patterns — guidelines");

run("Immutable data transformation (prefer const)", () => {
  const users = [
    { id: 1, name: "Alex", active: true },
    { id: 2, name: "Maria", active: false },
  ];

  const activeUsers = users.filter((u) => u.active);
  const names = activeUsers.map((u) => u.name);

  console.log("activeUsers =", activeUsers);
  console.log("names =", names);
});

run("Mutable accumulators/loop indices (use let)", () => {
  const numbers = [1, 2, 3, 4, 5];
  let product = 1; // will be reassigned
  for (let i = 0; i < numbers.length; i++) {
    product *= numbers[i];
  }
  console.log("product =", product);
});

// Bonus: Hoisting traps safely demonstrated
section("Bonus) Hoisting traps — demonstration with safe wrappers");

run("Accessing let/const in TDZ throws ReferenceError", () => {
  // Separate scope to avoid stopping the file
  (function tdzDemo() {
    try {
      // eslint-disable-next-line no-undef
      console.log(foo); // ReferenceError (TDZ for let/const)
    } catch (e) {
      console.log("TDZ access error as expected:", e.message);
    }
    let foo = "ok now"; // declaration after access
    console.log("foo after declaration =", foo);
  })();
});

run("Function declarations are hoisted with their definition", () => {
  // Call before definition works with function declarations
  console.log(add(2, 3)); // 5

  function add(a, b) {
    return a + b;
  }

  // BUT function expressions with let/const are NOT hoisted as callable:
  try {
    console.log(mul(2, 3)); // ReferenceError (TDZ)
  } catch (e) {
    console.log("Accessing mul before init:", e.message);
  }
  const mul = (a, b) => a * b;
  console.log("mul after init =", mul(2, 3)); // 6
});

// Mini-challenges to “visualize” decisions
section("Mini Challenges) When to use let vs const");

run("Challenge #1: running total (needs let)", () => {
  const data = [5, 10, -2, 7];
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    total += data[i];
    console.log(` step ${i}: total =`, total);
  }
  console.log("final total =", total);
});

run("Challenge #2: transform list (const everywhere)", () => {
  const data = [1, 2, 3];
  const squared = data.map((n) => n * n);
  const sum = squared.reduce((acc, n) => acc + n, 0);
  console.log("squared =", squared, "| sum =", sum);
});

// Final takeaway log
section("Takeaways");
console.log(
  [
    "- Use const by default;",
    "- Use let only when you must reassign (counters, accumulators);",
    "- Avoid var (function-scoped, easier to make bugs);",
    "- Hoisting: var -> undefined; let/const -> TDZ until initialized;",
    "- const prevents reassignment, not object/array mutation;",
    "- Primitives copy by value; objects/arrays by reference.",
  ].join("\n")
);
