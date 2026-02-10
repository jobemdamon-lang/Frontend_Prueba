import { IComboData } from "../../helpers/Types";
import { IModalFunctions, IuseProject, Role } from "../../hooks/Types";
import { IListCollaborators } from "../administration/Types";

export interface IServerProvisioningContext {
    rol: Role;
    modalHook: IModalFunctions;
    paramsHook: IuseParams;
    requestVMHook: IuseRequestVM;
    updateRequestHook: IuseRequestUpdateVM;
    setCurrentView: React.Dispatch<React.SetStateAction<Views>>;
    projectHook: IuseProject;
}

export enum ModalViewForServerProvisioning {
    APPROVAL_MODAL = "APPROVAL_MODAL",
    SEND_APPROVE = "SEND_APPROVE",
    CANCEL_REQUEST = "CANCEL_REQUEST",
    UPDATE_GENERAL = "UPDATE_GENERAL",
    UPDATE_NETWORK = "UPDATE_NETWORK",
    UPDATE_SERVICES = "UPDATE_SERVICES",
    UPDATE_HARDWARE = "UPDATE_HARDWARE",
    ADD_DISK = "ADD_DISK",
    UPDATE_DISK = "UPDATE_DISK",
    ELIMINATE_DISK = "ELIMINATE_DISK",
    ADD_PARTITION = "ADD_PARTITION",
    UPDATE_PARTITION = "UPDATE_PARTITION",
    ELIMINATE_PARTITION = "ELIMINATE_PARTITION",
    CONFIRM_EXECUTION = "CONFIRM_EXECUTION",
    CANCEL_CREATION = "CANCEL_CREATION",
    INFO_EXECUTION = "INFO_EXECUTION",
    MANAGE_ACCOUNTS = "MANAGE_ACCOUNTS",
    REVALIDATE_APPROVAL = "REVALIDATE_APPROVAL",
    VALIDATE_RECOMMENDATION = "VALIDATE_RECOMMENDATION",
    EDR_WARNING = "EDR_WARNING"
}

export interface StepForm {
    id: number;
    title: string;
    description: string;
}

export interface CreateRequestVM {
    id_criticidad: number;
    id_ubicacion: number;
    id_tipo_servicio: number;
    id_so_version: number;
    id_proyecto: number;
    id_admin_torre: number;
    vcpu_cores: number;
    ram_gb: number;
    swap_gb: number;
    hostname: string;
    ip: string;
    vlan_id: number;
    gateway: string;
    netmask: string;
    id_ambiente: number;
    id_tipo_alcance: number;
    implementar_monitoreo: boolean;
    implementar_backup: boolean;
    implementar_edr: number;
    id_ambito: number;
    fecha_ejecucion: string;
    rol_uso: string;
    usuario_creacion: string;
    discos: CreateDisk[];
}

export interface CreateDisk {
    nombre_unidad: string,
    gb_disco: number,
    particiones: CreatePartition[]
}

export interface CreatePartition {
    punto_montaje: string,
    gb_particion: number
}

export const initialRequest = (username: string, paramsHook: IuseParams): CreateRequestVM => {
    const findedEDRCanvia = paramsHook.requestParams.find(r => r.TIPOATRIBUTO === 'TIPO_EDR_APROVISIONAMIENTO' && r.VALOR === 'EDR_CANVIA')
    return {
        id_criticidad: 0,
        id_ubicacion: 0,
        id_tipo_servicio: 0,
        id_so_version: 0,
        id_proyecto: 0,
        id_admin_torre: 0,
        vcpu_cores: 0,
        ram_gb: 0,
        swap_gb: 0,
        hostname: "",
        ip: "",
        vlan_id: 0,
        gateway: '',
        netmask: '',
        id_ambiente: 0,
        id_tipo_alcance: 0,
        implementar_monitoreo: true,
        implementar_backup: false,
        implementar_edr: findedEDRCanvia ? findedEDRCanvia.IDOPCION : 0,
        id_ambito: 0,
        fecha_ejecucion: "",
        rol_uso: "",
        usuario_creacion: username,
        discos: []
    }
}

export interface RequestVMResume {
    ID_SOLICITUD: number;
    CRITICIDAD: string;
    UBICACION: string;
    TIPO_SERVICIO: string;
    SO: string;
    ADMIN_TORRE: string;
    HOSTNAME: string;
    PROYECTO: string;
    NRO_TICKET: string | null;
    MDR_ELEMENT_ID: string | null;
    FECHA_CREACION: string;
    USUARIO_CREACION: string;
    ESTADO_SOLICITUD: string;
    USUARIO_MODIFICACION: string;
    FECHA_MODIFICACION: string;
}

