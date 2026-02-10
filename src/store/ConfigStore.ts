import { configureStore } from '@reduxjs/toolkit'
import { reduxBatch } from '@manaflair/redux-batch'
import { persistStore } from 'redux-persist'
import { authReducer } from './auth/AuthSlice'
import  offCanvasReducer  from './offcanvasSlice'
import { TypedUseSelectorHook, useSelector } from 'react-redux'

const configStore = configureStore({
   reducer: {
      auth: authReducer,
      offCanvas: offCanvasReducer
   },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
   devTools: process.env.NODE_ENV !== 'production',
   enhancers: [reduxBatch],
})

export type RootState = ReturnType<typeof configStore.getState>
export const persistor = persistStore(configStore)
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export default configStore
