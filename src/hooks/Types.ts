import { IDataListFormat, IDataListProject } from "../helpers/Types"
import { ICreateProject, IProject, IUpdateProject } from "../views/administration/Types"

//Enum con los distintos posibles tamaños del Modal
export enum ModalSize { XL = "xl", LG = "lg", SM = "sm" }

export type Role = "admin" | "lectura" | "ejecutor"

//Tipado de las funciones y atributos del hook useModal
export interface IModalFunctions {
  openModal: (view: string, size: ModalSize, wantFullSize: true | string | undefined, information?: any) => void,
  closeModal: () => void,
  updateInformatioModal: (information: any) => void,
  showModal: boolean,
  modalView: string,
  modalInformation: any,
  sizeModal: ModalSize,
  wantFullSize: string | true | undefined,
}

export interface IuseClient {
  getClients: () => Promise<void>,
  loadingGetClients: boolean,
  clients: IDataListFormat[],
  getClientsWithCMDBD: () => Promise<void>,
  loadingGetClientsWithCMDB: boolean,
  clientsWithCMDB: IDataListFormat[],
  addNewClient: (nameClient: string) => Promise<true | undefined>,
  addingClientLoading: boolean
}

export interface IuseProject {
  getProjects: (client?: string) => Promise<void>,
  loadingGetProjects: boolean,
  projects: IDataListProject[],
  createProject: (params: ICreateProject) => Promise<true | undefined>,
  loadingCreateProject: boolean,
  updateProject: (params: IUpdateProject) => Promise<true | undefined>,
  loadingUpdateProject: boolean,
  getInformationProject: (projectID: string) => Promise<void>,
  InfoProjectData: IProject,
  loadingInfoProject: boolean
}