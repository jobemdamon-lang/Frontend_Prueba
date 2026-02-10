import { useCallback, useContext, useState } from "react"
import { BackupService } from "../../../services/Backup.service"
import { IDataDetailRequest, IDataRequestChangesOR, ITask, ITaskToApprove } from "../components/politicas/Types"
import { Context } from "../components/politicas/Context"
import { toast } from "react-toastify"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../../../store/ConfigStore"
import { IAuthState } from "../../../store/auth/Types"

//Custom Hook que devuelve un metodo para hacer la llamada a la API::GET Solicitudes, la data de los Politicas y el estado de carga
const useRequestTasks = (): any => {

  const { refreshTask } = useContext(Context)
  //Estados para almacenar el estado de las tareas de una Solicitud
  const [tasksLoading, setTasksLoading] = useState(false)
  //Estados para almacenar el estado del detalle de una Solicitud
  const [detailLoading, setDetailLoading] = useState(false)
  //Estado para el metodo eliminar Tarea
  const [loadingDelete, setLoadingDelete] = useState(false)
  //Estado para el metodo aprobar Tarea
  const [loadingApprove, setLoadingApprove] = useState(false)
  //Estado para el metodo aprobar Tarea
  const [loadingDisapprove, setLoadingDisapprove] = useState(false)
  //Estado para listar las tareas con sus aprobadores
  const [listTaskToApprove, setListTaskToApprove] = useState<Array<ITaskToApprove>>([])
  const [loadingTaskToApprove, setTasksToApproveLoading] = useState(false)

  const user: IAuthState = useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState

  //Metodo para llamar a la API ::GET Listar Tareas de una Solicitud
  const fetchListOfTasks = useCallback(async function (id_solicitud: string): Promise<ITask[]> {
    try {
      setTasksLoading(true)
      const response = await BackupService.listTaskOfRequest(id_solicitud)
      if (response.status === "Correcto") {
        setTasksLoading(false)
        return response.lista
      } else {
        setTasksLoading(false)
        return []
      }
    } catch (error) {
      setTasksLoading(false)
      return []
    }
  }, [])

  //Metodo para llamar a la API ::GET Listar Detalle de Solicitud
  const fetchDetailOfTasks = useCallback(async function (id_solicitud: string): Promise<IDataDetailRequest> {
    try {
      setDetailLoading(true)
      const response = await BackupService.listDetailOfRequest(id_solicitud)
      if (response.status === "Correcto") {
        setDetailLoading(false)
        return response.lista[0]
      } else {
        setDetailLoading(false)
        return {}
      }
    } catch (error) {
      setDetailLoading(false)
      return {}
    }
  }, [])

  //Metodo para obtener la informacion del estado de la Solicitud y sus tareas
  const fetchRequestAndTask = useCallback(async function (id_solicitud: string): Promise<IDataRequestChangesOR> {
    try {
      const [tasks, details] = await Promise.allSettled([fetchListOfTasks(id_solicitud), fetchDetailOfTasks(id_solicitud)])
        .then(results => {
          const allValues = (results.filter((c: any) => c.status === 'fulfilled') as PromiseFulfilledResult<any>[]).map(c => c.value)
          return allValues
        });
      return { ...details, tareas: tasks }
    } catch (error) {
      return { tareas: [] }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //Metodo para aprobar y desaprobar una tarea *flag_aprobacion*
  const approveTask = useCallback(async (id_solicitud:any , id_soli_tarea: string) => {
    setLoadingApprove(true)
    try {
      const response = await BackupService.aprobarTareas(id_soli_tarea, "1", user.usuario)
      if (response.data.status === "ok") {
        toast.success(`La tarea ha sido Aprobada!`, {
          position: toast.POSITION.TOP_RIGHT
        })
        fetchListOfTasks(id_solicitud).then((data: ITask[]) => {
          refreshTask(data)
        })
        setLoadingApprove(false)
      } else {
        toast.warn(`Oh No! Ha ocurrido un problema ${response.data.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
        setLoadingApprove(false)
      }
    } catch (error: any) {
      toast.error(`Oh No! Ha ocurrido un problema ${error}`, {
        position: toast.POSITION.TOP_RIGHT
      })
      setLoadingApprove(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //Metodo para aprobar y desaprobar una tarea *flag_aprobacion*
  const disapproveTask = useCallback(async (id_solicitud:any , id_soli_tarea: string) => {
    setLoadingDisapprove(true)
    try {
      const response = await BackupService.aprobarTareas(id_soli_tarea, "0", user.usuario)
      if (response.data.status === "ok") {
        toast.success(`La tarea ha sido Desaprobada!`, {
          position: toast.POSITION.TOP_RIGHT
        })
        fetchListOfTasks(id_solicitud).then((data: ITask[]) => {
          refreshTask(data)
        })
        setLoadingDisapprove(false)
      } else {
        toast.warn(`Oh No! Ha ocurrido un problema ${response.data.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
        setLoadingDisapprove(false)
      }
    } catch (error: any) {
      toast.error(`Oh No! Ha ocurrido un problema ${error}`, {
        position: toast.POSITION.TOP_RIGHT
      })
      setLoadingDisapprove(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteTask = useCallback(async function (id_solicitud:any, id_task: string) {
    setLoadingDelete(true)
    try {
      const response = await BackupService.eliminarTarea(id_task, user.usuario)
      if (response.data.status === "Correcto") {
        toast.success(`La tarea ha sido Eliminada con exito !`, {
          position: toast.POSITION.TOP_RIGHT
        })
        fetchListOfTasks(id_solicitud).then((data: ITask[]) => {
          refreshTask(data)
        })
        setLoadingDelete(false)
      } else {
        toast.warn(`Oh No! Ha ocurrido un problema ${response.data.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
        setLoadingDelete(false)
      }
    } catch (error: any) {
      toast.error(`Oh No! Ha ocurrido un problema ${error}`, {
        position: toast.POSITION.TOP_RIGHT
      })
      setLoadingDelete(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //Metodo para llamar a la API ::GET Listar las tareas con sus aprobadores
  const fetchlistTaskToApprove = useCallback(async function (id_solicitud: string) {
    try {
      setTasksToApproveLoading(true)
      const response = await BackupService.listRequestToApprove(id_solicitud)/*  const response = {status:"Correcto", data:[]} */
      if (response.status === "Correcto") {
        setTasksToApproveLoading(false)
        setListTaskToApprove(response.lista)
      } else {
        setTasksToApproveLoading(false)
        setListTaskToApprove([])
      }
    } catch (error) {
      setTasksToApproveLoading(false)
      setListTaskToApprove([])
    }
  }, [])

  return { tasksLoading, fetchListOfTasks, detailLoading, fetchDetailOfTasks, fetchRequestAndTask, approveTask, loadingApprove,
          deleteTask , loadingDelete , disapproveTask, loadingDisapprove, fetchlistTaskToApprove, listTaskToApprove, loadingTaskToApprove
        }
}

export { useRequestTasks }