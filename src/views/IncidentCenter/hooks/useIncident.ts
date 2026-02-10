import { useCallback, useState } from "react"
import { IncidentCenterService } from "../../../services/IncidentCenter.service"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../../../helpers/handleAxiosError"
import { errorNotification, successNotification } from "../../../helpers/notifications"
import { IAction, IChangePriority, ICoincidentes, ICreateIncident, IHistoricIncidents, IListCollabsToNotify, INewAction, INotifyIncident, IStateIncidentCenter, IUpdateAction, IUpdateIncident, IUpdateIncidentCenterState, IUpdateSintomaConclusion, IUseIncident } from "../Types"

const useIncident = (): IUseIncident => {

  //Estados para el metodo actualizar datos de incidencia
  const [updateIncidentLoading, setUpdateIncidentLoading] = useState(false)

  //Estado para el listar la información de un ticket 
  const [incidentInfoLoading, setIncidentInfoLoading] = useState(false)

  //Estado para el metodo de iniciar seguimiento de un ticket 
  const [startTrackingLoading, setStartTrackingLoading] = useState(false)

  //Estado para el metodo de listar acciones de una Incidencia
  const [actionList, setActionList] = useState<IAction[]>([])
  const [actionListLoading, setActionaListLoading] = useState(false)

  //Estado para el metodo de añadir una nueva Accion
  const [newActionLoading, setNewActionLoading] = useState(false)

  //Estado para el metodo de eliminar una Accion
  const [deleteActionLoading, setDeleteActionLoading] = useState(false)

  //Estado para el metodo de actualizar una Accion
  const [updateActionLoading, setUpdateActionLoading] = useState(false)

  //Estado para el metodo notificar el incidente
  const [notifyIncidentLoading, setNotifyIncidentLoading] = useState(false)

  //Estado para el metodo notificar el incidente
  const [changePriorityLoading, setChangePriorityLoading] = useState(false)

  //Estado para el metodo añadir un nuevo colaborador a la lista de notificados
  const [addCollabToNotifyTableLoading, setAddCollabToNotifyTableLoading] = useState(false)

  //Estado para el metodo listar colaboradores en la lista de notificados
  const [collabsToNotify, setCollabsToNotify] = useState<IListCollabsToNotify[]>([])
  const [listCollabsToNotifyLoading, setListCollabsToNotifyLoading] = useState(false)

  //Estado para el metodo eliminar un nuevo colaborador de la lista de notificados
  const [deleteCollabToNotifyTableLoading, setDeleteCollabToNotifyTableLoading] = useState(false)

  //Estado para el metodo crear un nuevo Incident P1
  const [createIncidentLoading, setCreateIncidentLoading] = useState(false)

  //Estado para el metodo listar los estado Inciden center
  const [incidentCenterStates, setIncidentCenterStates] = useState<IStateIncidentCenter[]>([])
  const [loadingStates, setLoadingStates] = useState(false)

  //Estado para listar las incidencias historicas coincidentes
  const [historicIncidentLoading, setHistoricIncidentLoading] = useState<boolean>(false)
  const [historicIncident, setHistoricIncident] = useState<ICoincidentes[]>([])

  //Estado para listar las incidencias historicas en general ALL
  const [listHistoricINCLoading, setListHistoricINCLoading] = useState<boolean>(false)
  const [listHistoricIncidents, setListHistoricIncidents] = useState<IHistoricIncidents[]>([])

  //Estado para el metodo de actualizar - confirmar el estado del ticket
  const [updateICStateLoading, setUpdateICStateLoading] = useState(false)

  //Estado para el metodo enviar notificacion (reporte) al grupo de WhatsApp
  const [sendingWhatsAppLoading, setSendingWhatsAppLoading] = useState(false)

  //Estados para el metodo actualizar sintoma y conclusiones
  const [updateSintomaConlusionLoading, setUpdateSintomaConlusionLoading] = useState(false)

  //Estados para el metodo exportar incidentes
  const [exportIncidentsLoading, setExportIncidentsLoading] = useState(false)

  //Estados para las alertas automáticas
  const [automaticAlertsEnabled, setAutomaticAlertsEnabled] = useState<boolean>(false)
  const [automaticAlertsLoading, setAutomaticAlertsLoading] = useState<boolean>(false)

  //Estados para la carga de la busqueda de un incidente especifico
  const [incidentInfoLoadingv2, setIncidentInfoLoadingv2] = useState<boolean>(false)

  const updatedInfoIncident = useCallback(async function (updatedIncident: IUpdateIncident) {
    setUpdateIncidentLoading(true)
    try {
      const response = await IncidentCenterService.updateIncident(updatedIncident)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        successNotification("La información del incidente de actualizó correctamente"); return true
      } else {
        errorNotification(response.data.mensaje)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setUpdateIncidentLoading(false)
    }
  }, [])

  const updatedSintomaConlusionIncident = useCallback(async function (updatedIncident: IUpdateSintomaConclusion) {
    setUpdateSintomaConlusionLoading(true)
    try {
      const response = await IncidentCenterService.updateIncident(updatedIncident)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        successNotification("La información del incidente de actualizó correctamente"); return true
      } else {
        errorNotification(response.data.mensaje)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setUpdateSintomaConlusionLoading(false)
    }
  }, [])

  const getInfoIncidentByNroTicket = useCallback(async function (nro_ticket: string) {
    setIncidentInfoLoading(true)
    try {
      const response = await IncidentCenterService.getIncidentByNroTicket(nro_ticket)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        if (response.data.lista.length !== 0) return { data: response.data.lista[0], success: true }
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setIncidentInfoLoading(false)
    }
  }, [])

  const getInfoIncidentWithServiceAideData = useCallback(async function (nro_ticket: string) {
    setIncidentInfoLoadingv2(true)
    try {
      const response = await IncidentCenterService.getIncidentByNroTicketv2(nro_ticket)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        if (response.data.lista.length !== 0) {
          return { data: response.data.lista[0], success: true }
        } else {
          return { success: false, mensaje: response.data.mensaje || "Ocurrió un error. Intentar de nuevo" }
        }
      } else {
        return { success: false, mensaje: response.data.mensaje || "Error al consultar el ticket" }
      }
    } catch (e) {
      handleAxiosError(e)
      return { success: false, mensaje: "Ocurrió un error al buscar el ticket. Intente nuevamente." }
    } finally {
      setIncidentInfoLoadingv2(false)
    }
  }, [])

  const startTracking = useCallback(async function (nro_ticket: string) {
    setStartTrackingLoading(true)
    try {
      const response = await IncidentCenterService.startTracking(nro_ticket)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        successNotification("Se inició el seguimiento de la incidencia correctamente"); return true
      } else {
        errorNotification(response.data.mensaje)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setStartTrackingLoading(false)
    }
  }, [])

  const getListActions = useCallback(async function (id_incidente: string) {
    setActionaListLoading(true)
    try {
      const response = await IncidentCenterService.getListActions(id_incidente)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setActionList(response.data.lista)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setActionaListLoading(false)
    }
  }, [])

  const createNewAction = useCallback(async function (newAction: INewAction) {
    setNewActionLoading(true)
    try {
      const response = await IncidentCenterService.createNewAction(newAction)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        successNotification("Guardado"); return true
      } else {
        errorNotification(response.data.mensaje)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setNewActionLoading(false)
    }
  }, [])

  const deleteAction = useCallback(async function (id_accion: string) {
    setDeleteActionLoading(true)
    try {
      const response = await IncidentCenterService.deleteAction(id_accion)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        successNotification("Eliminado"); return true
      } else {
        errorNotification(response.data.mensaje)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setDeleteActionLoading(false)
    }
  }, [])

  const updateAction = useCallback(async function (updatedAction: IUpdateAction) {
    setUpdateActionLoading(true)
    try {
      const response = await IncidentCenterService.updateAction(updatedAction)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        successNotification("La acción tomada se actualizó correctamente"); return true
      } else {
        errorNotification(response.data.mensaje)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setUpdateActionLoading(false)
    }
  }, [])

  const notifyIncident = useCallback(async function (incidentNumber: string, incidentInfo: INotifyIncident) {
    setNotifyIncidentLoading(true)
    try {
      const response = await IncidentCenterService.notifyIncident(incidentNumber, incidentInfo)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        successNotification("La notificó correctamente a los implicados"); return true
      } else {
        errorNotification(response.data.mensaje)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setNotifyIncidentLoading(false)
    }
  }, [])

  const ChangePriorityIncident = useCallback(async function (incidentToChange: IChangePriority) {
    setChangePriorityLoading(true)
    try {
      const response = await IncidentCenterService.PriorizeDespriorize(incidentToChange)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        successNotification("La cambió la prioridad de la incidencia correctamente"); return true
      } else {
        errorNotification(response.data.mensaje)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setChangePriorityLoading(false)
    }
  }, [])

  const getListCollabsToNotify = useCallback(async function (nroIncident: string) {
    setListCollabsToNotifyLoading(true)
    try {
      const response = await IncidentCenterService.listCollabTable(nroIncident)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setCollabsToNotify(response.data.lista)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setListCollabsToNotifyLoading(false)
    }
  }, [])

  const addCollabToNotifyTable = useCallback(async function (incidentNumber: string, usuario: string, correo: string) {
    setAddCollabToNotifyTableLoading(true)
    try {
      const response = await IncidentCenterService.addCollabToNotifyTable(incidentNumber, usuario, correo)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        successNotification("Añadido"); return true
      } else {
        errorNotification(response.data.mensaje)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setAddCollabToNotifyTableLoading(false)
    }
  }, [])

  const deleteCollabToNotifyTable = useCallback(async function (idNotificacion: string) {
    setDeleteCollabToNotifyTableLoading(true)
    try {
      const response = await IncidentCenterService.deleteCollabToNotifyTable(idNotificacion)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        successNotification("Retirado"); return true
      } else {
        errorNotification(response.data.mensaje)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setDeleteCollabToNotifyTableLoading(false)
    }
  }, [])

  const createIncident = useCallback(async function (incidentInfo: ICreateIncident) {
    setCreateIncidentLoading(true)
    try {
      const response = await IncidentCenterService.createNewIncident(incidentInfo)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        successNotification(`Se creó el incidente correctamente. Numero del Ticket : ${response.data.lista}`); return true
      } else {
        errorNotification(response.data.mensaje)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setCreateIncidentLoading(false)
    }
  }, [])

  const getListStatesIncidentCenter = useCallback(async function (priority: string) {
    setLoadingStates(true)
    try {
      const response = await IncidentCenterService.getStatesIncidentCenter(priority)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setIncidentCenterStates(response.data.lista)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setLoadingStates(false)
    }
  }, [])

  const getHistoricIncident = useCallback(async function (nroIncidente: string) {
    setHistoricIncidentLoading(true)
    try {
      const response = await IncidentCenterService.getHistoricIncident(nroIncidente)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setHistoricIncident(response.data.lista)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setHistoricIncidentLoading(false)
    }
  }, [])

  const getListHistoricIncidents = useCallback(async function (fecha_inicio?: string, fecha_fin?: string) {
    setListHistoricINCLoading(true)
    try {
      const response = await IncidentCenterService.getListHistoricIncidents(fecha_inicio, fecha_fin)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setListHistoricIncidents(response.data.lista)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setListHistoricINCLoading(false)
    }
  }, [])

  const updateICState = useCallback(async function (updatedIncident: IUpdateIncidentCenterState) {
    setUpdateICStateLoading(true)
    try {
      const response = await IncidentCenterService.updateIncident(updatedIncident)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        successNotification("Se actualizó el incidente correctamente"); return true
      } else {
        errorNotification(response.data.mensaje)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setUpdateICStateLoading(false)
    }
  }, [])

  const sendGroupWhatsApp = useCallback(async function (nro_Incidente: string) {
    setSendingWhatsAppLoading(true)
    try {
      const response = await IncidentCenterService.sendGroupWhatsApp(nro_Incidente)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        successNotification("Se envió el reporte al Grupo de WhatsApp correctamente"); return true
      } else {
        errorNotification(response.data.mensaje)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setSendingWhatsAppLoading(false)
    }
  }, [])

  const exportIncidents = useCallback(async function (fecha_inicio?: string, fecha_fin?: string) {
    setExportIncidentsLoading(true)
    try {
      const response = await IncidentCenterService.exportIncidents(fecha_inicio, fecha_fin)
      const url = URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
      const link = document.createElement('a');
      link.href = url;
      let today = new Date();
      let date = today.getFullYear() + "" + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);;
      let time = today.getHours() + "" + today.getMinutes();
      let filename = date + '_' + time + "-incidentes.xlsx";
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExportIncidentsLoading(false)
    } catch (error) {
      alert("Ops.. Al parecer ocurrió un problema al extraer el archivo")
      setExportIncidentsLoading(false)
    }
  }, [])

  const toggleAutomaticAlerts = useCallback(async function (enable: boolean, incidentId: string) {
    setAutomaticAlertsLoading(true);
    try {
      // Convertir boolean a número: true = 1, false = 0
      const activar_flag = enable ? 1 : 0;
      const response = await IncidentCenterService.toggleAutomaticAlerts(incidentId, activar_flag);
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setAutomaticAlertsEnabled(enable);
        successNotification(`Las alertas automáticas han sido ${enable ? "habilitadas" : "deshabilitadas"} correctamente.`);
        return true;
      } else {
        errorNotification(response.data.mensaje);
      }
    } catch (e) {
      handleAxiosError(e);
    } finally {
      setAutomaticAlertsLoading(false);
    }
  }, []);

  return {
    updatedInfoIncident, updateIncidentLoading,
    updatedSintomaConlusionIncident, updateSintomaConlusionLoading,
    getInfoIncidentByNroTicket, incidentInfoLoading,
    startTracking, startTrackingLoading,
    getListActions, actionList, actionListLoading,
    createNewAction, newActionLoading,
    deleteAction, deleteActionLoading,
    updateAction, updateActionLoading,
    notifyIncident, notifyIncidentLoading,
    ChangePriorityIncident, changePriorityLoading,
    addCollabToNotifyTable, addCollabToNotifyTableLoading,
    getListCollabsToNotify, collabsToNotify, listCollabsToNotifyLoading,
    deleteCollabToNotifyTable, deleteCollabToNotifyTableLoading,
    createIncident, createIncidentLoading,
    getListStatesIncidentCenter, incidentCenterStates, loadingStates,
    getHistoricIncident, historicIncident, historicIncidentLoading,
    getListHistoricIncidents, listHistoricINCLoading, listHistoricIncidents,
    updateICState, updateICStateLoading,
    sendingWhatsAppLoading, sendGroupWhatsApp,
    exportIncidents, exportIncidentsLoading,
    toggleAutomaticAlerts, automaticAlertsLoading, automaticAlertsEnabled, setAutomaticAlertsEnabled,
    getInfoIncidentWithServiceAideData, incidentInfoLoadingv2
  }
}

export { useIncident }