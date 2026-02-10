import { createContext, useContext } from 'react'
import { IWindowsPatchContext } from '../Types'

export const Context = createContext<IWindowsPatchContext>({} as IWindowsPatchContext)
export const WindowsPatchProvider = Context.Provider

export const useWindowsPatchContext = () => {
    const context = useContext(Context)
    if (context === undefined) {
        alert("Ocurrió un error al solicitar el Context - Solicitar ayuda a Cloud Innovation")
    } return context
}
