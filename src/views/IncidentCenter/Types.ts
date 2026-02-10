import { IModalFunctions, Role } from "../../hooks/Types";

export interface IncidentItem {
    __metadata: Metadata;
    CategorizationClass: string;
    MdrProduct: string;
    CategorizationType: string;
    MdrElementID: string;
    Description: string;
    RequesterOrgName: string;
    PriorityCode: string;
    TicketStatus: string;
    NonTranslatedTicketStatus: string;
    CreationTimestamp: string;
    LockedByExternalUserId: string;
    AssignedID: string;
    LastModTimestamp: string;
    TicketIdentifier: string;
    TypeName: string;
    MdrProdInstance: string;
    RequesterOrgHierarchicalPath: string;
    Priority: string;
    ReasonCode: string;
    AssignedCaseID: string;
    SLAComplianceStatus: string;
    AssignedIndividual: string;
    RequesterUserName: string;
    RequesterVIPFlag: string;
    TranslatedSLAComplianceStatus: string;
    CategorizationItem: string;
    SLAResolveByTimestamp: string;
    TranslatedTypeName: string;
    RequesterRootOrgName: string;
    HasAttachments: string;
    CategorizationCategory: string;
    AssignedGroup: string;
    HasConfigurationItem: HasConfigurationItem;
    HasCustomFieldMetadata: HasCustomFieldMetadata;
    IS_INICIADO: string;
}

export interface HasConfigurationItem {
    results: HasConfigurationItemResult[];
}

export interface HasConfigurationItemResult {
    __metadata: Metadata;
    Semantic: string;
    RelationshipType: string;
    CategorizationClass: string;
    AttributeName3: string;
    ConfigDescription: string;
    MdrProduct: string;
    ConfigOrganizationName: string;
    AttributeName1: string;
    CategorizationType: string;
    AttributeName2: string;
    ConfigRootOrgName: string;
    ExpandInlineCount: null;
    ConfigName: string;
    CategorizationItem: string;
    TranslatedRelationshipType: string;
    RelationDomain: string;
    RelationType: string;
    TranslatedRelationType: string;
    CIOrganizationID: string;
    LastModUserName: string;
    ConfigOwnerUserName: string;
    TranslatedRelationDomain: string;
    MdrProdInstance: string;
    CIID: string;
    CIContactFirstName: string;
    ConfigStatus: string;
    CIContactLastName: string;
    CategorizationCategory: string;
    TranslatedConfigStatus: string;
    ItemID: string;
    CIName: string;
    ConfigOrgHierarchicalPath: string;
    AttributeValue2: string;
    AttributeValue1: string;
    AttributeValue3: string;
    CIFunction: string;
    ConfigFunction: string;
    ConfigID: string;
    MdrElementID: string;
    CIImagePath: string;
    LastModTimestamp: string;
    ConfigurationItem: ConfigurationItem;
}

export interface ConfigurationItem {
    __deferred: Deferred;
}

export interface Deferred {
    uri: string;
}

export interface Metadata {
    uri: string;
    type: string;
}

export interface HasCustomFieldMetadata {
    results: HasCustomFieldMetadataResult[];
}

export interface HasCustomFieldMetadataResult {
    __metadata: Metadata;
    AttributeValue: string;
    ListWSId: string;
    DetailWSId: string;
    VisibleToUser: string;
    MdrProduct: string;
    TranslatedAttributeDefaultValue: string;
    TranslatedTemplateName: string;
    SectionHeaderSortOrder: string;
    TemplateStatus: string;
    RequiredOnSubmit: string;
    TicketID: string;
    AttributeDataType: string;
    TranslatedAttributePossibleValues: string;
    IsUnique: string;
    TemplateName: string;
    AttributeName: string;
    FormName: string;
    MdrProdInstance: string;
    AttributeDefaultValue: string;
    AttributeUnit: string;
    TranslatedAttributeValue: string;
    AttributeSortOrder: string;
    AttributeID: string;
    AttrID: string;
    SectionHeader: string;
    ActivityMappingID: string;
    FormID: string;
    TemplateID: string;
    MdrElementID: string;
    AttributePossibleValues: string;
    TranslatedAttributeName: string;
    AttributeStatus: string;
}

export interface IIncidentsContext {
    rol: Role,
    modalHook: IModalFunctions,
    useTicketHook: IUseTicket,
    useIncidentHook: IUseIncident,
    secondModalHook: IModalFunctions
}

