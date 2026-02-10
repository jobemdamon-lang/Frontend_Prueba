import { UniqueIdentifier } from "@dnd-kit/core"
import { IModalFunctions, IuseClient, Role } from "../../hooks/Types"
import { Socket } from "socket.io-client"
import { IDataListFormat } from "../../helpers/Types"
import uniqid from "uniqid"

export enum viewScreenEnum { MAIN = 'MAIN', CONF = 'CONF' }
//Enum con los distintos posibles contenidos del Modal
export enum ModalView {
    PLANIFICATION = 'PLANIFICATION',
    GROUP_AND_TEMPLATE = 'GROUP_AND_TEMPLATE',
    HISTORICAL_PATCHES = 'HISTORICAL_PATCHES',
    SERVER_INFORMATION = 'SERVER_INFORMATION',
    EXECUTION_MAIN = 'EXECUTION_MAIN',
    EXECUTION_NEW = 'EXECUTION_NEW',
    EXECUTION_ALREADY_CONFIGURED = 'EXECUTION_NEW',
    EXECUTION_PROCESS = 'EXECUTION_PROCESS',
    EXECUTION_DETAIL = 'EXECUTION_DETAIL',
    UNCHECK_CONFIRMATION_BYONE = 'UNCHECK_CONFIRMATION_BYONE',
    UNCHECK_CONFIRMATION_BYCATEGORY = 'UNCHECK_CONFIRMATION_BYCATEGORY',
    CREDENTIALS = 'CREDENTIALS',
    CONFIRM_DELETE_PLANIFICATION = 'CONFIRM_DELETE_PLANIFICATION',
    CONFIRM_DELETE_EXECUTION = 'CONFIRM_DELETE_EXECUTION'
}
export enum ModalSubView {
    NEW_EXECUTION = "NEW_EXECUTION",
    EXECUTION_PROCESS = 'EXECUTION_PROCESS',
    EXECUTION_ALREADY_CONFIGURED = 'EXECUTION_ALREADY_CONFIGURED',
    EXECUTION_SEARCH_PATCHES = 'EXECUTION_SEARCH_PATCHES',
}
export type ExecutionView = {
    execution_view: ModalSubView,
    executionInformation: any
}
//Tipado para la seleccion de cliente y proyecto para Seccion Servidores y Ejecuciones
export type DataListFormat = { id: number, value: string }
export type SelectedOwner = {
    cliente: DataListFormat
    proyecto: DataListFormat
}
export const initialOwner = {
    cliente: { id: 0, value: "" },
    proyecto: { id: 0, value: "" }
}

//Tipado para el envio de datos a los metodos del API
//Body de request listar grupos
export interface IListGroup {
    ID_GRUPO: number,
    NOMBRE: string
}
//Body necesario para el envio de data al endpoint de crear un Grupo
export interface ICreateGroup {
    id_grupo: number
    id_plantilla: number,
    usuario: string,
    nombre: string,
    sistema_operativo: OPERATE_SYSTEMS
}
//Body necesario para el envio de data al endpoint de actualizar un Grupo
export interface IUpdateGroup {
    id_grupo: number,
    id_plantilla: number,
    id_proyecto: number,
    nombre_grupo: string,
    planificacion_inicio: string,
    planificacion_fin: string
}
//Body necesario para el envio de data al endpoint de crear una plantilla de Ejecucion
export interface ICreateTemplate {
    nombre_plantilla: string,
    usuario: string,
    lista_pasos: number[]
    sistema_operativo: OPERATE_SYSTEMS
}
//Body necesario para el envio de data al endpoint actualizar plantilla de Ejecucion
export interface IUpdateTemplate {
    nombre_plantilla: string
    usuario: string
    id_plantilla: number,
    lista_pasos: number[]
}
//Body de request para listar las plantillas de Ejecucion
export interface IListTemplate {
    ID_PLANTILLA: number,
    NOMBRE: string
}
//Body necesario para el envio de data al endpoint de asignar servidores a un Grupo
export interface IAssignServerToGroup {
    usuario: string
    id_grupo: number,
    lista_equipo: {
        id_equipo: number,
        id_equipo_ip: number
    }[]
}

export interface IIP {
    ID_EQUIPO_IP: number,
    NRO_IP: string,
    TIPO_IP: string
}
//Boby de request para listar los servidores de un ClienteProyecto (si un servidor tiene +2 grupos trae un solo registro)
export interface IListServerUnified {
    ID_GRUPO: null | number,
    CLASE: string,
    FAMILIA: string,
    GRUPOS: null | string,
    ID_EQUIPO: number,
    NOMBRE: string,
    NOMBRE_CI: string,
    NRO_IP: string | null,
    IP: IIP[]
}
//Body de request para listar los grupos de un ClienteeProyecto y los servers dentro de cada Grupo
export interface IGroupsWithServersWithPatches {
    ESTADO: null | number,
    FECHA_CREACION: null | string,
    FECHA_MODIFICACION: null | string,
    ID_GRUPO: number,
    ID_PLANTILLA: number,
    NOMBRE: string,
    NOMBRE_PLANTILLA: string,
    PASOS_PLANTILLA: IRoutinesTemplateInGroup[],
    SERVIDORES: IServerInGroup[]
}

