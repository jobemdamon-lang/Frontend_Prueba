import { createContext, useContext } from 'react'
import { IConfigurationItemsContext } from '../Types'

export const Context = createContext<IConfigurationItemsContext>({} as IConfigurationItemsContext)
export const ConfigurationItemsProvider = Context.Provider

export const useConfigurationItemsContext = () => {
    const context = useContext(Context)
    if (context === undefined){
        alert("Ocurrió un error al solicitar el Context - Solicitar ayuda a Cloud Innovation")
    } return context
}
