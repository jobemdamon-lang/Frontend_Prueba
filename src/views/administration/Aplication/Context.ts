import { createContext, useContext } from 'react'
import { IAplicationContext } from '../Types'

export const Context = createContext<IAplicationContext>({} as IAplicationContext)
export const AplicationProvider = Context.Provider

export const useAplicationContext = () => {
    const context = useContext(Context)
    if (context === undefined) {
        alert("Ocurrió un error al solicitar el Context - Solicitar ayuda a Cloud Innovation")
    } return context
}
