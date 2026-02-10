import { Api, ApiManagementCCS } from './ApiV2'

const AuthService = {
   login: (params: any) => Api.post('/login', params).then((data) => data.data),
   Newlogin: (params: any) => ApiManagementCCS.post('/administracion/usuario/login', params).then((data) => data.data),
   getUserByToken: (params: any) => Api.post('/verify_token', params).then((data) => data.data),
}

export { AuthService }
