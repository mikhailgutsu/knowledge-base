import { appleAuthSingin, androidAppleAuthSignin } from './appleHelpers'

import { OS } from 'src/constants'

export const appleSingin = OS === 'ios' ? appleAuthSingin : androidAppleAuthSignin
