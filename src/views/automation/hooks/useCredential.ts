import { useCallback, useState } from "react"
import { AutomationService } from "../../../services/Automation.service"
import { ICreateCredential, IListCredential, IBodyServersCredential, IUpdateCredential, initialCredential, initialCredentialUpdate, IListServersCredential, IBodyAssignCredential, IUseCredential } from "../Types"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../../../helpers/handleAxiosError"
import { errorNotification, successNotification } from "../../../helpers/notifications"

const useCredential = (): IUseCredential => {

    //Estado para manejar la nueva credencial
    const [newCredential, setNewCredential] = useState<ICreateCredential>(initialCredential)
    //Estado para manejar la actualización de una credencial
    const [credentialToUpdate, setCredentialToUpdate] = useState<IUpdateCredential>(initialCredentialUpdate)
    //Estados para el metodo listar credenciales
    const [getCredentialsLoading, setCredentialsdLoading] = useState(false)
    const [credentialsData, setCredentialsData] = useState<IListCredential[]>([])
    //Estados para el metodo crear Credencial
    const [createCredentialLoading, setCreateCredentialLoading] = useState(false)
    //Estados para el metodo crear Credencial
    const [createCredentialLinuxLoading, setCreateCredentialLinuxLoading] = useState(false)
    //Estados para el metodo actualizar Credencial
    const [updateCredentialLoading, setUpdateCredentialLoading] = useState(false)
    //Estados para el metodo eliminar Credencial
    const [deleteCredentialLoading, setDeleteCredentialLoading] = useState(false)
    //Estados para el metodo listar servidores con o sin Credencial
    const [serverWithCredentialLoading, setServersWithCredentialLoading] = useState(false)
    const [serversWithCredentialData, setServersWithCredentialsData] = useState<IListServersCredential[]>([])
    //Estados para el metodo listar servidores con o sin Credencial
    const [serverWithoutCredentialLoading, setServersWithoutCredentialLoading] = useState(false)
    const [serversWithoutCredentialData, setServersWithoutCredentialsData] = useState<IListServersCredential[]>([])
    //Estados para asignar equipos a una Credencial
    const [assignServerToCredentialsLoading, setAssignServersToCredentialLoading] = useState(false)
    //Estados para el metodo eliminar Credencial de un Equipo
    const [deleteCredentialOfServerLoading, setDeleteCredentialOfServerLoading] = useState(false)


    //Funciones para actualizar las propiedades de la credencial
    const updatePassword = (newvalue: string) => setNewCredential((prev) => ({ ...prev, clave: newvalue }))
    const updateUserName = (newvalue: string) => setNewCredential((prev) => ({ ...prev, usuario: newvalue }))
    const updateNameCredential = (newvalue: string) => setNewCredential((prev) => ({ ...prev, nombre: newvalue }))
    const updateDescription = (newvalue: string) => setNewCredential((prev) => ({ ...prev, descripcion: newvalue }))
    const newCredentialsFuncs = { updatePassword, updateUserName, updateNameCredential, updateDescription, setNewCredential }

    //Funciones para actualizar las propiedades de la credencial
    const updatedPassword = (newvalue: string) => setCredentialToUpdate((prev) => ({ ...prev, clave: newvalue }))
    const updatedUserName = (newvalue: string) => setCredentialToUpdate((prev) => ({ ...prev, usuario: newvalue }))
    const updatedNameCredential = (newvalue: string) => setCredentialToUpdate((prev) => ({ ...prev, nombre: newvalue }))
    const updatedDescription = (newvalue: string) => setCredentialToUpdate((prev) => ({ ...prev, descripcion: newvalue }))
    const updateCredentialsFuncs = { updatedPassword, updatedUserName, updatedNameCredential, updatedDescription, setCredentialToUpdate }

    const getListCredentials = useCallback(async function () {
        setCredentialsdLoading(true)
        try {
            const response = await AutomationService.getListCredentials()
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setCredentialsData(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setCredentialsdLoading(false)
        }
    }, [])

    const createCredential = useCallback(async function (newCredential: ICreateCredential) {
        setCreateCredentialLoading(true)
        try {
            const response = await AutomationService.createCredential(newCredential)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se creó la credencial exitosamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setCreateCredentialLoading(false)
        }
    }, [])

    const updateCredential = useCallback(async function (updatedCredential: IUpdateCredential) {
        setUpdateCredentialLoading(true)
        try {
            const response = await AutomationService.updateCredential(updatedCredential)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se actualizó la credencial exitosamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setUpdateCredentialLoading(false)
        }
    }, [])

    const deleteCredential = useCallback(async function (idCredential: number) {
        setDeleteCredentialLoading(true)
        try {
            const response = await AutomationService.deleteCredential(idCredential.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setDeleteCredentialLoading(false)
        }
    }, [])

    const getServersWithCredential = useCallback(async function (whoServerWants: IBodyServersCredential) {
        setServersWithCredentialLoading(true)
        try {
            const response = await AutomationService.getListServersWithORWithoutCredential(whoServerWants)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data[0].status)) {
                setServersWithCredentialsData(response.data[0].lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setServersWithCredentialLoading(false)
        }
    }, [])

    const getServersWithoutCredential = useCallback(async function (whoServerWants: IBodyServersCredential) {
        setServersWithoutCredentialLoading(true)
        try {
            const response = await AutomationService.getListServersWithORWithoutCredential(whoServerWants)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data[0].status)) {
                setServersWithoutCredentialsData(response.data[0].lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setServersWithoutCredentialLoading(false)
        }
    }, [])

    const AssignServersToCredential = useCallback(async function (serversToAssign: IBodyAssignCredential) {
        setAssignServersToCredentialLoading(true)
        try {
            const response = await AutomationService.assignServerToCredential(serversToAssign)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data[0].status)) {
                successNotification("Se asignaron los servidores a la credencial exitosamente"); return true
            } else {
                errorNotification(response.data[0].mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setAssignServersToCredentialLoading(false)
        }
    }, [])

    const deleteCredentialOfServer = useCallback(async function (idCredencial: number, idServer: number) {
        setDeleteCredentialOfServerLoading(true)
        try {
            const response = await AutomationService.deleteCredentialOfServer(idCredencial.toString(), idServer.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data[0].status)) {
                successNotification("Se eliminó la credencial del servidor exitosamente"); return true
            } else {
                errorNotification(response.data[0].mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setDeleteCredentialOfServerLoading(false)
        }
    }, [])

    const createCredentialLinux = useCallback(async function (newCredential: ICreateCredential) {
        setCreateCredentialLinuxLoading(true)
        try {
            const response = await AutomationService.createCredentialLinux(newCredential)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se creó la credencial exitosamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setCreateCredentialLinuxLoading(false)
        }
    }, [])

    return {
        newCredential, newCredentialsFuncs,
        credentialToUpdate, updateCredentialsFuncs,
        getListCredentials, getCredentialsLoading, credentialsData,
        createCredential, createCredentialLoading,
        updateCredential, updateCredentialLoading,
        deleteCredential, deleteCredentialLoading,
        getServersWithCredential, serverWithCredentialLoading, serversWithCredentialData,
        getServersWithoutCredential, serverWithoutCredentialLoading, serversWithoutCredentialData,
        AssignServersToCredential, assignServerToCredentialsLoading,
        deleteCredentialOfServer, deleteCredentialOfServerLoading,
        createCredentialLinux, createCredentialLinuxLoading
    }
}
export { useCredential }