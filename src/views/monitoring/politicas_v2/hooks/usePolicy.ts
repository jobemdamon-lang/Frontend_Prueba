import { useCallback, useState } from "react"
import { IUsePolicy, MetricChange, NewPolicy, Version } from "../Types"
import { MonitoringService } from "../../../../services/Monitoring.service"
import { isSuccessActionInBackend, isSuccessRequest } from "../../../../helpers/handleAxiosError"

const usePolicy = (): IUsePolicy => {

    const [versions, setVersions] = useState<Version[]>([])
    const [versionsLoading, setVersionsLoading] = useState(false)
    const [historic, setHistoric] = useState<MetricChange[]>([])
    const [historicLoading, setHistoricLoading] = useState(false)
    const [initializeLoading, setInitializeLoading] = useState(false)

    const getVersionsByProject = useCallback(async function (idProject: number) {
        setVersionsLoading(true)
        try {
            const response = await MonitoringService.getPolicyVersionsByProject(idProject)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setVersions(response.data.lista)
            } else {
                setVersions([])
            }
        } catch (e) {
            setVersions([])
        } finally {
            setVersionsLoading(false)
        }
    }, [])

    const getHistoricChanges = useCallback(async function (idProject: number) {
        setHistoricLoading(true)
        try {
            const response = await MonitoringService.getHistoricChanges(idProject)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setHistoric(response.data.lista)
            } else {
                setHistoric([])
            }
        } catch (e) {
            setHistoric([])
        } finally {
            setHistoricLoading(false)
        }
    }, [])

    const initializePolicy = useCallback(async function (data: NewPolicy) {
        setInitializeLoading(true)
        try {
            const response = await MonitoringService.initializePolicy(data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                return true
            }
        } catch (e) {
            return undefined
        } finally {
            setInitializeLoading(false)
        }
    }, [])

    return {
        getVersionsByProject, versions, versionsLoading,
        getHistoricChanges, historicLoading, historic,
        initializePolicy, initializeLoading
    }
}
export { usePolicy }