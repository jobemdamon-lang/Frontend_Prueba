//Formato de la data de la API GET::Listar Politicas
export interface IDataTableRowsPolicies {
  estado: string | null,
  nro_ticket?: string | null
  fecha_version: string | null,
  id_bkversion: number,
  id_politica: number,
  id_solicitud: number | null,
  motivo: string | null,
  nro_version: number
}

//Formato de la data de la API GET::Listar Solicitud de Cambio
export interface IDataRequestChanges {
  actor_actual?: string | null,
  actor_siguiente?: string | null,
  etapa?: string | null,
  fecha_actualizacion?: string | null,
  motivo?: string,
  id_solicitud?: number | null,
  solicitante?: string,
  tipo_solicitud?: string,
  cliente?: string,
  proyecto?: string,
  grupo?: string,
  fecha_registro?: string | null,
  tareas: ITask[]
}

export interface IDataRequestChangeByUser {
  ACTOR_ACTUAL: string,
  ESTADO_SIGUIENTE: string,
  ETAPA: string,
  FECHA_ACTUALIZACION: string | null,
  FECHA_REGISTRO: string | null,
  ID_SOLICITUD: number,
  MOTIVO: string,
  NRO_TICKET: number | null,
  SOLICITANTE: string,
  TIPO_SOL: string
}

//Estructura de datos de API GET::Detalle Solicitud
export interface IDataDetailRequest {
  actor_actual?: string,
  actor_siguiente?: string,
  alp?: string,
  cliente?: string,
  estado_actual?: string,
  estado_siguiente?: string,
  etapa?: string | null,
  id_solicitud?: number,
  motivo?: string | null,
  nombreSolicitante?: string | null,
  politica?: string,
  proyecto?: string,
  tipo_sol?: string,
  usuarioSolicitante?: string,
}

//Estructura de datos de API GET::Detalle Solicitud + GET::Tareas de Solicitud 
export interface IDataRequestChangesOR {
  actor_actual?: string,
  actor_siguiente?: string,
  alp?: string,
  cliente?: string,
  estado_actual?: string,
  estado_siguiente?: string,
  etapa?: string | null,
  id_solicitud?: number,
  motivo?: string | null,
  nombreSolicitante?: string | null,
  politica?: string,
  proyecto?: string,
  tipo_sol?: string,
  usuarioSolicitante?: string,
  nro_ticket?: string
  tareas: ITask[]
}

//Formato de la data GET::Tareas de Solicitud (42)
export interface ITask {
  accion?: string,
  aclaracion?: string,
  bk_lib_id: number,
  bklib_drive?: string,
  bkp_bd?: string,
  bkp_tnameold?: string,
  bks_depend: number,
  bks_detres?: string,
  bks_dom?: number,
  bks_eliminar_cont?: number,
  bks_jue?: number,
  bks_lun?: number,
  bks_mar?: number,
  bks_mie?: number,
  bks_sab?: number,
  bks_server?: string,
  bks_tamdat?: string,
  bks_vie?: number,
  cell_manager?: string,
  comentario?: string,
  contenido?: string,
  //Es detalle dependencia - API por correción
  detalle_independencia?: string,
  estado?: string,
  frecuencia?: string,
  herramienta?: string,
  hora_estimado?: number,
  hora_vfin?: string,
  hora_vinicio?: string,
  id_poli_tarea?: number,
  id_soli_tarea?: number,
  id_solicitud?: number,
  lista_hora: IListHours[],
  lista_ruta: IListRoutes[],
  lista_server: IListServers[],
  lista_proteccion_frecuencia: IListFrecuencyProtection[],
  medio?: string,
  minuto_estimado?: number,
  modo?: string,
  nombre_tarea?: string,
  proceso_estado?: string,
  proteccion?: string,
  tipo_backup?: string,
  tipo_tarea?: string,
  aprobador: string,
  area: string
  /* lista_aprobadores: [
    {
      usuario: string,
      area: string,
      tarea: string
    }
  ] */
}

export interface IListHours {
  descripcion: string,
  estado: string,
  id_soli_hora: number,
  observacion: string
}

export interface IListRoutes {
  descripcion: string,
  estado: string,
  excepcion: string,
  id_equipo: number,
  id_soli_ruta: number
  parametro: string,
  unidad: string,
  nombreEquipo?: string
}

export interface IListServers {
  estado: string,
  id_equipo: number,
  nombreci: string,
  ambiente?: string,
  tipoEquipo?: string,
  ubicacion?: string,
  ip?: string,
  nombreVirtual?: string
}

