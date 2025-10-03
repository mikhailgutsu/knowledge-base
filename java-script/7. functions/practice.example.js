/**
 * Practical tour: Function Basics & Hoisting, Parameters, `this` & Binding,
 * Closures & Scope, Higher-Order & FP, Async Functions, Generators & Iterators.
 */

const section = (title) => {
  const LINE = "-".repeat(80);
  console.log(`\n${LINE}\n${title}\n${LINE}`);
};

// Async-friendly runner so demo sections can use async/await
const run = async (title, fn) => {
  console.group(`\n▶ ${title}`);
  try {
    await fn();
  } catch (e) {
    console.log("⚠️", e?.name, e?.message);
  }
  console.groupEnd();
};

(async function main() {
  /* -------------------------------------------------------------------------- */
  /* 1) FUNCTION BASICS & HOISTING                                              */
  /* -------------------------------------------------------------------------- */
  section("1) Function Basics & Hoisting");

  await run("Declaration vs Expression vs Arrow (and hoisting)", async () => {
    // Function declaration is hoisted with its body:
    console.log("sumDecl(2,3) before def ->", sumDecl(2, 3)); // 5

    function sumDecl(a, b) {
      return a + b;
    }

    // Function expression/arrow are hoisted as bindings (TDZ until initialized):
    try {
      console.log(sumExpr(2, 3));
    } catch (e) {
      console.log("sumExpr before init ->", e.message);
    }
    const sumExpr = function (a, b) {
      return a + b;
    };
    console.log("sumExpr(2,3) after init ->", sumExpr(2, 3));

    try {
      console.log(sumArrow(2, 3));
    } catch (e) {
      console.log("sumArrow before init ->", e.message);
    }
    const sumArrow = (a, b) => a + b;
    console.log("sumArrow(2,3) after init ->", sumArrow(2, 3));
  });

  await run("Function objects: name, length, toString", async () => {
    function greet(name, title) {
      return `Hello, ${title} ${name}`;
    }
    console.log("greet.name   ->", greet.name); // "greet"
    console.log("greet.length ->", greet.length); // 2 (number of declared params)
    console.log("typeof greet ->", typeof greet); // "function"
    console.log(
      "greet.toString().slice(0,40) ->",
      greet.toString().slice(0, 40) + "..."
    );
  });

  /* -------------------------------------------------------------------------- */
  /* 2) PARAMETERS & ARGUMENTS                                                  */
  /* -------------------------------------------------------------------------- */
  section("2) Parameters & Arguments: default, rest, destructuring, spread");

  await run("Default params (including from previous params)", async () => {
    const inc = (x, step = 1) => x + step;
    const next = (a, b = a + 1) => [a, b];
    console.log("inc(5) ->", inc(5)); // 6
    console.log("next(10) ->", next(10)); // [10, 11]
  });

  await run("Rest params & the old arguments object", async () => {
    const sum = (...nums) => nums.reduce((a, b) => a + b, 0);
    console.log("sum(1,2,3,4) ->", sum(1, 2, 3, 4)); // 10

    function showArgs() {
      console.log("arguments length ->", arguments.length);
    }
    showArgs(1, 2, 3);
  });

  await run(
    "Destructuring in parameters (with defaults) + named args pattern",
    async () => {
      const draw = ({ x = 0, y = 0, size = 10 } = {}) =>
        `Drawing at (${x}, ${y}) size=${size}`;
      console.log(draw({ x: 5, y: 7 })); // "Drawing at (5, 7) size=10"
      console.log(draw()); // defaults

      const makeUser = ({ name, email, role = "user" }) => ({
        id: cryptoRandomId(),
        name,
        email,
        role,
      });
      function cryptoRandomId() {
        return Math.random().toString(36).slice(2, 10);
      }
      console.log("makeUser ->", makeUser({ name: "Alex", email: "a@x.io" }));
    }
  );

  await run("Spread when calling", async () => {
    const nums = [2, 3, 5];
    const multiply = (a, b, c) => a * b * c;
    console.log("multiply(...[2,3,5]) ->", multiply(...nums)); // 30
  });

  /* -------------------------------------------------------------------------- */
  /* 3) `this` & BINDING                                                        */
  /* -------------------------------------------------------------------------- */
  section("3) `this` & Binding: regular vs arrow, call/apply/bind");

  await run("Method context, losing `this`, and bind", async () => {
    const user = {
      name: "Alex",
      hello() {
        return `Hi, I'm ${this.name}`;
      },
    };
    console.log("user.hello() ->", user.hello());
    const fn = user.hello; // lost context
    try {
      console.log("fn() ->", fn());
    } catch (e) {
      console.log("fn() error ->", e.message);
    }
    const bound = user.hello.bind(user);
    console.log("bound() ->", bound());
  });

  await run("call vs apply vs bind", async () => {
    function intro(city, country) {
      return `${this.name} from ${city}, ${country}`;
    }
    const ctx = { name: "Maria" };
    console.log("call ->", intro.call(ctx, "Chisinau", "Moldova"));
    console.log("apply ->", intro.apply(ctx, ["Chisinau", "Moldova"]));
    const introMd = intro.bind(ctx, "Chisinau");
    console.log("bind ->", introMd("Moldova"));
  });

  await run(
    "Arrow `this` is lexical (ignores bind/call) — great for callbacks",
    async () => {
      const timer = {
        count: 0,
        start() {
          // arrow captures `this` from start()
          this._id = setInterval(() => {
            this.count++;
            if (this.count === 3) clearInterval(this._id);
          }, 10);
        },
      };
      timer.start();
      await new Promise((r) => setTimeout(r, 50));
      console.log("timer.count ->", timer.count); // 3
    }
  );

  /* -------------------------------------------------------------------------- */
  /* 4) CLOSURES & SCOPE                                                        */
  /* -------------------------------------------------------------------------- */
  section("4) Closures & Scope: private state, factories, IIFE");

  await run("Private counter via closure", async () => {
    function createCounter(initial = 0) {
      let value = initial;
      return {
        inc() {
          value++;
        },
        dec() {
          value--;
        },
        get() {
          return value;
        },
      };
    }
    const c = createCounter(10);
    c.inc();
    c.inc();
    c.dec();
    console.log("counter.get() ->", c.get()); // 11
  });

  await run("Once() utility (execute a function at most once)", async () => {
    const once = (fn) => {
      let called = false,
        result;
      return (...args) =>
        called ? result : ((called = true), (result = fn(...args)));
    };
    const init = once(() => "initialized!");
    console.log(init(), init(), init()); // only first call computes
  });

  await run("IIFE and Module pattern with closure", async () => {
    const storage = (() => {
      const data = new Map();
      return {
        set(k, v) {
          data.set(k, v);
        },
        get(k) {
          return data.get(k);
        },
      };
    })();
    storage.set("token", "abc123");
    console.log("storage.get('token') ->", storage.get("token"));
  });

  /* -------------------------------------------------------------------------- */
  /* 5) HIGHER-ORDER & FUNCTIONAL PATTERNS                                      */
  /* -------------------------------------------------------------------------- */
  section("5) Higher-Order Functions & FP: map/filter/reduce, curry, compose");

  await run("map / filter / reduce basics", async () => {
    const nums = [1, 2, 3, 4, 5];
    const doubled = nums.map((n) => n * 2);
    const evens = nums.filter((n) => n % 2 === 0);
    const sum = nums.reduce((a, n) => a + n, 0);
    console.log({ doubled, evens, sum });
  });

  await run("Currying & composition (pipe)", async () => {
    const curry2 = (fn) => (a) => (b) => fn(a, b);
    const add = (a, b) => a + b;
    const add10 = curry2(add)(10);
    console.log("add10(5) ->", add10(5)); // 15

    const pipe =
      (...fns) =>
      (x) =>
        fns.reduce((v, f) => f(v), x);
    const mul2 = (n) => n * 2;
    const square = (n) => n * n;
    const pipeline = pipe(add10, mul2, square);
    console.log("pipeline(5) ->", pipeline(5)); // ((5+10)*2)^2 = 900
  });

  /* -------------------------------------------------------------------------- */
  /* 6) ASYNC FUNCTIONS: CALLBACKS → PROMISES → ASYNC/AWAIT                      */
  /* -------------------------------------------------------------------------- */
  section("6) Async Functions: callbacks → promises → async/await");

  await run("From callback to Promise and async/await", async () => {
    // Callback style
    function doAsyncCb(x, cb) {
      setTimeout(() => {
        if (x < 0) cb(new Error("x must be >= 0"));
        else cb(null, x * 2);
      }, 20);
    }

    // Promisified
    const doAsync = (x) =>
      new Promise((resolve, reject) =>
        doAsyncCb(x, (err, val) => (err ? reject(err) : resolve(val)))
      );

    // async/await + error handling
    try {
      const v = await doAsync(21);
      console.log("await doAsync(21) ->", v); // 42
      await doAsync(-1);
    } catch (e) {
      console.log("caught ->", e.message);
    }

    // Concurrency
    const tasks = [1, 2, 3].map(doAsync);
    const results = await Promise.all(tasks);
    console.log("Promise.all ->", results);

    const mixed = [doAsync(1), doAsync(-2), doAsync(3)];
    const settled = await Promise.allSettled(mixed);
    console.log(
      "allSettled ->",
      settled.map((s) => s.status)
    );
  });

  /* -------------------------------------------------------------------------- */
  /* 7) GENERATORS & ITERATORS                                                  */
  /* -------------------------------------------------------------------------- */
  section("7) Generators & Iterators");

  await run("Synchronous generator: range", async () => {
    function* range(start, end, step = 1) {
      for (let n = start; n <= end; n += step) yield n;
    }
    console.log("[...range(1,5)] ->", [...range(1, 5)]);
  });

  await run(
    "Custom iterable via Symbol.iterator (using a generator)",
    async () => {
      const countdown = {
        from: 5,
        to: 1,
        *[Symbol.iterator]() {
          for (let n = this.from; n >= this.to; n--) yield n;
        },
      };
      console.log("[...countdown] ->", [...countdown]);
    }
  );

  await run("Async generator + for await...of", async () => {
    async function* ticker(times, ms) {
      for (let i = 1; i <= times; i++) {
        await new Promise((r) => setTimeout(r, ms));
        yield i;
      }
    }
    const out = [];
    for await (const t of ticker(3, 15)) out.push(t);
    console.log("ticks ->", out);
  });

  /* -------------------------------------------------------------------------- */
  /* 8) TAKEAWAYS                                                                */
  /* -------------------------------------------------------------------------- */
  section("8) Takeaways");
  console.log(
    [
      "- Declarations hoist (body included); expressions/arrows hoist as TDZ bindings.",
      "- Prefer default/rest/destructured params + named-args objects.",
      "- Arrow `this` is lexical; use bind/call/apply to control regular `this`.",
      "- Closures enable private state and factory patterns (IIFE/module).",
      "- Higher-order functions + compose/curry make pipelines declarative.",
      "- Prefer Promises/async-await; know Promise.all vs allSettled.",
      "- Generators yield sequences; async generators work with for-await-of.",
    ].join("\n")
  );
})(); // end main
