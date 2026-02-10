import { createContext, useContext } from 'react'
import { IBackupsPoliciesContext } from './Types'

export const Context = createContext<IBackupsPoliciesContext>({} as IBackupsPoliciesContext)
export const BackupsPoliciesProvider = Context.Provider

export const useBackupsPoliciesContext = () => {
    const context = useContext(Context)
    if (context === undefined) {
        alert("Ocurrió un error al solicitar el Context - Solicitar ayuda a Cloud Innovation")
    } return context
}