export interface IListFrecuencyProtection {
  estado: string;
  frecuencia: string;
  id_soli_tarea_pf: number;
  proteccion: string;
}

/*----------------------------------------------------------------------------------------------------- */
//Tipos referentes a la creación de una tarea

//Formato para crear una nueva Tarea a una solicitud de Cambio (43)
export interface ICreateTask {
  id_soli_tarea?: number,
  id_poli_tarea?: number,
  nombre_tarea?: string,
  hora_vinicio?: string,
  hora_vfin?: string,
  bks_lun?: number,
  bks_mar?: number,
  bks_mie?: number,
  bks_jue?: number,
  bks_vie?: number,
  bks_sab?: number,
  bks_dom?: number,
  bks_eliminar_cont?: number,
  tipo_backup?: string,
  frecuencia?: string,
  contenido?: string,
  modo?: string,
  herramienta?: string,
  proteccion?: string,
  medio?: string,
  cell_manager?: string,
  bks_depend: string,
  accion?: string,
  aclaracion?: string,
  proceso_estado?: string,
  id_solicitud?: number,
  bks_tamdat?: string,
  bks_detres?: string,
  bks_server?: string,
  tipo_tarea?: string,
  bk_lib_id: string,
  bklib_drive?: string,
  detalle_dependencia?: string,
  hora_estimado?: string,
  minuto_estimado?: string,
  bkp_tnameold?: string,
  bkp_bd?: string,
  comentario?: string,
  estado?: string,
  usuario: string,
  lista_server: ICreateServers[],
  lista_ruta: ICreateRoutes[],
  lista_hora: ICreateHours[],
  lista_proteccion_frecuencia: ICreateFrecuencyProtection[]
}

/* idRow es un atributo que se removerá al enviar la data, se usa unicamente como id unico para busquedas en la tabla 
y actualizaciones, el id es generado con la dependencia uniqid()*/

//Formato para enviar la informacion de las Rutas
export interface ICreateRoutes {
  idRow?: string,
  id_soli_ruta: number,
  descripcion: string,
  excepcion: string,
  id_equipo: number,
  unidad: string,
  parametro: string,
  estado: number
}

//Formato enviar la informacion de Servidores
export interface ICreateServers {
  idRow?: string,
  id_equipo: number,
  nombreci: string,
  estado: number,
  isCreatedInFront?: boolean
}

//Formato del listado de la informacion de las Horas
export interface ICreateHours {
  idRow?: string,
  id_soli_hora: number,
  descripcion: string,
  observacion: string,
  estado: number
}

//Formato del listado de la informacion de las Frecuencias - Proteccion
export interface ICreateFrecuencyProtection {
  idRow?: string,
  id_soli_tarea_pf: number,
  proteccion: string,
  frecuencia: string,
  estado: number
}

/*----------------------------------------------------------------------------------------------------- */

//Formato para listar-mostrar los servidores - CI en la tabla
export interface IDataTableRowsServers {
  id_equipo: number,
  nombreci: string,
  estado: string
  tipo: string,
  ip: string,
  ambiente: string,
  ubicacion: string,
  idRow?: string,
  nombreVirtual?: string
}

//Formato para listar-mostrar las rutas en la tabla
export interface IDataTableRowsRoutes {
  nombreci: string,
  id_soli_ruta: number,
  descripcion: string,
  excepcion: string,
  id_equipo: number,
  unidad: string,
  parametro: string,
  estado: number,
  idRow?: string
}

//Formato para listar-mostrar las horas en la tabla
export interface IDataTableRowsHours {
  hora_inicio: string,
  estado: number,
  id_soli_hora: number,
  idRow?: string
}

//Formato para listar-mostrar las frecuencias y proteccion en la tabla
export interface IDataTableRowsFrecuencyProtection {
  idRow?: string,
  id_soli_tarea_pf: number,
  proteccion: string,
  frecuencia: string,
  estado: number
}

/*----------------------------------------------------------------------------------------------------- */

//Formato de data de API listarEquipos
export interface IDataFetchServers {
  ID_EQUIPO: number;
  NOMBRE_CI: string;
  TIPO_EQUIPO: string;
  IPLAN: string;
  AMBIENTE: string;
  UBICACION: string;
  FAMILIA: string;
  CLASE: string;
  PROYECTO: string;
  ALP: string;
  CLIENTE: string;
  NOMBRE_VIRTUAL: string;
}


