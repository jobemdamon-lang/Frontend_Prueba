import { createSlice } from '@reduxjs/toolkit'
/* import { IAuthState } from './Types' */

const initialCanvasState = {
   isOffCanvasOpen: false
}

const offCanvasSlice = createSlice({
   name: 'offCanvas',
   initialState: initialCanvasState,
   reducers: {
      openOffCanvas: (state) => {
         state.isOffCanvasOpen = true
      },
      closeOffCanvas: (state) => {
        state.isOffCanvasOpen = false
      }
   },
})

export default offCanvasSlice.reducer

export const { openOffCanvas, closeOffCanvas } = offCanvasSlice.actions
