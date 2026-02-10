import { createContext, useContext } from 'react'
import { IServerProvisioningContext } from '../Types'

export const Context = createContext<IServerProvisioningContext>({} as IServerProvisioningContext)
export const ServerProvisioningProvider = Context.Provider

export const useServerProvisioningContext = () => {
    const context = useContext(Context)
    if (context === undefined){
        alert("Ocurrió un error al solicitar el Context - Solicitar ayuda a Cloud Innovation")
    } return context
}
