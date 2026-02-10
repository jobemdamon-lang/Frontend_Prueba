//Tipado para la carpeta politicas

export interface IMonitoringPolicy {
  COMENTARIO: string | null,
  ESTADO: number,
  ESTADO_POLITICA: string,
  FECHA_CREACION: string,
  FECHA_IMPLEMENTACION: null | string,
  FECHA_MODIFICACION: null | string,
  ID_POLITICA: number,
  NOMBRE: string,
  USUARIO_CREACION: string,
  USUARIO_MODIFICACION: null | string,
  VERSION_ACTUAL: number,
  id_proyecto: number
}

export interface IMonitoringPolicyVersions {
  ESTADO: number;
  ESTADO_POLITICA: string;
  FECHA_CREACION: Date;
  FECHA_MODIFICACION: null | string;
  FECHA_VERSION: Date;
  ID_POLITICA: number;
  ID_VERSION: number;
  NOMBRE: string;
  NRO_CRQ: null | string;
  NRO_TICKET: null | string;
  NRO_VERSION: number;
  SOLICITANTE: string;
  USUARIO_CREACION: string;
  USUARIO_IMPLEMENTADOR: null | string;
  USUARIO_MODIFICACION: null | string;
  TICKET_ORIGEN: null | string;
}

// Interfaces del Catalogo
export interface IListCatalog {
  FAMILIA: string,
  lista_clase: IListClase[]
}

export interface IListClase {
  CLASE: string,
  lista_ci: IEquipmentsRestantes[],
  lista_herramientas: IListHerramienta[],
  lista_tipo_equipo: IListTypeEquipment[]
}

export interface IListHerramienta {
  HERRAMIENTA_MONITOREO: string;
}

export interface IListTypeEquipment {
  TIPO_EQUIPO: string;
  lista_herramientas: IListHerramienta[]
}

//Formato Requerido para crear las metricas de Equipos 
export interface ICreateMetricsPolicy {
  id_politica: number,
  id_proyecto: number,
  usuario: string,
  lista_equipo: ListaEquipmentsToMetrics[]
}

export interface ListaEquipmentsToMetrics {
  id_equipo: number,
  familia: string,
  clase: string,
  tipo_equipo: string,
  herramienta: string
}

//Formato Momentaneo de creación de una metrica de Puerto
export interface ICreatePortMetric {
  protocolo: string,
  nro_puerto: string,
  intervalo: number
}

//Formato Momentaneo de creación de una metrica de Disponibilidad de servicio
export interface ICreateDisponibilityMetric {
  servicio_asociado: string,
  command_process: string,
  intervalo: number
}

//Formato Momentaneo de creación de una metrica de Disponibilidad de servicio
export interface ICreateFileSystemMetric {
  ruta_disco: string,
  intervalo: number
}

//Formato del Listado de Detalle Politica (trae todas las metricas de un politica-version)

export interface Urgency {
  ID_DETALLE_POLITICA: number | string,
  VALOR: string,
  NRO_POOLEO: string
}

