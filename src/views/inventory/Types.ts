import { ApiContext } from "@ezgrid/grid-core";
import { IComboData } from "../../helpers/Types";
import { IModalFunctions, IuseClient, IuseProject, Role } from "../../hooks/Types";

//Posibles vistas del modal del submodulo de Administración de la CMDB
export enum ModalViewForAdministrateCMDB {
    UPDATE_ATTRIBUTE = "UPDATE_ATTRIBUTE",
    CREATE_FAMILY = "CREATE_FAMILY",
    UPDATE_FAMILY_CLASE = "UPDATE_FAMILY_CLASE",
    CREATE_RELATION = "CREATE_RELATION",
    DELETE_RELATION = "DELETE_RELATION",
    HIERARCHY_FAMILYCLASE = "HIERARCHY_FAMILYCLASE"
}

//Posibles vistas del modal del submodulo de Administración de la CMDB
export enum ModalViewForConfigurationItems {
    UPDATE_CI_GENERAL = "UPDATE_CI_GENERAL",
    UPDATE_CI_SPECIFIC = "UPDATE_CI_SPECIFIC",
    INFORMATION_CI = "INFORMATION_CI",
    CREATE_CI = "CREATE_CI",
    ADMINISTRATE_IP = "ADMINISTRATE_IP",
    RELATION_CI = "RELATION_CI",
    HIERARCHY = "HIERARCHY",
    BULKLOAD = "BULKLOAD"
}

export interface IAttributeOfFamilyClase {
    IDOPCION: number;
    ID_METADATA: number;
    ID_TIPO_ATRIBUTO: null | number;
    ID_TIPO_DATO: null | number;
    NombreAtributo: string;
    TIPO_ATRIBUTO: null | string;
    TIPO_DATO: null | string;
    ESTADO: number;
}

//Interfaces para los Context de cada Submodulo
export interface IAdministrateCMDBContext {
    rol: Role,
    modalHook: IModalFunctions,
    familyData: IComboData[],
    familyLoading: boolean,
    typeAttributes: IComboData[],
    typeAttLoading: boolean,
    typeData: IComboData[],
    typeDataLoading: boolean,
    attributeHook: IuseAttribute,
    familyclaseHook: IuseFamilyClase
}

export interface IConfigurationItemsContext {
    rol: Role,
    modalHook: IModalFunctions,
    clientHook: IuseClient,
    projectHook: IuseProject,
    setOwners: React.Dispatch<React.SetStateAction<IOwners>>,
    owners: IOwners,
    handleListCIs: () => void,
    monitorOptionsHook: IuseDataFromMonitorOptions,
    configurationItemsPlane: IConfigurationItemPlane[],
    loadingListCIPlane: boolean,
    apiRef: React.MutableRefObject<ApiContext<unknown> | null>,
    handleCleanFilters: () => void,
    filterGlobalValue: string,
    setFilterGlobalValue: React.Dispatch<React.SetStateAction<string>>
}

//Interfaces para los Custom Hooks
export interface IuseDataFromMonitorOptions {
    getFamilia: () => Promise<void>;
    familyData: IComboData[];
    familyLoading: boolean;
    getClase: (family?: string) => Promise<void>;
    claseData: IComboData[];
    claseLoading: boolean;
    getTypesAttributes: (family?: string) => Promise<void>;
    typeAttributes: IComboData[];
    typeAttLoading: boolean;
    getTypesData: () => Promise<void>;
    typeData: IComboData[];
    typeDataLoading: boolean,
    getUbications: () => Promise<void>,
    ubications: IComboData[],
    loadingUbications: boolean,
    getVcenters: () => Promise<void>,
    vcenters: IComboData[],
    loadingVcenters: boolean,
    getStatesCI: () => Promise<void>,
    statesCI: IComboData[],
    loadingStates: boolean,
    getEnviroments: () => Promise<void>,
    environments: IComboData[],
    loadingEnvironments: boolean,
    getRoleUses: () => Promise<void>,
    roleUses: IComboData[],
    loadingRoleUses: boolean,
    getPriorities: () => Promise<void>,
    priorities: IComboData[],
    loadingPriorities: boolean,
    getTypesServices: () => Promise<void>,
    typeServices: IComboData[],
    loadingTypeServices: boolean,
    getTypesCI: () => Promise<void>,
    typesCI: IComboData[],
    loadingTypesCI: boolean,
    getTowersAdministrators: () => Promise<void>,
    towersAdministrators: IComboData[],
    loadingTowerAdministrator: boolean,
    getScopesTypes: (tower_administrator: string) => Promise<void>,
    scopesType: IComboData[],
    loadingScopeTypes: boolean,
    getAdministrators: () => Promise<void>,
    administrators: IComboData[],
    loadingAdministrators: boolean,
    getTypesIP: () => Promise<void>,
    IPtypes: IComboData[],
    loadingTypesIP: boolean,
    getAdminsCloudMonitoring: () => Promise<void>,
    loadingAdminsCloudMonitoring: boolean,
    adminsCloudMonitoring: IComboData[]
}

