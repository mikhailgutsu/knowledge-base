import type { RootState } from '../store.types'

export const selectGalleryState = (state: RootState) => state.galleryState.state