export interface IListMetricsPolicyVersion {
  ALERTA: string | null;
  CLASE: string;
  CLIENTES: string;
  COMMAND_PROCESS: string | null;
  CRITICAL: Urgency;
  DATA_D: string | null;
  DESCRIPCION: string | null;
  DETALLE: string;
  EQUIPO_ESTADO: string;
  ESCALAMIENTO: string | null;
  ESTADO: number;
  FAMILIA: string;
  FATAL: Urgency;
  FECHA_CREACION: string;
  FECHA_MODIFICACION: string | null;
  FRECUENCIA: string;
  HERRAMIENTA_MONITOREO: string;
  ID_DETALLE_VERSION: number;
  ID_EQUIPO: number;
  ID_VERSION: number;
  INTERFACE: string | null;
  IP: string;
  METRICAS: string;
  UNIDADES: string | null;
  METRICA_RUTA: string | null;
  MONITOREADO_DESDE: string | null;
  NOMBRE: string;
  NOMBRE_CI: string;
  NOMBRE_MODULO: string | null;
  NRO_POOLEOS: string;
  OBSERVACION: string | null;
  PATH_D: string | null;
  PROTOCOLO: string | null;
  PUERTO: string | null;
  RECURSOS: string;
  SERVICIO_ASOCIADO: string | null;
  TIPO_EQUIPO: string;
  TIPO_MONITOREO: string | null;
  UMBRAL_CRITICAL: string | null;
  UMBRAL_WARNING: string | null;
  USUARIO_CREACION: string;
  USUARIO_MODIFICACION: string | null;
  WARNING: Urgency;
  TABLESPACE_NAME: string | null;
  NOMBRE_INSTANCIA: string | null;
  NRO_PUERTO_INSTANCIA: string | null;
  NOMBRE_DB: string;
  NOMBRE_JOB: string | null;
  DISPONIBILIDAD_PROCESO: string | null;
  COMMAND_PATH: string | null;
  NOMBRE_INTERFAZ: string | null;
  ESTADO_INTERFACE: string | null;
  ALL_REPLICAS: string | null;
  PRIMARY_REPLICAS: string | null;
  SOME_REPLICAS: string | null;
  APP_POOL: string | null;
  NAME_WEB: string | null;
}

//Formato Restruturado de del Listado de Detalle Politica usado para Front - Dinamico

export interface IListMetricsPolicyVersionFront {
  ID: string,
  FAMILIA: string,
  METRICS: (IListMetricsPolicyVersion & { ID: string })[]
}

//Formato requerido para la lista de actualizar una politica - existentes
export interface IUpdateListaPolitica {
  id_detalle_politica: number | string,
  id_politica: number,
  nro_version: number,
  id_equipo: number,
  estado: number,
  metricas: string,
  tipo_equipo: string,
  herramienta_monitoreo: string,
  umbral: string,
  nro_pooleos: string,
  frecuencia: string,
  observacion: string,
  tipo_monitoreo: string,
  monitoreado_desde: string
  //Metrica FileSystem
  metrica_ruta: string,
  //Metrica Servicio Asociado 
  servicio_asociado: string,
  command_process: string,
  //Metrica Puertos
  protocolo: string,
  puerto: string,
  //Metrica TableSpaceUtilization
  tablespace_name: string,
  //Metrica TransactionLog
  nombre_instancia: string,
  nro_puerto_instancia: string,
  //Metrica MSSQL DB
  nombre_db: string,
  //Metrica MSSQL JOB
  nombre_job: string,
  // Metrica Disponibilidad de Procesos
  disponibilidad_proceso: string,
  command_path: string,
  //Metrica Disponibilidad de Interface
  nombre_interfaz: string,
  //Metrica Estado de Interface
  estado_interface: string,
  //Metrica MSSQL AG - Some replicas unhealthy
  some_replicas: string,
  //Metrica MSSQL AG - All replicas unhealthy
  all_replicas: string,
  //Metrica MSSQL AG - Primary replica recovery health in progress
  primary_replicas: string,
  //Metrica IIS: Application Pool
  app_pool: string,
  //Metrica Last error message of scenario Availability Web
  name_web: string
}

export interface ICIOfPolicyDetail {
  BAJA_EQUIPO: string,
  CLASE: string;
  DESCRIPCION: string;
  EQUIPO_ESTADO: string;
  FAMILIA: string;
  ID_EQUIPO: number;
  IP: string;
  NOMBRE: string;
  NOMBRE_CI: string;
  NOMBRE_VIRTUAL: string;
  HEERAMIENTA_MONITOREO: string | null;
  TIPO_EQUIPO: string
}

export interface IListMetricsByCi {
  METRICAS: string
}

export interface IChangesToBeImplemented extends IPolicyHistoryDetail {}

export interface IOwner {
  cliente: string,
  proyecto: string,
  id_proyecto: number
}

//Estructura de envio de una nueva politica - Lista de Equipos-CI
export interface ICreatePolicy_CI {
  id_equipo: number,
  categoria1: string,
  categoria2: string
}

