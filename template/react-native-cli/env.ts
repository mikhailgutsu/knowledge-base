// Import the "react-native-config" library.
// This gives us access to environment variables defined in .env files
// (e.g., .env.development, .env.production).
// The library injects these values into the native build (Android/iOS),
// so they can be accessed in JS/TS code.
import config from 'react-native-config'

// Centralize environment variables in one object.
// This makes it easier to manage, type-check, and swap environments later.
const env = {
  // Base API URL used for network requests
  API: config.API,

  // Tokens used for authentication/authorization flows
  USER_TOKEN: config.USER_TOKEN,
  TEMPORARY_TOKEN: config.TEMPORARY_TOKEN,

  // Google Sign-In client IDs for Web and iOS
  // Needed to configure Google login for different platforms
  GOOGLE_SIGNIN_WEB_CLIENT_ID: config.GOOGLE_SIGNIN_WEB_CLIENT_ID,
  GOOGLE_SIGNIN_IOS_CLIENT_ID: config.GOOGLE_SIGNIN_IOS_CLIENT_ID,

  // Service-related OAuth credentials
  SERVICE_CLIENT_ID: config.SERVICE_CLIENT_ID,
  SERVICE_REDIRECT_URI: config.SERVICE_REDIRECT_URI,
}

// Export the env object as default
// Other files can now import from "env.ts" instead of using react-native-config directly.
// This ensures consistency and allows us to enforce typing in one place.
export default env
