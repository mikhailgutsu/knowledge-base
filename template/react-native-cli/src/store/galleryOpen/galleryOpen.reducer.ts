import { createReducer, type PayloadAction } from '@reduxjs/toolkit'

import { IGalleryState } from './galleryOpen.types'
import { saveGalleryState } from './galleryOpen.actions'

const initialGalleryState: IGalleryState = {
  state: false,
}

const currentGalleryReducer = createReducer(initialGalleryState, (builder) => {
  builder.addCase(saveGalleryState, (state, action: PayloadAction<IGalleryState>) => {
    state.state = action.payload.state
  })
})

export default currentGalleryReducer
