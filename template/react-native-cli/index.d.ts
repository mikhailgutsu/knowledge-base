// Declare a module for "react-native-config"
// This tells TypeScript how to type-check imports from that package.
// Without this, TypeScript would treat it as "any" because the package
// does not ship with strong type definitions by default.
declare module 'react-native-config' {
  // Define the shape of our environment variables.
  // Each key corresponds to a variable we expect in our .env files.
  export interface NativeConfig {
    API: string

    USER_TOKEN: string
    TEMPORARY_TOKEN: string

    GOOGLE_SIGNIN_WEB_CLIENT_ID: string
    GOOGLE_SIGNIN_IOS_CLIENT_ID: string

    SERVICE_CLIENT_ID: string
    SERVICE_REDIRECT_URI: string
  }

  // Export a named constant Config with that shape.
  // Allows imports like: `import { Config } from 'react-native-config'`
  export const Config: NativeConfig
  // Export the same thing as default.
  // Allows imports like: `import config from 'react-native-config'`
  export default Config
}

// Utility type AtLeast<T, K>
// Ensures that at least the keys K from T are required,
// while the rest of the properties in T remain optional.
// Example: AtLeast<User, "id"> means "must have id, others optional".
type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>
