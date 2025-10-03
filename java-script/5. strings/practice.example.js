/**
 * A practical tour of: Strings, Template Literals, Common Methods,
 * Searching (plain & RegExp), and String "Reference" (primitive vs object).
 */

const section = (title) => {
  const LINE = "-".repeat(76);
  console.log(`\n${LINE}\n${title}\n${LINE}`);
};

const run = (title, fn) => {
  console.group(`\n▶ ${title}`);
  try {
    fn();
  } catch (e) {
    console.log("Caught error:", e?.name, e?.message);
  }
  console.groupEnd();
};

/* -------------------------------------------------------------------------- */
/* 1) STRINGS: BASICS, IMMUTABILITY, UNICODE SNAPSHOTS                         */
/* -------------------------------------------------------------------------- */
section("1) Strings — basics, immutability, Unicode snapshots");

run("Creation, length, indexing, immutability", () => {
  const a = "Hello";
  const b = "World";
  const c = `Multi
line`; // template supports newlines

  console.log("a =", a, "| length:", a.length);
  console.log("a[0] =", a[0], "| charAt(1) =", a.charAt(1));
  console.log("c =", c.replace("\n", "\\n in output"));

  // Immutability: this has no effect
  a[0] = "h";
  console.log("after a[0]='h' -> a:", a); // still "Hello"

  // Concatenation
  const d = a + " " + b + "!";
  console.log("concat:", d);
});

run("Unicode quick look (surrogates/code points)", () => {
  const heart = "💙"; // code point U+1F499 (surrogate pair)
  console.log("heart length:", heart.length, "(counts UTF-16 code units)");
  console.log("[...heart].length:", [...heart].length, "(proper code points)");
  console.log("heart.codePointAt(0):", heart.codePointAt(0));
  console.log("String.fromCodePoint(0x1F499):", String.fromCodePoint(0x1f499));
});

run("Normalization (NFC/NFD) matters for equality", () => {
  const composed = "é"; // U+00E9
  const decomposed = "e\u0301"; // 'e' + COMBINING ACUTE
  console.log("composed === decomposed:", composed === decomposed); // false
  console.log(
    "NFC equal:",
    composed.normalize("NFC") === decomposed.normalize("NFC")
  ); // true
});

/* -------------------------------------------------------------------------- */
/* 2) TEMPLATE LITERALS                                                        */
/* -------------------------------------------------------------------------- */
section("2) Template Literals — interpolation, multiline, tagged");

run("Interpolation & expressions", () => {
  const name = "Alex",
    items = 3,
    price = 19.9;
  const msg = `Hello, ${name}. Total: ${(items * price).toFixed(2)} EUR`;
  console.log(msg);
});

run("Multiline & String.raw (preserve escapes)", () => {
  const multi = `Line 1
Line 2\t<- has a tab char`;
  console.log(multi.replace("\t", "\\t (rendered as tab)"));

  const raw = String.raw`C:\path\to\file\next\line`;
  console.log("String.raw:", raw);
});