export interface IuseAttribute {
    createAttribute: (idOption: number, params: ICreateAttribute) => Promise<true | undefined>,
    loadingAddAttribute: boolean,
    getAttributesByFamilyClase: (idOption: number) => Promise<void>,
    attributesOfFamilyClase: IAttributeOfFamilyClase[],
    loadingGetAttribute: boolean,
    changeStatusOfAttribute: (idAttribute: number, status: number) => Promise<true | undefined>,
    loadingChangeStatusAtt: boolean,
    addOptionListInAtt: (idFamilyClase: string, idAttribute: string, params: IAddOptionListOfAtt) => Promise<true | undefined>,
    loadingCreateOptionListOfAtt: boolean,
    updateOptionListOfAtt: (idOptionList: string, params: IUpdateNameOptionListOfAtt) => Promise<true | undefined>,
    loadingUpdateOptionNameListOfAtt: boolean,
    changeStatusOfOptionListOfAtt: (idOptionList: string, status: number) => Promise<true | undefined>,
    loadingChangeStatusOptionListOfAtt: boolean,
    getListOptionsOfAtt: (idFamilyClase: string, idAttribute: string) => Promise<void>,
    loadingGetOptionsListOfAtt: boolean,
    optionsListOfAttribute: IOptionByAttribute[],
    updateNameAttribute: (idAttribute: string, params: IUpdateNameAttribute) => Promise<true | undefined>,
    loadingUpdateNameAttribute: boolean
}

export interface IuseFamilyClase {
    getFamiliesWithClases: () => Promise<void>,
    loadingGetFamilyClase: boolean,
    familyClaseData: IFamilyClase[],
    createFamilyClase: (params: ICreateFamilyClase) => Promise<true | undefined>,
    loadingCreateFamilyClase: boolean,
    updateFamilyName: (familyToUpdate: string, params: IUpdateFamily) => Promise<true | undefined>,
    loadingUpdateFamilyName: boolean,
    updateClaseName: (idOption: number, params: IUpdateClase) => Promise<true | undefined>,
    loadingUpdateClaseName: boolean,
    createRelationFamilyClase: (params: ICreateRelationFamilyClase) => Promise<true | undefined>,
    loadingCreateRelationFamilyClase: boolean,
    deleteRelationFamilyClase: (params: IDeleteRelationFamilyClase) => Promise<true | undefined>,
    loadingDeleteRelationFamilyClase: boolean
}

