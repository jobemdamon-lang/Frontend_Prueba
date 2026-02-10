import { ApiManagementCCS } from './ApiV2'

const BackupService = {
   getDataFilter: (params:any) => ApiManagementCCS.post("/administracion/opcion/listar",params).then((data) => data.data),
   listGroupsPolicies: (idProject:string) => ApiManagementCCS.get(`/backup/listarGrupo/${idProject}`).then((data) => data.data),
   createGroup: (params:any) => ApiManagementCCS.post("/backup/crearGrupo",params).then((data) => data.data),
   createRequest: (params:any) => ApiManagementCCS.post("/backup/crearSolicitud",params).then((data) => data.data),
   createTask: (canCreateCorrelative:string,params:any) => ApiManagementCCS.post(`/backup/crearSolicitudTarea/${canCreateCorrelative}`,params).then((data) => data).catch((err)=> err),
   listTaskOfRequest: (id_solicitud:string) => ApiManagementCCS.get(`/backup/listarSolicitudTarea/${id_solicitud}`).then((data) => data.data),
   listDetailOfRequest: (id_solicitud:string) => ApiManagementCCS.get(`/backup/listarSolicitudDetalle/${id_solicitud}`).then((data) => data.data),
   aprobarTareas: (id_soli_tarea:string, flag_aprobacion:string,user:string) => ApiManagementCCS.post(`/backup/aprobarTarea/${id_soli_tarea}/${flag_aprobacion}/${user}`).then((data) => data).catch((err)=> err),
   eliminarTarea: (id_soli_tarea:string, usuario:string) => ApiManagementCCS.delete(`/backup/eliminarTarea/${id_soli_tarea}/${usuario}`).then((data) => data).catch((err)=> err),
   listRequestsByUser: (user_name:string) => ApiManagementCCS.get(`/backup/listarSolicitudesUsuario/${user_name}`).then((data) => data.data),
   listRequestToApprove: (id_solicitud:string) => ApiManagementCCS.get(`/backup/listarSolicitudTareaAprobador/${id_solicitud}`).then((data) => data.data),
   searchTasksOfPolicy: (searchByIdRequest:string="1", idEquipo:string="0", idSolicitud:string ) => ApiManagementCCS.get(`/backup/buscarTareasPolitica/${searchByIdRequest}/${idEquipo}/${idSolicitud}`).then((data) => data.data),
   addTaskOfPolicyToRequest: (flag:string, params:any ) => ApiManagementCCS.post(`/backup/guardarTareaDesdePolitica/${flag}`,params).then((data) => data.data),
   sendRequestToAnotherState: (id_solicitud:string, usuario:string) => ApiManagementCCS.post(`/backup/enviarSolicitud/${id_solicitud}/${usuario}`).then((data) => data.data),
   assignApprover: (params:any) => ApiManagementCCS.post("/backup/asignarAprobadores", params).then((data) => data).catch((err)=> err),
   listLogs: (id_politica:string) => ApiManagementCCS.get(`/backup/listarLogSolicitud/${id_politica}`).then((data) => data.data),
   cancelRequestChange: (params: any) => ApiManagementCCS.post(`/backup/cancelarSolicitud`,params).then((data) => data.data),
   exportPolicy: (id:string, version:string) => ApiManagementCCS.post(`/backup/exportar/${id}/${version}`).then((data) => data.data),
   listTasksOfPolicy: (id_politica:string, version: string) => ApiManagementCCS.get(`/backup/listarTareaPolitica/${id_politica}/${version}`).then((data) => data.data),

   //Se usa en useOptions.ts
   listPolicies: (idGroup:string) => ApiManagementCCS.get(`/backup/listarPolitica/${idGroup}`).then((data) => data.data),
   listRequests: (idGroup:string) => ApiManagementCCS.get(`/backup/listarSolicitud/${idGroup}`).then((data) => data.data),
   //2da version
   getGroupPolicies: (idProject: number) => ApiManagementCCS.get(`/backup/listarGrupo/${idProject}`).then((data) => data),
   createGroupPolicy: (params: any) => ApiManagementCCS.post("/backup/crearGrupo", params).then((data) => data),
   createRequestChange: (params: any) => ApiManagementCCS.post("/backup/crearSolicitud", params).then((data) => data),
   listRequestDetails: (id_solicitud:string) => ApiManagementCCS.get(`/backup/listarSolicitudDetalle/${id_solicitud}`).then((data) => data),
   exportPolicyV2: (id:string, version:string) => ApiManagementCCS.post(`/backup/exportar/${id}/${version}`).then((data) => data),
   listTasksOfPolicyV2: (id_politica:string, version: string) => ApiManagementCCS.get(`/backup/listarTareaPolitica/${id_politica}/${version}`).then((data) => data),

}

export { BackupService }