export interface IRoutinesTemplateInGroup {
    ESTADO: number,
    FECHA_CREACION: string,
    FECHA_MODIFICACION: null | string,
    ID_PLANTILLA: number,
    ID_RUTINARIA: number,
    NOMBRE_RUTINARIA: string,
    ORDEN: number,
    USUARIO_CREACION: string,
    USUARIO_MODIFICACION: null | string
}

export interface IPatchesInServer {
    CATEGORIES: string,
    ID_PARCHE: number,
    ID_PROPIO: string,
    KB_ID: number,
    TITULO: string,
}

export interface IServerInGroup {
    CLASE: string,
    DESCRIPCION: string,
    FAMILIA: string,
    ID_EQUIPO: number,
    ID_PROYECTO: number,
    NOMBRE: string,
    NOMBRE_CI: string,
    PARCHES: IPatchesInServer[];
}

//IGroupsWithServersWithPatches extendido con propiedades extras para su manejo en Front
export interface IPatchesInServerFront extends IPatchesInServer {
    CHECK: boolean,
    UNCHECK_REASON: string
}
export interface IServerInGroupFront extends IServerInGroup {
    PARCHES: IPatchesInServerFront[]
}
export interface IGroupsWithServersWithPatchesFront extends IGroupsWithServersWithPatches {
    CHECK: boolean,
    SERVIDORES: IServerInGroupFront[]
}
//Body de Request listar rutinarias AWX 
export interface IListAWXRoutines {
    ID_RUTINARIA: number,
    NOMBRE: string,
    DESCRIPCION: string
}
//Body del request Listar servidores que estan asignados (server view table)
export interface IListServerAssigned {
    CLASE: string | null,
    FAMILIA: string | null,
    GRUPO: string,
    ID_EQUIPO: number,
    ID_GRUPO: number,
    NOMBRE: string,
    NOMBRE_CI: string,
    NRO_IP: string,
    NRO_PARCHES: number,
    TIENE_CREDENCIAL: number,
    TIENE_EJECUCION: number
}
//Boby del request listar informacion de un servidor
export interface IServerInformation {
    credenciales: ICredenciales;
    crqs: ICrq[];
    informacion: Informacion;
    parches: IPatch[];
}


export interface ICredenciales {
    CLAVE: null | string;
    ESTADO: null | number;
    ID_EQUIPO: number;
    USUARIO: null | string;
}
export interface ICrq {
    CRQ: null;
    NOMBRE: null;
    NRO_SERVIDORES: null;
}
export interface Informacion {
    CPU_DESCRIPCION: string | null;
    DISK_ASIGNADO: string | null;
    NRO_IP: string | null;
    RAM_ASIGNADO: string | null;
    VERSION_SW: string | null;
}
export interface IPatch {
    ID_EJECUCION_DETALLE: number;
    ID_PARCHE: number;
    KB_ID: number;
    TITULO: string;
}
export const initialServerInfo: IServerInformation = {
    credenciales: {
        CLAVE: "",
        ESTADO: 1,
        ID_EQUIPO: 0,
        USUARIO: ""
    },
    crqs: [],
    informacion: {
        CPU_DESCRIPCION: "",
        DISK_ASIGNADO: "",
        NRO_IP: "",
        RAM_ASIGNADO: "",
        VERSION_SW: ""
    },
    parches: []
}

export interface IListHistoricPatches {
    CATEGORIES: string,
    ID_EQUIPO: number,
    TITULO: string,
    KB_ID: string,
    INSTALLED_ON: string
}

export interface ICalendarEvents {
    id: string | number,
    title: string,
    color: string,
    allDay: boolean,
    start: string,
    end: string
}

//Body de request de Listar Ejecuciones (Padre)
export interface IListExecutions {
    CRQ: null | string,
    CUMPLIMIENTO: null | string,
    ESTADO_EJECUCION: null | string,
    FECHA_FIN: null | string,
    FECHA_INICIO: null | string,
    ID_EJECUCION: number,
    NOMBRE: string,
    NRO_SERVIDORES: number,
    SERVIDORES_EXITOSOS: number,
    USUARIO_EJECUTOR: null | string
}

export interface IDetailOfExecution {
    CHECK_INSTALLER: null | string;
    ES_ERROR: null | string;
    FECHA_FIN: null | string;
    FECHA_INICIO: null | string;
    ID_EJECUCION: number;
    ID_EJECUCION_DETALLE: number;
    ID_EQUIPO: number;
    ID_PLANTILLA: number;
    ID_RUTINARIA: number;
    NOMBRE_EQUIPO: string;
    NOMBRE_GRUPO: string;
    NOMBRE_PLANTILLA: string;
    NOMBRE_RUTINARIA: string;
    NRO_INTENTO: number;
    RESULTADO: null | string;
}

//Body para crear una nueva credencial
export interface ICreateCredential {
    nombre: string,
    descripcion: string,
    usuario: string,
    clave: string,
    usuario_ccs: string
}
export const initialCredential: ICreateCredential = {
    nombre: "",
    descripcion: "",
    usuario: "",
    clave: "",
    usuario_ccs: ""
}
export interface IUpdateCredential {
    id_credencial: number,
    nombre: string,
    descripcion: string,
    usuario: string,
    clave: string,
    usuario_ccs: string
}