export interface RequestFormOptions {
    IDOPCION: number;
    ATRIBUTO: string | null;
    VALOR: string;
    TIPOATRIBUTO: string;
}

export interface Template {
    ID_TEMPLATE: number;
    ROL_USO: string;
    SO: string;
    CPU: number | null;
    RAM: number | null;
    SWAP: number | null;
    DISCOS: DiskTemplate[];
}

export interface DiskTemplate {
    ID_DISCO: number;
    NOMBRE_UNIDAD: string | null;
    DISCO_GB: number | null;
    PARTICIONES: PartitionTemplate[];
}

export interface PartitionTemplate {
    PUNTO_MONTAJE: string;
    PARTICION_GB: number;
}

export interface RequestVM {
    ID_SOLICITUD: number;
    CRITICIDAD: string;
    ID_CRITICIDAD: number;
    UBICACION: string;
    ID_UBICACION: number;
    TIPO_SERVICIO: string;
    ID_TIPO_SERVICIO: number;
    SO: string;
    VERSION_SO: string;
    ID_SO_VERSION: number;
    PROYECTO: string;
    ADMIN_TORRE: string;
    ID_ADMIN_TORRE: number;
    ID_PROYECTO: number;
    VCPU_CORES: number;
    RAM_GB: number;
    SWAP_GB: number;
    HOSTNAME: string;
    IP: string;
    VLAN_ID: number;
    GATEWAY: string;
    NETMASK: string;
    ID_AMBIENTE: number;
    ID_TIPO_ALCANCE: number;
    IMPLEMENTAR_MONITOREO: boolean;
    IMPLEMENTAR_BACKUP: boolean;
    IMPLEMENTAR_EDR: number;
    NRO_TICKET: string | null;
    MDR_ELEMENT_ID: string | null;
    ESTADO_SOLICITUD: string;
    AMBITO: string;
    ID_AMBITO: number;
    USUARIO_CREACION: string;
    FECHA_CREACION: string;
    USUARIO_MODIFICACION: string | null;
    FECHA_MODIFICACION: string | null;
    APROBADOR: string | null;
    FECHA_APROBACION: string | null;
    USUARIO_ENVIO_APROBACION: string | null;
    FECHA_ENVIO_APROBACION: string | null;
    ROL_USO: string;
    DISCOS: Disco[];
    EJECUCION: {
        ID_SOLICITUD: number;
        RESULTADO: Ejecucion[];
        USUARIO_CREACION: string;
        FECHA_CREACION: string;
        ID_EJECUCION: number;
        MENSAJE: string;
        EJECUTOR: string | null;
        ESTADO: string;
        FECHA_EJECUCION_PLANIFICADA: string;
        FECHA_EJECUCION_REAL: string | null;
        IDAWX: number | null;
        PAYLOAD: string | null;
    }
}

export interface Disco {
    ID_DISCO: number;
    ID_SOLICITUD: number;
    NOMBRE_UNIDAD: string;
    GB_DISCO: number;
    USUARIO_CREACION: string;
    USUARIO_MODIFICACION: string | null;
    FECHA_CREACION: string | null;
    FECHA_MODIFICACION: string | null;
    PARTICIONES: Particiones[];
}

export interface Particiones {
    ID_PARTICION: number;
    PUNTO_MONTAJE: string;
    GB_PARTICION: number;
    USUARIO_CREACION: string;
    USUARIO_MODIFICACION: string | null;
    FECHA_CREACION: string;
    FECHA_MODIFICACION: string | null;
    ID_DISCO: number;
}

export interface Ejecucion {
    hora: string;
    id_ejecucion: number;
    mensaje: string;
    step_name: string;
    success: boolean;
    es_tarea: boolean;
}

export interface Vlan {
    client: string;
    mask: number;
    vlan_id: number;
    vlan_network: string;
    gateway: string;
    netmask: string;
}

export interface ValidateIP {
    ip_number: string;
    vlan_id: number;
}

export interface GenerateIP {
    vlan_id: number;
}

export interface GeneratedIP {
    ip: string;
    gateway: string;
    mask: number;
    netmask: string;
}


