import { createContext, useContext } from 'react'
import { IIncidentsContext } from '../Types'

export const Context = createContext<IIncidentsContext>({} as IIncidentsContext)
export const IncidentProvider = Context.Provider
export const useIncidentContext = () => {
    const context = useContext(Context)
    if (context === undefined){
        alert("Ocurrió un error al solicitar el Context - Solicitar ayuda a Cloud Innovation")
    } return context
}