export interface IuseCI {
    getListConfigurationItems: (params: IGetConfigurationItems) => Promise<void>,
    loadingListCI: boolean,
    configurationItems: IConfigurationItem[],
    getValuesOfDynamicAttributesByCI: (idOptionFamilyClase: string, idCI: string) => Promise<void>
    loadingListDynamicAttributes: boolean,
    dynamicValuesOfAttributes: ICombinedAttribute[],
    updateGeneralInformationCI: (params: IUpdateGeneralInformation) => Promise<true | undefined>,
    loadingUpdateGeneralInformationCI: boolean,
    updateDynamicInformationCI: (idCI: number, params: IUpdateDynamicInformationCI) => Promise<true | undefined>,
    loadingUpdateDynamicInformationCI: boolean,
    createCI: (params: ICreateCI) => Promise<true | undefined>,
    loadingCreateCI: boolean,
    getIPsByCI: (idCI: number) => Promise<void>,
    loadingIPsByCI: boolean,
    CIIps: IassignedIP[],
    addIP: (params: IaddIP) => Promise<true | undefined>,
    loadingAddIP: boolean,
    getListConfigurationItemsPlane: (params: IGetConfigurationItems) => Promise<void>,
    configurationItemsPlane: IConfigurationItemPlane[],
    loadingListCIPlane: boolean,
    assignChildrensCI: (params: IAssignChildrenCI) => Promise<true | undefined>,
    loadingAssignChildrensCI: boolean,
    getExportFile: (owners: IOwners, CIs: IConfigurationItem[]) => Promise<void>,
    generateFile: (owners: IOwners, CIs: IConfigurationItem[]) => Promise<void>; 
    loadingGeneration: boolean;
    loadingExport: boolean
    getAuditCILogs: (idEquipo: string, params: any) => Promise<void>,
    loadingAuditCILogs: boolean,
    auditCILogs: IAuditCILog[],
    exportAuditLogs: (idCI: number) => Promise<void>,
    loadingExportAuditLogs: boolean,
}

export interface ICreateAttribute {
    nombre: string,
    id_tipo_atributo: number,
    id_tipo_dato: number
}

export interface IAddOptionListOfAtt {
    valor: string
}
export interface IUpdateNameOptionListOfAtt {
    valor: string
}

export interface IUpdateNameAttribute {
    nombre: string
}

export interface IOptionByAttribute {
    IDOPCION: number,
    VALOR: string,
    ESTADO: number
}

export interface IMInformationHideOptionOfList {
    row: IOptionByAttribute,
    isChecked: boolean,
    handleUpdateTableData: () => Promise<void>
}

export interface ICreateFamilyClase {
    familia: string,
    clase: string
}

export interface IFamilyClase {
    FAMILIA: string,
    CLASE: string,
    ID: number,
    HIJOS: IFamilyClase[],
}

export interface IUpdateFamily {
    familia: string
}

export interface IUpdateClase {
    clase: string
}

export interface ICreateRelationFamilyClase {
    familia_clase_padre: number,
    familia_clase_hijo: number
}

export interface IGetConfigurationItems {
    cliente: string,
    alp: string,
    proyecto: string,
    buscar_palabra: string
}

export interface IOwners {
    client: string,
    project: string,
    alp: string,
    projectID: number,
    generic_filter: string
}

export const initialOwnerCMDB: IOwners = {
    client: "",
    project: "",
    alp: "",
    projectID: 0,
    generic_filter: ""
}

