import { createContext, useContext } from 'react'
import { IProjectSubmoduleContext } from '../Types'

export const Context = createContext<IProjectSubmoduleContext>({} as IProjectSubmoduleContext)
export const ConfigurationItemsProvider = Context.Provider

export const useProjectSubModuleContext = () => {
    const context = useContext(Context)
    if (context === undefined) {
        alert("Ocurrió un error al solicitar el Context - Solicitar ayuda a Cloud Innovation")
    } return context
}
