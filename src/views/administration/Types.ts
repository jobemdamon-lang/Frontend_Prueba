import { IModalFunctions, IuseClient, IuseProject, Role } from "../../hooks/Types"

export interface IAplicationContext {
  rol: Role,
  modalHook: IModalFunctions,
  integrationHook: IuseIntegration
}
export enum ModalViewForAplication {
  EDIT_TOKEN = 'EDIT_TOKEN',
  CONFIRMATION_DELELTE = 'CONFIRMATION_DELELTE',
  INSERT_TOKEN = 'INSERT_TOKEN',
  INFO_URL = 'INFO_URL',
  EDIT_URL = 'EDIT_URL',
  CONFIRMATIONURL_DELELTE = 'CONFIRMATIONURL_DELELTE',
}
export interface IProjectSubmoduleContext {
  projectHook: IuseProject,
  modalHook: IModalFunctions,
  isCreateClientVisible: boolean,
  setIsVisibility: React.Dispatch<React.SetStateAction<boolean>>
  clientHook: IuseClient,
  administrateHook: IUseAdministration
}

export interface IUpdateToken extends IIntegration {
  estado: number
}

export interface ICreateToken {
  name: string,
  cliente: string,
  date_expiration: string,
  user_creation: string,
  token: string
}

export interface IUseAdministration {
  createColaborator: (userWhoCreate: string, params: ICreateCollab) => Promise<true | undefined>,
  loadingCreateCollab: boolean,
  deleteColaborator: (id_proyect_collab: string) => Promise<true | undefined>,
  loadingDelete: boolean,
  updateOwners: (userWhoCreate: string, params: IUpdateOwners) => Promise<true | undefined>,
  loadingUpdateOwners: boolean,
  getStateProjectData: () => Promise<void>,
  loadingStateProjects: boolean,
  stateProjectData: IComboData[],
  getTypeProjectData: () => Promise<void>,
  typeProjectData: IComboData[],
  loadingTypeProjectData: boolean,
  getManagerData: () => Promise<void>,
  managerData: IComboData[],
  loadingManager: boolean,
  getBossData: () => Promise<void>,
  bossData: IComboData[],
  loadingBoss: boolean,
  getCollabData: () => Promise<void>,
  collabData: IComboData[],
  loadingCollabData: boolean
}

export interface IComboData {
  codigo: number,
  nombre: string
}

//Formato para recibir informacion de endpoint Colaborador
export interface ICollaborators {
  CARGO: string,
  ESTADO: number,
  FLAG: number,
  ID_PROYECTO: number,
  ID_PROY_COLAB: number,
  ID_USUARIO: string,
  NOMBRE: string
}

//Formato necesario para crear un nuevo proyecto
export interface ICreateProject {
  id_proyecto: number,
  nombre: string,
  alp: string,
  fecha_Inicio: string,
  fecha_fin: string,
  cliente: string,
  proyecto_estado: string,
  proyecto_tipo: string,
  usuario: string,
  lista_usuarios: IListaUsuarios[]
}

export interface IUpdateProject {
  id_proyecto: number,
  nombre: string,
  alp: string,
  fecha_Inicio: string,
  fecha_fin: string,
  cliente: string,
  proyecto_estado: string,
  proyecto_tipo: string,
  usuario: string
}

export interface IListaUsuarios {
  id_proy_colab?: number,
  id_proyecto: number,
  id_usuario: number,
  estado?: number,
  nombre: string,
  cargo?: string
}

export interface IUpdateOwners {
  lista_usuarios: {
    id_proy_colab?: number,
    id_proyecto: number,
    id_usuario: number,
    estado?: number,
    nombre: string,
    cargo?: string
  }[]
}

//Formato para recibir la informacion de enpoint Informacion Proyecto
export interface IProject {
  alp: string,
  cliente: string,
  fecha_fin: string,
  fecha_inicio: string,
  id_proyecto: number,
  lista_usuarios: ICollaborators[],
  nombre: string,
  proyecto_estado: string,
  proyecto_tipo: string
}

export const initialProject: IProject = {
  alp: "",
  cliente: "",
  fecha_fin: "",
  fecha_inicio: "",
  id_proyecto: 0,
  lista_usuarios: [],
  nombre: "",
  proyecto_estado: "",
  proyecto_tipo: ""
}

export interface ICollaborator {
  nombre: string,
  apellido: string,
  cargo: string,
  area: string,
  dni: number,
  correo: string,
  usuario: string,
  telefono: number
}

export interface ICreateCollab {
  id_proy_colab: number,
  id_proyecto: number,
  id_usuario: number,
  estado: number,
  nombre: string,
  cargo: string
}

export interface IListCollaborators {
  area: string | null,
  cargo: string | null,
  dni: string | null,
  estado: number | null,
  idusuario: number,
  nombre: string,
  telefono: string | null,
  usuario: string,
  correo: string
}