export interface IConfigurationItem {
    ID_EQUIPO: number;
    NOMBRE: string | null;
    DETALLE_ADMINISTRACION: string | null;
    DESCRIPCION: string | null;
    CONFIDENCIALIDAD: string | null;
    INTEGRIDAD: string | null;
    DISPONIBILIDAD: string | null;
    NRO_SERIE: string | null;
    DETALLE_PROPIEDAD: string | null;
    FECHA_ALTA: string | null;
    FECHA_BAJA: string | null;
    NOMBRE_VIRTUAL: string | null;
    AMBIENTE: string | null;
    FAMILIA: string | null;
    CLASE: string | null;
    PRIORIDAD: string | null;
    EQUIPO_ESTADO: string | null;
    PROYECTO: string | null;
    ALP: string | null;
    CRQ_ALTA: string | null;
    BAHIA_DESDE: string | null;
    BAHIA_HASTA: string | null;
    CANTIDAD_RU: string | null;
    NRO_CID: string | null;
    NRO_RANURAS: string | null;
    RANGO_RU_DESDE: string | null;
    RANGO_RU_HASTA: string | null;
    TIPO_EQUIPO: string | null;
    NRO_CORE: string | null;
    NRO_CPU: string | null;
    CPU_DESCRIPCION: string | null;
    DISK_APROVISIONADO: string | null;
    DISK_ASIGNADO: string | null;
    RAM_ASIGNADO: string | null;
    ENERGIA_KW: string | null;
    ENERGIA_USO: string | null;
    ID_GENESYS: number | null;
    PART_NUMBER: string | null;
    FABRICANTE: string | null;
    PROVEEDOR: string | null;
    REFERENCIA_EXTERNA: string | null;
    LINEA_BASE: string | null;
    BACKUPS: string | null;
    MONITOREO: string | null;
    ESTADO: boolean | null;
    VERSION_SW: string | null;
    MODELO: string | null;
    ROL_USO: string | null;
    VCENTER: string | null;
    PROPIEDAD: string | null;
    ADMINISTRADOR: string | null;
    TIPO_SERVICIO: string | null;
    UBICACION: string | null;
    CLIENTE: string | null;
    SISTEMA_OPERATIVO: string | null;
    MARCA: string | null;
    BACKUPS_CLOUD: string | null;
    MONITOREO_CLOUD: string | null;
    IPLAN: string | null;
    TIPO_ALCANCE: string | null;
    NOMBRE_CI: string | null;
    FAMILIA_REAL: string | null;
    CLASE_REAL: string | null;
    IDOPCION: number;
    SERVICIO_NEGOCIO: string | null;
    TICKET_BAJA: string | null;
    SEDE_CLIENTE: string | null;
    HIJOS: IConfigurationItem[],
}

export type IConfigurationItemPlane = Omit<IConfigurationItem, 'HIJOS'> & {
    PARENT_ID: number | null,
    PARENT_NOMBRE: string | null,
    PARENT_NOMBRE_CI: string | null
}

export type TYPE_ATTRIBUTE = "SIMPLE" | "LISTA" | "MULTIPLE"
export type TYPE_DATA = "TEXTO" | "NUMERO" | "FECHA" | "HORA"

export interface IOptionList {
    ATRIBUTO: string,
    IDOPCION: number,
    VALOR: string
}
export interface IDynamicAttribute {
    //El tipo de atributo que es en texto 
    ATRIBUTO: TYPE_ATTRIBUTE;
    ESTADO: number;
    //Id de la familia - Clase a la que pertenece el atributo
    ID_FAMILIA_CLASE: number | null;
    //Valor del tipo de datos, solo aplica para Simple
    TIPO_DATO: TYPE_DATA | null;
    ID_EQUIPO: number | null;
    //Id del atributo, de la tabla metadata
    ID_METADATA: number;
    //Id del valor, si no tiene valor guardado para este atributo es null
    ID_VALOR: number | null;
    //Id del tipo de Atributo -  Simple | Lista | Multiple
    ID_TIPO_ATRIBUTO: number;
    //Id del tipo de datos, solo aplica si es Tipo de atributo Simple - TEXTO | NUMERO ...
    ID_TIPO_DATO: number;
    //Id donde se almacenado el id del valor, solo aplica Lista
    ID_VALOR_LISTA: number | null;
    NombreAtributo: string;
    //Valor del atributo, solo aplica para lista
    VALOR_LISTA: string | null;
    //Valor del atributo, solo aplica para Simple y Multiple
    VALOR_SIMPLE: string | null;
    //Lista de opciones posibles, solo aplica para lista
    LISTA_OPCIONES?: IOptionList[]
}

export interface ICombinedAttribute {
    NombreAtributo: string;
    ATRIBUTO: TYPE_ATTRIBUTE;
    HIJOS: IDynamicAttribute[];
}

export interface IUpdateGeneralInformation {
    id_equipo: number;
    tipo_alcance: string;
    nombre: string;
    familia: string;
    clase: string;
    rol_uso: string;
    vcenter: string;
    administrador: string;
    equipo_estado: string;
    prioridad: string;
    tipo_servicio: string;
    ubicacion: string;
    ambiente: string;
    id_proyecto: string;
    crq_alta: string;
    nombre_virtual: string;
    tipo_equipo: string;
    backups: string;
    monitoreo: string;
    backups_cloud: string;
    monitoreo_cloud: string;
    usuario: string;
    nombre_ci: string;
    alp: string;
    servicio_negocio: string;
    ticket_baja: string;
    sede_cliente: string;
}

