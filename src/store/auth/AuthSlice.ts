import { createSlice } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { IAuthState } from './Types'

const initialAuthState: IAuthState = {
   cargo: "",
   foto: "",
   mensaje: "",
   nombre: "",
   status: "",
   token: "",
   usuario: "",
   permission: []
}

const authSlice = createSlice({
   name: 'auth',
   initialState: initialAuthState,
   reducers: {
      actionLogin: (state, action) => {
         state.cargo = action.payload.cargo
         state.foto = action.payload.foto
         state.mensaje = action.payload.mensaje
         state.nombre = action.payload.nombre
         state.status = action.payload.status
         state.token = action.payload.token
         state.usuario = action.payload.usuario
         state.permission = action.payload.permission
      },
      actionUpdateToken: (state, action) => {
         state.token = action.payload;
       },
      actionLogout: () => initialAuthState
   },
})

export const authReducer = persistReducer(
   { storage, key: 'v100-canvia-auth', whitelist: ['usuario', 'token', 'permission', 'nombre', 'foto', 'cargo'] },
   authSlice.reducer
)

export const { actionLogin, actionLogout } = authSlice.actions