//Formato de la data de la API GET::Listar Tareas de una Politica
export interface IDataTableRowsTaskPolicies {
  item_idunico: string,
  server: string,
  tarea: string,
  tipo: string,
  frecuencia: string,
  modo: string,
  ventana_inicio: string,
  ventana_fin: string,
  duracion_estimacion: string
}

//Formato de envio para la API POST::Crear Grupo
export interface ICreateGroup {
  id_proyecto: number,
  cliente: string,
  alp: string,
  usuario: string
}
//Formato de envio para la API POST::Crear Solicitud
export interface ICreateRequestChange {
  id_grupo: number,
  motivo: string,
  usuario: string
}

//Formato de Propietario 
export interface IClientProject {
  cliente: string,
  proyecto: string,
  id_proyecto?: number
  alp?: string
}

//Formato de data de API opcion/listar
export interface IComboData {
  codigo: number,
  nombre: string
}

//Formato para la extraccion de datos de Equipos por Clase y Familia
export interface IClaseFamilia {
  familia: number,
  clase: string
}

export interface IModifyTask {
  id_soli_tarea?: number,
  id_poli_tarea?: number,
  nombre_tarea?: string,
  hora_vinicio?: string,
  hora_vfin?: string,
  bks_lun?: number,
  bks_mar?: number,
  bks_mie?: number,
  bks_jue?: number,
  bks_vie?: number,
  bks_sab?: number,
  bks_dom?: number,
  bks_eliminar_cont?: number,
  tipo_backup?: string,
  frecuencia?: string,
  contenido?: string,
  modo?: string,
  herramienta?: string,
  proteccion?: string,
  medio?: string,
  cell_manager?: string,
  bks_depend: string,
  accion?: string,
  aclaracion?: string,
  proceso_estado?: string,
  id_solicitud?: number,
  bks_tamdat?: string,
  bks_detres?: string,
  bks_server?: string,
  tipo_tarea?: string,
  bk_lib_id?: string,
  bklib_drive?: string,
  //Es detalle dependencia - API
  detalle_dependencia?: string,
  hora_estimado?: string,
  minuto_estimado?: string,
  bkp_tnameold?: string,
  bkp_bd?: string,
  comentario?: string,
  estado?: string,
  usuario: string,
  lista_server: ICreateServers[],
  lista_ruta: ICreateRoutes[],
  lista_hora: ICreateHours[],
  lista_proteccion_frecuencia: ICreateFrecuencyProtection[]
  /* lista_aprobadores: [
    {
      usuario: string,
      area: string,
      tarea: string
    }
  ] */
}

export interface IListServerPolicy {
  estado: string,
  id_equipo: number,
  nombreci: string
}

export interface IListHourPolicy {
  descripcion: string,
  estado: string,
  id_poli_hora: number,
  observacion: string
}

export interface IListRoutesPolicy {
  descripcion: string,
  estado: string,
  excepcion: string,
  id_equipo: number,
  id_poli_ruta: number
  parametro: string,
  unidad: string,
  nombreEquipo?: string
}

//Formato para listar las tareas de una poltica
export interface ITaksOfPolicies {
  accion: string,
  aclaracion: string,
  bk_lib_id: number,
  bklib_drive: string,
  bkp_bd: string,
  bkp_tnameold: string,
  bks_depend: number,
  bks_detres: string,
  bks_dom: number,
  bks_eliminar_cont: number,
  bks_juev: number,
  bks_lun: number,
  bks_mar: number,
  bks_mie: number,
  bks_sab: number,
  bks_server: string,
  bks_tamdat: string,
  bks_vie: number,
  cell_manager: string,
  comentario: string,
  contenido: string,
  detalle_dependencia: string,
  estado: string,
  frecuencia: string,
  herramienta: string,
  hora_estimado: number,
  hora_vfin: string,
  hora_vinicio: string,
  id_bkversion: number,
  id_poli_tarea: number,
  id_politica: number,
  medio: string,
  minuto_estimado: number,
  modo: string,
  nombre_tarea: string,
  proceso_estado: string,
  proteccion: string,
  tipo_backup: string,
  tipo_tarea: string,
  lista_hora: IListHourPolicy[],
  lista_ruta: IListRoutesPolicy[],
  lista_server: IListServerPolicy[]
}

