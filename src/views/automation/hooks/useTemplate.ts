import { useCallback, useState } from "react"
import { AutomationService } from "../../../services/Automation.service"
import { ICreateTemplate, IListAWXRoutines, IListTemplate, ITemplatedConfiguratedLinux, IUpdateTemplate, IUseTemplate, OPERATE_SYSTEMS } from "../Types"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../../../helpers/handleAxiosError"
import { errorNotification, successNotification } from "../../../helpers/notifications"

const useTemplate = (): IUseTemplate => {

    //Estado para el metodo crear plantilla de Ejecución
    const [createTemplatesLoading, setCreateTemplatesLoading] = useState(false)
    //Estados para el metodo listar las plantillas de Ejecución
    const [getListTemplateLoading, setGetListTemplateLoading] = useState(false)
    const [templatesData, setTemplatesData] = useState<IListTemplate[]>([])
    //Estados para el metodo listar Rutinarias AWX
    const [getListAWXoutinesLoading, setGetListAWXRoutinesLoading] = useState(false)
    const [awxRoutinesData, setAWXRoutinesData] = useState<IListAWXRoutines[]>([])
    //Estado para el metodo crear actualizar de Ejecución
    const [updateTemplateLoading, setUpdateTemplateLoading] = useState(false)
    //Estados para el metodo listar Rutinarias AWX de un Plantilla de Ejecución
    const [getListAWXoutinesOfTemplateLoading, setGetListAWXRoutinesOfTemplateLoading] = useState(false)
    const [awxRoutinesOfTemplateData, setAWXRoutinesOfTemplateData] = useState<IListAWXRoutines[]>([])
    //Estado para el metodo eliminar una Plantilla de Ejecución
    const [deleteTemplateLoading, setDeleteTemplateLoading] = useState(false)
    //Estado para el metodo para listar las plantilla configuradas en una ejecucion
    const [getTemplateByExecution, setGetTemplateByExecution] = useState(false)


    const createTemplate = useCallback(async function (newTemplate: ICreateTemplate) {
        setCreateTemplatesLoading(true)
        try {
            const response = await AutomationService.createTemplate(newTemplate)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se creó la plantilla de ejecución exitosamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setCreateTemplatesLoading(false)
        }
    }, [])

    const getListTemplate = useCallback(async function (so: OPERATE_SYSTEMS) {
        setGetListTemplateLoading(true)
        try {
            const response = await AutomationService.getListTemplate(so)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setTemplatesData(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setGetListTemplateLoading(false)
        }
    }, [])

    const getListAWXRoutines = useCallback(async function (isLinux: boolean) {
        setGetListAWXRoutinesLoading(true)
        try {
            const response = await AutomationService.getListAWXRoutines(isLinux ? "1" : "0")
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setAWXRoutinesData(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setGetListAWXRoutinesLoading(false)
        }
    }, [])

    const updateTemplate = useCallback(async function (templateUpdated: IUpdateTemplate) {
        setUpdateTemplateLoading(true)
        try {
            const response = await AutomationService.updateTemplate(templateUpdated)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se actualizó la plantilla de ejecución exitosamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setUpdateTemplateLoading(false)
        }
    }, [])

    const getListAWXRoutinesOfTemplate = useCallback(async function (idTemplate: number) {
        setGetListAWXRoutinesOfTemplateLoading(true)
        try {
            const response = await AutomationService.getListAWXRoutinesOfTemplate(idTemplate.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setAWXRoutinesOfTemplateData(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setGetListAWXRoutinesOfTemplateLoading(false)
        }
    }, [])

    const deleteTemplate = useCallback(async function (idTemplate: number) {
        setDeleteTemplateLoading(true)
        try {
            const response = await AutomationService.deleteTemplate(idTemplate.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se eliminó la plantilla de ejecución exitosamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setDeleteTemplateLoading(false)
        }
    }, [])

    const getTemplateOfExecution = useCallback(async function (idExecution: number): Promise<ITemplatedConfiguratedLinux[] | undefined> {
        setGetTemplateByExecution(true)
        try {
            const response = await AutomationService.getTemplateByExecution(idExecution.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                return response.data.lista
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setGetTemplateByExecution(false)
        }
    }, [])

    return {
        createTemplate, createTemplatesLoading,
        getListTemplate, getListTemplateLoading, templatesData,
        getListAWXRoutines, getListAWXoutinesLoading, awxRoutinesData,
        updateTemplate, updateTemplateLoading,
        getListAWXRoutinesOfTemplate, getListAWXoutinesOfTemplateLoading, awxRoutinesOfTemplateData,
        deleteTemplate, deleteTemplateLoading,
        getTemplateOfExecution, getTemplateByExecution
    }
}
export { useTemplate }