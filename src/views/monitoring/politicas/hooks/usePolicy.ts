import { useCallback, useState } from "react"
import { toast } from "react-toastify"
import { ICIOfPolicyDetail, IChangeTool, ICreatePolicy, IListMetricsByCi, IMonitoringPolicyVersions, IPolicyHistoryDetail, IUpdatePolicy } from "../Types"
import { MonitoringService } from "../../../../services/Monitoring.service"

const usePolicy = () => {

  //Estado para la creacion de una Politica
  const [createPolicyLoading, setCreatePolicyLoading] = useState(false)
  //Estado para el listado de Politicas por Proyecto
  const [policiesByProject, setPoliciesByProject] = useState<IMonitoringPolicyVersions[]>([])
  const [fetchPoliciesByProjectLoading, setFetchPoliciesByProjectLoading] = useState(false)
  //Estado para la actualización de una politica
  const [updatePolicyLoading, setUpdatePolicyLoading] = useState(false)
  //Estado para la actualización de una politica
  const [updateStateOfPolicyLoading, setUpdateStateOfPolicyLoading] = useState(false)
  //Estado para el resumen del detalle de la politica
  const [listCIsOfPolicyVersion, setListCisOfPolicyVersion] = useState<ICIOfPolicyDetail[]>([])
  const [listCiLoading, setListCILoading] = useState(false)
  //Estado para el resumen del detalle de la politica
  const [listNameMetricsByCI, setListMetricsNameByCi] = useState<IListMetricsByCi[]>([])
  const [listNameMetricByCILoading, setListNameMetricListByCI] = useState(false)
  //Estado para la cancelacion de una politica
  const [cancelupdatePolicyLoading, setCancelUpdatePolicyLoading] = useState(false)
  //Estado para la eliminacion de un ci para una politica
  const [deletingCIsOfPolicyLoading, setDeletingCIsOfPolicyLoading] = useState(false)
  //Estado para la cancelacion de una politica
  const [changesToImplementLoading, setChangesToImplementLoading] = useState(false)
  const [listChangesToImplement, setListChangesToImplement] = useState([])
  //Estado para la actualización de las herramiemtas de monitoreo usadas
  const [updateToolsLoading, setUpdateToolsLoading] = useState(false)
  //Estado para la informacion de la cabecera de cambios historicos
  const [historicalChanges, setHistoricalChanges] = useState<IPolicyHistoryDetail[]>([])
  const [historicalChangesLoading, setHistoricalChangesLoading] = useState(false)
  //Estado para la lista de metricas de una politica version
  const [metricsOfPolicyLoading, setMetricsOfPolicyLoading] = useState(false)

  const updatePolicyNewVersion = useCallback(async function (policy: IUpdatePolicy, closeModal: any, idProject: string) {
    setUpdatePolicyLoading(true)
    try {
      const response = await MonitoringService.generateNewPolicy(policy)
      if (response.status === "COMPLETO") {
        setUpdatePolicyLoading(false)
        toast.success(`Completado. ${response.mensaje ?? ""}`, {
          position: toast.POSITION.TOP_RIGHT
        })
        getListPoliciesByProject(idProject)
        closeModal()
      } else {
        setUpdatePolicyLoading(false)
        toast.error(`Ocurrió un problema al actualizar la politica. ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    } catch (error) {
      setUpdatePolicyLoading(false)
      toast.error(`Surgió un error inesperado. ${error}`, {
        position: toast.POSITION.TOP_RIGHT
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getListPoliciesByProject = useCallback(async function (idProject: string) {
    setFetchPoliciesByProjectLoading(true)
    try {
      const response = await MonitoringService.getPoliciesByProject(idProject)
      if (response.status === "Correcto") {
        setFetchPoliciesByProjectLoading(false)
        setPoliciesByProject(response.lista)
      } else {
        setFetchPoliciesByProjectLoading(false)
        setPoliciesByProject([])
      }
    } catch (error) {
      setFetchPoliciesByProjectLoading(false)
      setPoliciesByProject([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createPolicy = useCallback(async function (newPolicy: ICreatePolicy) {
    setCreatePolicyLoading(true)
    try {
      const response = await MonitoringService.createNewPolicy(newPolicy)
      if (response.status === "COMPLETO") {
        setCreatePolicyLoading(false)
        toast.success(`${response.mensaje ?? "Creado."}`, {
          position: toast.POSITION.TOP_RIGHT
        })
        getListPoliciesByProject(newPolicy.id_proyecto.toString())
        return response.lista.id_politica
      } else {
        setCreatePolicyLoading(false)
        toast.error(`Ocurrió un problema al crear la Politica. ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    } catch (error) {
      setCreatePolicyLoading(false)
      toast.error(`Surgió un error inesperado. ${error}`, {
        position: toast.POSITION.TOP_RIGHT
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateStateOfPolicy = useCallback(async function (idPolicy: string, nro_version: string, usuario: string, idProject: string) {
    setUpdateStateOfPolicyLoading(true)
    try {
      const response = await MonitoringService.updateStateOfPolicy(idPolicy, nro_version, usuario)
      if (response.status === "Correcto") {
        setUpdateStateOfPolicyLoading(false)
        toast.success(`Completado. ${response.mensaje ?? ""}`, {
          position: toast.POSITION.TOP_RIGHT
        })
        getListPoliciesByProject(idProject)
      } else {
        setUpdateStateOfPolicyLoading(false)
        toast.error(`Ocurrió un problema al actualizar el estado de la Politica. ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    } catch (error) {
      setUpdateStateOfPolicyLoading(false)
      toast.error(`Surgió un error inesperado. ${error}`, {
        position: toast.POSITION.TOP_RIGHT
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getListOfMetricsOfPolicy = useCallback(async function (idPolicy: string, nro_Version: string) {
    setMetricsOfPolicyLoading(true)
    try {
      const response = await MonitoringService.getMetricsOfPolicyVersion(idPolicy, nro_Version)
      if (response.status === "Correcto") {
        return response.lista
      } else {
        return []
      }
    } catch (error) {
      return []
    } finally {
      setMetricsOfPolicyLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getCisOfPolicyVersion = useCallback(async function (idPolicy: string, nro_Version: string) {
    setListCILoading(true)
    try {
      const response = await MonitoringService.getCIsOfPolicyVersion(idPolicy, nro_Version)
      if (response.status === "Correcto") {
        setListCisOfPolicyVersion(response.lista)
        setListCILoading(false)
      } else {
        setListCisOfPolicyVersion([])
        setListCILoading(false)
      }
    } catch (error) {
      setListCisOfPolicyVersion([])
      setListCILoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getListNameMetricsByCI = useCallback(async function (idPolicy: string, nro_Version: string, idEquipo: string) {
    setListNameMetricListByCI(true)
    try {
      const response = await MonitoringService.getListMetrisByCI(idPolicy, nro_Version, idEquipo)
      if (response.status === "Correcto") {
        setListMetricsNameByCi(response.lista)
        setListNameMetricListByCI(false)
      } else {
        setListMetricsNameByCi([])
        setListNameMetricListByCI(false)
      }
    } catch (error) {
      setListMetricsNameByCi([])
      setListNameMetricListByCI(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cancelUpdatingPolicy = useCallback(async function (idPolicy: string, nro_version: string, usuario: string, idProject: string, closeModalParams: Function, closeModal: Function) {
    setCancelUpdatePolicyLoading(true)
    try {
      const response = await MonitoringService.cancelUpdatePolicy(idPolicy, nro_version, usuario)
      if (response.status === "Correcto") {
        setCancelUpdatePolicyLoading(false)
        toast.success(`La politica ha sido cancelada con éxito. ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
        getListPoliciesByProject(idProject)
        closeModalParams()
        closeModal()
      } else {
        setCancelUpdatePolicyLoading(false)
        toast.error(`Ocurrió un problema al cancelar la Politica. ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    } catch (error) {
      setCancelUpdatePolicyLoading(false)
      toast.error(`Surgió un error inesperado. ${error}`, {
        position: toast.POSITION.TOP_RIGHT
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteCIsOfPolicy = useCallback(async function (deletedCIs: any, idProject: string, closeModal: Function) {
    setDeletingCIsOfPolicyLoading(true)
    try {
      const response = await MonitoringService.deleteCIsOfPolicy(deletedCIs)
      if (response.status === "Correcto") {
        setDeletingCIsOfPolicyLoading(false)
        toast.success(`Los CIs seleccionados fueron procesados exitosamente para su baja de la politica.`, {
          position: toast.POSITION.TOP_RIGHT
        })
        getListPoliciesByProject(idProject)
        closeModal()
      } else {
        setDeletingCIsOfPolicyLoading(false)
        toast.error(`Ocurrió un problema al procesar la baja del los CIs. ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    } catch (error) {
      setDeletingCIsOfPolicyLoading(false)
      toast.error(`Surgió un error inesperado. ${error}`, {
        position: toast.POSITION.TOP_RIGHT
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getListChangesToImplement = useCallback(async function (idPolicy: string, nro_Version: string) {
    setChangesToImplementLoading(true)
    try {
      const response = await MonitoringService.listChangesToImplement(idPolicy, nro_Version)
      if (response.status === "Correcto") {
        setListChangesToImplement(response.lista)
        setChangesToImplementLoading(false)
      } else {
        setListChangesToImplement([])
        setChangesToImplementLoading(false)
      }
    } catch (error) {
      setListChangesToImplement([])
      setChangesToImplementLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateTools = useCallback(async function (changes: IChangeTool, closeModalParams: Function, closeModal: Function) {
    setUpdateToolsLoading(true)
    try {
      const response = await MonitoringService.updateTools(changes)
      if (response.status === "COMPLETO") {
        toast.success(`Se actualizaron las herramientas usadas correctamente.`, {
          position: toast.POSITION.TOP_RIGHT
        })
        closeModalParams()
        closeModal()
      } else {
        toast.error(`Ocurrió un problema al actualizar las herramientas. ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    } catch (error) {
      toast.error(`Surgió un error inesperado. ${error}`, {
        position: toast.POSITION.TOP_RIGHT
      })
    } finally {
      setUpdateToolsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getHistoricalChanges = useCallback(async function (idPolicy: string, nro_Version: string) {
    setHistoricalChangesLoading(true)
    try {
      const response = await MonitoringService.getHistoricalChanges(idPolicy, nro_Version)
      if (response.status === "Correcto") {
        setHistoricalChanges(response.lista)
      } else {
        setHistoricalChanges([])
      }
    } catch (error) {
      setHistoricalChanges([])
    } finally {
      setHistoricalChangesLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    createPolicy, createPolicyLoading, getListPoliciesByProject, fetchPoliciesByProjectLoading, policiesByProject,
    updatePolicyNewVersion, updatePolicyLoading, updateStateOfPolicy, updateStateOfPolicyLoading, getListOfMetricsOfPolicy,
    getCisOfPolicyVersion, listCIsOfPolicyVersion, listCiLoading, getListNameMetricsByCI, listNameMetricsByCI,
    metricsOfPolicyLoading, listNameMetricByCILoading, cancelUpdatingPolicy, cancelupdatePolicyLoading, deleteCIsOfPolicy, deletingCIsOfPolicyLoading,
    getListChangesToImplement, changesToImplementLoading, listChangesToImplement, updateTools, updateToolsLoading,
    getHistoricalChanges, historicalChanges, historicalChangesLoading
  }
}
export { usePolicy }