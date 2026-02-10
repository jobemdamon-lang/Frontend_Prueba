import { IModalFunctions, Role } from "../../../hooks/Types";

export interface IGlobalParams {
    clientName: string;
    projectID: number;
    projectName: string;
    groupPolicyID: number;
    alp: string;
    usuario: string;
}

export interface IBackupsPoliciesContext {
    rol: Role;
    modalHook: IModalFunctions;
    globalParams: IGlobalParams;
    setGlobalParams: React.Dispatch<React.SetStateAction<IGlobalParams>>;
    // Agregar estados de políticas al contexto
    policies: IPolicy[];
    policiesLoading: boolean;
    getPolicies: (idGroup: number) => Promise<void>;
    requests: any[];
    requestsLoading: boolean;
    getRequests: (idGroup: number) => Promise<void>;
    groupPolicies: IGroupPoliciesDataListFormat[];
    groupPoliciesLoading: boolean;
    getGroupPolicies: (idProject: number) => Promise<void>;
}

export interface Client {
    id: number;
    nombre: string;
}

export interface IProject {
    id: number;
    value: string;
}

export interface IPolicy {
    estado: string;
    fecha_version: string;
    id_bkversion: number;
    id_politica: number;
    id_solicitud: number | null;
    motivo: string;
    nro_ticket: string | null;
    nro_version: number;
}

export interface IGroupPolicies { 
    codigo: number, 
    nombre: string 
}

export interface IGroupPoliciesDataListFormat { 
    id: number, 
    value: string 
}
export interface ICreateGroup {
    id_proyecto: number,
    cliente: string,
    alp: string,
    usuario: string
}


export enum ModalViewForBackupsPolicies {
    CREATE_GROUP_POLICY="CREATE_GROUP_POLICY",
    DELETE_CI="DELETE_CI",
    CREATE_CHANGE_REQUEST="CREATE_CHANGE_REQUEST",
    CHANGE_REQUEST_LOGS="CHANGE_REQUEST_LOGS",
    CANCEL_CHANGE_REQUEST="CANCEL_CHANGE_REQUEST",
    DETAIL_POLITICS_VERSIONS="DETAIL_POLITICS_VERSIONS",
    CREATE_NEW_TASK="CREATE_NEW_TASK",
    SEND_REQUEST_APPROVAL="SEND_REQUEST_APPROVAL",
    INITIALIZE_POLICY="INITIALIZE_POLICY",
    EXPORT_POLICY="EXPORT_POLICY"
}