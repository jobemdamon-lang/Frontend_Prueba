import { useCallback, useState } from "react"
import { MonitoringService } from "../../../../services/Monitoring.service"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../../../../helpers/handleAxiosError"
import { AdministrationService } from "../../../../services/Administration.service"
import { IComboData } from "../../../../helpers/Types"
import { errorNotification, successNotification } from "../../../../helpers/notifications"
import { ExportMetrics, IUseMetric, MetricCatalog, RegisterMetric, UpdatedMetric } from "../Types"

const useMetric = (): IUseMetric => {

    const [tools, setTools] = useState<IComboData[]>([])
    const [toolsLoading, setToolsLoading] = useState(false)
    const [typeEquipments, setTypeEquipments] = useState<IComboData[]>([])
    const [typeEquipmentsLoading, setTypeEquipmentsLoading] = useState(false)
    const [familiesClases, setFamiliesClases] = useState<IComboData[]>([])
    const [familiesClasesLoading, setFamiliesClasesLoading] = useState(false)
    const [metrics, setMetrics] = useState<MetricCatalog[]>([])
    const [metricsLoading, setMetricsLoading] = useState(false)
    const [createMetricLoading, setCreateMetricLoading] = useState(false)
    const [updateMetricLoading, setUpdateMetricLoading] = useState(false)
    const [loadingExportMetrics, setLoadingExportMetrics] = useState(false)

    const getTypeEquipment = useCallback(async () => {
        setTypeEquipmentsLoading(true)
        try {
            const response = await AdministrationService.getDataFilter({
                tabla: "TIPO_EQUIPO_MONITOREO",
                filtro: "",
            })
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setTypeEquipments(response.data.lista)
            }
        } catch (e) {
            setTools([])
        } finally {
            setTypeEquipmentsLoading(false)
        }
    }, [])

    const getTools = useCallback(async () => {
        setToolsLoading(true)
        try {
            const response = await AdministrationService.getDataFilter({
                tabla: "HERRAMIENTA_MONITOREO",
                filtro: "",
            })
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setTools(response.data.lista.filter((tool: { codigo: number, nombre: string }) => tool.nombre !== 'ALL'))
            }
        } catch (e) {
            setTools([])
        } finally {
            setToolsLoading(false)
        }
    }, [])

    const getFamiliesClases = useCallback(async () => {
        setFamiliesClasesLoading(true)
        try {
            const response = await AdministrationService.getDataFilter({
                tabla: "FAMILIA_CLASE",
                filtro: "",
            })
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setFamiliesClases(response.data.lista)
            }
        } catch (e) {
            setFamiliesClases([])
        } finally {
            setFamiliesClasesLoading(false)
        }
    }, [])


    const getMetrics = useCallback(async () => {
        setMetricsLoading(true)
        try {
            const response = await MonitoringService.getMetrics()
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setMetrics(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setMetricsLoading(false)
        }
    }, [])

    const createMetric = useCallback(async (data: RegisterMetric): Promise<boolean | undefined> => {
        setCreateMetricLoading(true)
        try {
            const response = await MonitoringService.createMetric(data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje)
                return true
            } else {
                if (response.data.mensaje) {
                    errorNotification(response.data.mensaje)
                }
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setCreateMetricLoading(false)
        }
    }, [])

    const updateMetric = useCallback(async (data: UpdatedMetric): Promise<boolean | undefined> => {
        setUpdateMetricLoading(true)
        try {
            const response = await MonitoringService.updateMetric(data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje)
                return true
            } else {
                if (response.data.mensaje) {
                    errorNotification(response.data.mensaje)
                }
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setUpdateMetricLoading(false)
        }
    }, [])

    const exportMetrics = useCallback(async (params: ExportMetrics) => {
    setLoadingExportMetrics(true)
    try {
        const response = await MonitoringService.exportMetrics(params)
        const contentType = response.headers?.['content-type'];

        if (contentType && contentType.includes('application/json')) {
            const arrayBuffer = response.data
            const uint8Array = new Uint8Array(arrayBuffer)
            const textDecoder = new TextDecoder('utf-8')
            const jsonString = textDecoder.decode(uint8Array)
            const json_response = JSON.parse(jsonString)
            errorNotification(json_response.mensaje || "Ocurrió un error al exportar las métricas.")
        } else {
            const url = URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.ms-excel' }))
            const link = document.createElement('a')
            link.href = url
            const today = new Date()
            const date = today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + ("0" + today.getDate()).slice(-2)
            const time = today.getHours() + "" + today.getMinutes()
            const filename = date + '_' + time + '-metricas.xls'
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            successNotification("¡Exportación realizada con éxito!")
        }
    } catch (e) {
        handleAxiosError(e)
    } finally {
        setLoadingExportMetrics(false)
    }
}, [])

    return {
        getTypeEquipment, typeEquipments, typeEquipmentsLoading,
        getTools, tools, toolsLoading,
        getFamiliesClases, familiesClases, familiesClasesLoading,
        getMetrics, metrics, metricsLoading,
        createMetric, createMetricLoading,
        updateMetric, updateMetricLoading,
        exportMetrics, loadingExportMetrics
    }
}

export { useMetric }
