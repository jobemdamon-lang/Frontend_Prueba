import { useCallback, useContext, useState } from "react"
import { BackupService } from "../../../services/Backup.service"
import { Context } from "../components/politicas/Context"
import { ICreateRequestChange, IDataRequestChanges, IDataRequestChangesOR, ILogs, ISendTaskToApprove, ModalSize, ModalView } from "../components/politicas/Types"
import { toast } from "react-toastify"
import { useRequestTasks } from "./useRequestTasks"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../../../store/ConfigStore"
import { IAuthState } from "../../../store/auth/Types"

//Custom Hook que devuelve un metodo para hacer la llamada a la API::GET Solicitudes, la data de los Politicas y el estado de carga
const useRequestChanges = (): any => {

  const { closeModal, openModal } = useContext(Context)
  const { fetchRequestAndTask } = useRequestTasks()

  //Estados para el manejo de la peticion Listar Solicitudes de Cambios
  const [requestChangesData, setRequestchanges] = useState<Array<IDataRequestChanges>>([])
  const [requestChangesLoading, setLoading] = useState(false)
  //Estados para el manejo de la peticion Crear Solicitud de Cambio
  const [loadingRequestChange, setLoadingRequestChange] = useState(false)
  //Estado para el manejo de la peticion de Listar solicitud de un usuario
  const [loadingRequestByUser, setLoadingRequestByUser] = useState(true)
  const [requestchangesDataByUser, setRequestChangeByUser] = useState([])
  //Estado para la peticion asignar tarea a aprobador
  const [loadingTaskToApprover, setLoadingTaskToApprover] = useState(false)
  //Estado para la peticion de envio de solicitud de cambio al siguiente estado
  const [loadingSendRequest, setLoadingSendRequest] = useState(false)
  //Estado para la peticion de envio de listra logs de aprobaciones
  const [loadingLogs, setLoadingLogs] = useState(false)
  const [logsData, setLogsData] = useState<Array<ILogs>>([])
  //Estado para la peticion de cancelación de una solicitud de cambio
  const [cancelRequestChangeLoading, setCancelRequestChangeLoading] = useState(false)

  const user: IAuthState = useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState

  //Metodo para llamar a la API ::GET Listar Solicitudes
  const fetchRequestChanges = useCallback(async function (GroupCode: string) {
    try {
      setLoading(true)
      const response = await BackupService.listRequests(GroupCode)
      if (response.status === "Correcto") {
        setRequestchanges(response.lista.reverse())
        setLoading(false)
      } else {
        setRequestchanges([])
        setLoading(false)
      }
    } catch (error) {
      setRequestchanges([])
      setLoading(false)
    }
  }, [])

  //Metodo para llamar a la API ::POST Crear Solicitud de Cambio
  const createRequestChange = useCallback(async function (requestInformation: ICreateRequestChange) {
    try {
      setLoadingRequestChange(true)
      const response = await BackupService.createRequest(requestInformation)
      if (response.status === "Correcto") {
        toast.success("Solicitud Creada!", {
          position: toast.POSITION.TOP_RIGHT
        })
        setLoadingRequestChange(false)
        fetchRequestChanges(requestInformation.id_grupo.toString())
        setTimeout(() => {
          //Se cierra el modal de Creación de Solicitud
          closeModal()
          //Se llama al endpoint de listar detalle de solicitud y su lista de tareas con el id_solicitud devuelto
          fetchRequestAndTask(response.id_solicitud).then((data: IDataRequestChangesOR) => {
            if (data?.id_solicitud === undefined) {
              toast.error(`Oh No! Ocurrio un problema al solicitar la información`, {
                position: toast.POSITION.TOP_RIGHT
              })
            }
            //Se abre el modal de detalle de solicitud con la informacion fetcheada previamente
            openModal(ModalView.REQUEST_CHANGE_DETAIL_RW, ModalSize.XL, data)
          })
        }, 200)
      } else {
        toast.error(`Oh No! No se pudo crear la solicitud: ${response.message} `, {
          position: toast.POSITION.TOP_RIGHT
        })
        setLoadingRequestChange(false)
      }
    } catch (error) {
      toast.error(`Oh No! No se pudo crear la solicitud: ${error} `, {
        position: toast.POSITION.TOP_RIGHT
      })
      setLoadingRequestChange(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //Metodo para llamar a la API ::POST Asignar tarea a un responsable
  const assignTaskToApprover = useCallback(async function (approver: string, area: number, id_soli_tareas: string, fetchlistTaskToApprove: any, id_solicitud: string, setShowApproval: any) {
    try {
      setLoadingTaskToApprover(true)
      let taskToSendToApprove: ISendTaskToApprove = {
        aprobador: approver,
        id_area: area.toString(),
        id_tareas_ap: id_soli_tareas,
        usuario: user.usuario
      }
      console.log("Asignar tarea -> id_solicitud :", id_solicitud)
      const response = await BackupService.assignApprover(taskToSendToApprove) /* {data:{status:"Correcto"}} */
      if (response.data.status === "Correcto") {
        toast.success("Tarea Asignada Correctamente.", {
          position: toast.POSITION.TOP_RIGHT
        })
        setLoadingTaskToApprover(false)
        fetchlistTaskToApprove(id_solicitud)
        setShowApproval(false)
      } else {
        setLoadingTaskToApprover(false)
        toast.error(`Oh No! Ocurrió un problema al asignar la tarea. ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    } catch (error) {
      setLoadingTaskToApprover(false)
      toast.error(`Oh No! Ocurrió un problema al asignar la tarea. ${error}`, {
        position: toast.POSITION.TOP_RIGHT
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //Metodo para enviar la solicitud de Cambio al siguiente Estado
  const sendRequestChange = useCallback(async function (id_solicitud: string) {
    try {
      setLoadingSendRequest(true)
      const response = await BackupService.sendRequestToAnotherState(id_solicitud, user.usuario) /* { status: "Correcto" } */
      if (response.status === "ok") {
        toast.success("Solicitud Enviada Correctamente.", {
          position: toast.POSITION.TOP_RIGHT
        })
        setLoadingSendRequest(false)
        closeModal()
      } else {
        setLoadingSendRequest(false)
        toast.error(`Oh No! Ocurrió un problema al Enviar la Solicitud. ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    } catch (error) {
      setLoadingSendRequest(false)
      toast.error(`Oh No! Ocurrió un problema al Enviar la Solicitud. ${error}`, {
        position: toast.POSITION.TOP_RIGHT
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //Metodo para llamar a la API ::GET Listar Solicitudes por Usuario
  const fetchRequestChangesByUser = useCallback(async function (user_name: string) {
    try {
      setLoadingRequestByUser(true)
      const response = await BackupService.listRequestsByUser(user_name)
      if (response.status === "Correcto") {
        setRequestChangeByUser(response.lista)
        setLoadingRequestByUser(false)
      } else {
        setRequestChangeByUser([])
        setLoadingRequestByUser(false)
      }
    } catch (error) {
      setRequestChangeByUser([])
      setLoadingRequestByUser(false)
    }
  }, [])

  //Metodo para llamar a la API ::GET Listar Logs de Aprobaciones
  const fetchLogsRequest = useCallback(async function (id_solicitud: string) {
    try {
      setLoadingLogs(true)
      const response = await BackupService.listLogs(id_solicitud)
      if (response.status === "Correcto") {
        setLogsData(response.lista)
        setLoadingLogs(false)
      } else {
        setLogsData([])
        setLoadingLogs(false)
      }
    } catch (error) {
      setLogsData([])
      setLoadingLogs(false)
    }
  }, [])

  //Metodo para enviar la solicitud de Cambio al siguiente Estado
  const cancelRequestChange = useCallback(async function (params: { id_solicitud: number, usuario: string }) {
    setCancelRequestChangeLoading(true)
    try {
      const response = await BackupService.cancelRequestChange(params)
      if (response.status === "Correcto") {
        toast.success("La solicitud fue Cancelada exitosamente.", {
          position: toast.POSITION.TOP_RIGHT
        })
        return true
      } else {
        toast.error(`Oh No! Ocurrió un problema al Cancelar la Solicitud. ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
        return false
      }
    } catch (error) {
      toast.error(`Oh No! Ocurrió un error inesperado. ${error}`, {
        position: toast.POSITION.TOP_RIGHT
      })
      return false
    } finally {
      setCancelRequestChangeLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    fetchRequestChanges, requestChangesData, requestChangesLoading, createRequestChange, loadingRequestChange, assignTaskToApprover,
    loadingTaskToApprover, loadingRequestByUser, requestchangesDataByUser, fetchRequestChangesByUser, loadingSendRequest,
    sendRequestChange, fetchLogsRequest, loadingLogs, logsData, cancelRequestChange, cancelRequestChangeLoading
  }
}

export { useRequestChanges }