export const facebookError = (error: unknown) => {
  if (__DEV__) {
    console.info('Facebook login error:', error)
  }
}
