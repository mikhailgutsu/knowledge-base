/**
 * Practical tour of: Numbers, Number Methods, Number Properties,
 * Number "Reference" (primitive vs wrapper), BigInt, and Bitwise operations.
 */

const section = (title) => {
  const LINE = "-".repeat(78);
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
/* 1) NUMBERS: LITERALS, FLOATING-POINT, PARSING                               */
/* -------------------------------------------------------------------------- */
section("1) Numbers — literals, separators, floating-point, parsing");

run("Literals & separators", () => {
  const dec = 1_234_567.89;
  const bin = 0b1010; // 10
  const oct = 0o755; // 493
  const hex = 0xff; // 255
  const exp = 6.022e23; // scientific notation

  console.log({ dec, bin, oct, hex, exp });
});

run("Floating-point gotcha & EPSILON fix", () => {
  const sum = 0.1 + 0.2;
  console.log("0.1 + 0.2 =", sum); // 0.30000000000000004
  const approxEqual = (a, b, eps = Number.EPSILON) =>
    Math.abs(a - b) < eps * Math.max(1, Math.abs(a), Math.abs(b));
  console.log("approxEqual(sum, 0.3) ->", approxEqual(sum, 0.3)); // true
});

run("Parsing: Number(), parseInt, parseFloat, radix", () => {
  console.log("Number('42')   ->", Number("42")); // 42
  console.log("Number('42px') ->", Number("42px")); // NaN
  console.log("parseInt('42px')  ->", parseInt("42px")); // 42
  console.log("parseFloat('3.14x')->", parseFloat("3.14x")); // 3.14

  console.log("parseInt('08')        ->", parseInt("08")); // 8
  console.log("parseInt('08', 10)    ->", parseInt("08", 10)); // 8
  console.log("parseInt('FF', 16)    ->", parseInt("FF", 16)); // 255
  console.log("('  \t 5 ').trim() ->", "  \t 5 ".trim());
});

/* -------------------------------------------------------------------------- */
/* 2) NUMBER METHODS: STATIC & INSTANCE                                        */
/* -------------------------------------------------------------------------- */
section("2) Number methods — static checks and instance formatting");

run("Static checks", () => {
  console.log("Number.isNaN(NaN)           ->", Number.isNaN(NaN)); // true
  console.log("isNaN('foo') (global)       ->", isNaN("foo")); // true (coerces!)
  console.log("Number.isNaN('foo')         ->", Number.isNaN("foo")); // false (no coercion)

  console.log("Number.isFinite(42)         ->", Number.isFinite(42)); // true
  console.log("isFinite('42') (global)     ->", isFinite("42")); // true (coerces)
  console.log("Number.isFinite('42')       ->", Number.isFinite("42")); // false

  console.log("Number.isInteger(3.0)       ->", Number.isInteger(3.0)); // true
  console.log(
    "Number.isSafeInteger(2**53-1)->",
    Number.isSafeInteger(2 ** 53 - 1)
  ); // true
});

run(
  "Instance formatters: toFixed / toPrecision / toExponential / toString(radix)",
  () => {
    const n = 1234.56789;
    console.log("n.toFixed(2)        =", n.toFixed(2)); // "1234.57"
    console.log("n.toPrecision(4)    =", n.toPrecision(4)); // "1235"
    console.log("n.toExponential(3)  =", n.toExponential(3)); // "1.235e+3"
    console.log("(255).toString(16)  =", (255).toString(16)); // "ff"
    console.log("(10).toString(2)    =", (10).toString(2)); // "1010"
  }
);

/* -------------------------------------------------------------------------- */
/* 3) NUMBER PROPERTIES                                                        */
/* -------------------------------------------------------------------------- */
section("3) Number properties — limits, infinities, NaN, EPSILON");

run("Limits & special constants", () => {
  console.log("Number.MAX_VALUE        =", Number.MAX_VALUE);
  console.log(
    "Number.MIN_VALUE        =",
    Number.MIN_VALUE,
    "(smallest positive > 0)"
  );
  console.log("Number.MAX_SAFE_INTEGER =", Number.MAX_SAFE_INTEGER);
  console.log("Number.MIN_SAFE_INTEGER =", Number.MIN_SAFE_INTEGER);
  console.log("Number.EPSILON          =", Number.EPSILON);
  console.log("Number.POSITIVE_INFINITY=", Number.POSITIVE_INFINITY);
  console.log("Number.NEGATIVE_INFINITY=", Number.NEGATIVE_INFINITY);
  console.log("Number.NaN              =", Number.NaN);

  console.log("Overflow: Number.MAX_VALUE * 2 =", Number.MAX_VALUE * 2); // Infinity
  console.log("Underflow: Number.MIN_VALUE / 2 =", Number.MIN_VALUE / 2); // 0
});

/* -------------------------------------------------------------------------- */
/* 4) NUMBERS REFERENCE: PRIMITIVE VS WRAPPER                                  */
/* -------------------------------------------------------------------------- */
section("4) Numbers 'reference' — primitive vs Number object wrapper");

run("typeof & truthiness pitfalls", () => {
  const p = 0; // primitive
  const o = new Number(0); // object wrapper (avoid)

  console.log("typeof p ->", typeof p); // "number"
  console.log("typeof o ->", typeof o); // "object"
  console.log("Boolean(0) ->", Boolean(0)); // false
  console.log("Boolean(new Number(0)) ->", Boolean(o)); // true (!) surprising
  console.log("o.valueOf() === 0 ->", o.valueOf() === 0); // true

  console.log("p === 0:", p === 0); // true
  console.log("o === 0:", o === 0); // false (object vs number)
  console.log("o == 0 :", o == 0); // true (coercion)
  console.log("Recommendation: avoid new Number(...) in app code.");
});

/* -------------------------------------------------------------------------- */
/* 5) BIGINT                                                                   */
/* -------------------------------------------------------------------------- */
section("5) BigInt — large integers beyond 2^53-1");

run("Create & operate", () => {
  const a = 9_007_199_254_740_991n; // Number.MAX_SAFE_INTEGER is 2^53-1
  const b = a + 10n;
  console.log({ a, b });

  // Mixing Number and BigInt throws:
  try {
    console.log(1n + 1);
  } catch (e) {
    console.log("1n + 1 ->", e.message);
  }

  // Convert explicitly:
  console.log("1n + BigInt(1) ->", 1n + BigInt(1));
  console.log("Number(1n) + 1 ->", Number(1n) + 1);

  // Division truncates toward zero:
  console.log("5n / 2n ->", 5n / 2n); // 2n
});

run("Format BigInt", () => {
  const x = 0xff_ff_ffn; // hex BigInt
  console.log("x.toString(16) ->", x.toString(16)); // "fffff"
});

/* -------------------------------------------------------------------------- */
/* 6) BITWISE                                                                  */
/* -------------------------------------------------------------------------- */
section("6) Bitwise — on 32-bit Numbers and on BigInt");

run("Numbers: &, |, ^, ~, <<, >>, >>> (32-bit signed values)", () => {
  const A = 0b1010; // 10
  const B = 0b1100; // 12
  console.log("A & B  =", (A & B).toString(2).padStart(4, "0")); // 1000
  console.log("A | B  =", (A | B).toString(2).padStart(4, "0")); // 1110
  console.log("A ^ B  =", (A ^ B).toString(2).padStart(4, "0")); // 0110
  console.log("~A     =", (~A >>> 0).toString(2).padStart(32, "0")); // invert; >>>0 for unsigned view

  console.log("1 << 5 =", 1 << 5); // 32
  console.log("-16 >> 2 =", -16 >> 2); // arithmetic right shift keeps sign -> -4
  console.log("16 >>> 2 =", 16 >>> 2); // unsigned right shift -> 4

  // Beware 32-bit wrap:
  console.log("(1 << 31) | 0 =", (1 << 31) | 0); // negative due to sign bit
});

run("BigInt bitwise: &, |, ^, ~, <<, >> (no >>> for BigInt)", () => {
  const x = 0b1010n;
  const y = 0b1100n;
  console.log("(x & y).toString(2) ->", (x & y).toString(2)); // "1000"
  console.log("(x | y).toString(2) ->", (x | y).toString(2)); // "1110"
  console.log("(x ^ y).toString(2) ->", (x ^ y).toString(2)); // "110"
  console.log("(~x).toString(2)    ->", (~x).toString(2)); // infinite-width two's complement style
  console.log("(1n << 10n)         ->", 1n << 10n); // 1024n
  console.log("(256n >> 3n)        ->", 256n >> 3n); // 32n
  try {
    console.log(1n >>> 1n);
  } catch (e) {
    console.log("1n >>> 1n ->", e.message);
  } // not supported
});

run("Bit flags example (Numbers)", () => {
  const READ = 1 << 0; // 0001
  const WRITE = 1 << 1; // 0010
  const EXEC = 1 << 2; // 0100

  let perm = 0;
  perm |= READ | WRITE; // add flags
  console.log("perm =", perm.toString(2).padStart(3, "0")); // 011
  console.log("has WRITE? ->", Boolean(perm & WRITE)); // true
  perm &= ~WRITE; // remove WRITE
  console.log("has WRITE? ->", Boolean(perm & WRITE)); // false
});

/* -------------------------------------------------------------------------- */
/* 7) MINI PRACTICE                                                            */
/* -------------------------------------------------------------------------- */
section("7) Mini practice");

run("Safe float compare & currency rounding", () => {
  const total = [19.99, 9.99, 4.99].reduce((a, b) => a + b, 0);
  const price = Number(total.toFixed(2)); // format for display
  console.log({ total, price, asString: price.toFixed(2) });
});

run("Sum large IDs safely (BigInt)", () => {
  const ids = [9007199254740991n, 4n, 5n];
  const sum = ids.reduce((a, b) => a + b, 0n);
  console.log("sum BigInt ->", sum.toString());
});

run("Masking & extracting low 8 bits", () => {
  const val = 0xabcd;
  console.log("val & 0xFF ->", (val & 0xff).toString(16)); // "cd"
});

/* -------------------------------------------------------------------------- */
/* 8) TAKEAWAYS                                                                */
/* -------------------------------------------------------------------------- */
section("8) Takeaways");
console.log(
  [
    "- Numbers are IEEE-754 doubles; beware precision; use EPSILON for approx compares.",
    "- Use Number.isNaN / Number.isFinite (no coercion) instead of global isNaN/isFinite.",
    "- Know formatters: toFixed, toPrecision, toExponential, toString(radix).",
    "- Properties: MAX_VALUE, MIN_VALUE, (UN)SAFE_INTEGER bounds, EPSILON, ±Infinity, NaN.",
    "- Avoid Number object wrapper (new Number); primitives are safer.",
    "- BigInt handles huge integers; cannot mix with Number without explicit conversion; integer division truncates.",
    "- Bitwise on Numbers uses 32-bit lanes; BigInt supports bitwise except unsigned >>>.",
  ].join("\n")
);
