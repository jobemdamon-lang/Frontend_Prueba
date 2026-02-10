import { createContext, useContext } from 'react'
import { IUserAdministrationContext } from './Types'

export const Context = createContext<IUserAdministrationContext>({} as IUserAdministrationContext)
export const UserAdministrationProvider = Context.Provider

export const useUserAdministrationContext = () => {
    const context = useContext(Context)
    if (context === undefined) {
        alert("Ocurrió un error al solicitar el Context - Solicitar ayuda a Cloud Innovation")
    } return context
}
