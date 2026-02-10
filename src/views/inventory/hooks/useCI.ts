import { useCallback, useState } from "react"
import { InventoryService } from "../../../services/Inventory.service"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../../../helpers/handleAxiosError";
import { IAssignChildrenCI, ICombinedAttribute, IConfigurationItem, IConfigurationItemPlane, ICreateCI, IGetConfigurationItems, IOwners, IUpdateDynamicInformationCI, IUpdateGeneralInformation, IaddIP, IassignedIP, IuseCI, IAuditCILog } from "../Types";
import { errorNotification, successNotification, warningNotification } from "../../../helpers/notifications";
import { combinarRegistros, flattenAuditByIteration } from "./utils";
import { useTypedSelector } from "../../../store/ConfigStore";

const useCI = (): IuseCI => {

    //Estado para la request obtener lista CIs
    const [loadingListCI, setLoadindListCI] = useState(false)
    const [configurationItems, setConfigurationItems] = useState<IConfigurationItem[]>([])
    //Estado para la request obtener lista CIs
    const [loadingListCIPlane, setLoadindListCIPlane] = useState(false)
    const [configurationItemsPlane, setConfigurationItemsPlane] = useState<IConfigurationItemPlane[]>([])
    //Estado para la request obtener los valores y atributos dinamicos de un CI
    const [loadingListDynamicAttributes, setLoadingListDynamicAttributes] = useState(false)
    const [dynamicValuesOfAttributes, setValuesOfDynamicAttributes] = useState<ICombinedAttribute[]>([])
    //Estados para actualizar la información general de un CI
    const [loadingUpdateGeneralInformationCI, setLoadingGeneralInformationCI] = useState(false)
    //Estados para actualizar la información especifica (dinamica) de un CI
    const [loadingUpdateDynamicInformationCI, setLoadingDynamicInformationCI] = useState(false)
    //Estados para la creación de un CI
    const [loadingCreateCI, setLoadingCreateCI] = useState(false)
    //Estado para la request obtener la lista de IPs de un CI
    const [loadingIPsByCI, setLoadingIPsByCI] = useState(false)
    const [CIIps, setCIIps] = useState<IassignedIP[]>([])
    //Estados para la creación de una IP en un CI
    const [loadingAddIP, setLoadingAddIP] = useState(false)
    //Estados para la asignacion de hijos CI de un CI
    const [loadingAssignChildrensCI, setLoadingAssignChildrensCI] = useState(false)
    //Estados para la asignacion de hijos CI de un CI
    const [loadingExport, setLoadingExport] = useState(false)
    //Estado para la auditoria de un CI
    const [loadingAuditCILogs, setLoadingAuditCILogs] = useState(false)
    const [auditCILogs, setAuditCILogs] = useState<IAuditCILog[]>([])
    //Estado para la exportación de logs de auditoria
    const [loadingExportAuditLogs, setLoadingExportAuditLogs] = useState(false)
    //Estado para la generación de archivos
    const [loadingGeneration, setLoadingGeneration] = useState(false)

    const userName = useTypedSelector(({ auth }) => auth.usuario)

    const getListConfigurationItems = useCallback(async function (params: IGetConfigurationItems) {
        setLoadindListCI(true)
        try {
            const response = await InventoryService.listConfigurationItemsWithHierarchy(params)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setConfigurationItems(response.data.lista)
            } else {
                setConfigurationItems([])
            }
        } catch (e) {
            handleAxiosError(e)
            setConfigurationItems([])
        } finally {
            setLoadindListCI(false)
        }
    }, [])

    const getListConfigurationItemsPlane = useCallback(async function (params: IGetConfigurationItems) {
        setLoadindListCIPlane(true)
        try {
            const response = await InventoryService.listConfigurationItems(params)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setConfigurationItemsPlane(response.data.lista)
            } else {
                setConfigurationItemsPlane([])
            }
        } catch (e) {
            handleAxiosError(e)
            setConfigurationItemsPlane([])
        } finally {
            setLoadindListCIPlane(false)
        }
    }, [])

    const getValuesOfDynamicAttributesByCI = useCallback(async function (idOptionFamilyClase: string, idCI: string) {
        setLoadingListDynamicAttributes(true)
        try {
            const response = await InventoryService.getValuesOfDynamicAttributesByCI(idOptionFamilyClase, idCI)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setValuesOfDynamicAttributes(combinarRegistros(response.data.lista))
            } else {
                setValuesOfDynamicAttributes([])
            }
        } catch (e) {
            handleAxiosError(e)
            setValuesOfDynamicAttributes([])
        } finally {
            setLoadingListDynamicAttributes(false)
        }
    }, [])

    const updateGeneralInformationCI = useCallback(async function (params: IUpdateGeneralInformation) {
        setLoadingGeneralInformationCI(true)
        try {
            const response = await InventoryService.updateGeneralInformationCI(params)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se acutalizó el elemento de configuración correctamente."); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingGeneralInformationCI(false)
        }
    }, [])

    const updateDynamicInformationCI = useCallback(async function (idCI: number, params: IUpdateDynamicInformationCI) {
        setLoadingDynamicInformationCI(true)
        try {
            const response = await InventoryService.updateDynamicInformationCI(idCI.toString(), userName, params)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se actualizó el elemento de configuración correctamente."); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingDynamicInformationCI(false)
        }
    }, [userName])

    const createCI = useCallback(async function (params: ICreateCI) {
        setLoadingCreateCI(true)
        try {
            const response = await InventoryService.createCI(params)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se creó el elemento de configuración correctamente."); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingCreateCI(false)
        }
    }, [])

    const getIPsByCI = useCallback(async function (idCI: number) {
        setLoadingIPsByCI(true)
        try {
            const response = await InventoryService.getIPsByCI(idCI.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setCIIps(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
            setCIIps([])
        } finally {
            setLoadingIPsByCI(false)
        }
    }, [])

    const addIP = useCallback(async function (params: IaddIP) {
        setLoadingAddIP(true)
        try {
            const response = await InventoryService.addIPCI(params)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se añadió la IP correctamente."); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingAddIP(false)
        }
    }, [])

    const assignChildrensCI = useCallback(async function (params: IAssignChildrenCI) {
        setLoadingAssignChildrensCI(true)
        try {
            const response = await InventoryService.assignChildrensCI(params)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se actualizó la relación correctamente."); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingAssignChildrensCI(false)
        }
    }, [])

    const getExportFile = useCallback(async function (owners: IOwners, CIs: IConfigurationItem[]) {
        setLoadingExport(true)
        if (CIs.length === 0) {
            warningNotification("No existen CIs para exportar")
            setLoadingExport(false)
            return
        }
        try {
            const response = await InventoryService.exportCIs({
                lista_equipo: CIs.map(ci => ({ id_equipo: ci.ID_EQUIPO }))
            })
            const url = URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.ms-excel' }))
            const link = document.createElement('a')
            link.href = url;
            let today = new Date();
            let date = today.getFullYear() + "" + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2)
            let time = today.getHours() + "" + today.getMinutes()
            let filename = date + '_' + time + "_" + owners.alp + "_" + owners.project + "-reporte.xls"
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click();
            document.body.removeChild(link)
        } catch (error) {
            warningNotification("Ops.. Al parecer ocurrió un problema al extraer el archivo.")
        } finally {
            setLoadingExport(false)
        }
    }, [])

    const generateFile = useCallback(async function (owners: IOwners, CIs: IConfigurationItem[]) {
        setLoadingGeneration(true)
        if (CIs.length === 0) {
            warningNotification("No existen CIs para exportar")
            setLoadingGeneration(false)
            return
        }
        try {
            const response = await InventoryService.generateCI({
                lista_equipo: CIs.map(ci => ({ id_equipo: ci.ID_EQUIPO }))
            })
            const url = URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.ms-excel' }))
            const link = document.createElement('a')
            link.href = url;
            let today = new Date();
            let date = today.getFullYear() + "" + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2)
            let time = today.getHours() + "" + today.getMinutes()
            let filename = date + '_' + time + "_" + owners.alp + "_" + owners.project + "-reporte.xls"
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click();
            document.body.removeChild(link)
        } catch (error) {
            warningNotification("Ops.. Al parecer ocurrió un problema al extraer el archivo.")
        } finally {
            setLoadingGeneration(false)
        }
    }, [])

    const getAuditCILogs = useCallback(async function (idEquipo: string, params: any) {
        setLoadingAuditCILogs(true)
        try {
            const response = await InventoryService.listAuditCILogs(idEquipo, params)
            if (isSuccessRequest(response.status)) {
                const flattenedData = flattenAuditByIteration(response.data)
                setAuditCILogs(flattenedData)
            } else {
                setAuditCILogs([])
            }
        } catch (e) {
            handleAxiosError(e)
            setAuditCILogs([])
        } finally {
            setLoadingAuditCILogs(false)
        }
    }, [])

    const exportAuditLogs = useCallback(async function (idCI: number) {
        setLoadingExportAuditLogs(true)
        try {
            const response = await InventoryService.exportAuditLogs(idCI)
            const url = URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.ms-excel' }))
            const link = document.createElement('a')
            link.href = url;
            let today = new Date();
            let date = today.getFullYear() + "" + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2)
            let time = today.getHours() + "" + today.getMinutes()
            let filename = 'auditoria_' + date + '_' + time + ".xls"
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click();
            document.body.removeChild(link)
        } catch (error) {
            warningNotification("Ops.. Al parecer ocurrió un problema al extraer el archivo.")
        } finally {
            setLoadingExportAuditLogs(false)
        }
    }, [])

    return {
        getListConfigurationItems, loadingListCI, configurationItems,
        getValuesOfDynamicAttributesByCI, loadingListDynamicAttributes, dynamicValuesOfAttributes,
        updateGeneralInformationCI, loadingUpdateGeneralInformationCI,
        updateDynamicInformationCI, loadingUpdateDynamicInformationCI,
        createCI, loadingCreateCI,
        getIPsByCI, loadingIPsByCI, CIIps,
        addIP, loadingAddIP,
        getListConfigurationItemsPlane, configurationItemsPlane, loadingListCIPlane,
        assignChildrensCI, loadingAssignChildrensCI,
        getExportFile, loadingExport,
        generateFile, loadingGeneration,
        getAuditCILogs, loadingAuditCILogs, auditCILogs,
        exportAuditLogs, loadingExportAuditLogs
    }
}

export { useCI }