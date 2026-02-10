import { useCallback, useState } from "react"
import { AutomationService } from "../../../services/Automation.service"
import { IDifferencesPrePostLinux, IListHistoricPatches, IListLogsPrePostLinux, IListServerAssigned, IListServerAssignedLinux, IListServerUnified, IResultSearchLinux, ISearchFilter, IServerInformation, IUpdateIP, IUseServer, initialServerInfo } from "../Types"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../../../helpers/handleAxiosError"
import { errorNotification, successNotification } from "../../../helpers/notifications"
import { formatToDataList } from "../../../helpers/general"
import { IDataListFormat } from "../../../helpers/Types"

const useServer = (): IUseServer => {

    //Estados para el metodo listar los servidores de un ClienteProyecto unificado (si un server tiene +2 grupos trae un solo registro)
    const [getServersUnifiedLoading, setServersUnifiedLoading] = useState(false)
    const [serversUnifiedData, setServersUnifiedData] = useState<IListServerUnified[]>([])
    //Estados para el metodo obtener la informacion de un servidor
    const [getServersInfoLoading, setServersInfoLoading] = useState(false)
    const [serverInformationData, setServerInformationData] = useState<IServerInformation>(initialServerInfo)
    //Estados para el metodo obtener la informacion de un servidor Linux
    const [getServersInfoLinuxLoading, setServersInfoLinuxLoading] = useState(false)
    const [serverInformationLinuxData, setServerInformationLinuxData] = useState<IServerInformation>(initialServerInfo)
    //Estados para el metodo obtener la lista de servidores asignados
    const [getServersAssignedLoading, setServersAssignedLoading] = useState(false)
    const [serverAssignedData, setServerAssignedData] = useState<IListServerAssigned[]>([])
    //Estados para el metodo obtener la lista de servidores asignados Linux
    const [getServersAssignedLinuxLoading, setServersAssignedLinuxLoading] = useState(false)
    const [serverAssignedLinuxData, setServerAssignedLinuxData] = useState<IListServerAssignedLinux[]>([])
    //Estados para el metodo obtener parches historicos de un Servidor
    const [getHistoricPatchesLoading, setHistoricPatchesLoading] = useState(false)
    const [historicPatches, setHistoricPatchesa] = useState<IListHistoricPatches[]>([])
    //Estado para saber el estado de carga del request actualizar ip utilizada de un servidor
    const [updateIPLoading, setUpdateLoading] = useState(false)
    //Estados para el metodo obtener la lista de exclusiones
    const [getExclusionsLoading, setExclusionsLoading] = useState(false)
    const [exclusionsData, setExclusionsData] = useState<IDataListFormat[]>([])
    //Estados para el metodo obtener la lista de categorias_suse
    const [getSuseCategoriesLoading, setSuseCategoriesLoading] = useState(false)
    const [suseCategoriesData, setCategoriesData] = useState<IDataListFormat[]>([])
    //Estados para el metodo obtener la lista de severidad_suse
    const [getSuseSeverityLoading, setSuseSeverityLoading] = useState(false)
    const [suseSeverityData, setSuseSeverityData] = useState<IDataListFormat[]>([])
    //Estado para obtener los logs pre post de lun server linux
    const [getLogsPrePostLinuxLoading, setLogsPrePostLinuxLoading] = useState(false)
    //Estado para obtener las diferencias de pre post de un server linux en una ejecucion
    const [getDifferencesPrePostLinuxLoading, setDiferencePrePostLoading] = useState(false)
    //Estado para obtener las diferencias de pre post de un server linux en una ejecucion
    const [getResultSearchLinuxLoading, setResultSearchLinuxLoading] = useState(false)

    const getListOfServersUnified = useCallback(async function (nameClient: string, idProject: number) {
        setServersUnifiedLoading(true)
        try {
            const response = await AutomationService.getServersByClientProject(nameClient, idProject.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setServersUnifiedData(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setServersUnifiedLoading(false)
        }
    }, [])

    const getServerInformation = useCallback(async function (idServer: number) {
        setServersInfoLoading(true)
        try {
            const response = await AutomationService.getServerInformation(idServer.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setServerInformationData(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setServersInfoLoading(false)
        }
    }, [])


    const getServerInformationLinux = useCallback(async function (idServer: number) {
        setServersInfoLinuxLoading(true)
        try {
            const response = await AutomationService.getServerInformationLinux(idServer.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setServerInformationLinuxData(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setServersInfoLinuxLoading(false)
        }
    }, [])

    const getServersAssigned = useCallback(async function (nameClient: string, idProject: number) {
        setServersAssignedLoading(true)
        try {
            const response = await AutomationService.getServersAssigned(nameClient, idProject.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setServerAssignedData(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setServersAssignedLoading(false)
        }
    }, [])

    const getServersAssignedLinux = useCallback(async function (nameClient: string, idProject: number) {
        setServersAssignedLinuxLoading(true)
        try {
            const response = await AutomationService.getServersAssignedLinux(nameClient, idProject.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setServerAssignedLinuxData(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setServersAssignedLinuxLoading(false)
        }
    }, [])

    const getHistoricPatches = useCallback(async function (idServer: number) {
        setHistoricPatchesLoading(true)
        try {
            const response = await AutomationService.getListHistoricPatches(idServer.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setHistoricPatchesa(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setHistoricPatchesLoading(false)
        }
    }, [])

    const updateIPOfServer = useCallback(async function (newIP: IUpdateIP) {
        setUpdateLoading(true)
        try {
            const response = await AutomationService.updateIP(newIP)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se actualizó la ip exitosamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setUpdateLoading(false)
        }
    }, [])

    const getExclusions = useCallback(async function () {
        setExclusionsLoading(true)
        try {
            const response = await AutomationService.getDataFromMonitorOptions({
                tabla: "exclusion",
                filtro: "",
            })
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setExclusionsData(formatToDataList(response.data.lista))
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setExclusionsLoading(false)
        }
    }, [])

    const getSuseCategories = useCallback(async function () {
        setSuseCategoriesLoading(true)
        try {
            const response = await AutomationService.getDataFromMonitorOptions({
                tabla: "suse_os_categoria",
                filtro: "",
            })
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setCategoriesData(formatToDataList(response.data.lista))
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setSuseCategoriesLoading(false)
        }
    }, [])

    const getSuseSeverities = useCallback(async function () {
        setSuseSeverityLoading(true)
        try {
            const response = await AutomationService.getDataFromMonitorOptions({
                tabla: "suse_os_severidad",
                filtro: "",
            })
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setSuseSeverityData(formatToDataList(response.data.lista))
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setSuseSeverityLoading(false)
        }
    }, [])

    const getPhotoPrePostByServerLinux = useCallback(async function (nroTicket: string, idServer: number): Promise<IListLogsPrePostLinux | undefined> {
        setLogsPrePostLinuxLoading(true)
        try {
            const response = await AutomationService.getPhotoPrePostByServerLinux(nroTicket, idServer.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                return response.data.lista
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLogsPrePostLinuxLoading(false)
        }
    }, [])

    const getDifferencesPrePostLinux = useCallback(async function (idExecution: number, idServer: number): Promise<IDifferencesPrePostLinux | undefined> {
        setDiferencePrePostLoading(true)
        try {
            const response = await AutomationService.getDifferencesPrePostLinux(idExecution.toString(), idServer.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                return response.data.lista
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setDiferencePrePostLoading(false)
        }
    }, [])

    const getResultSearchLinux = useCallback(async function (searchFilter: ISearchFilter): Promise<IResultSearchLinux[] | undefined> {
        setResultSearchLinuxLoading(true)
        try {
            const response = await AutomationService.getResultSearchLinux(searchFilter)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                return response.data.lista
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setResultSearchLinuxLoading(false)
        }
    }, [])


    return {
        getListOfServersUnified, getServersUnifiedLoading, serversUnifiedData,
        getServerInformation, getServersInfoLoading, serverInformationData,
        getServersAssigned, getServersAssignedLoading, serverAssignedData,
        getHistoricPatches, getHistoricPatchesLoading, historicPatches,
        updateIPOfServer, updateIPLoading,
        getServersAssignedLinux, getServersAssignedLinuxLoading, serverAssignedLinuxData,
        getServerInformationLinux, getServersInfoLinuxLoading, serverInformationLinuxData,
        getExclusions, getExclusionsLoading, exclusionsData,
        getSuseCategories, getSuseCategoriesLoading, suseCategoriesData,
        getSuseSeverities, getSuseSeverityLoading, suseSeverityData,
        getPhotoPrePostByServerLinux, getLogsPrePostLinuxLoading,
        getDifferencesPrePostLinux, getDifferencesPrePostLinuxLoading,
        getResultSearchLinux, getResultSearchLinuxLoading
    }
}
export { useServer }