export enum ModalViewForIncident {
    START_TRACKING_CONFIRMATION = "START_TRACKING_CONFIRMATION",
    DEPRIORITIZATION = "DEPRIORITIZATION",
    TRACKING_PANEL = "TRACKING_PANEL",
    NOTIFICATION_CONFIRMATION = "NOTIFICATION_CONFIRMATION",
    EDIT_ACTION = "EDIT_ACTION",
    CREATE_INCIDENT = "CREATE_INCIDENT",
    PRIORIZATION_CONFIRM = "PRIORIZATION_CONFIRM",
    DESPRIORIZATION_CONFIRM = "DESPRIORIZATION_CONFIRM",
    REOPEN_CONFIRMATION = "REOPEN_CONFIRMATION",
    SEND_WHATSAPP = "SEND_WHATSAPP",
    HISTORIC_ACTIONS = "HISTORIC_ACTIONS",
    HISTORIC_INFO_INCIDENT = "HISTORIC_INFO_INCIDENT",
    DESPRIORIZATION_IC = "DESPRIORIZATION_IC",
    PRIORIZATION_IC = "PRIORIZATION_IC",
    EXPORT_INCIDENTS = "EXPORT_INCIDENTS"
}

export interface IUseTicket {
    getActiveTickets: () => Promise<void>,
    activeTicketsLoading: boolean,
    activeTickets: IncidentItem[],
    getClosedTickets: (fecha_inicio?: string, fecha_fin?: string) => Promise<void>,
    finalizedTicketsLoading: boolean,
    finalizedTickets: IncidentItem[],
    reopenTicketLoading: boolean
    reopenTicket: (incidentInfo: IReopenIncident) => Promise<true | undefined>,
    getObservatedTickets: () => Promise<void>,
    observatedTickets: IncidentItem[],
    observatedTicketLoading: boolean,
    exportTableFiltered: (filteredData: IncidentItem[]) => Promise<void>,
    exportFilteredLoading: boolean
}

export interface IUseIncident {
    updatedInfoIncident: (updatedIncident: IUpdateIncident) => Promise<true | undefined>,
    updateIncidentLoading: boolean,
    updatedSintomaConlusionIncident: (updatedIncident: IUpdateSintomaConclusion) => Promise<true | undefined>,
    updateSintomaConlusionLoading: boolean,
    getInfoIncidentByNroTicket: (nro_ticket: string) => Promise<{
        data: ITrackedTicket;
        success: boolean;
    } | undefined>,
    incidentInfoLoading: boolean,
    getInfoIncidentWithServiceAideData: (nro_ticket: string) => Promise<any>,
    incidentInfoLoadingv2: boolean,
    startTracking: (nro_ticket: string) => Promise<true | undefined>,
    startTrackingLoading: boolean,
    getListActions: (id_incidente: string) => Promise<void>,
    actionListLoading: boolean,
    actionList: IAction[],
    createNewAction: (newAction: INewAction) => Promise<true | undefined>,
    newActionLoading: boolean,
    deleteAction: (id_accion: string) => Promise<true | undefined>,
    deleteActionLoading: boolean,
    updateAction: (updatedAction: IUpdateAction) => Promise<true | undefined>
    updateActionLoading: boolean,
    notifyIncident: (incidentNumber: string, incidentInfo: INotifyIncident) => Promise<true | undefined>,
    notifyIncidentLoading: boolean,
    ChangePriorityIncident: (incidentToChange: IChangePriority) => Promise<true | undefined>,
    changePriorityLoading: boolean,
    getListCollabsToNotify: (nroIncident: string) => Promise<void>,
    listCollabsToNotifyLoading: boolean,
    collabsToNotify: IListCollabsToNotify[],
    addCollabToNotifyTable: (incidentNumber: string, usuario: string, correo: string) => Promise<true | undefined>,
    addCollabToNotifyTableLoading: boolean,
    deleteCollabToNotifyTable: (idNotificacion: string, incidentNumber: string) => Promise<true | undefined>,
    deleteCollabToNotifyTableLoading: boolean,
    createIncident: (incidentInfo: ICreateIncident) => Promise<true | undefined>,
    createIncidentLoading: boolean,
    getListStatesIncidentCenter: (priority: string) => Promise<void>,
    loadingStates: boolean,
    incidentCenterStates: IStateIncidentCenter[],
    getHistoricIncident: (nroIncidente: string) => Promise<void>,
    historicIncident: ICoincidentes[],
    historicIncidentLoading: boolean,
    getListHistoricIncidents: (startDate?: string, endDate?: string) => Promise<void>,
    listHistoricIncidents: IHistoricIncidents[],
    listHistoricINCLoading: boolean,
    updateICState: (updatedIncident: IUpdateIncidentCenterState) => Promise<true | undefined>,
    updateICStateLoading: boolean,
    sendGroupWhatsApp: (nro_Incidente: string) => Promise<true | undefined>,
    sendingWhatsAppLoading: boolean,
    exportIncidents: (fecha_inicio?: string, fecha_fin?: string) => Promise<void>,
    exportIncidentsLoading: boolean,
    toggleAutomaticAlerts: (enable: boolean, incidentId: string) => Promise<true | undefined>,
    automaticAlertsLoading: boolean,
    automaticAlertsEnabled: boolean,
    setAutomaticAlertsEnabled: React.Dispatch<React.SetStateAction<boolean>>
}

