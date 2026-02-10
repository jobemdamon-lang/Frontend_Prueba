import { createContext, useContext } from 'react'
import { ILinuxPatchContext } from '../Types'

export const Context = createContext<ILinuxPatchContext>({} as ILinuxPatchContext)
export const LinuxPatchProvider = Context.Provider

export const useLinuxPatchContext = () => {
    const context = useContext(Context)
    if (context === undefined) {
        alert("Ocurrió un error al solicitar el Context - Solicitar ayuda a Cloud Innovation")
    } return context
}
