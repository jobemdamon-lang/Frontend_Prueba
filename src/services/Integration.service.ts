import { ICreateIntegration, ICreateIntegrationUrl, IUpdateURL, } from '../views/administration/Types'
import { ApiManagementCCS } from './ApiV2'

const IntegrationService = {

   activateDesactivateIntegration: (idIntegration: string) => ApiManagementCCS.post(`/administracion/proyecto/activar_desactivar_integracion/${idIntegration}`).then((data) => data),
   createIntegration: (integrationInformation: ICreateIntegration) => ApiManagementCCS.post(`/administracion/proyecto/crear_integracion`, integrationInformation).then((data) => data),
   createIntegrationUrl: (integrationInformationUrl: ICreateIntegrationUrl) => ApiManagementCCS.post(`/administracion/proyecto/crear_integracion_url`, integrationInformationUrl).then((data) => data),
   deleteUrl: (idUrl: string) => ApiManagementCCS.post(`/administracion/proyecto/eliminar_url/${idUrl}`).then((data) => data),
   generateTokenIntegration: (idIntegration: string) => ApiManagementCCS.post(`/administracion/proyecto/generar_token_integracion/${idIntegration}`).then((data) => data),
   lisAlltIntegration: () => ApiManagementCCS.get(`/administracion/proyecto/listar_integracion/0`).then((data) => data),
   listIntegration: (idIntegration: string) => ApiManagementCCS.get(`/administracion/proyecto/listar_integracion/${idIntegration}`).then((data) => data),
   listIntegrationUrl: (idIntegration: string) => ApiManagementCCS.get(`/administracion/proyecto/listar_integracion_url/${idIntegration}`).then((data) => data),
   updateUrl: (idUrl: string, integrationUpdateUrl: IUpdateURL) => ApiManagementCCS.post(`/administracion/proyecto/actualizar_url/${idUrl}`, integrationUpdateUrl).then((data) => data),

}

export { IntegrationService }