export interface IuseRequestVM {
    createRequestVM: (data: CreateRequestVM) => Promise<true | undefined>;
    loadingCreateRequestVM: boolean;
    getRequestsVM: () => Promise<void>;
    loadingRequestsVM: boolean;
    requestsVM: RequestVMResume[];
    getRequestVM: (id_vm_request: number) => Promise<void>;
    loadingRequestVM: boolean;
    requestVM: RequestVM | null;
    sendToApproveRequestVM: (id_vm_request: number, usuario: string) => Promise<true | undefined>;
    loadingSendApproveRequestVM: boolean;
    approveRequestVM: (id_vm_request: number, usuario: string) => Promise<true | undefined>;
    loadingApproveRequestVM: boolean;
    cancelRequestVM: (id_vm_request: number, usuario: string) => Promise<true | undefined>;
    loadingCancelRequestVM: boolean;
    validateIPRequestVM: (data: ValidateIP) => Promise<true | undefined>;
    loadingValidateIP: boolean;
    generateIPRequestVM: (data: GenerateIP) => Promise<GeneratedIP | undefined>;
    loadingGenerateIP: boolean;
    executeProvisioning: (id_request: number, usuario: string) => Promise<true | undefined>;
    loadingProvisioning: boolean;
    validateRequestVM: (data: ValidateRequestVM) => Promise<undefined | [boolean, string]>;
    loadingValidateRequestVM: boolean;
    getProgressExecution: (id_execution: number) => Promise<void>;
    loadingProgress: boolean;
    progressExecution: Ejecucion[];
    revalidateApproval: (data: RevalidateApproval) => Promise<true | undefined>;
    loadingRevalidation: boolean;
    validateRecommendations: (data: validateRecommendation) => Promise<{
        success: boolean;
        recommended: Recommendation | null;
        message: string
    }>;
    loadingRecommendation: boolean;
    exportarAprovisionamiento: (data: any) => Promise<void>;
    loadingExport: boolean;
}
;
export interface IuseParams {
    getRequestFormParams: () => Promise<void>;
    loadingRequestParams: boolean;
    requestParams: RequestFormOptions[];
    getRequestFormTemplate: () => Promise<void>;
    loadingTemplate: boolean;
    template: Template[];
    getVlans: () => Promise<void>;
    loadingVlans: boolean;
    vlans: Vlan[];
    getScopeByProject: (id_project: number) => Promise<void>;
    loadingScopes: boolean;
    projectScopes: RequestFormOptions[];
    getTowers: () => Promise<void>;
    loadingTowers: boolean;
    towers: IComboData[];
    getCollaborators: () => Promise<void>;
    loadingCollabs: boolean;
    collaborators: IListCollaborators[];
}

export interface IuseRequestUpdateVM {
    updateGeneralVM: (id_request: number, data: UpdatedGeneral) => Promise<Array<boolean | unknown> | undefined>;
    loadingUpdateGeneral: boolean;
    updatehardwareVM: (id_request: number, data: UpdatedHardware) => Promise<Array<boolean | unknown> | undefined>;
    loadingUpdateHardware: boolean;
    updateServicesVM: (id_request: number, data: UpdatedServices) => Promise<true | undefined>;
    loadingUpdateServices: boolean;
    addDiskVM: (id_request: number, data: NewDisk) => Promise<Array<boolean | unknown> | undefined>;
    loadingAddDisk: boolean;
    updateDiskVM: (id_request: number, data: UpdatedDisk) => Promise<Array<boolean | unknown> | undefined>;
    loadingUpdateDisk: boolean;
    eliminateDiskVM: (id_request: number, id_disco: number) => Promise<true | undefined>;
    loadingEliminateDisk: boolean;
    addPartitionVM: (id_request: number, data: NewPartition) => Promise<Array<boolean | unknown> | undefined>;
    loadingAddPartition: boolean;
    updatePartitionVM: (id_request: number, data: UpdatedPartition) => Promise<Array<boolean | unknown> | undefined>;
    loadingUpdatePartition: boolean;
    eliminatePartitionVM: (id_request: number, id_partition: number) => Promise<true | undefined>;
    loadingEliminatePartition: boolean;
}

export interface IuseAdministrate {
    getTowerOwners: () => Promise<void>;
    loadingGetOwners: boolean;
    owners: TowerOwner[];
    addTowerOwner: (data: CreateTowerOwner) => Promise<void>;
    loadingAddOwner: boolean;
    deleteTowerOwner: (id_manage_account: number) => Promise<void>;
    loadingDeleteOwner: boolean;
}

