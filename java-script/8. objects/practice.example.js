/**
 * Practical tour of: Object Basics, Cloning/Merging/Immutability,
 * Descriptors & Getters/Setters, Object Utilities,
 * Prototypes & Inheritance, Map/Set/WeakMap/WeakSet,
 * and JSON Serialization (replacer/reviver).
 */

const section = (title) => {
  const LINE = "-".repeat(86);
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
/* 1) OBJECT BASICS: literals, access, computed keys, method shorthand, symbols */
/* -------------------------------------------------------------------------- */
section("1) Object Basics — literals, access, computed keys, methods, symbols");

run("Literals, dot/bracket access, computed keys, method shorthand", () => {
  const field = "score";
  const user = {
    name: "Alex",
    age: 25,
    "likes-js": true, // needs bracket access
    [field]: 100, // computed property name
    sayHi() {
      return `Hi, I'm ${this.name}`;
    }, // method shorthand
  };

  console.log(user.name); // dot
  console.log(user["likes-js"]); // bracket for non-identifier keys
  console.log(user[field]); // computed access
  console.log(user.sayHi());

  // number-like keys become strings internally
  const obj = { 1: "one", 10: "ten", 2: "two" };
  console.log("Object.keys numeric order ->", Object.keys(obj)); // ["1","2","10"] (numeric ascending first)
});

run("Symbols as keys (non-enumerated by keys/values/entries)", () => {
  const ID = Symbol("id");
  const o = { a: 1 };
  o[ID] = 12345;
  console.log("Object.keys(o) ->", Object.keys(o)); // ["a"]
  console.log("getOwnPropertySymbols(o) ->", Object.getOwnPropertySymbols(o)); // [Symbol(id)]
  console.log("o[ID] ->", o[ID]); // 12345
});

/* -------------------------------------------------------------------------- */
/* 2) CLONING / MERGING / IMMUTABILITY                                        */
/* -------------------------------------------------------------------------- */
section("2) Cloning / Merging / Immutability");

run("Shallow clone: spread vs Object.assign", () => {
  const src = { a: 1, nested: { z: 9 } };
  const c1 = { ...src };
  const c2 = Object.assign({}, src);
  c1.nested.z = 100; // shallow clone -> affects src
  console.log("src.nested.z ->", src.nested.z); // 100
  console.log("c2.nested.z ->", c2.nested.z); // 100
});

run("Deep clone: structuredClone vs JSON (limitations)", () => {
  const x = { d: new Date("2020-01-01"), f() {}, n: 1, nested: { k: 2 } };
  const deep = global.structuredClone
    ? structuredClone(x)
    : JSON.parse(JSON.stringify(x));
  console.log("deep.nested.k ->", deep.nested.k); // 2

  if (!global.structuredClone) {
    console.log(
      "JSON clone loses Date/function: typeof deep.d ->",
      typeof deep.d
    ); // "string"
    console.log("deep.f ->", deep.f); // undefined
  } else {
    console.log("structuredClone keeps Date:", deep.d instanceof Date); // true
  }
});

run("Freeze / Seal / PreventExtensions", () => {
  const a = { x: 1 },
    b = { y: 2 },
    c = { z: 3 };
  Object.freeze(a); // no add/remove/change (shallow)
  Object.seal(b); // no add/remove, can change existing (shallow)
  Object.preventExtensions(c); // no add, can change/delete existing

  a.x = 9;
  delete a.x; // ignored (or throws in strict mode)
  b.y = 9; // allowed
  try {
    b.newProp = 1;
  } catch {}
  try {
    c.newProp = 1;
  } catch {}

  console.log({ a, b, c, extensibleC: Object.isExtensible(c) });
});

/* -------------------------------------------------------------------------- */
/* 3) DESCRIPTORS / GETTERS / SETTERS                                         */
/* -------------------------------------------------------------------------- */
section("3) Descriptors / Getters / Setters");

run("defineProperty + enumerable/writable/configurable", () => {
  const o = {};
  Object.defineProperty(o, "hidden", {
    value: 42,
    enumerable: false,
    writable: false,
    configurable: false,
  });
  o.hidden = 99; // ignored (or throws in strict)
  console.log("keys ->", Object.keys(o)); // [] (not enumerable)
  console.log(
    "getOwnPropertyDescriptor ->",
    Object.getOwnPropertyDescriptor(o, "hidden")
  );
});

run("Accessor properties (get/set)", () => {
  const person = {
    first: "Alex",
    last: "Bircu",
    get full() {
      return `${this.first} ${this.last}`;
    },
    set full(v) {
      const [f, ...rest] = String(v).split(" ");
      this.first = f;
      this.last = rest.join(" ") || "";
    },
  };
  console.log("person.full ->", person.full);
  person.full = "Maria Redwood";
  console.log("after set ->", person.first, person.last);
});

/* -------------------------------------------------------------------------- */
/* 4) OBJECT UTILITIES                                                         */
/* -------------------------------------------------------------------------- */
section(
  "4) Object Utilities — keys/values/entries, fromEntries, hasOwn, names/symbols"
);

run("keys/values/entries <-> fromEntries", () => {
  const o = { a: 1, b: 2 };
  console.log("Object.keys   ->", Object.keys(o));
  console.log("Object.values ->", Object.values(o));
  console.log("Object.entries->", Object.entries(o));
  const o2 = Object.fromEntries([
    ["x", 10],
    ["y", 20],
  ]);
  console.log("fromEntries   ->", o2);
});

run("'in' vs hasOwn vs Object.hasOwn", () => {
  const proto = { p: 1 };
  const o = Object.create(proto);
  o.own = 2;

  console.log("'p' in o           ->", "p" in o); // true (from prototype)
  console.log("o.hasOwnProperty('p')->", o.hasOwnProperty("p")); // false
  console.log("Object.hasOwn(o,'p') ->", Object.hasOwn(o, "p")); // false
  console.log("Object.hasOwn(o,'own')->", Object.hasOwn(o, "own")); // true
});

run("getOwnPropertyNames / getOwnPropertySymbols / descriptors", () => {
  const S = Symbol("s");
  const o = Object.create(null, {
    a: { value: 1, enumerable: true },
    b: { value: 2, enumerable: false },
  });
  o[S] = 7;
  console.log("names ->", Object.getOwnPropertyNames(o)); // ["a","b"]
  console.log("symbols ->", Object.getOwnPropertySymbols(o)); // [Symbol(s)]
  console.log("descriptors ->", Object.getOwnPropertyDescriptors(o));
});

/* -------------------------------------------------------------------------- */
/* 5) PROTOTYPES & INHERITANCE                                                 */
/* -------------------------------------------------------------------------- */
section(
  "5) Prototypes & Inheritance — Object.create, prototype chain, class sugar"
);

run("Prototype chain with Object.create", () => {
  const proto = {
    greet() {
      return `Hello ${this.name}`;
    },
  };
  const obj = Object.create(proto, {
    name: { value: "Alex", enumerable: true, writable: true },
  });
  console.log("obj.greet() ->", obj.greet());
  console.log("proto.isPrototypeOf(obj) ->", proto.isPrototypeOf(obj)); // true
  console.log(
    "'greet' in obj ->",
    "greet" in obj,
    "| hasOwn ->",
    Object.hasOwn(obj, "greet")
  ); // true | false
});

run("Class syntax is sugar for prototypes", () => {
  class Animal {
    constructor(name) {
      this.name = name;
    }
    speak() {
      return `${this.name} makes a sound`;
    }
  }
  class Dog extends Animal {
    speak() {
      return `${super.speak()} (woof)`;
    }
  }
  const d = new Dog("Rex");
  console.log(d.speak());
});

/* -------------------------------------------------------------------------- */
/* 6) MAP / SET / WEAKMAP / WEAKSET vs OBJECT                                  */
/* -------------------------------------------------------------------------- */
section("6) Map / Set / WeakMap / WeakSet vs Object");

run("Map with non-string keys; Set uniqueness", () => {
  const k1 = { id: 1 },
    k2 = { id: 2 };
  const map = new Map();
  map.set(k1, "alpha");
  map.set(k2, "beta");
  console.log("map.get(k1) ->", map.get(k1));

  const set = new Set([1, 2, 2, 3]);
  console.log("set ->", [...set]); // [1,2,3]
});

run("WeakMap for private data (no strong references to keys)", () => {
  const priv = new WeakMap();
  function createUser(name) {
    const obj = {
      name,
      get secret() {
        return priv.get(obj);
      },
    };
    priv.set(obj, `secret-of-${name}`);
    return obj;
  }
  const u = createUser("Alex");
  console.log("private via WeakMap ->", u.secret);
  // When `u` is lost, priv can be GC'ed (non-demonstrable in a short script).
});

/* -------------------------------------------------------------------------- */
/* 7) JSON SERIALIZATION (replacer / reviver / toJSON)                         */
/* -------------------------------------------------------------------------- */
section("7) JSON Serialization — stringify replacer, parse reviver, toJSON");

run("JSON.stringify with space & replacer", () => {
  const data = { id: 1, pwd: "secret", created: new Date("2024-01-01") };
  const safe = JSON.stringify(data, (k, v) => (k === "pwd" ? "***" : v), 2);
  console.log("safe JSON ->\n" + safe);
});

run("JSON.parse reviver to restore Date objects", () => {
  const json = `{"at":"2024-02-02T10:20:30.000Z","n":5}`;
  const parsed = JSON.parse(json, (k, v) => (k === "at" ? new Date(v) : v));
  console.log("parsed.at instanceof Date ->", parsed.at instanceof Date);
});

run("Custom toJSON hook", () => {
  const account = {
    id: 7,
    balance: 19.95,
    toJSON() {
      return { id: this.id, balance: Number(this.balance.toFixed(2)) };
    },
  };
  console.log("JSON.stringify(account) ->", JSON.stringify(account)); // uses toJSON
});

/* -------------------------------------------------------------------------- */
/* 8) TAKEAWAYS                                                                */
/* -------------------------------------------------------------------------- */
section("8) Takeaways");
console.log(
  [
    "- Objects store string/symbol keyed properties; prefer dot access, bracket for dynamic or special keys.",
    "- Spread/Object.assign make shallow clones; structuredClone for deep clone (JSON clone loses Dates/functions).",
    "- Control enumerability/writability via descriptors; use getters/setters for derived properties.",
    "- keys/values/entries/fromEntries + Object.hasOwn cover most utilities.",
    "- Prototype chain underlies classes; Object.create builds custom chains.",
    "- Use Map/Set for non-string keys and uniqueness; WeakMap/WeakSet for GC-friendly private data.",
    "- JSON stringify/parse with replacer/reviver and toJSON to control serialization.",
  ].join("\n")
);
