import { useCallback, useState } from "react"
import { IUseCatalog, MetricCatalog, MetricFamilyClase, ProjectMonitored } from "../Types"
import { MonitoringService } from "../../../../services/Monitoring.service"
import { isSuccessActionInBackend, isSuccessRequest } from "../../../../helpers/handleAxiosError"
import { AdministrationService } from "../../../../services/Administration.service"
import { IComboData } from "../../../../helpers/Types"

const useCatalog = (): IUseCatalog => {

    const [tools, setTools] = useState<IComboData[]>([])
    const [toolsLoading, setToolsLoading] = useState(false)
    const [familyClaseMetrics, setFamilyClaseMetrics] = useState<MetricFamilyClase[]>([])
    const [familyClaseMetricsLoading, setFamilyClaseMetricsLoading] = useState(false)
    const [metricCatalog, setMetricCatalog] = useState<MetricCatalog | null>(null)
    const [metricCatalogLoading, setMetricCatalogLoading] = useState(false)
    const [loadingProjectsOld, setProjectsLoadingOld] = useState(false)
    const [loadingProjectsNew, setProjectsLoadingNew] = useState(false)

    const getTools = useCallback(async function () {
        setToolsLoading(true)
        try {
            const response = await AdministrationService.getDataFilter({
                tabla: "HERRAMIENTA_MONITOREO",
                filtro: ""
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

    const getMetricsByFamilyClase = useCallback(async function (idFamilyClase: number): Promise<MetricFamilyClase[] | undefined> {
        setFamilyClaseMetrics([])
        setFamilyClaseMetricsLoading(true)
        try {
            const response = await MonitoringService.getMetricsByFamilyClase(idFamilyClase)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setFamilyClaseMetrics(response.data.lista)
                return response.data.lista
            }
        } catch (e) {
            setFamilyClaseMetrics([])
        } finally {
            setFamilyClaseMetricsLoading(false)
        }
    }, [])

    const getMetricCatalog = useCallback(async function (idMetric: number) {
        setMetricCatalog(null)
        setMetricCatalogLoading(true)
        try {
            const response = await MonitoringService.getMetricCatalog(idMetric)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setMetricCatalog(response.data.lista)
            }
        } catch (e) {
            setMetricCatalog(null)
        } finally {
            setMetricCatalogLoading(false)
        }
    }, [])

    const getProjectsMonitoringOldVersion = useCallback(async function (flag: number): Promise<ProjectMonitored[] | undefined> {
        // 0: Not migrated, 1: Migrated, 2: With no policies
        setProjectsLoadingOld(true)
        try {
            const response = await MonitoringService.getProjectsMonitoringOldVersion(flag)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                return response.data.lista
            }
        } catch (e) {
            return undefined
        } finally {
            setProjectsLoadingOld(false)
        }
    }, [])

    const getProjectsMonitoringNewVersion = useCallback(async function (): Promise<ProjectMonitored[] | undefined> {
        // 0: Not migrated, 1: Migrated, 2: With no policies
        setProjectsLoadingNew(true)
        try {
            const response = await MonitoringService.getProjectsMonitoringNewVersion()
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                return response.data.lista
            }
        } catch (e) {
            return undefined
        } finally {
            setProjectsLoadingNew(false)
        }
    }, [])

    return {
        getTools, toolsLoading, tools,
        getMetricsByFamilyClase, familyClaseMetricsLoading, familyClaseMetrics,
        getMetricCatalog, metricCatalogLoading, metricCatalog,
        getProjectsMonitoringOldVersion, loadingProjectsOld,
        getProjectsMonitoringNewVersion, loadingProjectsNew
    }
}
export { useCatalog }