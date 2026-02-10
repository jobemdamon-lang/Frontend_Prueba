import { createContext, useContext } from 'react'
import { IMonitoringPoliciesContext } from './Types'

export const Context = createContext<IMonitoringPoliciesContext>({} as IMonitoringPoliciesContext)
export const MonitoringPoliciesProvider = Context.Provider

export const useMonitoringPoliciesContext = () => {
    const context = useContext(Context)
    if (context === undefined) {
        alert("Ocurrió un error al solicitar el Context - Solicitar ayuda a Cloud Innovation")
    } return context
}
