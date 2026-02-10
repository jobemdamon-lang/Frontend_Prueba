export interface IChildrenModule {
   Aside_title: string,
   Aside_to: string,
   Rol: string,
   RouteTitle: string,
   Route_module: string,
   Route_path: string
}

export interface IParentModule {
   Aside_title: string,
   Aside_to: string,
   Route_defaultRoute: string,
   Route_path: string,
   logo: string,
   subModule: Array<IChildrenModule>
}

export interface IAuthState {
   cargo: string,
   foto: string,
   mensaje: string,
   nombre: string,
   status: string,
   token: string,
   usuario: string,
   permission: Array<IParentModule>
}