export interface IModule {
  IDOPCION: number,
  Route_defaultRoute: string,
  Route_path: string,
  aside_title: string,
  aside_to: string,
  estado: number,
  icon: string,
  prioridad: number
}

export interface INewModule {
  aside_to: string,
  aside_title: string,
  icon: string,
  prioridad: string,
  estado: string,
  routh_path: string,
  route_defaultRoute: string
}

export interface ISubModule {
  Aside_title: string,
  Aside_to: string,
  IDOPCION: number,
  RouteTitle: string,
  Route_module: string,
  Route_path: string,
  estado: number,
  prioridad: number
}

export interface INewSubmodule {
  aside_to: string,
  aside_title: string,
  prioridad: string,
  estado: string,
  routeTitle: string,
  route_module: string,
  route_path: string,
  parentid: number
}

export interface IProfile {
  ATRIBUTO: string,
  IDOPCION: number,
  SUBMODULO: string,
  VALOR: string
}

export interface IProfileByArea {
  ATRIBUTO: string,
  ID_PERFIL_AREA: number,
  ROL: string,
  VALOR: string
}

export interface INewProfile {
  atributo: string,
  valor: string,
  id_Submodulo: number,
  estado: number
}

export interface IAssignProfileToArea {
  id_perfil: number,
  id_area: number,
  rol: string,
  estado: number
}

export interface IProfileAreaUser {
  ATRIBUTO: string,
  ID_PERFIL_AREA: number,
  ROL: string,
  VALOR: string
}
export interface IAccessByUser {
  perfil_area: IProfileAreaUser[],
  perfil_usuario: []
}

export interface IAssignProfileToUser {
  id_perfil: number,
  id_usuario: number,
  rol: string,
  estado: number
}

export interface INotifyIncident {
  id_usuario: number[]
}

//Enum con los distintos posibles contenidos del Modal
export enum ModalView {
  NEW_PROJECT = "NEW_PROJECT",
  NEW_CLIENT = "NEW_CLIENT",
  ADD_COLABORATOR = "ADD_COLABORATOR",
  EDIT_COLAB = "EDIT_COLAB",
  CONFIRMATION = "CONFIRMATION",
  DELETE_CONFIRMATION = "DELETE_CONFIRMATION",
  UDPATE_OWNERS = "UPDATE_OWNERS",
  //Vistas de Accesos
  NEW_SUBMODULE = "NEW_SUBMODULE",
  NEW_MODULE = "NEW_MODULE",
  //Vista de Perfiles
  NEW_PROFILE = "NEW_PROFILE",
  ASSIGN_PROFILE_TO_AREA = "ASSIGN_PROFILE_TO_AREA",
  //Vista de Permisos
  ASSIGN_PROFILE_TO_USER = "ASSIGN_PROFILE_TO_USER",
}
//Enum con los distintos posibles tamaños del Modal
export enum ModalSize { XL = "xl", LG = "lg", SM = "sm" }

export interface ICreateIntegration {
  nombre: string,
  id_proyecto: number,
}

export interface ICreateIntegrationUrl {
  id_integracion: number,
  url: string,
}

export interface IUrls {
  ID: number,
  ID_INTEGRATION: number,
  URL: string,
}

export interface IIntegration {
  ESTADO: number;
  ID_INTEGRACION: number;
  ID_PROYECTO: number;
  NOMBRE: string;
  TOKEN: string;
}

export interface IUpdateURL {
  url: string;

}

export interface IuseIntegration {
  activateDesactivateIntegration: (idIntegration: string) => Promise<true | undefined>,
  loadingActivateDesactivate: boolean,

  createIntegration: (integrationInformation: ICreateIntegration) => Promise<true | undefined>,
  loadingCreateIntegration: boolean,

  createIntegrationUrl: (integrationInformationUrl: ICreateIntegrationUrl) => Promise<true | undefined>,
  loadingCreateIntegrationUrl: boolean,

  deleteUrl: (idUrl: string) => Promise<true | undefined>,
  loadingDeleteIntegrationUrl: boolean,

  generateTokenIntegration: (idIntegration: string) => Promise<true | undefined>,
  loadingGenerationToken: boolean,

  getLisAlltIntegration: () => Promise<void>,
  loadingListAllIntegrations: boolean,
  integrationsList: IIntegration[],

  getListIntegration: (idIntegration: string) => Promise<void>,
  loadingListIntegration: boolean,
  integration: [],

  getListIntegrationUrl: (idIntegration: string) => Promise<void>,
  loadingListIntegrationUrl: boolean,
  integrationUrl: [],
  
  updateUrl: (idUrl: string, integrationUpdateUrl: IUpdateURL) => Promise<true | undefined>,
  loadingUpdateUrl: boolean
}
