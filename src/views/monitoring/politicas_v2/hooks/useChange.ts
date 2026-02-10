import { useCallback, useState } from "react"
import { CancelImplement, ChangeRequest, CIToDelete, IUseChange, MetricChange, UpdatedVersion, AddChangeDetail } from "../Types"
import { MonitoringService } from "../../../../services/Monitoring.service"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest, isExcelHeaderContect } from "../../../../helpers/handleAxiosError"
import { errorNotification, successNotification, warningNotification } from "../../../../helpers/notifications"

const useChange = (): IUseChange => {
    
    const [changeRequests, setChangesRequests] = useState<ChangeRequest[]>([])
    const [changesLoading, setChanhgesLoading] = useState(false)
    const [registerChangeLoading, setRegisterChangeLoading] = useState(false)
    const [changeDetailLoading, setChangeDetailLoading] = useState(false)
    const [cancelImplementChangeLoading, setCancelImplementChangeLoading] = useState(false)
    const [loadingUpdateChange, setLoadingUpdateChange] = useState(false)
    const [deleteMetricChangeLoading, setDeleteMetricChangeLoading] = useState(false)
    const [deleteCILoading, setDeleteCILoading] = useState(false)
    const [changesOfVersion, setChangesOfVersion] = useState<MetricChange[]>([])
    const [changeOfVersionLoading, setChangeOfVersionLoading] = useState(false)
    const [addChangeDetailLoading, setAddChangeDetailLoading] = useState(false)
    const [importPolicyLoading, setImportPolicyLoading] = useState(false)
    const [massiveMetricsLoading, setMassiveMetricsLoading] = useState(false)
    const [compatibleToolsLoading, setCompatibleToolsLoading] = useState(false)

    const getListChanges = useCallback(async function (idProject: number) {
        setChanhgesLoading(true)
        try {
            const response = await MonitoringService.getChangeRequests(idProject)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setChangesRequests(response.data.lista)
            }
        } catch (e) {
            setChangesRequests([])
        } finally {
            setChanhgesLoading(false)
        }
    }, [])

    const getRequestChangeDetail = useCallback(async function (idChange: number): Promise<MetricChange[] | undefined> {
        setChangeDetailLoading(true)
        try {
            const response = await MonitoringService.getRequestChangeDetail(idChange)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                return response.data.lista
            }
        } catch (e) {
            return undefined
        } finally {
            setChangeDetailLoading(false)
        }
    }, [])

    const registerChange = useCallback(async function (data: UpdatedVersion): Promise<boolean | undefined> {
        setRegisterChangeLoading(true)
        try {
            const response = await MonitoringService.registerChange(data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje)
                return true
            }
        } catch (e) {
            handleAxiosError(e)
            return false
        } finally {
            setRegisterChangeLoading(false)
        }
    }, [])

    const addChangeDetail = useCallback(async function (data:AddChangeDetail):Promise<boolean|undefined>{
        setAddChangeDetailLoading(true)
        try{
            const response = await MonitoringService.addChangeDetail(data)
            if(isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)){
                successNotification(response.data.mensaje)
                return true
            }
        } catch (e) {
            handleAxiosError(e)
            return false
        } finally {
            setAddChangeDetailLoading(false)
        }
    }, [])

    const cancelImplementChange = useCallback(async function (data: CancelImplement): Promise<boolean | undefined> {
        setCancelImplementChangeLoading(true)
        try {
            const response = await MonitoringService.cancelImplementChange(data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje)
                return true
            }
        } catch (e) {
            handleAxiosError(e)
            return false
        } finally {
            setCancelImplementChangeLoading(false)
        }
    }, [])

    const updateChange = useCallback(async function (data: UpdatedVersion): Promise<boolean | undefined> {
        setLoadingUpdateChange(true)
        try {
            const response = await MonitoringService.updateChange(data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje)
                return true
            }
        } catch (e) {
            handleAxiosError(e)
            return false
        } finally {
            setLoadingUpdateChange(false)
        }
    }, [])

    const deleteMetricChange = useCallback(async function (idChangeMetric: number, idChangeParam: number): Promise<boolean | undefined> {
        setDeleteMetricChangeLoading(true)
        try {
            const response = await MonitoringService.deleteMetricChange(idChangeMetric, idChangeParam)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje)
                return true
            }
        } catch (e) {
            handleAxiosError(e)
            return false
        } finally {
            setDeleteMetricChangeLoading(false)
        }
    }, [])

    const deleteCI = useCallback(async function (data: CIToDelete): Promise<boolean | undefined> {
        setDeleteCILoading(true)
        try {
            const response = await MonitoringService.deleteCI(data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje)
                return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
            return false
        } finally {
            setDeleteCILoading(false)
        }
    }, [])

    const importPolicy = useCallback(async function (idPolicy:string, usuario:string, data: any): Promise<boolean | undefined> {
        setImportPolicyLoading(true)
        try {
            // ImportPolicy siempre devuelve un ArrayBuffer.
            const response = await MonitoringService.importPolicy(idPolicy, usuario, data)
            
            // Me aseguro que el encabezado sea de Excel.
            if (isExcelHeaderContect(response.headers["content-type"])) {
                // Creo una URL a partir del blob de response.data y el type.
                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.ms-excel' }))

                // Genero la etiqueda 'a'
                const link = document.createElement('a');

                // Generación del Nombre de archivo. Politicas_{fecha}_{tiempo}_fileError.err
                let today = new Date();
                let date = today.getFullYear() + "" + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);;
                let time = today.getHours() + "" + today.getMinutes();
                let filename = 'Politicas_' + date + '_' + time + "_fileError.xls";

                // Abro el Link y descargo el archivo automaticamente
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // NOTIFICAR CARGA PARCIAL 
                successNotification('Se cargaron los datos de manera parcial. Revisar excel');
                return true;
            }else{
                // Decodificamos a texto el array buffer a utf-8
                const decoder = new TextDecoder("utf-8");

                // Pasamos a String el ArrayBuffer
                const jsonString = decoder.decode(response.data);

                // Pasamos a Json, el String
                const json = JSON.parse(jsonString);

                if (isSuccessRequest(response.status) && isSuccessActionInBackend(json.status)) {
                    if (json.warning) {
                        warningNotification(json.mensaje);
                    } else {
                        successNotification(json.mensaje);
                    }
                    return true;
                }else{
                    errorNotification(json.mensaje);
                    return false;
                }
            }

        } catch (e) {
            handleAxiosError(e)
            return false
        } finally {
            setImportPolicyLoading(false)
        }
    }, [])

    const getChangeByVersion = useCallback(async function (idVersion: number) {
        setChangeOfVersionLoading(true)
        try {
            const response = await MonitoringService.getChangeByVersion(idVersion)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setChangesOfVersion(response.data.lista)
            }
        } catch (e) {
            setChangesOfVersion([])
        } finally {
            setChangeOfVersionLoading(false)
        }
    }, [])

    const deleteChangeCI = useCallback(async function (idChangeCI: string): Promise<boolean | undefined> {
        setDeleteCILoading(true)
        try {
            const response = await MonitoringService.deleteChangeCI(idChangeCI)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje)
                return true
            }else{
                errorNotification(response.data.mensaje)
                return false
            }
        } catch (e) {
            handleAxiosError(e)
            return false
        } finally {
            setDeleteCILoading(false)
        }
    }, [])

    const obtainDefaultMassiveMetric = useCallback(async function (data: any): Promise<any | undefined> {
        setMassiveMetricsLoading(true)
        try{
            const response = await MonitoringService.obtenerMetricasDefaultMasivo(data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                console.log("✅ Respuesta exitosa - Métricas masivas:", response.data)
                successNotification(response.data.mensaje)
                return response.data
            } else {
                console.log("Error en respuesta:", response.data)
                errorNotification(response.data.mensaje)
                return false
            }
        } catch (e) {
            console.error("Error en llamada a métricas masivas:", e)
            handleAxiosError(e)
            return false
        } finally {
            setMassiveMetricsLoading(false)
        }
    }, [])

    const getCompatibleTools = useCallback(async function (idEquipos: string): Promise<any | undefined> {
        setCompatibleToolsLoading(true)
        try{
            const response = await MonitoringService.getCompatibleTools(idEquipos)
            if (isSuccessRequest(response.status)) {
                if (response.data.status === "Correcto") {
                    successNotification(response.data.mensaje)
                } else if (response.data.status === "Warning") {
                    warningNotification(response.data.mensaje)
                } else {
                    errorNotification(response.data.mensaje)
                }
                return response.data
            } else {
                errorNotification("Error al consultar herramientas compatibles")
            }
        } catch (e) {
            handleAxiosError(e)
            return false
        } finally {
            setCompatibleToolsLoading(false)
        }}
    , [])

    return {
        getListChanges, changesLoading, changeRequests,
        registerChange, registerChangeLoading,
        getRequestChangeDetail, changeDetailLoading,
        cancelImplementChange, cancelImplementChangeLoading,
        updateChange, loadingUpdateChange,
        deleteMetricChange, deleteMetricChangeLoading,
        deleteCI, deleteCILoading,
        getChangeByVersion, changeOfVersionLoading, changesOfVersion, 
        addChangeDetail, addChangeDetailLoading,
        importPolicy, importPolicyLoading,
        deleteChangeCI,
        obtainDefaultMassiveMetric, massiveMetricsLoading,
        getCompatibleTools, compatibleToolsLoading
    }
}

export { useChange }