export interface IUpdateIncident {
    id_incidente: number;
    supervisor: string;
    nro_ticket: string;
    cliente: string;
    escalo_incidente: string,
    otros_clientes_afectados: string;
    jp_gp: string;
    servicio_aplicativo_impactado: string;
    parcial_total: string;
    descripcion: string;
    impacto_negocio_posibles_consecuencias: string;
    inicio_indisponibilidad: string;
    perdida_sla_penalidades: string;
    fin_indisponibilidad?: string;
    acciones_tomadas: string;
    estado_incidente: string;
    estado_incidente_id: number,
    incident: string;
    participo: string;
    alerta: string;
    porque_no_salio_alerta: string;
    pm_p1: string;
    bajo_prioridad: string;
    crq_wo: string;
    observacion_crisis_manager: string;
    observacion_especialista: string;
    observacion_coordinador: string;
    observacion_capa_gestion: string;
    duracion: string;
    desviaciones: string;
    resumen: string;
    numero_ticket_sad: string;
    avance_ticket_sad: string;
    usuario_creacion: string;
    fecha_creacion: string;
    usuario_modificacion: string;
    fecha_modificacion: string;
    estado: number;
    conclusion: string;
    sintoma: string
}

export interface IUpdateSintomaConclusion {
    id_incidente: number;
    conclusion: string;
    nro_ticket: string;
    sintoma: string,
    estado_incidente_id: number,
    usuario_modificacion: string,
    is_historico: string
}

export interface ITrackedTicket {
    ACCIONES_TOMADAS: null | string;
    ALERTA: null | string;
    AVANCE_TICKET_SAD: null | string;
    BAJO_PRIORIDAD: null | string;
    CLIENTE: string;
    CRQ_WO: null | string;
    DESCRIPCION: string;
    DESVIACIONES: null | string;
    DURACION: null | string;
    ESTADO_INCIDENTE: string;
    ESCALO_INCIDENTE: null | string;
    ESTADO_INCIDENTE_ID: number,
    ESTADO: number;
    ESTADO_TICKET: string;
    FECHA_CREACION: null | string;
    FECHA_MODIFICACION: null | string;
    FIN_INDISPONIBILIDAD: null | string;
    ID_INCIDENTE: number;
    FLAG_ALERTA:number;
    IMPACTO_NEGOCIO_POSIBLES_CONSECUENCIAS: null | string;
    INCIDENT: null | string;
    INICIO_INDISPONIBILIDAD: Date;
    JP_GP: string;
    NRO_TICKET: string;
    NUMERO_TICKET_SAD: null | string;
    OBSERVACION_CAPA_GESTION: null | string;
    OBSERVACION_COORDINADOR: null | string;
    OBSERVACION_CRISIS_MANAGER: null | string;
    OBSERVACION_ESPECIALISTA: null | string;
    OTROS_CLIENTES_AFECTADOS: null | string;
    PARCIAL_TOTAL: null | string;
    PARTICIPO: null | string;
    PERDIDA_SLA_PENALIDADES: null | string;
    PM_P1: null | string;
    PORQUE_NO_SALIO_ALERTA: null | string;
    RESUMEN: null | string;
    SERVICIO_APLICATIVO_IMPACTADO: null | string;
    SUPERVISOR: null | string;
    USUARIO_CREACION: null | string;
    USUARIO_MODIFICACION: null | string;
    SERVIDOR: string;
    CONCLUSION: string | null;
    SINTOMA: string | null
}

export interface ITrackedTicketWithActions extends ITrackedTicket {
    lista_acciones: IAction[]
}

export interface IReopenIncident {
    nroTicket: string,
    motivo: string,
    usuario: string
}

export interface INewAction {
    id_incidente: number,
    usuario: string,
    contenido: string
}

export interface IUpdateAction {
    id_accion: number,
    contenido: string
}

export interface INotifyIncident {
    id_usuario: number[]
}

export interface IChangePriority {
    nroTicket: string,
    motivo: string,
    prioridad: number,
    usuario: string
}

export interface ICreateIncident {
    id_proyecto: number,
    asunto: string,
    descripcion: string,
    nombre_usuairo: string
}

