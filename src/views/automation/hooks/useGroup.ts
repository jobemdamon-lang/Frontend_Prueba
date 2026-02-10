import { useCallback, useState } from "react"
import { AutomationService } from "../../../services/Automation.service"
import { IAssignServerToGroup, ICreateGroup, IGroupsWithServersLinux, IGroupsWithServersWithPatches, IListGroup, IListTemplate, IReassignTemplateOfGroup, IUpdateGroupName, IUseGroup, OPERATE_SYSTEMS, initialLinuxFormConfigurationData } from "../Types"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../../../helpers/handleAxiosError"
import { errorNotification, successNotification } from "../../../helpers/notifications"

const useGroup = (): IUseGroup => {

    //Estados para la asignacion de servidores a un Grupo
    const [assignServerLoading, setAssignServerLoading] = useState(false)
    //Estados para el metodo crear un nuevo grupo
    const [isCreateLoading, setIsCreateLoading] = useState(false)
    //Estados para el metodo listar los servidores de un Proyecto independientemente si tienen grupo o no
    const [getListGroupsServersPatchesLoading, setListGroupsServersPatchesLoading] = useState(false)
    const [groupsServerPatchesData, setGroupsServersPatchesData] = useState<IGroupsWithServersWithPatches[]>([])
    //Estados para el metodo listar los servidores de un Proyecto independientemente si tienen grupo o no
    const [getListGroupsServersLinux, getListGroupsServersLinuxLoading] = useState(false)
    const [groupsServerLinuxData, setGroupsServersLinuxData] = useState<IGroupsWithServersLinux[]>([])
    const [linuxFormConfigurationData, setLinuxFormConfigurationData] = useState(initialLinuxFormConfigurationData)
    //Estados para el metodo listar los Grupos
    const [getListGroupsLoading, setListGroupsLoading] = useState(false)
    const [groupsData, setGroupsData] = useState<IListGroup[]>([])
    //Estados para el metodo eliminar servidor de un Grupo
    const [deleteServerInGroupLoading, setDeleteServerInGroupLoading] = useState(false)
    //Estados para el metodo obtener template asociado a una plantilla
    const [getTemplateOfGroupLoading, setTemplateOfGroupLoading] = useState(false)
    const [templateAsociatedToGroup, setTemplateAsociatedToGroup] = useState<IListTemplate[]>([])
    //Estados para el metodo para reasignar un template de un grupo
    const [reassignTemplateOfGroupLoading, setReassignTemplateOfGroupLoading] = useState(false)
    //Estados para el metodo para actualizar el nombre del Grupo
    const [changeGroupNameLoading, setChangeGroupNameLoading] = useState(false)
    //Estados para el metodo eliminar servidor de un Grupo
    const [deleteServerInGroupLinuxLoading, setDeleteServerInGroupLinuxLoading] = useState(false)
    //Estado para deshabilitar un grupo
    const [dehabilitateGroupLoading, setDehabilitateGroupLoading] = useState(false)

    const createGroup = useCallback(async function (newGroup: ICreateGroup) {
        setIsCreateLoading(true)
        try {
            const response = await AutomationService.createGroup(newGroup)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se creó el grupo exitosamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setIsCreateLoading(false)
        }
    }, [])

    const assignServerToGroup = useCallback(async function (serversData: IAssignServerToGroup) {
        setAssignServerLoading(true)
        try {
            const response = await AutomationService.assignServerToGroup(serversData)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se asignaron los servidores al grupo exitosamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setAssignServerLoading(false)
        }
    }, [])

    const getListGroupsWithServers = useCallback(async function (nameClient: string, idProject: number) {
        setListGroupsServersPatchesLoading(true)
        try {
            const response = await AutomationService.getGroupsServersPatches(nameClient, idProject.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setGroupsServersPatchesData(response.data.lista?.reverse())
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setListGroupsServersPatchesLoading(false)
        }
    }, [])

    const getGroupsServersLinux = useCallback(async function (nameClient: string, idProject: number) {
        getListGroupsServersLinuxLoading(true)
        try {
            const response = await AutomationService.getGroupsServersLinux(nameClient, idProject.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setGroupsServersLinuxData(response.data.lista)
                setLinuxFormConfigurationData({
                    exclusions: response.data.lista_exclude.map((exclusion: any) => ({
                        id: exclusion.IDOPCION,
                        value: exclusion.ATRIBUTO?.toUpperCase()
                    })),
                    suse_categoria: response.data.lista_suse_priority.map((priority: any) => ({
                        id: priority.IDOPCION,
                        value: priority.ATRIBUTO?.toUpperCase()
                    })),
                    suse_severity: response.data.lista_suse_serverity.map((severity: any) => ({
                        id: severity.IDOPCION,
                        value: severity.ATRIBUTO?.toUpperCase()
                    })),
                })
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            getListGroupsServersLinuxLoading(false)
        }
    }, [])

    const getListGroups = useCallback(async function (so: OPERATE_SYSTEMS) {
        setListGroupsLoading(true)
        try {
            const response = await AutomationService.getListGroup(so)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setGroupsData(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setListGroupsLoading(false)
        }
    }, [])

    const deleteServerInGroup = useCallback(async function (idGroup: number, idServer: number) {
        setDeleteServerInGroupLoading(true)
        try {
            const response = await AutomationService.deleteServerInGroup(idGroup.toString(), idServer.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se eliminó el servidor del grupo exitosamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setDeleteServerInGroupLoading(false)
        }
    }, [])

    const getTemplateOfGroup = useCallback(async function (idGroup: number) {
        setTemplateOfGroupLoading(true)
        try {
            const response = await AutomationService.getTemplateOfGroup(idGroup.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setTemplateAsociatedToGroup(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setTemplateOfGroupLoading(false)
        }
    }, [])

    const reassignTemplate = useCallback(async function (groupToChange: IReassignTemplateOfGroup) {
        setReassignTemplateOfGroupLoading(true)
        try {
            const response = await AutomationService.reassignTemplate(groupToChange)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se reasignó de plantilla al grupo exitosamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setReassignTemplateOfGroupLoading(false)
        }
    }, [])

    const changeGroupName = useCallback(async function (idGroup: number, newGroupName: IUpdateGroupName) {
        setChangeGroupNameLoading(true)
        try {
            const response = await AutomationService.changeGroupName(idGroup.toString(), newGroupName)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se actualizaó el nombre del grupo exitosamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setChangeGroupNameLoading(false)
        }
    }, [])


    const deleteServerInGroupLinux = useCallback(async function (idGroup: number, idServer: number) {
        setDeleteServerInGroupLinuxLoading(true)
        try {
            const response = await AutomationService.deleteServerInGroupLinux(idGroup.toString(), idServer.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se eliminó el servidor del grupo exitosamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setDeleteServerInGroupLinuxLoading(false)
        }
    }, [])

    const dehabilitateGroup = useCallback(async function (idGroup: number) {
        setDehabilitateGroupLoading(true)
        try {
            const response = await AutomationService.dehabilitateGroup(idGroup.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se eliminó el grupo y sus relaciones correctamente."); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setDehabilitateGroupLoading(false)
        }
    }, [])

    return {
        createGroup, isCreateLoading,
        assignServerToGroup, assignServerLoading,
        getListGroupsWithServers, getListGroupsServersPatchesLoading, groupsServerPatchesData,
        getListGroups, getListGroupsLoading, groupsData,
        deleteServerInGroup, deleteServerInGroupLoading,
        getTemplateOfGroup, getTemplateOfGroupLoading, templateAsociatedToGroup,
        reassignTemplate, reassignTemplateOfGroupLoading,
        changeGroupName, changeGroupNameLoading,
        getGroupsServersLinux, getListGroupsServersLinux, groupsServerLinuxData, linuxFormConfigurationData,
        deleteServerInGroupLinux, deleteServerInGroupLinuxLoading,
        dehabilitateGroup, dehabilitateGroupLoading
    }
}
export { useGroup }