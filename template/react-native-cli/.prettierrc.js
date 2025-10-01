module.exports = {
  // Don't add semicolons at the end of statements.
  // Example: const x = 1 instead of const x = 1;
  semi: false,

  // Each indentation level = 2 spaces
  tabWidth: 2,

  // Enforce spaces instead of hard tab characters
  useTabs: false,

  // Maximum line length before Prettier wraps code
  // Keeps code more readable on smaller screens
  printWidth: 90,

  // Use single quotes instead of double quotes in JS/TS
  // Example: 'hello' instead of "hello"
  singleQuote: true,

  // Add trailing commas where valid in ES5 (objects, arrays, etc.)
  // Makes diffs cleaner when adding/removing items
  trailingComma: 'es5',
}