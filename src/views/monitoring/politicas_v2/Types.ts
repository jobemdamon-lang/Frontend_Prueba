import { IComboData } from "../../../helpers/Types";
import { IModalFunctions, Role } from "../../../hooks/Types";

export interface IMonitoringPoliciesContext {
    rol: Role;
    modalHook: IModalFunctions;
    currentView: Views;
    setCurrentView: React.Dispatch<React.SetStateAction<Views>>;
    globalParams: {
        projectID: number;
        clientID: number;
        policyID: number,
        versionID: number
    };
    setGlobalParams: React.Dispatch<React.SetStateAction<{
        projectID: number;
        clientID: number;
        policyID: number,
        versionID: number
    }>>;
    policyHook: IUsePolicy;
    versionHook: IUseVersion;
    catalogHook: IUseCatalog;
    changesHook: IUseChange;
}

export enum ModalViewForMonitoringPolicies {
    DETAIL_VERSION = "DETAIL_VERSION",
    DELETE_CI = "DELETE_CI",
    HISTORIC = "HISTORIC",
    UPDATE_METRIC = "UPDATE_METRIC",
    DELETE_METRIC = "DELETE_METRIC",
    ADD_CI_METRICS = "ADD_CI_METRICS",
    ADD_METRIC = "ADD_METRIC",
    DETAIL_CHANGE = "DETAIL_CHANGE",
    CANCEL_CHANGE = "CANCEL_CHANGE",
    IMPLEMENT_CHANGE = "IMPLEMENT_CHANGE",
    INITIALIZE_POLICY = "INITIALIZE_POLICY",
    DETAIL_VERSION_OLD = "DETAIL_VERSION_OLD",
    HISTORIC_OLD = "HISTORIC_OLD",
    VALIDATE_MASSIVE_CI = "VALIDATE_MASSIVE_CI",
    //IMPORT_CI_CHANGES = "IMPORT_CI_CHANGES",
    //EXPORT_CI_DETAILS = "EXPORT_CI_DETAILS"
    CHARGE_POLICY = "CHARGE_POLICY"
}

export type Views = 'policies' | 'create_policy' | 'update_policy' | 'detail_policy'
export type Urgent = 'WARNING' | 'CRITICAL' | 'FATAL' | 'INFORMATIVO'

export interface IUsePolicy {
    getVersionsByProject: (idProject: number) => Promise<void>;
    versions: Version[];
    versionsLoading: boolean;
    getHistoricChanges: (idProject: number) => Promise<void>;
    historicLoading: boolean;
    historic: MetricChange[];
    initializePolicy: (data: NewPolicy) => Promise<true | undefined>;
    initializeLoading: boolean;
}

export interface IUseVersion {
    getMetricsVersion: (idPolicy: number, idVersion: number) => Promise<MetricVersion[] | undefined>;
    metricsVersionLoading: boolean;
    metricsVersion: MetricVersion[];
    getCIsInVersion: (idPolicy: number, idVersion: number, monitored: boolean) => Promise<void>;
    cisInVersion: CIsInVersion[];
    cisInVersionLoading: boolean;
}

export interface IUseCatalog {
    getTools: () => Promise<void>;
    toolsLoading: boolean;
    tools: IComboData[];
    getMetricsByFamilyClase: (idFamilyClase: number) => Promise<MetricFamilyClase[] | undefined>;
    familyClaseMetricsLoading: boolean;
    familyClaseMetrics: MetricFamilyClase[];
    getMetricCatalog: (idMetric: number) => Promise<void>;
    metricCatalogLoading: boolean;
    metricCatalog: MetricCatalog | null;
    getProjectsMonitoringOldVersion: (flag: number) => Promise<ProjectMonitored[] | undefined>;
    loadingProjectsOld: boolean;
    getProjectsMonitoringNewVersion: () => Promise<ProjectMonitored[] | undefined>;
    loadingProjectsNew: boolean;
}

export interface IUseChange {
    getListChanges: (idPolicy: number) => Promise<void>;
    changesLoading: boolean;
    changeRequests: ChangeRequest[];
    registerChange: (data: UpdatedVersion) => Promise<boolean | undefined>;
    registerChangeLoading: boolean;
    getRequestChangeDetail: (idChange: number) => Promise<MetricChange[] | undefined>;
    changeDetailLoading: boolean;
    cancelImplementChange: (data: CancelImplement) => Promise<boolean | undefined>;
    cancelImplementChangeLoading: boolean;
    updateChange: (data: UpdatedVersion) => Promise<boolean | undefined>;
    addChangeDetail: (data: AddChangeDetail) => Promise<boolean | undefined>;
    addChangeDetailLoading: boolean;
    loadingUpdateChange: boolean;
    deleteMetricChange: (idChangeMetric: number, idChangeParam: number) => Promise<boolean | undefined>;
    deleteMetricChangeLoading: boolean;
    deleteCI: (data: CIToDelete) => Promise<boolean | undefined>;
    deleteCILoading: boolean;
    getChangeByVersion: (idVersion: number) => Promise<void>;
    changeOfVersionLoading: boolean;
    changesOfVersion: MetricChange[];
    importPolicy: (idPolicy:string, usuario:string, data: any) => Promise<boolean | undefined>;
    importPolicyLoading: boolean;
    deleteChangeCI: (idChangeCI: string) => Promise<boolean | undefined>;
    massiveMetricsLoading: boolean;
    obtainDefaultMassiveMetric: (data: any) => Promise<any | undefined>;
    getCompatibleTools: (idEquipos: string) => Promise<any | undefined>;
    compatibleToolsLoading: boolean;
}

