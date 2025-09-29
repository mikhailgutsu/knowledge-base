/**
 * Deep-dive into JS loops: for, for...of, for...in, while, do...while, continue, break.
 */

const section = (title) => {
  const LINE = "-".repeat(74);
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
/* 1) LOOP BASICS                                                              */
/* -------------------------------------------------------------------------- */
section("1) Loop basics — iterate, transform, search, aggregate");

run("Common tasks", () => {
  const arr = [3, 7, 2, 9, 4];
  // sum (aggregate)
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum += arr[i];
  console.log("sum =", sum);
  // search first > 5 (break when found)
  let found = null;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > 5) {
      found = arr[i];
      break;
    }
  }
  console.log("first > 5 =", found);
  // transform to doubled (produce new array)
  const doubled = [];
  for (let i = 0; i < arr.length; i++) doubled.push(arr[i] * 2);
  console.log("doubled =", doubled);
});

/* -------------------------------------------------------------------------- */
/* 2) FOR LOOPS                                                                */
/* -------------------------------------------------------------------------- */
section(
  "2) for loops — classic, for...of, for...in (object) *pitfalls included*"
);

run("Classic for (index-based)", () => {
  const items = ["a", "b", "c"];
  for (let i = 0; i < items.length; i++) {
    console.log(`i=${i} -> ${items[i]}`);
  }
});

run("for...of (iterate values of iterables)", () => {
  const items = ["x", "y", "z"];
  for (const val of items) {
    console.log("val =", val);
  }
});

run("for...in for objects (keys) — avoid on arrays", () => {
  const user = { id: 1, name: "Alex", active: true };
  for (const key in user) {
    // Own vs inherited: safeguard if needed -> if (Object.hasOwn(user, key)) { ... }
    if (Object.prototype.hasOwnProperty.call(user, key)) {
      console.log(key, "->", user[key]);
    }
  }
});

run(
  "Pitfall: for...in on arrays gives string indexes (and can include inherited)",
  () => {
    const arr = ["A", "B", "C"];
    Array.prototype.extra = "⚠️ inherited";
    for (const k in arr) {
      console.log("for...in k =", k);
    } // "0","1","2","extra?"
    delete Array.prototype.extra;

    console.log("Prefer for...of for array values:");
    for (const v of arr) console.log("for...of v =", v);
  }
);

/* -------------------------------------------------------------------------- */
/* 3) WHILE & DO...WHILE                                                       */
/* -------------------------------------------------------------------------- */
section(
  "3) while & do...while — sentinel conditions, queues, at-least-once work"
);

run("while with sentinel condition (queue processing)", () => {
  const queue = ["task-1", "task-2", "task-3"];
  while (queue.length > 0) {
    const job = queue.shift(); // removes from front
    console.log("processing", job);
  }
  console.log("queue empty =", queue.length === 0);
});

run("do...while runs at least once", () => {
  let tries = 0;
  let ok = false;
  do {
    tries++;
    console.log("attempt", tries);
    ok = tries >= 3; // pretend success on 3rd try
  } while (!ok);
  console.log("success after tries =", tries);
});

/* -------------------------------------------------------------------------- */
/* 4) CONTINUE & BREAK                                                         */
/* -------------------------------------------------------------------------- */
section("4) continue & break — skip or stop loop iterations");

run("continue: skip odds; break: stop after first match", () => {
  const nums = [1, 2, 3, 4, 5, 6];
  const evens = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] % 2 !== 0) continue; // skip odd
    evens.push(nums[i]);
  }
  console.log("evens =", evens);

  let firstOver4 = null;
  for (const n of nums) {
    if (n > 4) {
      firstOver4 = n;
      break;
    }
  }
  console.log("first > 4 =", firstOver4);
});

run("Nested loops + labeled break (escape multiple levels)", () => {
  const matrix = [
    [1, 2, 3],
    [4, 99, 6],
    [7, 8, 9],
  ];
  let pos = null;

  outer: for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] === 99) {
        pos = { r, c };
        break outer;
      }
    }
  }
  console.log("found 99 at:", pos);
});

run("Early exit patterns: break vs Array.prototype.find", () => {
  const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
  // Loop with break
  let found = null;
  for (const it of items) {
    if (it.id === 2) {
      found = it;
      break;
    }
  }
  console.log("loop found =", found);

  // Declarative alternative
  const viaFind = items.find((it) => it.id === 2);
  console.log("find found =", viaFind);
});

/* -------------------------------------------------------------------------- */
/* 5) MINI PRACTICE                                                            */
/* -------------------------------------------------------------------------- */
section(
  "5) Mini practice — primes and threshold sum with while/for/continue/break"
);

run("List primes up to N (basic trial division)", () => {
  const N = 30;
  const primes = [];
  for (let n = 2; n <= N; n++) {
    let isPrime = true;
    for (let d = 2; d * d <= n; d++) {
      if (n % d === 0) {
        isPrime = false;
        break;
      } // stop early
    }
    if (!isPrime) continue; // skip composites
    primes.push(n);
  }
  console.log(`primes <= ${N}:`, primes.join(", "));
});

run("Sum until threshold using while", () => {
  const data = [5, 3, 8, 6, 2, 7];
  const target = 15;
  let sum = 0;
  let i = 0;
  while (i < data.length) {
    sum += data[i];
    if (sum >= target) break; // stop when reached
    i++;
  }
  console.log("stopped at index =", i, "sum =", sum);
});

/* -------------------------------------------------------------------------- */
/* 6) TAKEAWAYS                                                                */
/* -------------------------------------------------------------------------- */
section("6) Takeaways");
console.log(
  [
    "- use classic for for index control; for...of for array values; for...in for object keys;",
    "- prefer for...of to avoid for...in pitfalls on arrays;",
    "- while/do...while for sentinel-driven loops or 'at least once' work;",
    "- use continue to skip, break to stop early; labeled break for nested exits.",
  ].join("\n")
);