export interface IUpdateIncidentCenterState {
    id_incidente: number;
    nro_ticket: string;
    estado_incidente: string;
    estado_incidente_id: number,
    usuario_modificacion: string
}

export interface IAction {
    CONTENIDO: string,
    ESTADO: number,
    FECHA_REGISTRO: string,
    ID_ACCION: number,
    ID_INCIDENTE: number,
    USUARIO: string
}

export interface IListCollabsToNotify {
    CORREO: string,
    ID_NOTIFICACION: number,
    NOMBRE: string,
    USUARIO: string
}

export interface IStateIncidentCenter {
    ESTADO: number,
    ID_ESTADO_INCIDENTE: number,
    PRIORIDAD: number,
    VALOR: string
}

export interface IHistoricIncidents {
    ACCIONES_TOMADAS: null | string;
    ALERTA: null | string;
    ALP: string;
    ASIGNADO: string;
    AVANCE_TICKET_SAD: null | string;
    BAJO_PRIORIDAD: null | string;
    CIS: string;
    CLIENTE: string;
    COMENTARIO_IM: null | string;
    CONCLUSION: null | string;
    CRQ_WO: null | string;
    DESCRIPCION: string;
    DESCRIPCION_DETALLADA: string;
    DESVIACIONES: null | string;
    DURACION: null | string;
    EMPRESA: null | string;
    ESCALO_INCIDENTE: null | string;
    ESPECIALISTA_RESPONSABLE_INFORME_P1: null | string;
    ESTADO: number;
    ESTADO_INCIDENTE: string;
    ESTADO_INCIDENTE_ID: number;
    ESTADO_TICKET: null | string;
    FECHA_CREACION: null | string;
    FECHA_ENTREGA: null | string;
    FECHA_MODIFICACION: Date;
    FIN_INDISPONIBILIDAD: null | string;
    GERENTE: string;
    GRUPO_ASIGNADO: string;
    ID_INCIDENTE: number;
    IMPACTO_NEGOCIO_POSIBLES_CONSECUENCIAS: null | string;
    INCIDENT: null | string;
    INICIO_INDISPONIBILIDAD: null | string;
    IS_ENTREGA_INFORME_P1: null | string;
    IS_ENTREGO_96_HORAS: null | string;
    IS_HISTORICO: string;
    IS_OCASIONADO_CRQ: null | string;
    IS_P1: null | string;
    JEFE: string;
    JP_GP: string;
    MOTIVO_PRIORIZAR_DESPRIORIZAR: null | string;
    NRO_TICKET: string;
    NUMERO_TICKET_SAD: null | string;
    OBSERVACION_CAPA_GESTION: null | string;
    OBSERVACION_COORDINADOR: null | string;
    OBSERVACION_CRISIS_MANAGER: null | string;
    OBSERVACION_ESPECIALISTA: null | string;
    OTROS_CLIENTES_AFECTADOS: null | string;
    PARCIAL_TOTAL: null | string;
    PARTICIPO: null | string;
    PERDIDA_SLA_PENALIDADES: null | string;
    PM_P1: null | string;
    PORQUE_NO_SALIO_ALERTA: null | string;
    PRIORIDAD: string;
    PROYECTO: null | string;
    RESUMEN: null | string;
    SERVICIO_APLICATIVO_IMPACTADO: string;
    SINTOMA: null | string;
    SUPERVISOR: null | string;
    USUARIO_CREACION: null | string;
    USUARIO_MODIFICACION: string;
    TIEMPO_INDISPONIBILIDAD: string | null;
}

export interface ICoincidentes extends IHistoricIncidents {
    ACCIONES: IAction[]
}

export const IncidentCenterStates: any = {
    DESPRIORIZADO: "secondary",
    PRIORIZADO: "primary",
    INICIADO: "success",
    NOINICIADO: "secondary",
    ENWARROOM: "warning",
    FINALIZADO: "info"
}

export const TicketToolStates: any = {
    ACTIVO: "success",
    PENDINGSTOPCLOCK: "secondary",
    RESUELTO: "success",
    APROBADO: "primary",
    ARCHIVO: "warning",
    CERRADO: "success",
    COMPLETO: "info",
    ESCALADO: "primary",
    NUEVO: "info",
    PENDIENTE: "info",
    APROBACIÓNPENDIENTE: "secondary",
    PENDINGCONTINUECLOCK: "secondary",
    ENCOLA: "info",
    ENVIADO: "info",
    ACTIVE: "success",
    QUEUED: "info",
    APPROVED: "primary",
    ESCALED: "primary",
    PENDINGAPPROVAL: "secondary",
    RESOLVED: "success",
    CLOSED: "danger"
}