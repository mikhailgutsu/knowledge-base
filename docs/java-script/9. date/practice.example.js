/**
 * Practical tour of: Date creation/parsing, formatting, "get" & "set" APIs,
 * time zones, arithmetic, and Date reference behavior.
 */

const section = (title) => {
  const LINE = "-".repeat(88);
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
/* 0) CREATE & PARSE                                                           */
/* -------------------------------------------------------------------------- */
section("0) Create & Parse — constructor forms, ISO, UTC helpers");

run("Common constructors & helpers", () => {
  const now = new Date(); // current local time
  const fromEpoch = new Date(0); // Epoch (Jan 1, 1970, UTC)
  const fromMs = new Date(1_700_000_000_000); // from ms timestamp
  const fromISO = new Date("2025-09-30T12:34:56Z"); // parse ISO (UTC)
  const fromDateOnly = new Date("2025-09-30"); // ISO DATE-ONLY → treated as UTC midnight
  const fromPartsLocal = new Date(2025, 8, 30, 12, 0, 0); // Y, M(0-based), D, h, m, s (local)
  const utcMs = Date.UTC(2025, 8, 30, 12, 0, 0); // same parts, but as UTC ms
  const fromUTCParts = new Date(utcMs); // Date representing that UTC time

  console.log({
    now,
    fromEpoch,
    fromMs,
    fromISO,
    fromDateOnly,
    fromPartsLocal,
    utcMs,
    fromUTCParts,
  });
  console.log("Date.now() ->", Date.now()); // fast ms timestamp
  console.log("Number(now) ->", Number(now)); // implicit ms since epoch
});

run("⚠️ Avoid ambiguous non-ISO strings", () => {
  // Avoid locale/engine-dependent strings like "03/04/2025"
  console.log(
    "Prefer ISO: 'YYYY-MM-DD' or full ISO with timezone 'YYYY-MM-DDTHH:mm:ssZ'"
  );
});

/* -------------------------------------------------------------------------- */
/* 1) DATE FORMAT                                                              */
/* -------------------------------------------------------------------------- */
section("1) Date Format — ISO, locale, Intl.DateTimeFormat, time zones");

run("ISO formatting", () => {
  const d = new Date("2025-09-30T08:15:30.123Z");
  console.log("toISOString()           ->", d.toISOString()); // always UTC
  console.log("toJSON()                ->", d.toJSON()); // same as toISOString
  console.log("d.toString() (local)    ->", d.toString()); // local time zone
  console.log("d.toUTCString() (text)  ->", d.toUTCString()); // human UTC format
  console.log("d.toLocaleString()      ->", d.toLocaleString()); // env locale & tz
});

run("Locale formatting with explicit timeZone (stable output)", () => {
  const base = new Date("2025-03-30T00:30:00Z"); // near EU DST start
  const fmt = (tz) =>
    new Intl.DateTimeFormat("en-GB", {
      dateStyle: "full",
      timeStyle: "long",
      timeZone: tz,
    }).format(base);

  console.log("UTC               ->", fmt("UTC"));
  console.log("Europe/Chisinau   ->", fmt("Europe/Chisinau"));
  console.log("America/New_York  ->", fmt("America/New_York"));
});

run("Custom pattern formatting (DIY)", () => {
  const d = new Date("2025-09-30T08:05:09.45Z");
  // Pad helper
  const pad = (n, w = 2) => String(n).padStart(w, "0");
  const Y = d.getUTCFullYear();
  const M = pad(d.getUTCMonth() + 1);
  const D = pad(d.getUTCDate());
  const h = pad(d.getUTCHours());
  const m = pad(d.getUTCMinutes());
  const s = pad(d.getUTCSeconds());
  const ms = String(d.getUTCMilliseconds()).padStart(3, "0");
  console.log(
    `YYYY-MM-DD hh:mm:ss.SSS (UTC) -> ${Y}-${M}-${D} ${h}:${m}:${s}.${ms}`
  );
});

/* -------------------------------------------------------------------------- */
/* 2) DATE GET                                                                 */
/* -------------------------------------------------------------------------- */
section("2) Date Get — local vs UTC getters, parts, epoch");

run("Local getters", () => {
  const d = new Date("2025-09-30T12:34:56.789Z"); // construct a fixed moment
  console.log("getFullYear   ->", d.getFullYear()); // local year
  console.log("getMonth      ->", d.getMonth(), "(0=Jan)"); // 0-11, local
  console.log("getDate       ->", d.getDate()); // day of month 1-31
  console.log("getDay        ->", d.getDay(), "(0=Sun)"); // 0-6
  console.log("getHours      ->", d.getHours()); // 0-23 local hours
  console.log("getMinutes    ->", d.getMinutes());
  console.log("getSeconds    ->", d.getSeconds());
  console.log("getMilliseconds->", d.getMilliseconds());
  console.log("getTime       ->", d.getTime(), "(ms since epoch)");
  console.log("valueOf()     ->", d.valueOf(), "(same as getTime)");
});

run("UTC getters", () => {
  const d = new Date("2025-09-30T12:34:56.789Z");
  console.log("getUTCFullYear   ->", d.getUTCFullYear());
  console.log("getUTCMonth      ->", d.getUTCMonth());
  console.log("getUTCDate       ->", d.getUTCDate());
  console.log("getUTCDay        ->", d.getUTCDay());
  console.log("getUTCHours      ->", d.getUTCHours());
  console.log("getUTCMinutes    ->", d.getUTCMinutes());
  console.log("getUTCSeconds    ->", d.getUTCSeconds());
  console.log("getUTCMilliseconds->", d.getUTCMilliseconds());
});

/* -------------------------------------------------------------------------- */
/* 3) DATE SET                                                                 */
/* -------------------------------------------------------------------------- */
section("3) Date Set — mutating parts, overflow rollovers, add helpers");

run("Local setters (rollover behavior)", () => {
  const d = new Date(2025, 0, 31); // Jan 31, 2025 (local)
  console.log("start ->", d.toString());
  d.setMonth(1); // set to February (month=1)
  console.log(
    "after setMonth(1) ->",
    d.toString(),
    " // rolls to Mar 3 if Feb has 28 days, etc."
  );
});

run("UTC setters", () => {
  const d = new Date("2025-09-30T12:00:00Z");
  console.log("start (UTC)       ->", d.toISOString());
  d.setUTCDate(d.getUTCDate() + 1); // add one UTC day
  console.log("after +1 day (UTC)->", d.toISOString());
});

run("Add helpers: days/hours (DST considerations)", () => {
  const addDaysLocal = (date, n) => {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  };
  const addHoursLocal = (date, n) => {
    const d = new Date(date);
    d.setHours(d.getHours() + n);
    return d;
  };

  const base = new Date("2025-03-30T00:30:00"); // local — may be near DST start depending on your tz
  console.log("base local ->", base.toString());
  console.log("addDaysLocal(base, 1)  ->", addDaysLocal(base, 1).toString());
  console.log(
    "addHoursLocal(base, 24)->",
    addHoursLocal(base, 24).toString(),
    " // may differ vs addDays across DST"
  );
});

run("Safer arithmetic in UTC to avoid DST jumps", () => {
  const addDaysUTC = (date, n) =>
    new Date(date.getTime() + n * 24 * 60 * 60 * 1000);
  const base = new Date("2025-03-30T00:30:00Z");
  console.log("base UTC   ->", base.toISOString());
  console.log("+1 day UTC ->", addDaysUTC(base, 1).toISOString());
});

/* -------------------------------------------------------------------------- */
/* 4) DATE REFERENCE & JSON                                                    */
/* -------------------------------------------------------------------------- */
section("4) Date Reference — mutability, copying, equality, JSON");

run("Dates are mutable objects; copy via new Date(d) or ms", () => {
  const a = new Date("2025-09-30T12:00:00Z");
  const b = new Date(a); // copy
  b.setUTCMinutes(30);
  console.log("a ->", a.toISOString());
  console.log("b ->", b.toISOString(), "(changed b only)");
});

run("Equality checks", () => {
  const a = new Date("2025-09-30T12:00:00Z");
  const b = new Date("2025-09-30T12:00:00Z");
  console.log("a === b            ->", a === b, "(false: different objects)");
  console.log(
    "a.getTime() === b.getTime() ->",
    a.getTime() === b.getTime(),
    "(true: same instant)"
  );
});

run("JSON serialization & revival", () => {
  const obj = { when: new Date("2025-09-30T12:34:56Z") };
  const json = JSON.stringify(obj); // Date becomes ISO string
  console.log("JSON ->", json);
  const revived = JSON.parse(json, (k, v) => (k === "when" ? new Date(v) : v));
  console.log("revived.when instanceof Date ->", revived.when instanceof Date);
});

/* -------------------------------------------------------------------------- */
/* 5) TAKEAWAYS                                                                */
/* -------------------------------------------------------------------------- */
section("5) Takeaways");
console.log(
  [
    "- Prefer ISO 8601 strings; avoid ambiguous locale date strings.",
    "- Months are 0-based; days-of-week: 0=Sunday..6=Saturday.",
    "- Use UTC getters/setters or add ms for DST-safe arithmetic.",
    "- Dates are mutable; copy before changing; compare with getTime().",
    "- toISOString()/toJSON() are UTC; toLocaleString depends on locale/timeZone.",
    "- For stable display, pass an explicit timeZone to Intl.DateTimeFormat.",
  ].join("\n")
);