export interface IValueOnSubmitDynamicForm {
    name: string;
    value: string;
    dataAttributes: IDynamicAttOnSubmit;
}

export interface IDynamicAttOnSubmit {
    "data-type-attribute": string;
    "data-id-value"?: string;
    "data-id-attribute": string;
    "data-ci"?: string;
    "data-state"?: string
}

export type IUpdateDynamicAttribute = {
    id_value_attribute: number,
    value: string,
    idoption: number,
    idmetadata: number,
    type_attribute: TYPE_ATTRIBUTE,
    state: number
}

export interface IUpdateDynamicInformationCI {
    registros: IUpdateDynamicAttribute[]
}

export interface ICreateCI {
    id_equipo: number;
    nombre_ci: string;
    tipo_alcance: string;
    nombre: string;
    id_opcion: number,
    sistema_operativo: string;
    version_sw: string;
    modelo: string;
    rol_uso: string;
    vcenter: string;
    propiedad: string;
    administrador: string;
    equipo_estado: string;
    prioridad: string;
    tipo_servicio: string;
    ubicacion: string;
    ambiente: string;
    id_proyecto: string;
    descripcion: string;
    confidencialidad: string;
    integridad: string;
    disponibilidad: string;
    crq_alta: string;
    nro_serie: string;
    detalle_propiedad: string;
    fecha_alta: string;
    fecha_baja: string;
    bahia_desde: string;
    bahia_hasta: string;
    cantidad_ru: string;
    nro_cid: string;
    nro_ranuras: string;
    rango_ru_desde: string;
    rango_ru_hasta: string;
    nombre_virtual: string;
    tipo_equipo: string;
    nro_core: string;
    nro_cpu: string;
    cpu_descripcion: string;
    disk_aprovisionado: string;
    disk_asignado: string;
    ram_asignado: string;
    energia_kw: string;
    energia_uso: string;
    id_genesys: number;
    part_number: string;
    fabricante: string;
    proveedor: string;
    referencia_externa: string;
    linea_base: string;
    backups: string;
    monitoreo: string;
    backups_cloud: string;
    monitoreo_cloud: string;
    usuario: string;
    alp: string;
    servicio_negocio: string;
    ticket_baja: string;
    sede_cliente: string;
}

export interface IFamiliesCard {
    title: string,
    path: string,
    quantity: number
}

export interface IassignedIP {
    ID_EQUIPO: string,
    ID_EQUIPO_IP: string,
    MASCARA: string,
    COMENTARIO: string,
    NRO_IP: string,
    TIPO_IP: string,
}

export interface IaddIP {
    id_equipo: number,
    nro_ip: string,
    tipo_ip: string,
    mascara: string,
    comentario: string
}

export interface IAssignChildrenCI {
    parent_id: number,
    hijos: number[]
}

export interface IFilterToExport {
    lista_equipo: {
        id_equipo: number
    }[]
}

export interface IDeleteRelationFamilyClase {
    familia_clase_padre: number,
    familia_clase_hijo: number
}

export interface IAuditCILog {
    id_ci: number;
    nombre_ci: string;
    fecha: string;
    usuario: string;
    accion: string;
    fecha_timestamp: number;
    fecha_formatted: string;
    cantidad_campos_modificados: number;
    lista_campos: string;
    // Campos dinámicos que pueden variar según los cambios
    [key: string]: any;
}

export interface Cambio {
    fecha: string;
    usuario: string;
    valor: string | number;
    accion: string;
}

export interface CambiosMap {
    [campo: string]: Cambio[];
}

export interface AuditData {
    id_ci?: number;
    nombre_ci?: string;
    cambios?: CambiosMap;
}

export interface IteracionAplanada {
    id_ci: number;
    nombre_ci: string;
    fecha: string;
    usuario: string;
    accion: string;
    fecha_timestamp: number;
    fecha_formatted: string;
    cantidad_campos_modificados: number;
    lista_campos: string;
    [campo: string]: string | number; // Campos dinámicos modificados
}