export const initialTask: ITaksOfPolicies = {
  accion: "",
  aclaracion: "",
  bk_lib_id: 0,
  bklib_drive: "",
  bkp_bd: "",
  bkp_tnameold: "",
  bks_depend: 0,
  bks_detres: "",
  bks_dom: 0,
  bks_eliminar_cont: 0,
  bks_juev: 0,
  bks_lun: 0,
  bks_mar: 0,
  bks_mie: 0,
  bks_sab: 0,
  bks_server: "",
  bks_tamdat: "",
  bks_vie: 0,
  cell_manager: "",
  comentario: "",
  contenido: "",
  detalle_dependencia: "",
  estado: "",
  frecuencia: "",
  herramienta: "",
  hora_estimado: 0,
  hora_vfin: "",
  hora_vinicio: "",
  id_bkversion: 0,
  id_poli_tarea: 0,
  id_politica: 0,
  medio: "",
  minuto_estimado: 0,
  modo: "",
  nombre_tarea: "",
  proceso_estado: "",
  proteccion: "",
  tipo_backup: "",
  tipo_tarea: "",
  lista_hora: [
    {
      descripcion: "",
      estado: "",
      id_poli_hora: 0,
      observacion: ""
    }
  ],
  lista_ruta: [
    {
      descripcion: "",
      estado: "",
      excepcion: "",
      id_equipo: 0,
      id_poli_ruta: 0,
      parametro: "",
      unidad: ""
    }
  ],
  lista_server: [
    {
      estado: "",
      id_equipo: 0,
      nombreci: "",
    }
  ]
}

export interface ISearchTaskOfPolicy extends Omit<ITaksOfPolicies, "lista_hora" | "lista_ruta" | "lista_server"> {
}

export interface ISearchTasksWithFormat extends ISearchTaskOfPolicy {
  has_a_change: {
    isInRequest: boolean,
    isDownTask: boolean,
    isModifiedTask: boolean,
    isChangeInFront: boolean
  },
}

//Formato de DATA Api:: Listar Logs de Aprobaciones
export interface ILogs {
  ACCION: string,
  APROBADOR: string,
  ESTADO_APROB: string,
  ESTADO_SOLICITUD: string,
  ID_SOLI_TAREA_APROB: number,
  NOMBRE_TAREA: string,
  ROL_APROB: string | null,
  area: string,
  estado: string,
  id_soli_tarea: number
}

//Formato para unir la cabecera de una politica con sus tareas de esa politica
export interface IPolicyWithTasks extends IDataTableRowsPolicies {
  tareas: ITaksOfPolicies[]
}

export interface IFrecuencias {
  DIARIO: string,
  SEMANAL: string,
  MENSUAL: string,
  FECHAFIJA: string,
  ADEMANDA: string,
  ANUAL: string
}

//Formato de Api Listar tareas por Aprobar - ApprovalModal
export interface ITaskToApprove {
  ACCION: string,
  APROBADOR: string,
  ESTADO: string,
  ESTADO_APROB: string,
  ESTADO_SOLICITUD: string,
  ID_SOLI_TAREA: number,
  ID_SOLI_TAREA_APROB: number,
  NOMBRE_TAREA: string
}

//Formato de l endpoint para enviar una tarea a aprobar
export interface ISendTaskToApprove {
  aprobador: string,
  id_area: string,
  id_tareas_ap: string,
  usuario: string
}

//Formato original de la data de la API GET::Listar Grupos de Politicas
export interface IGroupPolicies { codigo: number, nombre: string }
//Formato modificado para su uso en el componente DatalistInput
export interface IGroupPoliciesDataListFormat { id: number, value: string }
//Enum con los distintos posibles contenidos del Modal
export enum ModalView {
  CREATE_GROUP = "CREATE_GROUP",
  CHANGE_REQUEST = "CHANGE_REQUEST",
  TASK_PANE = "TASK_PANE",
  REQUEST_CHANGE_DETAIL_OR = "REQUEST_CHANGE_DETAIL_OR",
  REQUEST_CHANGE_DETAIL_RW = "REQUEST_CHANGE_DETAIL_RW",
  SEARCH_REQUEST = "SEARCH_REQUEST"
}
//Enum con los distintos posibles tamaños del Modal
export enum ModalSize { XL = "xl", LG = "lg", SM = "sm" }
//Enum con los estado de aprobacion
export enum estadoAprovador {
  ES = "Elaborar Solicitud",
  DT = "Definir Tareas de Backup",
  AT = "Aprobar Tareas de Backup",
  IT = "Implementar Tareas de Backup",
  T = "Terminado"
}