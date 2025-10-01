// Export the ESLint configuration object
module.exports = {
  // Marks this config as the root one.
  // ESLint will stop looking for other config files up the folder tree.
  root: true,

  // Add TypeScript-specific linting rules.
  // '@typescript-eslint' provides rules that understand TS syntax and types.
  plugins: ['@typescript-eslint'],

  // Use the TypeScript parser so ESLint can understand TS/TSX files.
  // Without this, ESLint would treat TypeScript code as invalid JS.
  parser: '@typescript-eslint/parser',

  // Extend base configs:
  // - '@react-native': recommended ESLint rules for React Native projects
  // - 'plugin:prettier/recommended': integrates Prettier with ESLint,
  //   ensures formatting conflicts between ESLint and Prettier are avoided
  extends: ['@react-native', 'plugin:prettier/recommended'],

  // Override or add rules only for specific file types
  overrides: [
    {
      // Target all TypeScript source files
      files: ['*.ts', '*.tsx'],
      rules: {
        // Disable the default "no-undef" rule.
        // TypeScript compiler already checks for undefined variables,
        // so this rule is redundant and can cause false positives.
        'no-undef': 'off',
        // Disable the base JS "no-shadow" rule
        // (it doesn't handle TS properly and may conflict).
        'no-shadow': 'off',
        // Replace it with the TypeScript-aware version.
        // This ensures variables aren't accidentally shadowed
        // (e.g., inner scope variable hides outer scope variable).
        '@typescript-eslint/no-shadow': ['error'],
      },
    },
  ],
}
