import { IChangePriority, IUpdateIncidentCenterState, ICreateIncident, INewAction, IReopenIncident, IUpdateAction, IUpdateIncident, IUpdateSintomaConclusion, IncidentItem } from '../views/IncidentCenter/Types'
import { INotifyIncident } from '../views/administration/Types'
import { ApiManagementCCS } from './ApiV2'

const IncidentCenterService = {
  /*getRemedyTickets: () => ApiInventory.get("/incidente/listar_tickets_p1_remedy").then((data) => data.data),
  getICTickets: () => ApiInventory.get("/incidente/listar_incidentes").then((data) => data.data),
  getIncidentByNroTicket: (nro_ticket: string) => ApiInventory.get(`/incidente/listar_incidente_nro_ticket/${nro_ticket}`).then((data) => data.data),
  updateIncident: (updatedIncident: IUpdateIncident | IUpdateIncidentCenterState | IUpdateSintomaConclusion) => ApiInventory.post(`/incidente/actualizar_incidente/`, updatedIncident).then((data) => data.data),
  startTracking: (nro_ticket: string) => ApiInventory.post(`/incidente/iniciar_ticket/${nro_ticket}`).then((data) => data.data),
  getListActions: (id_incidente: string) => ApiInventory.get(`/incidente/listar_incidente_acciones/${id_incidente}`).then((data) => data.data),
  createNewAction: (newAction: INewAction) => ApiInventory.post(`/incidente/crear_incidente_acciones/`, newAction).then((data) => data.data),
  deleteAction: (id_accion: string) => ApiInventory.delete(`/incidente/eliminar_incidente_acciones/${id_accion}`).then((data) => data.data),
  updateAction: (actionUpdated: IUpdateAction) => ApiInventory.post(`/incidente/actualizar_incidente_acciones/`, actionUpdated).then((data) => data.data),
  createTicket: (ticketInfo: any) => ApiInventory.post(`/incidente/crear_ticket/`, ticketInfo).then((data) => data.data),
  PriorizeDespriorize: (TicketToChange: IChangePriority) => ApiInventory.post(`/incidente/cambiar_prioridad/`, TicketToChange).then((data) => data.data),
  notifyIncident: (incidentNumber: string, incidentInfo: INotifyIncident) => ApiInventory.post(`/incidente/notificar/${incidentNumber}`, incidentInfo).then((data) => data.data),
  listCollabTable: (incidentNumber: string) => ApiInventory.get(`/incidente/listar_usuarios_notificacion/${incidentNumber}`).then((data) => data.data),
  addCollabToNotifyTable: (incidentNumber: string, usuario: string, correo: string) => ApiInventory.post(`/incidente/agregarUsuarioNotificar/${incidentNumber}/${usuario}/${correo}`).then((data) => data.data),
  deleteCollabToNotifyTable: (idNotification: string) => ApiInventory.delete(`/incidente/eliminar_usuario_notificacion/${idNotification}`).then((data) => data.data),
  createNewIncident: (newIncidentInfo: ICreateIncident) => ApiInventory.post(`/incidente/crear_ticket/`, newIncidentInfo).then((data) => data.data),
  reopenIncident: (IncidentInfo: IReopenIncident) => ApiInventory.post(`/incidente/reabrirTicket/`, IncidentInfo).then((data) => data.data),
  getRemedyTicketsFinalized: () => ApiInventory.get("/incidente/listar_tickets_resueltos_remedy").then((data) => data.data),
  getStatesIncidentCenter: (prioridad: string) => ApiInventory.get(`/incidente/listar_incidente_estados/${prioridad}`).then((data) => data.data),
  getHistoricIncidents: (nro_Incidente: string) => ApiInventory.get(`/incidente/listar_incidentes_historicos_by_nro_ticket/${nro_Incidente}`).then((data) => data.data),
  getListHistoricIncidents: () => ApiInventory.get(`/incidente/listar_incidentes_historicos/`).then((data) => data.data),
  getListTicketWithObservations: () => ApiInventory.get(`/incidente/listar_tickets_observados/`).then((data) => data.data),
  sendGroupWhatsApp: (nro_Incidente: string) => ApiInventory.get(`/incidente/enviar_whatsapp_grupo/${nro_Incidente}`).then((data) => data.data),*/
  //Nuevos metodo de incident center
  getActiveTickets: () => ApiManagementCCS.get("/incidente/listar_tickets_p1/").then((data) => data),
  getFinalizedTickets: (fecha_inicio?: string, fecha_fin?: string) => {
      const payload = (fecha_inicio && fecha_fin) ? { fecha_inicio, fecha_fin } : {};
      return ApiManagementCCS.post(`/incidente/listar_tickets_resueltos/`, payload).then((data) => data);
    },  getObservatedTickets: () => ApiManagementCCS.get(`/incidente/listar_tickets_observados/`).then((data) => data),
  reopenTicket: (IncidentInfo: IReopenIncident) => ApiManagementCCS.post(`/incidente/reabrirTicket/`, IncidentInfo).then((data) => data),
  getIncidentByNroTicket: (nro_ticket: string) => ApiManagementCCS.get(`/incidente/listar_incidente_nro_ticket/${nro_ticket}`).then((data) => data),
  updateIncident: (updatedIncident: IUpdateIncident | IUpdateIncidentCenterState | IUpdateSintomaConclusion) => ApiManagementCCS.post(`/incidente/actualizar_incidente/`, updatedIncident).then((data) => data),
  startTracking: (nro_ticket: string) => ApiManagementCCS.post(`/incidente/iniciar_ticket/${nro_ticket}`).then((data) => data),
  getListActions: (id_incidente: string) => ApiManagementCCS.get(`/incidente/listar_incidente_acciones/${id_incidente}`).then((data) => data),
  createNewAction: (newAction: INewAction) => ApiManagementCCS.post(`/incidente/crear_incidente_acciones/`, newAction).then((data) => data),
  deleteAction: (id_accion: string) => ApiManagementCCS.delete(`/incidente/eliminar_incidente_acciones/${id_accion}`).then((data) => data),
  updateAction: (actionUpdated: IUpdateAction) => ApiManagementCCS.post(`/incidente/actualizar_incidente_acciones/`, actionUpdated).then((data) => data),
  PriorizeDespriorize: (TicketToChange: IChangePriority) => ApiManagementCCS.post(`/incidente/cambiar_prioridad/`, TicketToChange).then((data) => data),
  notifyIncident: (incidentNumber: string, incidentInfo: INotifyIncident) => ApiManagementCCS.post(`/incidente/notificar/${incidentNumber}`, incidentInfo).then((data) => data),
  listCollabTable: (incidentNumber: string) => ApiManagementCCS.get(`/incidente/listar_usuarios_notificacion/${incidentNumber}`).then((data) => data),
  addCollabToNotifyTable: (incidentNumber: string, usuario: string, correo: string) => ApiManagementCCS.post(`/incidente/agregarUsuarioNotificar/${incidentNumber}/${usuario}/${correo}`).then((data) => data),
  deleteCollabToNotifyTable: (idNotification: string) => ApiManagementCCS.delete(`/incidente/eliminar_usuario_notificacion/${idNotification}`).then((data) => data),
  createNewIncident: (newIncidentInfo: ICreateIncident) => ApiManagementCCS.post(`/incidente/crear_ticket/`, newIncidentInfo).then((data) => data),
  getStatesIncidentCenter: (prioridad: string) => ApiManagementCCS.get(`/incidente/listar_incidente_estados/${prioridad}`).then((data) => data),
  getHistoricIncident: (nro_Incidente: string) => ApiManagementCCS.get(`/incidente/listar_incidentes_historicos_by_nro_ticket/${nro_Incidente}`).then((data) => data),
  getListHistoricIncidents: (fecha_inicio?: string, fecha_fin?: string) => {const payload = (fecha_inicio && fecha_fin)  ? { fecha_inicio, fecha_fin } : {};return ApiManagementCCS.post(`/incidente/listar_incidentes_historicos/`, payload).then((data) => data);},
  sendGroupWhatsApp: (nro_Incidente: string) => ApiManagementCCS.get(`/incidente/enviar_whatsapp_grupo/${nro_Incidente}`).then((data) => data),
  exportIncidents: (fecha_inicio?: string, fecha_fin?: string) => {
    const payload = (fecha_inicio && fecha_fin) ? { fecha_inicio, fecha_fin } : {};
      return ApiManagementCCS.post(`/incidente/exportar_all_incidente`, payload).then((data) => data);
  },
  exportTableIncidentFiltered: (table_filtered: IncidentItem[]) => {
    const payload = { table_filtered };
    return ApiManagementCCS.post(`/incidente/export_table_incident_filtered`, payload, {
      responseType: 'arraybuffer'
    }).then((data) => data);
  },
  toggleAutomaticAlerts: (id_incidente: string, activar_flag: number) => ApiManagementCCS.get(`/incidente/activar_flag_alerta/${id_incidente}/${activar_flag}`).then((data) => data),
  //El endpoint de abajo es diferente al de arriba
  getIncidentByNroTicketv2: (nro_ticket: string) => ApiManagementCCS.get(`/incidente/get_incident_by_nro_ticket/${nro_ticket}`).then((data) => data)

}

export { IncidentCenterService }