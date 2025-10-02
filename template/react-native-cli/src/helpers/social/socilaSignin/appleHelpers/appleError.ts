export const appleError = (error: unknown) => {
  if (__DEV__) {
    console.info('Apple SignIn Error:', error)
  }
}
