import { useCallback, useState } from "react"
import { AutomationService } from "../../../services/Automation.service"
import { IBodyListPlanification, ICreatePlanification, IPlanification, IUsePlanification } from "../Types"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../../../helpers/handleAxiosError"
import { errorNotification, successNotification } from "../../../helpers/notifications"

const usePlanification = (): IUsePlanification => {

    //Estados para el metodo guardar planificacion
    const [savePlanificationLoading, setPlanificationLoadingLoading] = useState(false)
    //Estados para el metodo guardar planificacion
    const [deletePlanificationLoading, setDeletePlanificationLoadingLoading] = useState(false)
    //Estados para el metodo guardar planificacion
    const [listPlanificationLoading, setListPlanificationLoading] = useState(false)

    const savePlanification = useCallback(async function (planification: ICreatePlanification[]) {
        setPlanificationLoadingLoading(true)
        try {
            const response = await AutomationService.save_planification(planification)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data[0].status)) {
                successNotification("Se guardó la planificación exitosamente"); return true
            } else {
                errorNotification(response.data[0].mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setPlanificationLoadingLoading(false)
        }
    }, [])

    const deletePlanification = useCallback(async function (idPlanification: number | string) {
        setDeletePlanificationLoadingLoading(true)
        try {
            const response = await AutomationService.deletePlanification(idPlanification.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data[0].status)) {
                successNotification("Se eliminó el registro de planificación exitosamente"); return true
            } else {
                errorNotification(response.data[0].mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setDeletePlanificationLoadingLoading(false)
        }
    }, [])

    const getListPlanification = useCallback(async function (whoPlanificationWants: IBodyListPlanification): Promise<IPlanification[]> {
        setListPlanificationLoading(true)
        try {
            const response = await AutomationService.getListPlanification(whoPlanificationWants)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data[0].status)) {
                return response.data[0].lista
            } else {
                return []
            }
        } catch (e) {
            handleAxiosError(e)
            return []
        } finally {
            setListPlanificationLoading(false)
        }
    }, [])

    return {
        savePlanification, savePlanificationLoading,
        deletePlanification, deletePlanificationLoading,
        getListPlanification, listPlanificationLoading
    }
}
export { usePlanification }