//Estructura de envio de una nueva politica
export interface ICreatePolicy {
  id_proyecto: number,
  usuario: string,
  lista_equipo: ICreatePolicy_CI[]
}

export interface ICIRows {
  ID_EQUIPO: number;
  NOMBRE: string | null;
}

export interface IListEquipmentsOfPolicy {
  equipos_politica: IListEquipments[],
  politica: IMonitoringPolicy
}

export interface IListEquipments {
  DESCRIPCION: string;
  EQUIPO_ESTADO: string;
  ID_EQUIPO: number;
  IP: string;
  NOMBRE: string;
  NOMBRE_CI: string;
}

export interface IGenerateNewPolicy {
  id_politica: number;
  usuario: string;
  lista_politica: IUpdateListaPolitica[];
  lista_politica_new: IUpdateListaPolitica[]
}

export interface IGetDetailOfIdDetallePolitica {
  ALERTA: null | string;
  CATEGORIA1: null | string;
  CATEGORIA2: null | string;
  COMMAND_PROCESS: null | string;
  DATA_D: null | string;
  DESCRIPCION: string;
  DETALLE: null | string;
  ESCALAMIENTO: null | string;
  ESTADO: null | string;
  FECHA_CREACION: string;
  FECHA_MODIFICACION: null | string;
  FRECUENCIA: null | string;
  HERRAMIENTA_MONITOREO: null | string;
  ID_DETALLE_POLITICA: number;
  ID_EQUIPO: number;
  ID_POLITICA: number;
  INTERFACE: string;
  METRICA_RUTA: null | string;
  MONITOREADO_DESDE: null | string;
  NOMBRE_MODULO: null | string;
  NRO_POOLEOS: null | string;
  NRO_VERSION: number;
  OBSERVACION: string;
  PATH_D: null | string;
  PROTOCOLO: null | string;
  PUERTO: null | string;
  SERVICIO_ASOCIADO: null | string;
  TIPO_METRICA: null | string;
  TIPO_MONITOREO: null | string;
  TORRE: null | string;
  UMBRAL: null | string;
  UMBRAL_CRITICAL: null | string;
  UMBRAL_WARNING: null | string;
  UNIDADES: null | string;
  URGENCIA: null | string;
  USUARIO_CREACION: string;
  USUARIO_MODIFICACION: null | string;
}

//Formato requerido para actualizar una politica
export interface IUpdatePolicy {
  id_politica: number,
  nro_version: number
  usuario: string,
  nro_ticket: string,
  motivo: string,
  lista_politica: IUpdateListaPolitica[],
  lista_politica_new: IUpdateListaPolitica[]
}

export interface IEquipmentsRestantes {
  ADMINISTRADOPOR: null;
  ADMINISTRADOR: string;
  AMBIENTE: string;
  BACKUPS: string;
  BACKUPS_CLOUD: string;
  BAHIA_DESDE: string;
  BAHIA_HASTA: string;
  CANTIDAD_RU: string;
  CLASE: string;
  CONFIDENCIALIDAD: string;
  CPU_DESCRIPCION: string;
  CRQ_ALTA: string;
  DESCRIPCION: string;
  DETALLE_ADMINISTRACION: string;
  DETALLE_PROPIEDAD: string;
  DISK_APROVISIONADO: string;
  DISK_ASIGNADO: string;
  DISPONIBILIDAD: string;
  ENERGIA_KW: string;
  ENERGIA_USO: string;
  EQUIPO_ESTADO: string;
  ESTADO: boolean;
  FABRICANTE: string;
  FAMILIA: string;
  FECHA_ALTA: string;
  FECHA_BAJA: string;
  FECHA_CREACION: Date;
  FECHA_MODIFICACION: Date;
  ID_EQUIPO: number;
  ID_GENESYS: null;
  ID_PROYECTO: number;
  INTEGRIDAD: string;
  LINEA_BASE: string;
  MARCA: string;
  MODELO: string;
  MONITOREO: string;
  MONITOREO_CLOUD: string;
  NOMBRE: string;
  NOMBRE_CI: string;
  NOMBRE_VIRTUAL: string;
  NRO_CID: string;
  NRO_CORE: string;
  NRO_CPU: string;
  NRO_RANURAS: string;
  NRO_SERIE: string;
  PART_NUMBER: string;
  PRIORIDAD: string;
  PROPIEDAD: string;
  PROVEEDOR: string;
  RAM_ASIGNADO: string;
  RANGO_RU_DESDE: string;
  RANGO_RU_HASTA: string;
  REFERENCIA_EXTERNA: string;
  ROL_USO: string;
  SISTEMA_OPERATIVO: string;
  TIPO_ALCANCE: string;
  TIPO_EQUIPO: string;
  TIPO_SERVICIO: string;
  TOKEN_ID: string;
  UBICACION: string;
  USUARIO_CREACION: string;
  USUARIO_MODIFICACION: string;
  VCENTER: string;
  VERSION_SW: string;
}

