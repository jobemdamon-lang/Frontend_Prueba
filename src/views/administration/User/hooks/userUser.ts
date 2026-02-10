import { useCallback, useState } from "react"
import { IUpdateUser, IUserPermissionArea, IUserPermissionPersonal, IUseUserAdministration, PayloadAssignProfileUser, UserInformation } from "../Types"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../../../../helpers/handleAxiosError"
import { AdministrationService } from "../../../../services/Administration.service"
import { successNotification } from "../../../../helpers/notifications"

const useUserAdministration = (): IUseUserAdministration => {

    const [users, setUsers] = useState<UserInformation[]>([])
    const [getUsersLoading, setGetUsersLoading] = useState(false)
    const [updateUserLoading, setUpdateUserLoading] = useState(false)
    const [usersPermissions, setUserPermissions] = useState<{ byArea: IUserPermissionArea[], personal: IUserPermissionPersonal[] }>({ byArea: [], personal: [] })
    const [getUserPermissionsLoading, setUserPermissionsLoading] = useState(false)
    const [assignProfileUserLoading, setAssignProfileUserLoading] = useState(false)

    const getUsers = useCallback(async function () {
        setGetUsersLoading(true)
        try {
            const response = await AdministrationService.getUsers()
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setUsers(response.data.lista)
            }
        } catch (e) {
            setUsers([])
        } finally {
            setGetUsersLoading(false)
        }
    }, [])

    const updateUser = useCallback(async function (data: IUpdateUser) {
        setUpdateUserLoading(true)
        try {
            const response = await AdministrationService.updateUser(data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje)
                return true
            }
        } catch (e) {
            handleAxiosError(e)
            return undefined
        } finally {
            setUpdateUserLoading(false)
        }
    }, [])

    const getPermissionsPerUser = useCallback(async function (idUser: number) {
        setUserPermissionsLoading(true)
        try {
            const response = await AdministrationService.getPermissionsPerUser(idUser.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                const permissions = response.data.lista[0]
                if (permissions.perfil_area) {
                    setUserPermissions(prev => ({ ...prev, byArea: permissions.perfil_area }))
                }
                if (permissions.perfil_usuario) {
                    setUserPermissions(prev => ({ ...prev, personal: permissions.perfil_usuario }))
                }
            }
        } catch (e) {
            setUserPermissions({ byArea: [], personal: [] })
        } finally {
            setUserPermissionsLoading(false)
        }
    }, [])

    const assignProfileUser = useCallback(async function (data: PayloadAssignProfileUser) {
        setAssignProfileUserLoading(true)
        try {
            const response = await AdministrationService.assignProfileUser(data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje)
                return true
            }
        } catch (e) {
            handleAxiosError(e)
            return undefined
        } finally {
            setAssignProfileUserLoading(false)
        }
    }, [])

    return {
        getUsers, users, getUsersLoading,
        updateUser, updateUserLoading,
        getPermissionsPerUser, usersPermissions, getUserPermissionsLoading,
        assignProfileUser, assignProfileUserLoading
    }
}

export { useUserAdministration }