export interface NewDisk {
    so: string;
    nombre_unidad: string;
    gb_disco: number;
    particiones: NewDiskPartition[];
    usuario_creacion: string;
}

export interface NewDiskPartition {
    punto_montaje: string;
    gb_particion: number;
}

export interface UpdatedDisk {
    id_disco: number;
    nombre_unidad: string;
    gb_disco: number;
    usuario_modificacion: string;
}

export interface NewPartition {
    id_disco: number;
    punto_montaje: string;
    gb_particion: number;
    usuario_creacion: string;
}

export interface UpdatedPartition {
    id_particion: number;
    punto_montaje: string;
    gb_particion: number;
    usuario_modificacion: string;
}

export interface UpdatedGeneral {
    id_criticidad: number;
    id_ubicacion: number;
    id_tipo_servicio: number;
    id_admin_torre: number;
    hostname: string;
    ip: string;
    vlan_id: number;
    gateway: string;
    netmask: string;
    id_ambiente: number;
    id_tipo_alcance: number;
    id_ambito: number;
    usuario_modificacion: string;
}

export interface UpdatedHardware {
    vcpu_cores: number;
    ram_gb: number;
    swap_gb: number;
    usuario_modificacion: string;
}

export interface UpdatedServices {
    implementar_monitoreo: boolean;
    implementar_backup: boolean;
    implementar_edr: number;
    usuario_modificacion: string;
}

export interface ValidateRequestVM {
    alp: string;
    tipo_servicio: string;
    so: string;
    rol_uso: string;
    ambito: string;
    vlan_id: number;
    ubicacion: string;
    validar_todo: boolean;
}

export type ErrorKeysCreateVM =
    | keyof CreateRequestVM
    | `disco-${number}-nombre`
    | `disco-${number}-gb`
    | `disco-${number}-particion-${number}-montaje`
    | `disco-${number}-particion-${number}-gb`;

export type FormErrors = Partial<Record<ErrorKeysCreateVM, string>>;

export type Views = 'requests' | 'create_request' | 'update_request' | 'request_detail'

export interface PayloadExecution {
    extra_vars: ExtraVars
}

export interface ExtraVars {
    alp?: string;
    annotation?: string;
    cluster?: string;
    cpu?: number;
    datacenter?: string;
    datastore?: string;
    dmz?: string;
    folder?: string;
    gateway?: string;
    hostname?: string;
    id_ejecucion?: number;
    ip?: string;
    netmask?: string;
    os?: string;
    ram?: number;
    resource_pool?: string;
    template?: string;
    vcenter?: string;
    vlan_id?: string;
    vlan_name?: string;
    vm_name?: string;
}

export interface TowerOwner {
    ID_GESTION_CUENTA: number;
    ID_ADMIN_TORRE: number;
    ID_USUARIO: number;
    NOMBRE_ADMIN_TORRE: string;
    NOMBRE: string;
    USUARIO: string;
}

export interface CreateTowerOwner {
    id_admin_torre: number,
    id_usuario: number
}

export interface RevalidateApproval {
    nroTicket: string
}

export interface validateRecommendation {
    alp: string;
    tipo_servicio: string;
    so: string;
    rol_uso: string;
    ambito: string;
    vlan_id: number;
    ubicacion: string;
    total_gb: number;
    total_cpu: number;
    total_ram: number;
}

export interface Recommendation {
    available: number;
    cluster: string;
    cluster_pct_future_occuped_cpu_mhz: number;
    cluster_pct_future_occuped_ram_mb: number;
    cluster_pct_used_cpu_mhz: number;
    cluster_pct_used_ram_mb: number;
    cluster_total_cores: number;
    cluster_total_cpu_mhz: number;
    cluster_total_ram_mb: number;
    cluster_used_cores: number;
    cluster_used_cpu_mhz: number;
    cluster_used_ram_mb: number;
    datacenter: string;
    datastore: string;
    datastore_capacity_gb: number;
    datastore_occuped_space_gb: number;
    datastore_pct_future_occuped_space_gb: number;
    rank: number;
    score: number;
    vcenter: string;
    vlan_id: string;
    vlan_name: string;
}

export interface ProvisioningExport {
    fecha_inicio: string;
    fecha_fin: string;
}