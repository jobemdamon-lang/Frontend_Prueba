import { createContext, useContext } from 'react'
import { IAdministrateCMDBContext } from '../Types'

export const Context = createContext<IAdministrateCMDBContext>({} as IAdministrateCMDBContext)
export const AdministrateCMDBProvider = Context.Provider
export const useAdministrateCMDBContext = () => {
    const context = useContext(Context)
    if (context === undefined){
        alert("Ocurrió un error al solicitar el Context - Solicitar ayuda a Cloud Innovation")
    } return context
}
