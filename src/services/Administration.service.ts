import { IAssignProfileToArea, IAssignProfileToUser, ICreateCollab, INewModule, INewProfile, ICreateProject, INewSubmodule, IUpdateOwners, IUpdateProject } from '../views/administration/Types'
import { IUpdateUser, PayloadAssignProfileUser } from '../views/administration/User/Types'
import { ApiManagementCCS } from './ApiV2'

const AdministrationService = {
   getInfoProject: (id_project: string) => ApiManagementCCS.post(`/administracion/proyecto/listarProyectoId/${id_project}`).then((data) => data.data),
   newProject: (project_info: ICreateProject) => ApiManagementCCS.post("/administracion/proyecto/guardarProyecto", project_info).then((data) => data),
   newCollab: (userCreate: String, collabInfo: ICreateCollab) => ApiManagementCCS.post(`/administracion/proyecto/guardarUsuario/${userCreate}`, collabInfo).then((data) => data.data),
   getCollaborators: () => ApiManagementCCS.get("/administracion/usuario/listarUsuarios").then((data) => data.data),
   modifyCollaborator: (collab: any) => ApiManagementCCS.post("/administracion/usuario/actualizarUsuario", collab).then((data) => data.data),
   getModules: () => ApiManagementCCS.get("/administracion/opcion/listarModulos").then((data) => data.data),
   getSubmodules: (idModule: string) => ApiManagementCCS.get(`/administracion/opcion/listarSubmodulo/${idModule}`).then((data) => data.data),
   newModule: (module: INewModule) => ApiManagementCCS.post("/administracion/opcion/guardarModulo", module).then((data) => data.data),
   newSubModule: (submodule: INewSubmodule) => ApiManagementCCS.post("/administracion/opcion/guardarSubmodulo", submodule).then((data) => data.data),
   getProfiles: () => ApiManagementCCS.get("/administracion/opcion/listarPerfiles").then((data) => data.data),
   getProfileByArea: (idArea: string) => ApiManagementCCS.get(`/administracion/opcion/listarPerfilxArea/${idArea}`).then((data) => data.data),
   newProfile: (profile: INewProfile) => ApiManagementCCS.post("/administracion/opcion/guardarPerfil", profile).then((data) => data.data),
   assignProfileToArea: (profile: IAssignProfileToArea) => ApiManagementCCS.post("/administracion/opcion/asignarPerfilArea", profile).then((data) => data.data),
   getProfileByUser: (user: string) => ApiManagementCCS.get(`/administracion/usuario/listarAccesos/${user}`).then((data) => data.data),
   assignProfileTouser: (profile: IAssignProfileToUser) => ApiManagementCCS.post("/administracion/usuario/asignaPerfilUsuario", profile).then((data) => data.data),
   addNewClient: (nameClient: any) => ApiManagementCCS.post("/administracion/proyecto/guardarCliente", nameClient).then((data) => data.data),
   deleteProfileOfArea: (id_profile_area: any) => ApiManagementCCS.delete(`/administracion/opcion/eliminar_perfil_area/${id_profile_area}`).then((data) => data.data),
   //Refactoring
   createProject: (project_info: ICreateProject) => ApiManagementCCS.post("/administracion/proyecto/guardarProyecto", project_info).then((data) => data),
   updateProject: (project_info: IUpdateProject) => ApiManagementCCS.post("/administracion/proyecto/guardarProyecto", project_info).then((data) => data),
   getInformationProject: (id_project: string) => ApiManagementCCS.post(`/administracion/proyecto/listarProyectoId/${id_project}`).then((data) => data),
   createColaborator: (userWhoCreate: String, collabInfo: ICreateCollab) => ApiManagementCCS.post(`/administracion/proyecto/guardarUsuario/${userWhoCreate}`, collabInfo).then((data) => data),
   updateOwners: (userCreate: String, owners: IUpdateOwners) => ApiManagementCCS.post(`/administracion/proyecto/guardarJP_GP/${userCreate}`, owners).then((data) => data),
   deleteCollab: (id_proyect_collab: string) => ApiManagementCCS.delete(`/administracion/proyecto/eliminarUsuarioProyecto/${id_proyect_collab}`).then((data) => data),
   getDataFilter: (params: any) => ApiManagementCCS.post("/administracion/opcion/listar", params).then((data) => data),
   createClient: (nameClient: any) => ApiManagementCCS.post("/administracion/proyecto/guardarCliente", nameClient).then((data) => data),
   getUsers: () => ApiManagementCCS.get("/administracion/usuario/listarUsuarios").then((data) => data),
   updateUser: (detail: IUpdateUser) => ApiManagementCCS.post("/administracion/usuario/actualizarUsuario", detail).then((data) => data),
   getPermissionsPerUser: (idUser: string) => ApiManagementCCS.get(`/administracion/usuario/listarAccesos/${idUser}`).then((data) => data),
   assignProfileUser: (data: PayloadAssignProfileUser) => ApiManagementCCS.post("/administracion/usuario/asignaPerfilUsuario", data).then((data) => data),
   getAccessProfiles: () => ApiManagementCCS.get("/administracion/opcion/listarPerfiles").then((data) => data),
}

export { AdministrationService }