export const initialCredentialUpdate: IUpdateCredential = {
    id_credencial: 0,
    nombre: "",
    descripcion: "",
    usuario: "",
    clave: "",
    usuario_ccs: ""
}

export interface IListCredential {
    DESCRIPCION: string,
    FECHA_CREACION: string,
    FECHA_MODIFICACION: null | string,
    ID_CREDENCIAL: number,
    NOMBRE: string,
    USUARIO: null | string,
    USUARIO_CREACION: string,
    USUARIO_MODIFICACION: null | string
}

export type IUpdateFunctions = {
    updatedPassword: (newvalue: string) => void,
    updatedUserName: (newvalue: string) => void,
    updatedNameCredential: (newvalue: string) => void,
    updatedDescription: (newvalue: string) => void,
    setCredentialToUpdate: React.Dispatch<React.SetStateAction<IUpdateCredential>>
}

//Body necesario para el request de crear programacion - configuración
export interface ICreateConfiguration {
    cliente: string,
    usuario: string,
    lista_programacion: IListConfigListaProg[]
}

export interface IListConfigListaProg {
    id_grupo: number,
    lista_servidores:
    {
        id_servidor: number,
        lista_parches:
        {
            id_parche: number,
            seleccionado: number,
            motivo: string
        }[]
    }[]
}

export interface ICategories {
    categoryName: string,
    checked: boolean
}

//Body de request listar configuración de una ejecución
export interface IGroupsWithServersWithPatchesUpdate {
    ESTADO: null | number,
    FECHA_CREACION: null | string,
    FECHA_MODIFICACION: null | string,
    ID_GRUPO: number,
    ID_PLANTILLA: number,
    NOMBRE: string,
    NOMBRE_PLANTILLA: string,
    PASOS_PLANTILLA: IRoutinesTemplateInGroup[],
    SERVIDORES: IServerInGroupUpdate[]
}

export interface IPatchesInServerUpdate {
    CATEGORIES: string,
    CHECK_INSTALL: number,
    ESTADO: number,
    ID_PARCHE: number,
    ID_PROPIO: string,
    KB_ID: number,
    MOTIVO: null | string,
    TITULO: string,
}

export interface IServerInGroupUpdate {
    CLASE: string,
    DESCRIPCION: string,
    FAMILIA: string,
    ID_EQUIPO: number,
    ID_PROYECTO: number,
    NOMBRE: string,
    NOMBRE_CI: string,
    PARCHES: IPatchesInServerUpdate[];
}

export interface IUpdateConfiguration extends ICreateConfiguration {
}
//si flag es 1 lista servidores con credencial, si es 0 sin credencial
export interface IBodyServersCredential {
    id_credencial: number,
    id_proyecto: number,
    cliente: string,
    flag_credencial: number
}

export interface IListServersCredential {
    CLASE: string,
    CREDENCIAL: string,
    FAMILIA: string,
    GRUPO: string,
    ID_CREDENCIAL: number,
    ID_EQUIPO: number,
    ID_GRUPO: number,
    NOMBRE: string,
    NOMBRE_CI: string,
    NRO_IP: string
}

export interface IBodyAssignCredential {
    id_credencial: number,
    equipo_ids: string,
    usuario: string
}

export interface ICreatePlanification {
    id_planificacion: number,
    id_grupo: number,
    fecha_inicio: string,
    fecha_fin: string,
    all_day: number,
    ejecutado: number,
    estado: number,
    usuario: string
}

export interface IBodyListPlanification {
    cliente: string,
    id_proyecto: number
}
export interface IPlanification {
    FECHA_FIN: string | null,
    FECHA_INICIO: string,
    ID_GRUPO: number,
    grupo: string,
    ID_PLANIFICACION: number,
    all_day: number,
    ejecutado: number,
    estado: number
}

export interface IGroupPlanification {
    NOMBRE_GRUPO: string,
    ID_GRUPO: number
}

export interface ISocketDataEvent {
    usuario: string,
    mensaje: string,
    tipo: number,
    status: string,
    id_ejecucion_detalle: number,
    id_equipo: number
}

export interface IInitSearchHistoricPatches {
    usuario: string,
    id_equipo: number
}

export interface IInitSearchPendingPatches {
    cliente: string
    usuario: string
    crq: string
    lista_programacion: IListConfigListaProg[]
}

export interface IListPendingPatche {
    nombre_ejecucion: string | null,
    grupo: string,
    NOMBRE: string,
    rutinaria: string,
    FECHA_INICIO: null | string,
    FECHA_FIN: null | string,
    IS_EXECUTED: null | number,
    ES_ERROR: number | number,
    ORDEN: number,
    RESULTADO: null | string
}

export interface IListProgress {
    cliente: string;
    crq: null;
    lista_programacion: ListaProgramacion[];
}
export interface ListaProgramacion {
    id_grupo: number;
    lista_servidores: ListaServidores[];
    nombre_grupo: string;
}

