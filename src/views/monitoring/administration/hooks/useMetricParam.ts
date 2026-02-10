import { useCallback, useState } from "react"
import { MonitoringService } from "../../../../services/Monitoring.service"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../../../../helpers/handleAxiosError"
import { errorNotification, successNotification } from "../../../../helpers/notifications"
import { IUseMetricParams, MetricParam, RegisterMetricParam, UpdateMetricParam } from "../Types";

const useMetricParams = (): IUseMetricParams => {

    const [metricParams, setMetricParams] = useState<MetricParam[]>([])
    const [paramsLoading, setParamsLoading] = useState(false)
    const [createParamLoading, setCreateParamLoading] = useState(false)
    const [updateParamLoading, setUpdateParamLoading] = useState(false)

    const getParamsByMetricId = useCallback(async (idMetrica: number) => {
        setParamsLoading(true)
        try {
            const response = await MonitoringService.getMetricParams(idMetrica)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setMetricParams(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setParamsLoading(false)
        }
    }, [])

    const createMetricParam = useCallback(async (data: RegisterMetricParam): Promise<boolean | undefined> => {
        setCreateParamLoading(true)
        try {
            const response = await MonitoringService.createMetricParam(data)
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
            setCreateParamLoading(false)
        }
    }, [])

    const updateMetricParam = useCallback(async (data: UpdateMetricParam): Promise<boolean | undefined> => {
        setUpdateParamLoading(true)
        try {
            const response = await MonitoringService.updateMetricParam(data)
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
            setUpdateParamLoading(false)
        }
    }, [])

    return {
        getParamsByMetricId, metricParams, paramsLoading,
        createMetricParam, createParamLoading,
        updateParamLoading, updateMetricParam,
    }
}

export { useMetricParams }
