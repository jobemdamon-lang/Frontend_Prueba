import { createContext, useContext } from 'react'
import { IAdministrationContext } from './Types'

export const Context = createContext<IAdministrationContext>({} as IAdministrationContext)
export const AdministrationProvider = Context.Provider

export const useAdministrationContext = () => {
    const context = useContext(Context)
    if (context === undefined) {
        alert("Ocurrió un error al solicitar el Context - Solicitar ayuda a Cloud Innovation")
    } return context
}