export interface ListaServidores {
    id_equipo: number;
    lista_rutinaria: ListaRutinaria[];
    nombre_equipo: string;
}

export interface ListaRutinaria {
    es_error?: number;
    fecha_fin?: Date;
    fecha_inicio?: Date;
    is_executed?: number;
    id_ejecucion_detalle: number;
    orden: number;
    resultado?: string;
    rutinaria: string;
    id_job_awx: string;
}

export interface IReassignTemplateOfGroup {
    id_grupo: number,
    id_plantilla: number,
    usuario: string
}

export interface IUpdateGroupName {
    nombre: string
}

export interface IMotivoSalto {
    motivo: string
}

export interface ICheckList {
    post_status: string,
    pre_status: string,
    service: string
}

export interface IListServerUnifiedWithPickedIP extends IListServerUnified {
    PICKED_IP: IIP
}

export interface IUpdateIP {
    id_grupo: number,
    usuario: string,
    id_equipo: number,
    id_equipo_ip: number
}

export type OPERATE_SYSTEMS = 'WINDOWS' | 'LINUX'

export interface IUseTemplate {
    createTemplate: (newTemplate: ICreateTemplate) => Promise<true | undefined>,
    createTemplatesLoading: boolean,
    getListTemplate: (so: OPERATE_SYSTEMS) => Promise<void>,
    getListTemplateLoading: boolean,
    templatesData: IListTemplate[],
    getListAWXRoutines: (isLinux: boolean) => Promise<void>,
    getListAWXoutinesLoading: boolean,
    awxRoutinesData: IListAWXRoutines[],
    updateTemplate: (templateUpdated: IUpdateTemplate) => Promise<true | undefined>,
    updateTemplateLoading: boolean,
    getListAWXRoutinesOfTemplate: (idTemplate: number) => Promise<void>,
    getListAWXoutinesOfTemplateLoading: boolean,
    awxRoutinesOfTemplateData: IListAWXRoutines[],
    deleteTemplate: (idTemplate: number) => Promise<true | undefined>,
    deleteTemplateLoading: boolean,
    getTemplateOfExecution: (idExecution: number) => Promise<ITemplatedConfiguratedLinux[] | undefined>,
    getTemplateByExecution: boolean
}

export interface IUseServer {
    getListOfServersUnified: (nameClient: string, idProject: number) => Promise<void>,
    getServersUnifiedLoading: boolean,
    serversUnifiedData: IListServerUnified[],
    getServerInformation: (idServer: number) => Promise<void>,
    getServersInfoLoading: boolean,
    serverInformationData: IServerInformation,
    getServersAssigned: (nameClient: string, idProject: number) => Promise<void>,
    getServersAssignedLoading: boolean,
    serverAssignedData: IListServerAssigned[],
    getHistoricPatches: (idServer: number) => Promise<void>,
    getHistoricPatchesLoading: boolean,
    historicPatches: IListHistoricPatches[],
    updateIPOfServer: (newIP: IUpdateIP) => Promise<true | undefined>,
    updateIPLoading: boolean,
    getServersAssignedLinux: (nameClient: string, idProject: number) => Promise<void>,
    getServersAssignedLinuxLoading: boolean,
    serverAssignedLinuxData: IListServerAssignedLinux[],
    getServerInformationLinux: (idServer: number) => Promise<void>,
    getServersInfoLinuxLoading: boolean,
    serverInformationLinuxData: IServerInformation,
    getExclusions: () => Promise<void>,
    getExclusionsLoading: boolean,
    exclusionsData: IDataListFormat[],
    getSuseCategories: () => Promise<void>,
    getSuseCategoriesLoading: boolean,
    suseCategoriesData: IDataListFormat[],
    getSuseSeverities: () => Promise<void>,
    getSuseSeverityLoading: boolean,
    suseSeverityData: IDataListFormat[],
    getPhotoPrePostByServerLinux: (nroTicket: string, idServer: number) => Promise<IListLogsPrePostLinux | undefined>,
    getLogsPrePostLinuxLoading: boolean,
    getDifferencesPrePostLinux: (idExecution: number, idServer: number) => Promise<IDifferencesPrePostLinux | undefined>,
    getDifferencesPrePostLinuxLoading: boolean,
    getResultSearchLinux: (searchFilter: ISearchFilter) => Promise<IResultSearchLinux[] | undefined>,
    getResultSearchLinuxLoading: boolean
}



