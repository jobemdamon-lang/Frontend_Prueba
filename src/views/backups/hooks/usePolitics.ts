import { useCallback, useContext, useState } from "react"
import { BackupService } from "../../../services/Backup.service"
import { IDataTableRowsPolicies, ISearchTaskOfPolicy, ITaksOfPolicies, ITask } from "../components/politicas/Types"
import { toast } from "react-toastify"
import { useRequestTasks } from "./useRequestTasks"
import { Context } from "../components/politicas/Context"

//Custom Hook que devuelve un metodo para hacer la llamada a la API, la data de los Politicas y el estado de carga
const usePolitics = (): any => {

  //Estados para el manejo de la solicitud Listar Politicas de un Grupo
  const [ policiesData, setPoliciesData ] = useState<Array<IDataTableRowsPolicies>>([])
  const [ policiesLoading, setLoading] = useState(false)

  //Estados para el manejo de la solicitud Listar Tareas de una Politica
  const [tasksOfPoliciesData , setTasksOfPolicies] = useState<Array<ITaksOfPolicies>>([])
  const [loadingTaskOfPolicies, setLoadingTaskOfPolicies] = useState(false)

  //Estados para el manejo de la solicitud Buscar Tareas de una Politica
  const [searchTaskOfPoliciesData , setSearchTasksOfPolicies] = useState<Array<ISearchTaskOfPolicy>>([])
  const [loadingSearchTaskOfPolicies, setSearchLoadingTaskOfPolicies] = useState(false)

  //Estados para el manejo de la solicitud Buscar Tareas de una Politica
  const [loadingAddTaskToRequest, setLoadingAddTaskToRequest] = useState(false)
  const [showCorrelative, setShowCorrelative] = useState(false)

  const { fetchListOfTasks } = useRequestTasks()
  const { refreshTask } = useContext(Context)

  const fetchPolitics = useCallback(async function (GroupCode:string) {
    try {
      setLoading(true)
      const response = await BackupService.listPolicies(GroupCode)
      if(response.status === "Correcto"){
        const policiesDataOrdered = response.lista.sort((a:IDataTableRowsPolicies, b:IDataTableRowsPolicies) => b.id_bkversion - a.id_bkversion)
        setPoliciesData(policiesDataOrdered)
        setLoading(false)
      }else{
        setPoliciesData([])
        setLoading(false)
      }
    } catch (error) {
      setPoliciesData([])
      setLoading(false)
    }
  }, [])

  //Listar tarea de una politica
  const fetchTaskOfPolitics = useCallback(async function (id_politica:string, version:string) {
    try {
      setLoadingTaskOfPolicies(true)
      const response = await BackupService.listTasksOfPolicy(id_politica, version)
      if(response.status === "Correcto"){
        setTasksOfPolicies(response.lista)
        setLoadingTaskOfPolicies(false)
        return response.lista
      }else{
        setTasksOfPolicies([])
        setLoadingTaskOfPolicies(false)
        return []
      }
    } catch (error) {
      setTasksOfPolicies([])
      setLoadingTaskOfPolicies(false)
      return []
    }
  }, [])

  //Buscar tareas de una politica
  const searchTaskOfpolicy = useCallback(async function (searchByidRequest:string, id_Equipo:string, id_solicitud:string) {
    try {
      setSearchLoadingTaskOfPolicies(true)
      const response = await BackupService.searchTasksOfPolicy(searchByidRequest, id_Equipo, id_solicitud)
      if(response.status === "Correcto"){
        setSearchTasksOfPolicies(response.lista)
        setSearchLoadingTaskOfPolicies(false)
        return response.lista
      }else{
        setSearchTasksOfPolicies([])
        setSearchLoadingTaskOfPolicies(false)
        return []
      }
    } catch (error) {
      setSearchTasksOfPolicies([])
      setSearchLoadingTaskOfPolicies(false)
      return []
    }
  }, [])

  //Metodo para agregar una tarea de la politica a una solicitud de cambio
  const sendTaskOfPolicyToRequest = useCallback(async function (flag:string, params:any, id_solicitud:string) {
    try {
      setLoadingAddTaskToRequest(true)
      const response = await BackupService.addTaskOfPolicyToRequest(flag, params)
      if(response.status === "Repetido"){
        toast.warn(`Tareas repetidas ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
        setLoadingAddTaskToRequest(false)
        setShowCorrelative(true)
      }else if(response.status === "Correcto"){
        toast.success(`Tarea Agregada Correctamente ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
        fetchListOfTasks(params.id_solicitud).then((data: ITask[]) => {
          refreshTask(data)
        })
        searchTaskOfpolicy("1","0", id_solicitud)
        setShowCorrelative(false)
        setLoadingAddTaskToRequest(false)
      }
    } catch (error) {
      toast.error(`Ocurrio un problema ${error}`, {
        position: toast.POSITION.TOP_RIGHT
      })
      setLoadingAddTaskToRequest(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return {fetchPolitics, policiesData, policiesLoading, fetchTaskOfPolitics, loadingTaskOfPolicies, tasksOfPoliciesData,
          searchTaskOfpolicy, searchTaskOfPoliciesData, loadingSearchTaskOfPolicies, sendTaskOfPolicyToRequest, setShowCorrelative,
          showCorrelative, loadingAddTaskToRequest }
}

export { usePolitics }