export interface IResumeDetailPolicy {
  aplicacion: number;
  clase: string;
  cliente: string;
  cpu_memoria: number;
  descripcion: string;
  equipo_estado: string;
  filesystem: number;
  id_equipo: number;
  ipNat: null | string | number;
  network: number;
  nombre: string;
  nombre_ci: string;
  nro_ip: string;
  red: number;
  servicio: number;
  web: number;
}

export interface ICatalogModel {
  CATEGORIA1: string;
  CATEGORIA2: string;
  CLIENTES: string;
  DETALLE: string;
  FRECUENCIA: string;
  HERRAMIENTA_MONITOREO: string;
  ID_CATALOGO: number;
  METRICAS: string;
  NRO_POOLEOS: string;
  TORRE: string;
  UMBRAL: string;
  UNIDADES: string;
  URGENCIA: string;
}

export interface ITools {
  HERRAMIENTA_MONITOREO: string,
}

//Cuerpo para el envio de la petición cambiar herramienta
export interface IChangeTool {
  id_politica: number,
  nro_version: number,
  usuario: string,
  lista_equipo: IListaEquipoHerramienta[]
}

export interface IListaEquipoHerramienta {
  id_equipo: number,
  herramienta_monitoreo: string
}

export interface IPolicyHistory {
  estado: number;
  estado_politica: string;
  fecha: string;
  fecha_creacion: string;
  id_historial: number;
  id_version: number;
  motivo: null | string;
  nro_ticket: null | string;
  usuario: string;
  usuario_creacion: string;
  version_politica: number;
  ticket_monitoreo: string
}

export interface IDetailHistoryUmbral {
  VALOR: string;
  ID_HISTORICO_DETALLES: number;
  NRO_POOLEOS: string;
}