export interface IUseGroup {
    createGroup: (newGroup: ICreateGroup) => Promise<true | undefined>,
    isCreateLoading: boolean,
    assignServerToGroup: (serversData: IAssignServerToGroup) => Promise<true | undefined>,
    assignServerLoading: boolean,
    getListGroupsWithServers: (nameClient: string, idProject: number) => Promise<void>,
    getListGroupsServersPatchesLoading: boolean,
    groupsServerPatchesData: IGroupsWithServersWithPatches[],
    getListGroups: (so: OPERATE_SYSTEMS) => Promise<void>,
    getListGroupsLoading: boolean,
    groupsData: IListGroup[],
    deleteServerInGroup: (idGroup: number, idServer: number) => Promise<true | undefined>,
    deleteServerInGroupLoading: boolean,
    getTemplateOfGroup: (idGroup: number) => Promise<void>,
    getTemplateOfGroupLoading: boolean,
    templateAsociatedToGroup: IListTemplate[],
    reassignTemplate: (groupToChange: IReassignTemplateOfGroup) => Promise<true | undefined>,
    reassignTemplateOfGroupLoading: boolean,
    changeGroupName: (idGroup: number, newGroupName: IUpdateGroupName) => Promise<true | undefined>,
    changeGroupNameLoading: boolean,
    getGroupsServersLinux: (nameClient: string, idProject: number) => Promise<void>,
    getListGroupsServersLinux: boolean,
    groupsServerLinuxData: IGroupsWithServersLinux[],
    linuxFormConfigurationData: ILinuxFormData,
    deleteServerInGroupLinux: (idGroup: number, idServer: number) => Promise<true | undefined>,
    deleteServerInGroupLinuxLoading: boolean,
    dehabilitateGroup: (idGroup: number) => Promise<true | undefined>,
    dehabilitateGroupLoading: boolean
}

export interface IUseCredential {
    newCredential: ICreateCredential,
    newCredentialsFuncs: {
        updatePassword: (newvalue: string) => void;
        updateUserName: (newvalue: string) => void;
        updateNameCredential: (newvalue: string) => void;
        updateDescription: (newvalue: string) => void;
        setNewCredential: React.Dispatch<React.SetStateAction<ICreateCredential>>;
    },
    credentialToUpdate: IUpdateCredential,
    updateCredentialsFuncs: {
        updatedPassword: (newvalue: string) => void;
        updatedUserName: (newvalue: string) => void;
        updatedNameCredential: (newvalue: string) => void;
        updatedDescription: (newvalue: string) => void;
        setCredentialToUpdate: React.Dispatch<React.SetStateAction<IUpdateCredential>>
    },
    getListCredentials: () => Promise<void>,
    getCredentialsLoading: boolean,
    credentialsData: IListCredential[],
    createCredential: (newCredential: ICreateCredential) => Promise<true | undefined>,
    createCredentialLoading: boolean,
    updateCredential: (updatedCredential: IUpdateCredential) => Promise<true | undefined>,
    updateCredentialLoading: boolean,
    deleteCredential: (idCredential: number) => Promise<true | undefined>,
    deleteCredentialLoading: boolean,
    getServersWithCredential: (whoServerWants: IBodyServersCredential) => Promise<void>,
    serverWithCredentialLoading: boolean,
    serversWithCredentialData: IListServersCredential[],
    getServersWithoutCredential: (whoServerWants: IBodyServersCredential) => Promise<void>,
    serverWithoutCredentialLoading: boolean,
    serversWithoutCredentialData: IListServersCredential[],
    AssignServersToCredential: (serversToAssign: IBodyAssignCredential) => Promise<true | undefined>,
    assignServerToCredentialsLoading: boolean,
    deleteCredentialOfServer: (idCredencial: number, idServer: number) => Promise<true | undefined>,
    deleteCredentialOfServerLoading: boolean,
    createCredentialLinux: (newCredential: ICreateCredential) => Promise<true | undefined>,
    createCredentialLinuxLoading: boolean
}
export interface IUseExecution {
    getListExecutions: (nameClient: string, idProject?: number) => Promise<void>,
    getListExecutionsLoading: boolean,
    executionsData: IListExecutions[],
    getListExecutionDetail: (idExecution: number) => Promise<void>,
    getExecutionDetailLoading: boolean,
    executionDetailData: IDetailOfExecution[],
    createConfiguration: (configuration: ICreateConfiguration) => Promise<true | undefined>,
    createConfigurationLoading: boolean,
    getListConfigurationOfExecution: (idExecution: number) => Promise<void>,
    configurationLoading: boolean,
    configurationOfExecution: IGroupsWithServersWithPatchesUpdate[],
    updateConfiguration: (idEjecucion: number, configuration: IUpdateConfiguration) => Promise<true | undefined>,
    updateConfigurationLoading: boolean,
    initSearchHistoricPatches: (serversToFind: IInitSearchHistoricPatches) => Promise<true | undefined>,
    initSearchHistoricPatchLoading: boolean,
    setInitSearchHistoricPatchLoading: React.Dispatch<React.SetStateAction<boolean>>,
    initSearchPendingPatches: (serversToFind: IInitSearchPendingPatches) => Promise<{
        success: boolean;
        data: any;
    }>,
    initSearchPendingPatchLoading: boolean,
    initPatchingLoading: boolean,
    initPatching: (serversToExec: IInitSearchPendingPatches, idExecution: number) => Promise<true | undefined>,
    listProgressExecution: (idExecution: number, origen?: string) => Promise<void>
    progressExecutionData: IListProgress,
    setProgressExecutionData: React.Dispatch<React.SetStateAction<IListProgress>>
    progressExecutionLoading: boolean,
    deleteExecution: (idExecution: number) => Promise<true | undefined>,
    deleteExecutionLoading: boolean,
    restartExecution: (idExecution: number, idDetailExecution: number, user: string, idServer: number) => Promise<true | undefined>,
    restartExecutionLoading: boolean,
    cancelExecution: (idExecution: number, idDetailExecution: number, user: string, idServer: number) => Promise<true | undefined>,
    cancelExecutionLoading: boolean,
    getLogsJobAwx: (id_job_awx: string) => Promise<void>,
    logsAwxData: string,
    getLogsAwxLoading: boolean,
    saltarExecution: (idExecution: number, idDetailExecution: number, user: string, idServer: number, motivo: IMotivoSalto) => Promise<true | undefined>,
    getMotivoSaltoLoading: boolean,
    getDifferencesPrePost: (idExecution: number, idServer: number) => Promise<void>,
    prePostDifferences: string[],
    loadingDifferences: boolean,
    getCheckList: (idExecution: number, idServer: number) => Promise<void>,
    checkListData: ICheckList[],
    loadingChecklist: boolean,
    createConfigurationLinux: (configuration: ICreateConfigurationLinux) => Promise<true | undefined>,
    createConfigurationLinuxLoading: boolean,
    getListExecutionsLinux: (nameClient: string, idProject?: number) => Promise<void>,
    getListExecutionsLinuxLoading: boolean,
    executionsLinuxData: IListExecutionsLinux[],
    getListExecutionDetailLinux: (idExecution: number) => Promise<IDetailOfExecutionLinux[] | undefined>,
    getExecutionLinuxDetailLoading: boolean,
    updateConfigurationLinux: (idEjecucion: number, configuration: IUpdateConfigurationLinux) => Promise<true | undefined>,
    updateConfigurationLinuxLoading: boolean,
    getConfigurationLinuxOfExecution: (idExecution: number) => Promise<ILinuxConfigurationSaved | undefined>,
    configurationLinuxLoading: boolean,
    listProgressLinuxExecution: (idExecution: number) => Promise<IListProgressLinux | undefined>,
    progressLinuxExecutionLoading: boolean,
    deleteExecutionLinux: (idExecution: number) => Promise<true | undefined>,
    deleteExecutionLinuxLoading: boolean,
    getExecutionHistoryByServer: (idExecution: number) => Promise<IExecutionHistoryByServer[] | undefined>,
    historicalExecutionsLoading: boolean,
    executeSearchLinux: (serversToFind: ISearchLinuxConfiguration) => Promise<{
        success: boolean;
        data: number;
    }>,
    executeSearchLinuxLoading: boolean,
    startExecutionLinux: (configuration: IExecuteTemplateLinux, idExecution: number) => Promise<{
        success: boolean;
        data: any;
    }>,
    startExecutionLoading: boolean,
    getLogsJobAwxV2: (id_job_awx: string) => Promise<void>,
    logsAwxV2Data: string,
    getLogsAwxV2Loading: boolean,
    cancelExecutionLinux: (idExecution: number, userName: string, idServer: number) => Promise<true | undefined>,
    cancelExecutionLinuxLoading: boolean,
    skipExecutionLinux: (idExecution: number, userName: string, idServer: number, motivo: IMotivoSalto) => Promise<true | undefined>,
    skipExecutionLinuxLoading: boolean,
    rerunExecutionLinux: (idExecution: number, userName: string, idServer: number) => Promise<true | undefined>,
    rerunExecutionLinuxLoading: boolean
}

