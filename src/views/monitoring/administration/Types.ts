import { IComboData } from "../../../helpers/Types";
import { IModalFunctions, Role } from "../../../hooks/Types";

export interface IAdministrationContext {
    modalHook: IModalFunctions;
    rol: Role;
    metricHook: IUseMetric;
    metricParamHook: IUseMetricParams;
    currentView: {
        view: "metric" | "param";
        metric: MetricCatalog | null;
    };
    setCurrentView: React.Dispatch<React.SetStateAction<{
        view: "metric" | "param";
        metric: MetricCatalog | null;
    }>>;
}

export enum ModalViewForAdministration {
    CREATE_METRIC = 'CREATE_METRIC',
    UPDATE_METRIC = 'UPDATE_METRIC',
    CREATE_UMBRAL = 'CREATE_UMBRAL',
    CREATE_PARAM = 'CREATE_PARAM',
    UPDATE_PARAM = 'UPDATE_PARAM',
    UPDATE_UMBRAL = 'UPDATE_UMBRAL'
}

export interface IUseMetric {
    getTypeEquipment: () => Promise<void>;
    typeEquipments: IComboData[];
    typeEquipmentsLoading: boolean;
    getTools: () => Promise<void>;
    tools: IComboData[];
    toolsLoading: boolean;
    getFamiliesClases: () => Promise<void>;
    familiesClases: IComboData[];
    familiesClasesLoading: boolean;
    getMetrics: () => Promise<void>;
    metrics: MetricCatalog[];
    metricsLoading: boolean;
    createMetric: (data: RegisterMetric) => Promise<boolean | undefined>;
    createMetricLoading: boolean;
    updateMetric: (data: UpdatedMetric) => Promise<boolean | undefined>;
    updateMetricLoading: boolean;
    exportMetrics: (params: any) => Promise<void>;
    loadingExportMetrics: boolean;
}

export interface IUseMetricParams {
    getParamsByMetricId: (idMetrica: number) => Promise<void>;
    metricParams: MetricParam[];
    paramsLoading: boolean;
    createMetricParam: (data: RegisterMetricParam) => Promise<boolean | undefined>;
    createParamLoading: boolean;
    updateParamLoading: boolean;
    updateMetricParam: (data: UpdateMetricParam) => Promise<boolean | undefined>;
}

export interface MetricCatalog {
    CLASE: string;
    CLIENTE: string;
    DETALLE: string;
    ESTADO: number;
    FAMILIA: string;
    FECHA_CREACION: string;
    FECHA_MODIFICACION: string | null;
    FRECUENCIA: string | null;
    HERRAMIENTA: string;
    ID_FAMILIA_CLASE: number;
    ID_HERRAMIENTA: number;
    ID_METRICA: number;
    ID_TIPOEQUIPO: number;
    IS_OPCIONAL: number;
    NOMBRE: string;
    TIPO_EQUIPO: string;
    USUARIO_CREACION: string;
    USUARIO_MODIFICACION: string | null;
}

export interface RegisterMetric {
    nombre: string;
    detalle: string;
    id_familia_clase: number;
    id_herramienta: number;
    id_tipoequipo: number;
    cliente: string;
    is_opcional: number;
    frecuencia: number;
    usuario: string;
}

export interface UpdatedMetric {
    id_metrica: number;
    nombre: string;
    detalle: string;
    id_familia_clase: number;
    id_herramienta: number;
    id_tipoequipo: number;
    cliente: string;
    is_opcional: number;
    frecuencia: number;
    usuario: string;
    estado: number;
}

export interface MetricParam {
    ESTADO: number;
    FECHA_CREACION: string;
    FECHA_MODIFICACION: string | null;
    ID_METRICA: number;
    ID_METRICA_PARAMETRO: number;
    NRO_POOLEOS: string;
    PARAMETRO: string;
    UMBRAL: string;
    UNIDADES: string;
    URGENCIA: string | null;
    USUARIO_CREACION: string;
    USUARIO_MODIFICACION: string | null;
    VALOR_PARAMETRO: string | null;
}

export interface RegisterMetricParam {
    id_metrica: number;
    parametro: string;
    urgencia: string;
    umbral: string;
    nro_pooleos: string;
    unidades: string;
    valor_parametro: string;
    usuario: string;
}

export interface UpdateMetricParam {
    id_metrica_parametro: number;
    parametro: string;
    urgencia: string;
    umbral: string;
    nro_pooleos: string;
    unidades: string;
    valor_parametro: string;
    usuario: string;
    estado: number;
}

export interface ExportMetrics {
    ID_METRICA: number[];
}