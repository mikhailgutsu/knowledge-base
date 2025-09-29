/**
 * JS Conditionals Deep-Dive:
 * Booleans + Truthy/Falsy, Logical Operators (&&, ||, !, ??, ?. + ||=, &&=, ??=),
 * if / if-else / else-if (guard clauses), Ternary, Switch (patterns & pitfalls).
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
    console.log("⚠️ Caught error:", e?.name, e?.message);
  }
  console.groupEnd();
};

/* -------------------------------------------------------------------------- */
/* 1) BOOLEANS & TRUTHY/FALSY                                                 */
/* -------------------------------------------------------------------------- */
section("1) Booleans & Truthy/Falsy (Boolean(), !!, !)");

run("Truthy vs Falsy basics", () => {
  const samples = [
    { label: "false", v: false },
    { label: "0", v: 0 },
    { label: "-0", v: -0 },
    { label: "0n (BigInt zero)", v: 0n },
    { label: "'' (empty string)", v: "" },
    { label: "null", v: null },
    { label: "undefined", v: undefined },
    { label: "NaN", v: NaN },
    { label: "'0' (string)", v: "0" },
    { label: "'false' (string)", v: "false" },
    { label: "[] (array)", v: [] },
    { label: "{} (object)", v: {} },
    { label: "() => {} (function)", v: () => {} },
    { label: "Infinity", v: Infinity },
  ];
  for (const { label, v } of samples) {
    console.log(label.padEnd(22), "=> Boolean:", Boolean(v), "| !!:", !!v);
  }
});

run("Logical NOT (!) and double NOT (!!) coercion", () => {
  console.log("!0 =", !0); // true
  console.log("!!0 =", !!0); // false
  console.log("!'hello' =", !"hello"); // false
  console.log("!!'hello' =", !!"hello"); // true
});

/* -------------------------------------------------------------------------- */
/* 2) LOGICAL OPERATORS (& short-circuit)                                      */
/* -------------------------------------------------------------------------- */
section(
  "2) Logical Operators: &&, ||, !, ??, ?. (and logical assignment ||=, &&=, ??=)"
);

run("&& and || return operands (not forced booleans)", () => {
  console.log("'A' && 'B' ->", "A" && "B"); // 'B' (both truthy => returns right)
  console.log("0 && 'B'   ->", 0 && "B"); // 0   (stops at falsy left)
  console.log("'A' || 'B' ->", "A" || "B"); // 'A' (first truthy)
  console.log("'' || 'B'  ->", "" || "B"); // 'B' (fallback)
});

run("Short-circuit to avoid work", () => {
  const heavy = () => {
    console.log("  heavy() called");
    return "RESULT";
  };
  const cached = "OK";

  console.log("cached && heavy() ->", cached && heavy()); // heavy() runs
  console.log("'' && heavy() ->", "" && heavy()); // empty string falsy => heavy() NOT called
  console.log("'' || heavy() ->", "" || heavy()); // heavy() called as fallback
});

run("Precedence: ! > && > || (use parentheses for clarity)", () => {
  console.log("!true || false && true ->", !true || (false && true)); // false || false => false
  console.log("!(true || false) && true ->", !(true || false) && true); // false && true => false
});

run("Nullish coalescing (??) vs OR (||)", () => {
  // || treats: 0, '', false as falsy (will use fallback)
  // ?? only treats: null and undefined as 'nullish'
  console.log("0 || 42  ->", 0 || 42); // 42 (not desired if 0 is a valid value)
  console.log("0 ?? 42  ->", 0 ?? 42); // 0  (keeps valid 0)
  console.log("'' || 'N/A' ->", "" || "N/A"); // 'N/A'
  console.log("'' ?? 'N/A' ->", "" ?? "N/A"); // '' (keeps empty string)
  console.log("undefined ?? 'fallback' ->", undefined ?? "fallback"); // 'fallback'
  console.log("null ?? 'fallback' ->", null ?? "fallback"); // 'fallback'

  // ❗ Mixing ?? with && / || without parentheses is a SyntaxError. Use parentheses:
  const a = null,
    b = 0,
    c = 7;
  console.log("(a ?? b) || c ->", (a ?? b) || c); // (nullish -> b=0) || 7 => 7
  console.log("(b || c) ?? 9 ->", (b || c) ?? 9); // (0 || 7) => 7, then 7 ?? 9 => 7
});

run("Optional chaining (?.) to safely access deep props/calls", () => {
  const data = { user: { profile: { name: "Alex" }, getId: () => 123 } };
  const missing = {};
  console.log("data.user?.profile?.name ->", data.user?.profile?.name); // 'Alex'
  console.log("missing.user?.profile?.name ->", missing.user?.profile?.name); // undefined
  console.log("data.user?.getId?.() ->", data.user?.getId?.()); // 123
});

run("Logical assignment: ||=, &&=, ??=", () => {
  let title = "";
  // ||= assigns if left is falsy ('' is falsy)
  title ||= "Untitled";
  console.log("title after ||= 'Untitled' ->", title); // 'Untitled'

  let enabled = true;
  // &&= assigns if left is truthy
  enabled &&= false;
  console.log("enabled after &&= false ->", enabled); // false

  let count = 0; // valid 0
  // ??= assigns only if nullish
  count ??= 10;
  console.log("count after ??= 10 ->", count); // 0 (kept)
});

