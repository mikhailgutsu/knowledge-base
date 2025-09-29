/**
 * JS Operators Deep-Dive: Arithmetic, Assignment, Comparisons (+ coercion gotchas)
 */

const section = (title) => {
  const LINE = "-".repeat(68);
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

/* -------------------------------------------------------------------------- */
/* 1) ARITHMETIC OPERATORS                                                    */
/* -------------------------------------------------------------------------- */
section("1) Arithmetic Operators (+, -, *, /, %, **, ++, --) and nuances");

run("Basic arithmetic", () => {
  let a = 10,
    b = 3;
  console.log("a + b =", a + b); // 13
  console.log("a - b =", a - b); // 7
  console.log("a * b =", a * b); // 30
  console.log("a / b =", a / b); // 3.3333...
  console.log("a % b =", a % b); // 1 (remainder)
  console.log("a ** b =", a ** b); // 1000 (10^3)
});

run("Increment / Decrement: prefix vs postfix", () => {
  let x = 5;
  console.log("x =", x); // 5
  console.log("x++ returns", x++); // returns OLD value -> 5; x becomes 6
  console.log("after x++ -> x =", x); // 6
  console.log("++x returns", ++x); // increments first -> returns 7
  console.log("after ++x -> x =", x); // 7

  let y = 3;
  console.log("y-- returns", y--); // 3; y becomes 2
  console.log("after y-- -> y =", y); // 2
  console.log("--y returns", --y); // 1
});

run("Operator precedence and parentheses", () => {
  // MDN precedence ref: ** > * / % > + - (unary > binary) > =
  console.log("2 + 3 * 4 =", 2 + 3 * 4); // 14  (3*4 first)
  console.log("(2 + 3) * 4 =", (2 + 3) * 4); // 20
  console.log("2 ** 3 ** 2 =", 2 ** (3 ** 2)); // 2 ** 9 = 512 (right-associative)
  console.log("(2 ** 3) ** 2 =", (2 ** 3) ** 2); // 64
});

run("Numeric edge cases: division by 0, NaN", () => {
  console.log("1 / 0 =", 1 / 0); // Infinity
  console.log("-1 / 0 =", -1 / 0); // -Infinity
  console.log("0 / 0 =", 0 / 0); // NaN
  console.log("Number.isNaN(0/0) =", Number.isNaN(0 / 0)); // true
});

/* -------------------------------------------------------------------------- */
/* 2) ASSIGNMENT OPERATORS                                                    */
/* -------------------------------------------------------------------------- */
section("2) Assignment Operators (=, +=, -=, *=, /=, %=, **=) and chaining");

run("Standard compound assignments", () => {
  let n = 10;
  console.log("start n =", n);
  n += 5;
  console.log("n += 5  ->", n); // 15
  n -= 3;
  console.log("n -= 3  ->", n); // 12
  n *= 2;
  console.log("n *= 2  ->", n); // 24
  n /= 4;
  console.log("n /= 4  ->", n); // 6
  n %= 5;
  console.log("n %= 5  ->", n); // 1
  n **= 3;
  console.log("n **= 3 ->", n); // 1
});

run("Chained assignment (evaluates right-to-left)", () => {
  let a, b, c;
  a = b = c = 7; // c=7 -> b=7 -> a=7
  console.log({ a, b, c }); // { a: 7, b: 7, c: 7 }
});

run("Assignment returns a value (be careful in conditions!)", () => {
  let ok = false;
  if ((ok = true)) {
    // assignment, not comparison
    console.log("Branch executed because ok became", ok); // true
  }
  // Always use === in conditions to avoid accidental assignment.
});

/* -------------------------------------------------------------------------- */
/* 3) COMPARISON OPERATORS                                                    */
/* -------------------------------------------------------------------------- */
section("3) Comparison Operators (==, ===, !=, !==, >, <, >=, <=)");

run("Strict vs loose equality", () => {
  console.log("5 == '5'   ->", 5 == "5"); // true  (coercion)
  console.log("5 === '5'  ->", 5 === "5"); // false (no coercion)
  console.log("0 == false ->", 0 == false); // true  (coercion)
  console.log("0 === false->", 0 === false); // false
  console.log("null == undefined  ->", null == undefined); // true
  console.log("null === undefined ->", null === undefined); // false
});

run("Inequalities on numbers", () => {
  console.log("7 > 3  ->", 7 > 3); // true
  console.log("7 < 3  ->", 7 < 3); // false
  console.log("5 >= 5 ->", 5 >= 5); // true
  console.log("4 <= 5 ->", 4 <= 5); // true
});

run("String comparisons are lexicographical (by UTF-16 code units)", () => {
  console.log("'a' < 'b' ->", "a" < "b"); // true
  console.log("'apple' > 'ant' ->", "apple" > "ant"); // true (pp vs nt)
  console.log("'10' < '2' ->", "10" < "2"); // true ('1' < '2')
  // For locale-aware compares, use localeCompare:
  console.log("'ä'.localeCompare('z') ->", "ä".localeCompare("z")); // may differ by locale
});

run("Comparing objects compares references, not deep values", () => {
  const o1 = { x: 1 };
  const o2 = { x: 1 };
  const o3 = o1;
  console.log("o1 === o2 ->", o1 === o2); // false (different refs)
  console.log("o1 === o3 ->", o1 === o3); // true  (same ref)
});

run("Special: NaN is not equal to anything, even itself", () => {
  const v = NaN;
  console.log("NaN === NaN ->", NaN === NaN); // false
  console.log("Number.isNaN(v) ->", Number.isNaN(v)); // true
  console.log("Object.is(NaN, NaN) ->", Object.is(NaN, NaN)); // true
});

run("Special: -0 vs 0", () => {
  console.log("-0 === 0 ->", -0 === 0); // true
  console.log("Object.is(-0, 0) ->", Object.is(-0, 0)); // false (can distinguish)
});

/* -------------------------------------------------------------------------- */
/* 4) COERCION GOTCHAS WITH COMPARISONS (FYI; still about comparisons)       */
/* -------------------------------------------------------------------------- */
section("4) Coercion gotchas (why we prefer === and !==)");

run("Loose equality coercion surprises", () => {
  console.log("'' == 0 ->", "" == 0); // true ('' -> 0)
  console.log("'  ' == 0 ->", "  " == 0); // true (whitespace -> 0)
  console.log("false == [] ->", false == []); // true ([] -> '')
  console.log("false == {} ->", false == {}); // false
  console.log("null == 0 ->", null == 0); // false (null only == undefined)
  console.log("[] == '' ->", [] == ""); // true
  console.log("[] == 0  ->", [] == 0); // true
});

/* -------------------------------------------------------------------------- */
/* 5) MINI PRACTICE: put it together                                          */
/* -------------------------------------------------------------------------- */
section("5) Mini practice — combine arithmetic, assignment, comparisons");

run("Compute average and compare", () => {
  const scores = [10, 7, 9, 8, 10];
  let sum = 0;
  for (let i = 0; i < scores.length; i++) {
    sum += scores[i]; // assignment + arithmetic
  }
  const avg = sum / scores.length;
  console.log("sum =", sum, "| avg =", avg);

  const PASS = 8.5;
  if (avg >= PASS) {
    console.log(`Passed: avg (${avg}) >= ${PASS}`);
  } else {
    console.log(`Failed: avg (${avg}) < ${PASS}`);
  }
});

run("Counter with ++ and compound ops", () => {
  let counter = 0;
  counter += 1; // 1
  counter++; // 2
  counter *= 3; // 6
  counter -= 2; // 4
  console.log("counter =", counter); // 4
  console.log("counter++ returns", counter++); // returns 4; counter -> 5
  console.log("after counter++ ->", counter); // 5
});

/* -------------------------------------------------------------------------- */
/* 6) TAKEAWAYS                                                                */
/* -------------------------------------------------------------------------- */
section("Takeaways");
console.log(
  [
    "- Arithmetic: + - * / % ** ++ -- (watch precedence; use parentheses).",
    "- Assignment: use compound ops (+=, -=, *=, etc.) to update values.",
    "- Comparisons: prefer strict (===, !==); avoid loose (==, !=) to dodge coercion.",
    "- Strings compare lexicographically; numbers numerically.",
    "- NaN !== NaN; use Number.isNaN or Object.is.",
    "- Object comparisons are by reference, not content.",
  ].join("\n")
);