export interface IUsePlanification {
    savePlanification: (planification: ICreatePlanification[]) => Promise<true | undefined>,
    savePlanificationLoading: boolean,
    deletePlanification: (idPlanification: number | string) => Promise<true | undefined>,
    deletePlanificationLoading: boolean,
    getListPlanification: (whoPlanificationWants: IBodyListPlanification) => Promise<IPlanification[]>,
    listPlanificationLoading: boolean
}

export interface ILinuxPatchContext {
    rol: Role,
    modalHook: IModalFunctions,
    groupHook: IUseGroup,
    serverHook: IUseServer,
    templateHook: IUseTemplate,
    credentialHook: IUseCredential,
    selectedOwners: IOwnerLinuxServer,
    executionHook: IUseExecution,
    clientHook: IuseClient,
    socketInstance: Socket<any, any> | undefined,
    setOwners: React.Dispatch<React.SetStateAction<IOwnerLinuxServer>>
}

export enum ModalViewForLinuxPatch {
    EXEC_PATCH = 'EXEC_PATCH',
    GROUPS_AND_TEMPLATES = 'GROUPS_AND_TEMPLATES',
    CREDENTIALS = 'CREDENTIALS',
    HISTORIC_EXECUTIONS = 'HISTORIC_EXECUTIONS',
    SERVER_INFORMATION = 'SERVER_INFORMATION',
    CONFIGURATION_PATCH = 'CONFIGURATION_PATCH',
    EXECUTION_DETAIL = 'EXECUTION_DETAIL',
    EXECUTION_PROGRESS = 'EXECUTION_PROGRESS',
    EXECUTION_SAVED = 'EXECUTION_SAVED',
    CONFIRM_DELETE_EXECUTION = 'CONFIRM_DELETE_EXECUTION',
    SEARCH_PATCHES = 'SEARCH_PATCHES'
}