export interface IPolicyHistoryDetail {
  CRITICAL: IDetailHistoryUmbral;
  FATAL: IDetailHistoryUmbral;
  WARNING: IDetailHistoryUmbral;
  ALERTA: string | null;
  Accion: string | null;
  CLASE: string | null;
  CLASE_EQUIPO: string | null;
  CLIENTES: string | null;
  COMMAND_PATH: string | null;
  COMMAND_PROCESS: string | null;
  DATA_D: string | null;
  DESCRIPCION: string | null;
  DESCRIPCION_EQUIPO: string | null;
  DETALLE: string | null;
  DISPONIBILIDAD_PROCESO: string | null;
  EQUIPO_ESTADO: string | null;
  ESCALAMIENTO: string | null;
  ESTADO: number;
  ESTADO_POLITICA: string | null;
  ESTADO_POLITICA_REAL: string | null;
  FAMILIA: string | null;
  FECHA: string | null;
  FECHA_CREACION: string | null;
  FECHA_MODIFICACION: string | null;
  FRECUENCIA: string | null;
  HERRAMIENTA_MONITOREO: string | null;
  ID_DETALLE_POLITICA: number;
  ID_DETALLE_VERSION: number;
  ID_EQUIPO: number;
  ID_HISTORIAL: number;
  ID_HISTORICO_DETALLES: number;
  ID_VERSION: number;
  INTERFACE: string | null;
  IP: string | null;
  METRICAS: string | null;
  METRICA_RUTA: string | null;
  MONITOREADO_DESDE: string | null;
  MOTIVO: string | null;
  NOMBRE: string | null;
  NOMBRE_CI: string | null;
  NOMBRE_MODULO: string | null;
  NRO_POOLEOS: string | null;
  NRO_TICKET: string | null;
  OBSERVACION: string | null;
  PATH_D: string | null;
  PROTOCOLO: string | null;
  PUERTO: string | null;
  RECURSOS: string | null;
  SERVICIO_ASOCIADO: string | null;
  TICKET_MONITOREO: string | null;
  TIPO_EQUIPO: string | null;
  TIPO_MONITOREO: string | null;
  UMBRAL: string | null;
  UMBRAL_CRITICAL: string | null;
  UMBRAL_WARNING: string | null;
  UNIDADES: string | null;
  URGENCIA: string | null;
  USUARIO: string | null;
  USUARIO_CREACION: string | null;
  USUARIO_MODIFICACION: string | null;
  VERSION_POLITICA: number;
  //Metrica TableSpaceUtilization
  TABLESPACE_NAME: string | null;
  //Metrica TransactionLog
  NRO_PUERTO_INSTANCIA: string | null;
  NOMBRE_INSTANCIA: string | null;
  //Metrica MSSQL DB
  NOMBRE_DB: string | null;
  //Metrica MSSQL JOB
  NOMBRE_JOB: string | null;
  //Metrica Disponibilidad de Interface
  NOMBRE_INTERFAZ: string | null;
  //Metrica Estado de Interface
  ESTADO_INTERFACE: string | null;
  //Metrica MSSQL AG - Some replicas unhealthy
  SOME_REPLICAS: string;
  //Metrica MSSQL AG - All replicas unhealthy
  ALL_REPLICAS: string;
  //Metrica MSSQL AG - Primary replica recovery health in progress
  PRIMARY_REPLICAS: string;
  //Metrica IIS: Application Pool
  APP_POOL: string;
  //Metrica Last error message of scenario Availability Web
  NAME_WEB: string;
}

export enum TIPOCAMBIO { EDIT = "EDIT", DELETE = "DELETE", NUEVO = "NUEVO" }
export interface ITipoCambio { tipo_cambio: TIPOCAMBIO }

//Enum con los distintos posibles contenidos del Modal
export enum ModalView {
  CHANGE_TOOL = "CHANGE_TOOL",
  DELETE_CI_OF_POLICY = "DELETE_CI_OF_POLICY",
  CONFIRMATION_CANCELATION = "CONFIRMATION_CANCELATION",
  ADD_OPTIONAL_METRIC = "ADD_OPTIONAL_METRIC",
  UPDATE_METRIC = "UPDATE_METRIC",
  ADD_PORT_METRIC = "ADD_PORT_METRIC",
  ADD_DISPONIBILITY_METRIC = "ADD_DISPONIBILITY_METRIC",
  ADD_FILESYSTEM_METRIC = "ADD_FILESYSTEM_METRIC",
  CREATE_NEW_POLICY_MONITORING = "CREATE_NEW_POLICY_MONITORING",
  UPDATE_CURRENT_POLICY = "UPDATE_CURRENT_POLICY",
  DETAIL_POLICY = "DETAIL_POLICY",
  DETAIL_POLICY_OF_CI = "DETAIL_POLICY_OF_CI",
  DETAIL_OF_CATALOG = "DETAIL_OF_CATALOG",
  HISTORIC_CHANGES = "HISTORIC_CHANGES"
}
//Enum con los distintos posibles tamaños del Modal
export enum ModalSize { XL = "xl", LG = "lg", SM = "sm" }

