import type { AuthState } from './authState/authState.types.ts'
import type { ThemeState } from './themeState/themeState.types.ts'
import type { ICurrentUser } from './currentUser/currentUser.types.ts'
import type { IGalleryState } from './galleryOpen/galleryOpen.types.ts'
import type { InternetState } from './internetState/internetState.types'

export interface RootState {
  authState: AuthState
  themeState: ThemeState
  currentUser: ICurrentUser
  galleryState: IGalleryState
  internetState: InternetState
}