export interface Version {
    ESTADO: number;
    ESTADO_POLITICA: string;
    FECHA_CREACION: string | null;
    FECHA_MODIFICACION: string | null;
    FECHA_VERSION: string | null;
    ID_POLITICA: number;
    ID_VERSION: number;
    NOMBRE: string;
    NRO_TICKET: string | null;
    NRO_VERSION: number;
    SOLICITANTE: string | null;
    TICKET_ORIGEN: string | null;
    USUARIO_CREACION: string | null;
    USUARIO_IMPLEMENTADOR: string | null;
    USUARIO_MODIFICACION: string | null;
    flag_nuevo: number;
}


export interface MetricParameter {
    ESTADO: number;
    FECHA_CREACION: string | null;
    FECHA_MODIFICACION: string | null;
    ID_DETALLE_METRICA_VALOR: number;
    NRO_POOLEOS: string | null;
    PARAMETRO_VALOR: string | null;
    UMBRAL: string | null;
    // En la key URGENCIA se guarda el valor de la urgencia ('WARNING', 'CRITICAL', 'FATAL', 'INFORMATIVO') o el nombre del parametro si es un parámetro normal
    URGENCIA: string | null;
    USUARIO_CREACION: string | null;
    USUARIO_MODIFICACION: string | null;
    ID_METRICA_PARAMETRO: number;
}

export interface MetricVersion {
    CLASE: string;
    DETALLE: string;
    ESTADO: number;
    FAMILIA: string;
    FECHA_CREACION: string | null;
    FECHA_MODIFICACION: string | null;
    FRECUENCIA: string;
    HERRAMIENTA: string | null;
    HOSTNAME: string;
    ID_DETALLE_POLITICA: number;
    ID_EQUIPO: number;
    ID_EQUIPO_IP: number;
    ID_FAMILIA_CLASE: number;
    ID_HERRAMIENTA: number;
    ID_METRICA: number;
    ID_POLITICA: number;
    ID_TIPO_EQUIPO: number;
    ID_VERSION: number;
    NOMBRE: string;
    NOMBRE_CI: string;
    NRO_IP: string | null;
    TIPO_EQUIPO: string | null;
    USUARIO_CREACION: string | null;
    USUARIO_MODIFICACION: string | null;
    VALORES_PARAMETROS: MetricParameter[];
}

export type CIGroupedMetrics = {
    ID_EQUIPO: number;
    NOMBRE_CI: string;
    IP: string[];
    FAMILIA: string;
    CLASE: string;
    ID_OPCION: number;
    METRICAS: MetricVersion[];
}

export interface CIsInVersion {
    NOMBRE_CI: string;
    CLASE: string;
    FAMILIA: string;
    ID_EQUIPO: number;
    ID_FAMILIA_CLASE: number;
    IP: string | null;
    NOMBRE: string;
}

export type CIGroupedMetricsInternal = Omit<CIGroupedMetrics, 'IP'> & { IP: Set<string> }

export interface UpdatedVersion {
    id_cambio?: number;
    id_politica: number;
    id_version: number;
    usuario: string;
    nro_ticket: string;
    motivo: string;
    lista_cambio_politica: UpdatedMetric[];
}

export interface AddChangeDetail {
    id_cambio: number;
    id_equipo: number;
    usuario: string;
    lista_cambio_detalle: MetricsData[];
}

export interface MetricsData {
    tipo_cambio: string;
    id_cambio_detalle: number;
    id_detalle_politica: number;
    id_metrica: number;
    id_herramienta: number;
    id_equipo_ip: number;
    id_tipoequipo: number;
    frecuencia: number;
    estado: number;
    lista_parametros: UpdatedParam[];
}

export interface UpdatedMetric {
    tipo_cambio: string;
    id_cambio_detalle: number;
    id_detalle_politica: number;
    id_equipo: number;
    id_metrica: number;
    id_herramienta: number;
    id_equipo_ip: number;
    id_tipoequipo: number;
    frecuencia: number;
    estado: number;
    lista_parametros: UpdatedParam[];
}

export interface UpdatedParam {
    id_cambio_metrica_valor: number;
    nro_pooleos: number;
    parametro_valor: string;
    umbral: string;
    estado: string;
    id_metrica_parametro: number;
}