run("Tagged template (simple sanitizer demo)", () => {
  const html = (strings, ...values) =>
    strings.reduce((acc, s, i) => {
      const v =
        i < values.length
          ? String(values[i]).replace(
              /[&<>"']/g,
              (m) =>
                ({
                  "&": "&amp;",
                  "<": "&lt;",
                  ">": "&gt;",
                  '"': "&quot;",
                  "'": "&#39;",
                }[m])
            )
          : "";
      return acc + s + v;
    }, "");
  const user = `<script>alert('xss')</script>`;
  console.log(html`Hello, ${user}!`); // escaped safely
});

/* -------------------------------------------------------------------------- */
/* 3) STRING METHODS (transform, trim, pad, slice, replace, split, repeat)     */
/* -------------------------------------------------------------------------- */
section("3) String Methods — common transformations");

run("Case, trim, pad, repeat", () => {
  const s = "  hello  ";
  console.log("trim:", s.trim());
  console.log("toUpperCase:", s.toUpperCase());
  console.log("'7'.padStart(3, '0'):", "7".padStart(3, "0"));
  console.log("'A'.repeat(5):", "A".repeat(5));
});

run("slice / substring / at()", () => {
  const s = "JavaScript";
  console.log("slice(4):", s.slice(4)); // "Script"
  console.log("slice(0,4):", s.slice(0, 4)); // "Java"
  console.log("slice(-6):", s.slice(-6)); // "Script"

  console.log("substring(4):", s.substring(4)); // "Script"
  console.log("substring(4,0):", s.substring(4, 0)); // swaps -> "Java"
  console.log("at(-1):", s.at(-1)); // "t" (nice for negatives)
});

run("replace vs replaceAll; split/join; localeCompare", () => {
  const s = "one, two, two, three";
  console.log("replace first 'two':", s.replace("two", "2"));
  console.log("replaceAll 'two':", s.replaceAll("two", "2"));

  const words = "alpha|beta|gamma".split("|");
  console.log("split:", words, "join by ',':", words.join(","));

  // Locale-aware compare (diacritics)
  console.log("'ä'.localeCompare('z', 'de'):", "ä".localeCompare("z", "de"));
});

/* -------------------------------------------------------------------------- */
/* 4) SEARCH: indexOf/includes/startsWith/endsWith + RegExp                    */
/* -------------------------------------------------------------------------- */
section("4) Searching — indexOf/includes/startsWith/endsWith & RegExp");

run("Plain search helpers", () => {
  const s = "Hello world, hello JS.";
  console.log("includes('world'):", s.includes("world"));
  console.log("startsWith('Hell'):", s.startsWith("Hell"));
  console.log("endsWith('JS.'):", s.endsWith("JS."));
  console.log("indexOf('hello'):", s.indexOf("hello")); // 13 (case-sensitive)
  console.log("lastIndexOf('o'):", s.lastIndexOf("o")); // last 'o'
});

run("Case-insensitive with toLowerCase", () => {
  const s = "Hello world, hello JS.";
  const term = "HELLO";
  const pos = s.toLowerCase().indexOf(term.toLowerCase());
  console.log("case-insensitive index:", pos);
});

run("RegExp: test, match, matchAll, replace with groups", () => {
  const text = "Emails: alex@mail.com, maria@site.org";
  const re = /\b([a-z0-9._%+-]+)@([a-z0-9.-]+\.[a-z]{2,})\b/gi;

  console.log("test():", re.test(text)); // true

  console.log("match():", text.match(re)); // array of matches (no groups returned here)

  console.log("matchAll():");
  for (const m of text.matchAll(re)) {
    console.log("  whole:", m[0], "| user:", m[1], "| host:", m[2]);
  }

  console.log(
    "replace():",
    text.replace(re, (_whole, user, host) => `${user} [at] ${host}`)
  );
});

run("Building dynamic RegExp safely (escape user input)", () => {
  const escapeRE = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const hay = "Find (these) special *chars* exactly.";
  const needle = "(these) special *chars*";
  const regex = new RegExp(escapeRE(needle), "i");
  console.log("found:", regex.test(hay));
});

/* -------------------------------------------------------------------------- */
/* 5) STRING REFERENCE: primitive vs String object                              */
/* -------------------------------------------------------------------------- */
section("5) String Reference — primitive vs String object, equality, pitfalls");

run("typeof & instanceof", () => {
  const p = "hi"; // primitive
  const o = new String("hi"); // object wrapper (avoid)

  console.log("typeof p:", typeof p); // "string"
  console.log("typeof o:", typeof o); // "object"
  console.log("o instanceof String:", o instanceof String); // true

  // Equality
  console.log("p === 'hi':", p === "hi"); // true (value)
  console.log("o === 'hi':", o === "hi"); // false (object vs primitive)
  console.log("o.valueOf() === 'hi':", o.valueOf() === "hi"); // true
});

run("Truthiness edge case with new String('')", () => {
  const emptyPrim = "";
  const emptyObj = new String("");
  console.log("Boolean(''):", Boolean(emptyPrim)); // false
  console.log("Boolean(new String('')):", Boolean(emptyObj)); // true — surprising!
  console.log("Recommendation: avoid new String(...) in app code.");
});

/* -------------------------------------------------------------------------- */
/* 6) MINI PRACTICE UTILITIES                                                  */
/* -------------------------------------------------------------------------- */
section("6) Mini practice — useful utilities");

run("slugify (ASCII-ish) with diacritics removal", () => {
  const slugify = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove combining marks
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-") // non-alnum -> dashes
      .replace(/^-+|-+$/g, ""); // trim dashes

  console.log(slugify("  Crème Brûlée à la JS!  ")); // "creme-brulee-a-la-js"
});

run("titleCase (simple English rules)", () => {
  const titleCase = (s) =>
    s
      .toLowerCase()
      .split(/\s+/)
      .map((w, i) =>
        i === 0 ||
        i === s.length - 1 ||
        !/^(of|the|a|an|in|on|at|to|for|and|or)$/.test(w)
          ? w.charAt(0).toUpperCase() + w.slice(1)
          : w
      )
      .join(" ");
  console.log(titleCase("a tale of two cities"));
});

run("maskEmail & extractDomains", () => {
  const maskEmail = (email) =>
    email.replace(
      /\b([a-z0-9._%+-])[a-z0-9._%+-]*(@.+)\b/gi,
      (_w, first, rest) => first + "***" + rest
    );
  console.log(maskEmail("alex.long@mail.com")); // a***@mail.com

  const extractDomains = (text) => {
    const out = [];
    const re = /\b[a-z0-9._%+-]+@([a-z0-9.-]+\.[a-z]{2,})\b/gi;
    for (const m of text.matchAll(re)) out.push(m[1].toLowerCase());
    return Array.from(new Set(out));
  };
  console.log(extractDomains("c@x.io, d@y.com, C@X.io")); // ['x.io','y.com']
});

run("first N characters by code points (safe for emojis)", () => {
  const firstN = (s, n) => Array.from(s).slice(0, n).join("");
  console.log(firstN("I ❤️ JS 🤓", 5)); // takes whole emojis safely
});

/* -------------------------------------------------------------------------- */
/* 7) TAKEAWAYS                                                                */
/* -------------------------------------------------------------------------- */
section("7) Takeaways");
console.log(
  [
    "- Strings are immutable; indexing returns code units; prefer at() for negatives;",
    "- Template literals allow interpolation, multiline; String.raw & tags are powerful;",
    "- Know your essentials: trim/pad/repeat/slice/replaceAll/split/join/localeCompare;",
    "- Use includes/startsWith/endsWith; for complex search use RegExp (matchAll, groups);",
    "- Normalize before comparing user-visible strings; handle Unicode code points;",
    "- Avoid new String(...); primitives are the right choice.",
  ].join("\n")
);