/* -------------------------------------------------------------------------- */
/* 3) IF / ELSE IF / ELSE (with guard clauses)                                */
/* -------------------------------------------------------------------------- */
section("3) if / else if / else (guard clauses & best practices)");

run("Basic branching", () => {
  const n = 7;
  if (n > 10) {
    console.log("n is big");
  } else if (n > 5) {
    console.log("n is medium"); // <-- this path
  } else {
    console.log("n is small");
  }
});

run("Guard clauses (early returns) to reduce nesting", () => {
  function canAccess(user) {
    if (!user) return false; // guard
    if (!user.active) return false; // guard
    return user.role === "admin" || user.role === "editor";
  }
  console.log("canAccess(null) ->", canAccess(null));
  console.log("canAccess({active:false}) ->", canAccess({ active: false }));
  console.log(
    "canAccess({active:true, role:'editor'}) ->",
    canAccess({ active: true, role: "editor" })
  );
});

run("Avoid accidental assignment in conditions", () => {
  let ok = false;
  if (ok === true) {
    console.log("will not log");
  }
  // if (ok = true) { ... } // ❌ assignment; don't do this
});

/* -------------------------------------------------------------------------- */
/* 4) TERNARY (?:) — expression form of if/else                                */
/* -------------------------------------------------------------------------- */
section("4) Ternary operator (cond ? a : b) — keep it short & readable");

run("Basic usage", () => {
  const age = 19;
  const access = age >= 18 ? "granted" : "denied";
  console.log(`access: ${access}`);
});

run("Inline display + nested ternary (prefer if/else if it's too long)", () => {
  const score = 86;
  const grade =
    score >= 90
      ? "A"
      : score >= 80
      ? "B"
      : score >= 70
      ? "C"
      : score >= 60
      ? "D"
      : "F";
  console.log("grade =", grade, "(but prefer if/else for more complex rules)");
});

/* -------------------------------------------------------------------------- */
/* 5) SWITCH — multi-branching patterns                                       */
/* -------------------------------------------------------------------------- */
section("5) switch — exact matches, grouped cases, range via switch(true)");

run("Basic switch with break", () => {
  const method = "PUT";
  switch (method) {
    case "GET":
      console.log("read");
      break;
    case "POST":
    case "PUT": // fall-through group
      console.log("write/update"); // <-- here
      break;
    default:
      console.log("unknown");
  }
});

run("Switch(true) for range-like checks", () => {
  const temp = 31;
  switch (true) {
    case temp <= 0:
      console.log("freezing");
      break;
    case temp <= 15:
      console.log("cold");
      break;
    case temp <= 25:
      console.log("mild");
      break;
    default:
      console.log("hot"); // <-- here
  }
});

run("Switch alternative: dictionary/object map", () => {
  const op = "es";
  const messages = {
    en: "Hello",
    es: "Hola",
    fr: "Bonjour",
  };
  // Use ?? for nullish; OR use || but beware '' being falsy
  console.log(messages[op] ?? "Hello (default)"); // Hola
});

/* -------------------------------------------------------------------------- */
/* 6) MINI PRACTICE — compose concepts                                        */
/* -------------------------------------------------------------------------- */
section("6) Mini practice — combine booleans, logicals, if/ternary/switch");

run("Display name with safe fallback (prefer ?? over ||)", () => {
  const userA = { name: "" }; // empty string is a valid (though empty) value
  const userB = { name: undefined };
  const userC = null;

  const getNameBad = (u) => u && (u.name || "Guest"); // '' -> 'Guest' (maybe not desired)
  const getNameGood = (u) => u?.name ?? "Guest"; // only null/undefined fallback

  console.log("Bad A:", getNameBad(userA), "| Good A:", getNameGood(userA)); // Bad: Guest | Good: ''
  console.log("Bad B:", getNameBad(userB), "| Good B:", getNameGood(userB)); // Bad: Guest | Good: Guest
  console.log("Bad C:", getNameBad(userC), "| Good C:", getNameGood(userC)); // Bad: null | Good: Guest
});

run("Feature flag with && shortcut", () => {
  const featureEnabled = true;
  const track = (ev) => console.log("  tracked:", ev);
  featureEnabled && track("experiment-start"); // called only if enabled
});

run("Choose formatter via switch, fallback via default", () => {
  const fmt = "json";
  const data = { id: 1, name: "Alex" };
  let out;
  switch (fmt) {
    case "json":
      out = JSON.stringify(data);
      break;
    case "kv":
      out = `id=${data.id};name=${data.name}`;
      break;
    default:
      out = String(data);
  }
  console.log("out ->", out);
});

/* -------------------------------------------------------------------------- */
/* 7) TAKEAWAYS                                                                */
/* -------------------------------------------------------------------------- */
section("Takeaways");
console.log(
  [
    "- prefer strict boolean checks with clear guard clauses;",
    "- use ?? for null/undefined fallbacks; || for general falsy fallbacks;",
    "- remember && and || return operands (not just true/false);",
    "- optional chaining ?. protects from crashes on missing props;",
    "- ternary is great for simple expressions; use if/else for complex logic;",
    "- switch is good for discrete matches; for ranges use switch(true) or if/else;",
    "- logical assignment (||=, &&=, ??=) is concise but mind semantics.",
  ].join("\n")
);