export interface MetricVersionFront extends MetricVersion {
    TIPO_CAMBIO: 'ACTUALIZACION METRICA' | 'NUEVA METRICA' | 'BAJA METRICA' | 'NUEVO CI' | 'BAJA CI';
    ID_FRONT: string; // Identificador único para el front
}


export interface MetricFamilyClase {
    CLASE: string
    CLIENTE: string
    DETALLE: string
    ESTADO_METRICA: number
    FAMILIA: string
    FRECUENCIA: string
    HERRAMIENTA: string
    ID_FAMILIA_CLASE: number
    ID_HERRAMIENTA: number
    ID_METRICA: number
    ID_TIPOEQUIPO: number
    IS_OPCIONAL: number
    NOMBRE: string
    TIPOEQUIPO: string
    valores_parametro: ParamValue[]
}

export interface ParamValue {
    ESTADO_METRICA_PARAMETRO: number
    ID_METRICA_PARAMETRO: number
    NRO_POOLEOS?: string
    PARAMETRO: string
    UMBRAL?: string
    UNIDADES?: string
    URGENCIA?: string
    VALOR_PARAMETRO: any
}

export interface MetricCatalog {
    DETALLE: string;
    ID_FAMILIA_CLASE: number;
    ID_METRICA: number;
    NOMBRE: string;
    VALORES_PARAMETROS: ParamCatalog[];
}

export interface ParamCatalog {
    ESTADO: number;
    ID_METRICA_PARAMETRO: number;
    NRO_POOLEOS: null | string;
    PARAMETRO: string;
    UMBRAL: null | string;
    URGENCIA: null | string;
    VALOR_PARAMETRO: null;
}

export interface ChangeRequest {
    ESTADO: number;
    FECHA_CREACION: string;
    ID_POLITICA: number;
    ID_VERSION: string;
    MOTIVO: string;
    NRO_TICKET: string;
    USUARIO_CREACION: string;
    NRO_TICKET_IMPLEMENTACION: string;
    ID_CAMBIO: number;
}

export interface MetricChange {
    ID_CAMBIO: number;
    MOTIVO: string;
    NRO_TICKET: string;
    SOLICITANTE: string;
    NRO_TICKET_IMPLEMENTACION: string;
    USUARIO_IMPLEMENTADOR: string;
    FECHA_IMPLEMENTACION: string;
    FECHA_CAMBIO: string;
    CLASE: string;
    DETALLE: string;
    ESTADO: number;
    FAMILIA: string;
    TIPO_CAMBIO: string;
    FECHA_CREACION: string | null;
    FECHA_MODIFICACION: string | null;
    FRECUENCIA: string | null;
    HERRAMIENTA: string | null;
    HOSTNAME: string;
    ID_CAMBIO_DETALLE: number;
    ID_DETALLE_POLITICA: number;
    ID_EQUIPO: number;
    ID_EQUIPO_IP: number;
    ID_FAMILIA_CLASE: number;
    ID_HERRAMIENTA: number;
    ID_METRICA: number;
    ID_TIPO_EQUIPO: number;
    NOMBRE: string;
    NOMBRE_CI: string;
    NRO_IP: string | null;
    TIPO_EQUIPO: string;
    USUARIO_CREACION: string;
    USUARIO_MODIFICACION: string | null;
    VALORES_PARAMETROS: MetricParamChange[];
    NRO_VERSION?: number;
}

export interface MetricParamChange {
    ESTADO: number;
    FECHA_CREACION: string | null;
    FECHA_MODIFICACION: string | null;
    ID_CAMBIO_METRICA_VALOR: number;
    ID_METRICA_PARAMETRO: number;
    NRO_POOLEOS: string;
    PARAMETRO_VALOR: string;
    UMBRAL: string;
    URGENCIA: string;
    USUARIO_CREACION: string;
    USUARIO_MODIFICACION: string | null;
}

export interface CIToDelete {
    id_politica: number;
    id_version: number;
    usuario: string;
    nro_ticket: string;
    motivo: string;
    //lista_baja_equipo: { id_equipo: number, id_version: number }[];
    lista_baja_equipo: { id_equipo: number }[];
}

export interface CancelImplement {
    id_cambio: number;
    accion: number;
    usuario: string;
}

export interface NewPolicy {
    id_politica: number;
    nro_version: number;
    id_proyecto: number;
    usuario: string;
    lista_equipo:
    {
        id_equipo: number;
        familia: string;
        clase: string;
        tipo_equipo: string;
        herramienta: string;
    }[]
}

export interface ProjectMonitored {
    ALP: string;
    ID_PROYECTO: number;
    NOMBRE: string;
    CLIENTE: string;
    NOMBRE_PROYECTO: string;
}

export interface ExportPolicyMassiveParams {
    equipos: { id_detalle_politica: number }[];
}