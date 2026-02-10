import { useCallback, useState } from "react"
import { AutomationService } from "../../../services/Automation.service"
import { ICheckList, ICreateConfiguration, ICreateConfigurationLinux, IDetailOfExecution, IDetailOfExecutionLinux, IExecuteTemplateLinux, IExecutionHistoryByServer, IGroupsWithServersWithPatchesUpdate, IInitSearchHistoricPatches, IInitSearchPendingPatches, ILinuxConfigurationSaved, IListExecutions, IListExecutionsLinux, IListProgress, IListProgressLinux, IMotivoSalto, ISearchLinuxConfiguration, IUpdateConfiguration, IUpdateConfigurationLinux, IUseExecution } from "../Types"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../../../helpers/handleAxiosError"
import { errorNotification, successNotification } from "../../../helpers/notifications"

const useExecution = (): IUseExecution => {

    //Estados para el metodo listar los Grupos
    const [getListExecutionsLoading, setListexecutionsLoading] = useState(false)
    const [executionsData, setExecutionsData] = useState<IListExecutions[]>([])
    //Estados para el metodo listar los Grupos
    const [getExecutionDetailLoading, setExecutionDetailtLoading] = useState(false)
    const [executionDetailData, setExecutionDetailData] = useState<IDetailOfExecution[]>([])
    //Estados para el metodo guardar configuracion windows
    const [createConfigurationLoading, setCreateConfigurationLoading] = useState(false)
    //Estados para el metodo obtener la configuracion planificada
    const [configurationLoading, setConfigurationLoading] = useState(false)
    const [configurationOfExecution, setConfigurationOfExecution] = useState<IGroupsWithServersWithPatchesUpdate[]>([])
    //Estados para el metodo actualizar configuracion
    const [updateConfigurationLoading, setUpdateConfigurationLoading] = useState(false)
    //Estados para el metodo iniciar busqueda de parches
    const [initSearchHistoricPatchLoading, setInitSearchHistoricPatchLoading] = useState(false)
    //Estados para el metodo iniciar busqueda de parches para la configuracion
    const [initSearchPendingPatchLoading, setInitSearchPendingPatchLoading] = useState(false)
    //Estados para el metodo iniciar parchado
    const [initPatchingLoading, setInitPatchingLoading] = useState(false)
    //Estados para el metodo listar progreso de una ejecucion
    const [progressExecutionData, setProgressExecutionData] = useState<IListProgress>({} as IListProgress)
    const [progressExecutionLoading, setProgressLoading] = useState(false)
    //Estados para el metodo eliminar una ejecucion windows
    const [deleteExecutionLoading, setDeleteExecutionLoading] = useState(false)
    //Estados para el metodo rejecutar una ejecucion
    const [restartExecutionLoading, setRestartExecutionLoading] = useState(false)
    //Estados para el metodo cancelar la Ejecución
    const [cancelExecutionLoading, setCancelExecutionLoadind] = useState(false)
    //Estados para el metodo listar logs de AWX de la ejecucion de una rutinaria 
    const [getLogsAwxLoading, setLogsAwxLoading] = useState(false)
    const [logsAwxData, setLogsAwxData] = useState("")
    // Estado para saber el estado de carga del salto de una rutinaria
    const [getMotivoSaltoLoading, setMotivoSaltoLoading] = useState(false)
    //Estado para saber el estado de carga e información de las diferencias de servicios WIN PRE - POST
    const [prePostDifferences, setPrePostDifferences] = useState<string[]>([])
    const [loadingDifferences, setLoadingDifferences] = useState(false)
    //Estado para saber el estado de carga e información del CheckList de Servicios
    const [checkListData, setCheckListData] = useState<ICheckList[]>([])
    const [loadingChecklist, setLoadingChecklist] = useState(false)
    //Estados para el metodo guardar configuracion linux
    const [createConfigurationLinuxLoading, setCreateConfigurationLinuxLoading] = useState(false)
    //Estados para el metodo listar las ejecuciones de Linux
    const [getListExecutionsLinuxLoading, setListexecutionsLinuxLoading] = useState(false)
    const [executionsLinuxData, setExecutionsLinuxData] = useState<IListExecutionsLinux[]>([])
    //Estados para el metodo listar el detalle de una Ejecucion de Linux
    const [getExecutionLinuxDetailLoading, setExecutionLinuxDetailtLoading] = useState(false)
    //Estados para el metodo actualizar configuracion de Linux
    const [updateConfigurationLinuxLoading, setUpdateConfigurationLinuxLoading] = useState(false)
    //Estados para el metodo obtener la configuracion planificada de Linux
    const [configurationLinuxLoading, setConfigurationLinuxLoading] = useState(false)
    //Estados para el metodo listar progreso de una ejecucion
    const [progressLinuxExecutionLoading, setProgressLinuxLoading] = useState(false)
    //Estados para el metedo eliminar ejecucion de linux
    const [deleteExecutionLinuxLoading, setDeleteExecutionLinuxLoading] = useState(false)
    //Estados para el metodo listar el historial de ejecuciones linux de un servidor
    const [historicalExecutionsLoading, setHistoricalExecutionsLoading] = useState(false)
    //Estados para el metodo para ejecutar la busqueda de parches Linux
    const [executeSearchLinuxLoading, setExecuteSearchLinuxLoading] = useState(false)
    //Estados para el metodo iniciar ejecucion linux
    const [startExecutionLoading, setStartExecutionLoading] = useState(false)
    //Estados para el metodo listar logs de AWX de la ejecucion de una rutinaria 
    const [getLogsAwxV2Loading, setLogsAwxV2Loading] = useState(false)
    const [logsAwxV2Data, setLogsAwxV2Data] = useState("")
    // Estado para saber el estado de carga del relanzado de una ejecucion
    const [rerunExecutionLinuxLoading, setRerunExecutionLinuxLoading] = useState(false)
    // Estado para saber el estado de carga del salto de una ejecucion
    const [skipExecutionLinuxLoading, setSkipExecutionLinuxLoading] = useState(false)
    // Estado para saber el estado de carga de la cancelacion de una ejecucion
    const [cancelExecutionLinuxLoading, setCancelExecutionLinuxLoading] = useState(false)

    const getListExecutions = useCallback(async function (nameClient: string, idProject: number = 0) {
        setListexecutionsLoading(true)
        try {
            const response = await AutomationService.getListExecutions(nameClient, idProject.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setExecutionsData(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setListexecutionsLoading(false)
        }
    }, [])

    const getListExecutionDetail = useCallback(async function (idExecution: number) {
        setExecutionDetailtLoading(true)
        try {
            const response = await AutomationService.getExecutiondetail(idExecution.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setExecutionDetailData(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setExecutionDetailtLoading(false)
        }
    }, [])

    const createConfiguration = useCallback(async function (configuration: ICreateConfiguration) {
        setCreateConfigurationLoading(true)
        try {
            const response = await AutomationService.createConfiguration(configuration)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se creó y guardo la configuración de la ejecución exitosamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setCreateConfigurationLoading(false)
        }
    }, [])

    const getListConfigurationOfExecution = useCallback(async function (idExecution: number) {
        setConfigurationLoading(true)
        try {
            const response = await AutomationService.getConfigurationOfExecution(idExecution.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setConfigurationOfExecution(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setConfigurationLoading(false)
        }
    }, [])

    const updateConfiguration = useCallback(async function (idEjecucion: number, configuration: IUpdateConfiguration) {
        setUpdateConfigurationLoading(true)
        try {
            const response = await AutomationService.updateConfiguration(idEjecucion.toString(), configuration)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se actualizó la ejecución exitosamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setUpdateConfigurationLoading(false)
        }
    }, [])

    const initSearchHistoricPatches = useCallback(async function (serversToFind: IInitSearchHistoricPatches) {
        setInitSearchHistoricPatchLoading(true)
        try {
            const response = await AutomationService.initSearchHistoricPatches(serversToFind)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data[0].status)) {
                successNotification(response.data[0].mensaje); return true
            } else {
                errorNotification(response.data[0].mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setInitSearchHistoricPatchLoading(false)
        }
    }, [])

    const initSearchPendingPatches = useCallback(async function (serversToFind: IInitSearchPendingPatches) {
        setInitSearchPendingPatchLoading(true)
        try {
            const response = await AutomationService.initSearchPendingPatches(serversToFind)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje)
                return { success: true, data: response.data.id_ejecucion }
            } else {
                errorNotification(response.data.mensaje)
                return { success: false, data: 0 }
            }
        } catch (e) {
            handleAxiosError(e)
            return { success: false, data: 0 }
        } finally {
            setInitSearchPendingPatchLoading(false)
        }
    }, [])

    const initPatching = useCallback(async function (serversToExec: IInitSearchPendingPatches, idExecution: number) {
        setInitPatchingLoading(true)
        try {
            const response = await AutomationService.initPatching(serversToExec, idExecution.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setInitPatchingLoading(false)
        }
    }, [])

    const listProgressExecution = async function (idExecution: number, origen?: string) {
        setProgressLoading(true)
        try {
            const response = await AutomationService.listProgressExecution(idExecution.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setProgressExecutionData(response.data.lista)
            }
        } catch (e) {
            console.log('pendiente de debugar')
        } finally {
            setProgressLoading(false)
        }
    }

    const deleteExecution = useCallback(async function (idExecution: number) {
        setDeleteExecutionLoading(true)
        try {
            const response = await AutomationService.deleteExecution(idExecution.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data[0].status)) {
                successNotification(response.data[0].mensaje); return true
            } else {
                errorNotification(response.data[0].mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setDeleteExecutionLoading(false)
        }
    }, [])

    const restartExecution = useCallback(async function (idExecution: number, idDetailExecution: number, user: string, idServer: number) {
        setRestartExecutionLoading(true)
        try {
            const response = await AutomationService.restartExecution(idExecution.toString(), idDetailExecution.toString(), user, idServer.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setRestartExecutionLoading(false)
        }
    }, [])

    const cancelExecution = useCallback(async function (idExecution: number, idDetailExecution: number, user: string, idServer: number) {
        setCancelExecutionLoadind(true)
        try {
            const response = await AutomationService.cancelExecution(idExecution.toString(), idDetailExecution.toString(), user, idServer.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setCancelExecutionLoadind(false)
        }
    }, [])

    const saltarExecution = useCallback(async function (idExecution: number, idDetailExecution: number, user: string, idServer: number, motivo: IMotivoSalto) {
        setMotivoSaltoLoading(true)
        try {
            const response = await AutomationService.saltarExecution(idExecution.toString(), idDetailExecution.toString(), user, idServer.toString(), motivo)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setMotivoSaltoLoading(false)
        }
    }, [])

    const getLogsJobAwx = useCallback(async function (id_job_awx: string) {
        console.log('llamando a logs de awx con id: ',id_job_awx )
        setLogsAwxLoading(true)
        try {
            const response = await AutomationService.getLogsJobAwx(id_job_awx)
            setLogsAwxData(response.data)
        } catch (error: any) {
            setLogsAwxData(`Ocurrió un al extrarer la información de AWX: ${error.response.data?.mensaje}`)
        } finally {
            setLogsAwxLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getDifferencesPrePost = useCallback(async function (idExecution: number, idServer: number) {
        setLoadingDifferences(true)
        try {
            const response = await AutomationService.getDifferencesPrePost(idExecution.toString(), idServer.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setPrePostDifferences(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingDifferences(false)
        }
    }, [])

    const getCheckList = useCallback(async function (idExecution: number, idServer: number) {
        setLoadingChecklist(true)
        try {
            const response = await AutomationService.getCheckList(idExecution.toString(), idServer.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setCheckListData(response.data.lista)
            }
        } catch (e) {
            console.log(e)
            //handleAxiosError(e)
        } finally {
            setLoadingChecklist(false)
        }
    }, [])

    const createConfigurationLinux = useCallback(async function (configuration: ICreateConfigurationLinux) {
        setCreateConfigurationLinuxLoading(true)
        try {
            const response = await AutomationService.createConfigurationLinux(configuration)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se creó y guardo la configuración de la ejecución exitosamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setCreateConfigurationLinuxLoading(false)
        }
    }, [])

    const getListExecutionsLinux = useCallback(async function (nameClient: string, idProject: number = 0) {
        setListexecutionsLinuxLoading(true)
        try {
            const response = await AutomationService.getListExecutionsLinux(nameClient, idProject.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setExecutionsLinuxData(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setListexecutionsLinuxLoading(false)
        }
    }, [])

    const getListExecutionDetailLinux = useCallback(async function (idExecution: number): Promise<IDetailOfExecutionLinux[] | undefined> {
        setExecutionLinuxDetailtLoading(true)
        try {
            const response = await AutomationService.getExecutiondetailLinux(idExecution.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                return response.data.lista
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setExecutionLinuxDetailtLoading(false)
        }
    }, [])

    const updateConfigurationLinux = useCallback(async function (idEjecucion: number, configuration: IUpdateConfigurationLinux) {
        setUpdateConfigurationLinuxLoading(true)
        try {
            const response = await AutomationService.updateConfigurationLinux(idEjecucion.toString(), configuration)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se actualizó la ejecución exitosamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setUpdateConfigurationLinuxLoading(false)
        }
    }, [])

    const getConfigurationLinuxOfExecution = useCallback(async function (idExecution: number): Promise<ILinuxConfigurationSaved | undefined> {
        setConfigurationLinuxLoading(true)
        try {
            const response = await AutomationService.getConfigurationLinuxOfExecution(idExecution.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                return response.data.lista
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setConfigurationLinuxLoading(false)
        }
    }, [])

    const listProgressLinuxExecution = useCallback(async function (idExecution: number): Promise<IListProgressLinux | undefined> {
        setProgressLinuxLoading(true)
        try {
            const response = await AutomationService.listProgressLinuxExecution(idExecution.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                return response.data.lista
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setProgressLinuxLoading(false)
        }
    }, [])

    const deleteExecutionLinux = useCallback(async function (idExecution: number) {
        setDeleteExecutionLinuxLoading(true)
        try {
            const response = await AutomationService.deleteExecutionLinux(idExecution.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data[0].status)) {
                successNotification(response.data[0].mensaje); return true
            } else {
                errorNotification(response.data[0].mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setDeleteExecutionLinuxLoading(false)
        }
    }, [])

    const getExecutionHistoryByServer = useCallback(async function (idExecution: number): Promise<IExecutionHistoryByServer[] | undefined> {
        setHistoricalExecutionsLoading(true)
        try {
            const response = await AutomationService.getExecutionHistoryByServer(idExecution.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                return response.data.lista
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setHistoricalExecutionsLoading(false)
        }
    }, [])

    const executeSearchLinux = useCallback(async function (serversToFind: ISearchLinuxConfiguration) {
        setExecuteSearchLinuxLoading(true)
        try {
            const response = await AutomationService.executeSearchLinux(serversToFind)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje)
                return { success: true, data: response.data.id_ejecucion }
            } else {
                errorNotification(response.data.mensaje)
                return { success: false, data: 0 }
            }
        } catch (e) {
            handleAxiosError(e)
            return { success: false, data: 0 }
        } finally {
            setExecuteSearchLinuxLoading(false)
        }
    }, [])

    const startExecutionLinux = useCallback(async function (configuration: IExecuteTemplateLinux, idExecution: number) {
        setStartExecutionLoading(true)
        try {
            const response = await AutomationService.startExecutionLinux(configuration, idExecution.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje)
                return { success: true, data: response.data.id_ejecucion }
            } else {
                errorNotification(response.data.mensaje)
                return { success: false, data: 0 }
            }
        } catch (e) {
            handleAxiosError(e)
            return { success: false, data: 0 }
        } finally {
            setStartExecutionLoading(false)
        }
    }, [])

    const getLogsJobAwxV2 = useCallback(async function (id_job_awx: string) {
        setLogsAwxV2Loading(true)
        try {
            const response = await AutomationService.getLogsJobAwxLinux(id_job_awx)
            setLogsAwxV2Data(response.data)
        } catch (error: any) {
            setLogsAwxV2Data(`Ocurrió un al extrarer la información de AWX: ${error.response.data?.mensaje}`)
        } finally {
            setLogsAwxV2Loading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const cancelExecutionLinux = useCallback(async function (idExecution: number, userName: string, idServer: number) {
        setCancelExecutionLinuxLoading(true)
        try {
            const response = await AutomationService.cancelExecutionLinux(idExecution.toString(), userName, idServer.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setCancelExecutionLinuxLoading(false)
        }
    }, [])

    const rerunExecutionLinux = useCallback(async function (idExecution: number, userName: string, idServer: number) {
        setRerunExecutionLinuxLoading(true)
        try {
            const response = await AutomationService.rerunExecutionLinux(idExecution.toString(), userName, idServer.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setRerunExecutionLinuxLoading(false)
        }
    }, [])

    const skipExecutionLinux = useCallback(async function (idExecution: number, userName: string, idServer: number, motivo: IMotivoSalto) {
        setSkipExecutionLinuxLoading(true)
        try {
            const response = await AutomationService.skipExecutionLinux(idExecution.toString(), userName, idServer.toString(), motivo)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setSkipExecutionLinuxLoading(false)
        }
    }, [])

    return {
        getListExecutions, getListExecutionsLoading, executionsData,
        getListExecutionDetail, getExecutionDetailLoading, executionDetailData,
        createConfiguration, createConfigurationLoading,
        getListConfigurationOfExecution, configurationLoading, configurationOfExecution,
        updateConfiguration, updateConfigurationLoading,
        initSearchHistoricPatches, initSearchHistoricPatchLoading, setInitSearchHistoricPatchLoading,
        initSearchPendingPatches, initSearchPendingPatchLoading,
        initPatching, initPatchingLoading,
        listProgressExecution, progressExecutionData, setProgressExecutionData, progressExecutionLoading,
        deleteExecution, deleteExecutionLoading,
        restartExecution, restartExecutionLoading,
        cancelExecution, cancelExecutionLoading,
        getLogsJobAwx, logsAwxData, getLogsAwxLoading,
        saltarExecution, getMotivoSaltoLoading,
        getDifferencesPrePost, prePostDifferences, loadingDifferences,
        getCheckList, checkListData, loadingChecklist,
        createConfigurationLinux, createConfigurationLinuxLoading,
        getListExecutionsLinux, getListExecutionsLinuxLoading, executionsLinuxData,
        getListExecutionDetailLinux, getExecutionLinuxDetailLoading,
        updateConfigurationLinux, updateConfigurationLinuxLoading,
        getConfigurationLinuxOfExecution, configurationLinuxLoading,
        listProgressLinuxExecution, progressLinuxExecutionLoading,
        deleteExecutionLinux, deleteExecutionLinuxLoading,
        getExecutionHistoryByServer, historicalExecutionsLoading,
        executeSearchLinux, executeSearchLinuxLoading,
        startExecutionLinux, startExecutionLoading,
        getLogsJobAwxV2, logsAwxV2Data, getLogsAwxV2Loading,
        cancelExecutionLinux, cancelExecutionLinuxLoading,
        skipExecutionLinux, skipExecutionLinuxLoading,
        rerunExecutionLinux, rerunExecutionLinuxLoading
    }
}
export { useExecution }