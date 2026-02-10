import { useCallback, useState } from "react"
import { CIsInVersion, IUseVersion, MetricVersion } from "../Types"
import { MonitoringService } from "../../../../services/Monitoring.service"
import { isSuccessActionInBackend, isSuccessRequest } from "../../../../helpers/handleAxiosError"

const useVersion = (): IUseVersion => {

    const [metricsVersionLoading, setMetricsVersionLoading] = useState(false)
    const [metricsVersion, setMetricsVersion] = useState<MetricVersion[]>([])
    const [cisInVersion, setCIsInVersion] = useState<CIsInVersion[]>([])
    const [cisInVersionLoading, setCIsInVersionLoading] = useState(false)

    const getMetricsVersion = useCallback(async function (idPolicy: number, idVersion: number): Promise<MetricVersion[] | undefined> {
        setMetricsVersionLoading(true)
        try {
            const response = await MonitoringService.getVersionDetail(idPolicy, idVersion)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setMetricsVersion(response.data.lista)
                return response.data.lista
            }
        } catch (e) {
            return undefined
        } finally {
            setMetricsVersionLoading(false)
        }
    }, [])

    const getCIsInVersion = useCallback(async function (idPolicy: number, idVersion: number, monitored: boolean) {
        setCIsInVersionLoading(true)
        try {
            const response = await MonitoringService.getCIsInVersion(idPolicy, idVersion, monitored ? 1 : 0)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setCIsInVersion(response.data.lista)
            }
        } catch (e) {
            setCIsInVersion([])
        } finally {
            setCIsInVersionLoading(false)
        }
    }, [])

    return {
        getMetricsVersion, metricsVersionLoading, metricsVersion,
        getCIsInVersion, cisInVersion, cisInVersionLoading
    }
}
export { useVersion }