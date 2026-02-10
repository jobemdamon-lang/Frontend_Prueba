import { IModalFunctions, Role } from "../../../hooks/Types";
import { IComboData } from "../Types";

export interface IUserAdministrationContext {
    rol: Role;
    modalHook: IModalFunctions;
    userHook: IUseUserAdministration;
    setCurrentView: React.Dispatch<React.SetStateAction<Views>>;
    setSelectedUser: React.Dispatch<React.SetStateAction<UserInformation | null>>;
    selectedUser: UserInformation | null;
    paramsHook: IuseParams;
}

export enum ModalViewForUserAdministration {
    EDIT_USER = "EDIT_USER",
    ASSIGN_PROFILE_USER = "ASSIGN_PROFILE_USER"
}

export type Views = 'users_list' | 'user_profile'

export interface IUseUserAdministration {
    getUsers: () => Promise<void>;
    users: UserInformation[];
    getUsersLoading: boolean;
    updateUser: (data: IUpdateUser) => Promise<true | undefined>;
    updateUserLoading: boolean;
    getPermissionsPerUser: (idUser: number) => Promise<void>;
    usersPermissions: {
        byArea: IUserPermissionArea[];
        personal: IUserPermissionPersonal[];
    };
    getUserPermissionsLoading: boolean;
    assignProfileUser: (data: PayloadAssignProfileUser) => Promise<true | undefined>;
    assignProfileUserLoading: boolean;
}

export interface IuseParams {
    getAreas: () => Promise<void>;
    areas: IComboData[];
    loadingAreas: boolean;
    getAccessRoles: () => Promise<void>;
    roles: IComboData[];
    loadingRoles: boolean;
    getProfiles: () => Promise<void>;
    profiles: Profile[];
    loadingProfiles: boolean;
}

export interface UserInformation {
    area: null | string;
    cargo: null | string;
    correo: string;
    dni: null | string;
    estado: number;
    idusuario: number;
    nombre: string;
    telefono: null | string;
    usuario: string;
}

export interface IUpdateUser {
    telefono: string,
    estado: number,
    id_area: number,
    usuario: string
}

export interface IUserPermissionArea {
    ATRIBUTO: string;
    ID_PERFIL_AREA: number;
    ROL: string;
    VALOR: string;
}

export interface IUserPermissionPersonal {
    ATRIBUTO: string;
    ID_PERFIL_USUARIO: number;
    ROL: string;
    VALOR: string;
}

export interface Profile {
    ATRIBUTO: string;
    IDOPCION: number;
    SUBMODULO: string;
    VALOR: string;
}

export interface PayloadAssignProfileUser {
    id_perfil: number;
    id_usuario: number;
    rol: string;
    estado: number;
}