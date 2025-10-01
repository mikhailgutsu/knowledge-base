module.exports = {
  // Use the official React Native Babel preset
  // This preset configures Babel to transform modern JS/TS + JSX
  // into code that React Native's Metro bundler can run.
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Configure custom import paths with module-resolver
    [
      'module-resolver',
      {
        // Root directory for resolving imports
        root: ['.'],

        // File extensions that can be omitted in imports
        // (so you can write "import x from './file'" without ".ts")
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],

        // Define path aliases for cleaner imports
        alias: {
          '@env': './env.ts',                     // Environment variables wrapper
          '@api': './src/api',                    // API layer
          '@hooks': './src/hooks',                // Custom React hooks
          '@store': './src/store',                // State management (Redux/Context)
          '@theme': './src/theme',                // Styling / theme tokens
          '@assets': './src/assets',              // Images, fonts, static files
          '@helpers': './src/helpers',            // Utility functions
          '@screens': './src/screens',            // App screens
          '@storage': './src/storage',            // AsyncStorage or persistence logic
          '@typings': './src/typings',            // TypeScript type definitions
          '@firebase': './src/firebase',          // Firebase integration
          '@navigation': './src/navigation',      // Navigation configuration
          '@components': './src/components',      // Shared UI components
          '@endpoints': './src/endpoints.ts',     // API endpoints map
          '@translations': './src/translations',  // i18n translations
        },
      },
    ],
    // Required for react-native-reanimated
    // Must be listed LAST according to Reanimated's setup guide.
    // Handles transforming "worklets" into special bytecode
    // so animations can run on the UI thread for performance.
    'react-native-reanimated/plugin',
  ],
}
