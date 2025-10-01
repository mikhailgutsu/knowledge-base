// Import helper to integrate Reanimated with Metro
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config')

// Metro’s built-in default config and utility to merge custom changes
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')

/**
 * Metro configuration
 * Metro is the bundler that React Native uses to transform and serve your code.
 * Docs: https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname)
// Generate default config for the current project root

// Define project-specific overrides/extensions
const customConfig = {
  resolver: {
    // Extend the list of file extensions Metro will resolve
    // Default already includes js/jsx; here we explicitly add:
    // - 'json': so you can import JSON files directly
    // - 'ts'/'tsx': for TypeScript support
    sourceExts: [...defaultConfig.resolver.sourceExts, 'json', 'ts', 'tsx'],
  },
  transformer: {
    // Override Babel transformer to handle QR code SVG text encoding
    // react-native-qrcode-svg needs this for proper QR text rendering
    babelTransformerPath: require.resolve(
      'react-native-qrcode-svg/textEncodingTransformation'
    ),
  },
}

// Merge defaults with custom changes to avoid overriding other Metro internals
const mergedConfig = mergeConfig(defaultConfig, customConfig)


// Wrap config with Reanimated’s special requirements
// Ensures Reanimated’s Babel plugin + worklets are handled correctly in Metro
module.exports = wrapWithReanimatedMetroConfig(mergedConfig)