export interface IOwnerLinuxServer {
    cliente: string,
    proyecto: string,
    id_proyecto: number,
    clientToExecution: string
}

export const initialOwnerLinuxServer: IOwnerLinuxServer = {
    cliente: "",
    proyecto: "",
    id_proyecto: 0,
    clientToExecution: ""
}

export interface IListServerAssignedLinux {
    CLASE: string | null,
    FAMILIA: string | null,
    GRUPO: string,
    ID_EQUIPO: number,
    ID_GRUPO: number,
    NOMBRE: string,
    NOMBRE_CI: string,
    NRO_IP: string,
    TIENE_CREDENCIAL: number,
    TIENE_EJECUCION: number
}

export type DNDTypeItem = {
    id_item: UniqueIdentifier,
    name: string,
    description?: string
}

export type DNDType = {
    id: UniqueIdentifier,
    title: string,
    description?: string
    items: DNDTypeItem[]
}


export interface IWindowsPatchContext {
    rol: Role,
    modalHook: IModalFunctions,
    groupHook: IUseGroup,
    serverHook: IUseServer,
    templateHook: IUseTemplate,
    credentialHook: IUseCredential,
    planificationHook: IUsePlanification,
    selectedOwners: IOwnerLinuxServer,
    executionHook: IUseExecution,
    socketInstance: Socket<any, any> | undefined,
    executionModalFunctions: IModalFunctions,
    disconnectSocket: () => void,
    setOwners: React.Dispatch<React.SetStateAction<IOwnerLinuxServer>>,
    clientForExecution: string,
    setSelectedClientForExecution: React.Dispatch<React.SetStateAction<string>>
}

export interface IExecutionConfiguration {
    client: string,
    exclusions: IDataListFormat[],
    actual_exclusion: string,
    redhat_user: string,
    redhat_credential: string,
    suse_categories: IDataListFormat[],
    actual_suse_category: string,
    suse_severities: IDataListFormat[],
    actual_suse_severity: string,
    actual_suse_optional: string,
    ticket_cambio: string
}

export const initialConfiguration = (client: string): IExecutionConfiguration => ({
    client: client,
    ticket_cambio: '',
    actual_suse_category: '',
    actual_suse_optional: 'SI',
    actual_suse_severity: '',
    actual_exclusion: '',
    exclusions: [{
        id: uniqid(),
        value: 'SIN_RESTRICCION_DE_PARCHES'
    }],
    redhat_credential: '',
    redhat_user: '',
    suse_categories: [{
        id: uniqid(),
        value: 'ALL'
    }],
    suse_severities: [{
        id: uniqid(),
        value: 'ALL'
    }]
})

export const executionStates: any = {
    TERMINADO: 'success',
    PLANIFICADO: 'info',
    INICIADO: 'warning'
}
export interface ICreateConfigurationLinux {
    cliente: string,
    usuario: string,
    crq: string,
    red_hat_user: string,
    red_hat_credential: string,
    lista_excluido: string[],
    lista_suse_categoria: string[],
    lista_suse_severidad: string[],
    suse_opcional: string
    lista_programacion: IListConfigListaProgLinux[]
}

export interface IExecuteTemplateLinux {
    cliente: string,
    usuario: string,
    crq: string,
    red_hat_user: string,
    red_hat_credential: string,
    lista_excluido: string[],
    lista_suse_categoria: string[],
    lista_suse_severidad: string[],
    suse_opcional: string
    lista_programacion: number[]
}

export interface IListConfigListaProgLinux {
    id_grupo: number,
    lista_servidores: {
        id_servidor: number
    }[]
}


export interface IGroupsWithServersLinux {
    ESTADO: null | number,
    FECHA_CREACION: null | string,
    FECHA_MODIFICACION: null | string,
    ID_GRUPO: number,
    ID_PLANTILLA: number,
    NOMBRE: string,
    NOMBRE_PLANTILLA: string,
    PASOS_PLANTILLA: IRoutinesTemplateInGroup[],
    SERVIDORES: IServerInGroupLinux[]
}

export interface IServerInGroupLinux {
    CLASE: string,
    DESCRIPCION: string,
    FAMILIA: string,
    ID_EQUIPO: number,
    ID_PROYECTO: number,
    NOMBRE: string,
    NOMBRE_CI: string,
    NRO_IP: string | null,
    TIPO_IP: string | null
}
export interface IGroupsWithServersLinuxFront extends IGroupsWithServersLinux {
    CHECK: boolean
}

export interface IListExecutionsLinux {
    CRQ: null | string,
    CUMPLIMIENTO: null | string,
    ESTADO_EJECUCION: null | string,
    FECHA_FIN: null | string,
    FECHA_INICIO: null | string,
    ID_EJECUCION: number,
    NOMBRE: string,
    NRO_SERVIDORES: number,
    SERVIDORES_EXITOSOS: number,
    USUARIO_EJECUTOR: null | string
}

