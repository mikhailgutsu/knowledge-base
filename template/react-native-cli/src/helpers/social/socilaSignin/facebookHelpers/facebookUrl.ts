export const facebookUrl = (accessToken: string): string => {
  return `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`
}
