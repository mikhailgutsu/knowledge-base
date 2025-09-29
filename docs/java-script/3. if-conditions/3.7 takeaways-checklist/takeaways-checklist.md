# 7. Takeaways & Checklist

## Key Points

- prefer strict boolean checks and early returns;
- use `??` for null/undefined fallbacks; use `||` for general falsy fallbacks;
- remember `&&` and `||` return operands, not just booleans;
- use optional chaining (`?.`) to avoid crashes on missing paths;
- keep ternaries short; switch to `if/else` when logic grows;
- `switch` suits discrete cases; use object maps for simple lookups;
- logical assignment (`||=`, `&&=`, `??=`) is concise; know each operator’s semantics.

## Quick Checklist

- are your conditions explicit and readable;
- did you avoid accidental assignment in `if` conditions;
- did you choose `??` vs `||` appropriately;
- did you use parentheses to clarify mixed logical expressions;
- did you avoid nested ternaries beyond one level.

## Next Step

- convert these notes into runnable demos;
- create unit tests for edge cases like `null`, `undefined`, `0`, `""`, `NaN`.
