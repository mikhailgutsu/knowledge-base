import { createAction } from '@reduxjs/toolkit'

import { IGalleryState } from './galleryOpen.types'

const SAVE_GALLERY_STATE = 'SAVE_GALLERY_STATE'

export const saveGalleryState = createAction<IGalleryState>(SAVE_GALLERY_STATE)