export interface IDetailOfExecutionLinux {
    CRQ: string | null,
    ES_ERROR: number | null,
    FECHA_FIN: string | null,
    FECHA_INICIO: string | null,
    ID_EJECUCION: number,
    ID_EJECUCION_DETALLE: number,
    ID_EQUIPO: number,
    ID_PLANTILLA: number,
    ID_RUTINARIA: number,
    IS_EXECUTED: number | null,
    NOMBRE_EQUIPO: string,
    NOMBRE_GRUPO: string,
    NOMBRE_PLANTILLA: string,
    NOMBRE_RUTINARIA: string,
    NRO_INTENTO: number | null,
    RESULTADO: string | null
}

export interface IUpdateConfigurationLinux extends ICreateConfigurationLinux {
}

export interface ILinuxConfigurationSaved {
    CRQ: string | null,
    EXCLUSION: string | null,
    ID_EJECUCION: number,
    SUSE_SEVERIDAD: string | null,
    SUSE_OPCIONAL: string | null,
    SUSE_CATEGORIA: string | null,
    RED_HAT_USER: string | null,
    RED_HAT_CREDENTIALS: string | null,
    NOMBRE: string
    LISTA_GRUPOS: IGroupsWithServersSaved[]
}

export interface ITemplateConfigurationSaved {
    ID_GRUPO: string
    ID_PLANTILLA: number,
    NOMBRE_RUTINARIA: string,
    ORDEN: number,
}

export interface IServersConfigurationSaved {
    CLASE: string,
    DESCRIPCION: string,
    FAMILIA: string,
    ID_EQUIPO: number,
    ID_PROYECTO: number,
    NOMBRE: string,
    NOMBRE_CI: string
}

export interface IGroupsWithServersSaved {
    ESTADO: null | number,
    FECHA_CREACION: null | string,
    FECHA_MODIFICACION: null | string,
    ID_GRUPO: number,
    ID_PLANTILLA: number,
    NOMBRE: string,
    NOMBRE_PLANTILLA: string,
    PASOS_PLANTILLA: ITemplateConfigurationSaved[],
    SERVIDORES: IServersConfigurationSaved[]
}

export interface IListProgressLinux {
    cliente: string;
    crq: string | null;
    nombre_ejecucion: string;
    id_ejecucion: string;
    lista_programacion: ListaProgramacionLinux[];
}

export interface ListaProgramacionLinux {
    id_grupo: number;
    nombre_grupo: string;
    lista_servidores: ListaServidoresLinux[];
}

export interface ListaServidoresLinux {
    id_equipo: number;
    lista_rutinaria: ListaRutinariaLinux[];
    nombre_equipo: string;
}

export interface ListaRutinariaLinux {
    es_error: number | null;
    fecha_fin: string | null;
    fecha_inicio: string | null;
    is_executed: number | null;
    id_ejecucion_detalle: number;
    orden: number;
    resultado: string | null;
    rutinaria: string;
    id_job_awx: string | null;
}

export interface IExecutionHistoryByServer {
    CRQ: string;
    CUMPLIMIENTO: string | null;
    ESTADO: number;
    ESTADO_EJECUCION: string;
    EXCLUSION: string;
    FECHA_CREACION: string;
    FECHA_FIN: string | null;
    FECHA_INICIO: string | null;
    FECHA_MODIFICACION: string | null;
    ID_EJECUCION: number;
    NOMBRE: string;
    NRO_SERVIDORES: number;
    RED_HAT_CREDENTIALS: string;
    RED_HAT_USER: string;
    SERVIDORES_EXITOSOS: string | null;
    SUSE_CATEGORIA: string;
    SUSE_OPCIONAL: string;
    SUSE_SEVERIDAD: string;
    USUARIO_CREACION: string;
    USUARIO_EJECUTOR: string | null;
    USUARIO_MODIFICACION: string | null;
}

export interface ISearchLinuxConfiguration extends ICreateConfigurationLinux {
}

export interface ILinuxFormData {
    exclusions: IDataListFormat[],
    suse_severity: IDataListFormat[],
    suse_categoria: IDataListFormat[]
}

export const initialLinuxFormConfigurationData: ILinuxFormData = {
    exclusions: [],
    suse_categoria: [],
    suse_severity: []
}

export interface IListLogsPrePostLinux {
    photo_pos: string | null,
    photo_pre: string | null
}

export interface IDifferencesPrePostLinux {
    photo_diff: string | null
}

export interface IResultSearchLinux {
    RESULTADO_BUSQUEDA: string | null
}

export interface ISearchFilter {
    id_ejecucion_detalle: number,
    id_servidor: number
}

export enum RoutinesLinux {
    PATCH = "CSS-LINUX-PATCH",
    REBOOT = "CSS-LINUX-REBOOT",
    PHOTO_POST = "CSS-LINUX-PHOTO-POS",
    PHOTO_PRE = "CSS-LINUX-PHOTO-PRE",
    SEARCH = "CSS-LINUX-SEARCH"
}

export interface ITemplatedConfiguratedLinux {
    id_grupo: number;
    lista_rutinarias: IRoutinesTemplate[];
    nombre_grupo: string;
    nombre_plantilla: string;
}

export interface IRoutinesTemplate {
    id_rutinaria: string;
    nombre_rutinaria: string;
}
