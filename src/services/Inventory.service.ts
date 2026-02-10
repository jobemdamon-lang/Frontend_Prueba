import { IAddOptionListOfAtt, IAssignChildrenCI, ICreateAttribute, ICreateCI, ICreateFamilyClase, ICreateRelationFamilyClase, IFilterToExport, IGetConfigurationItems, IDeleteRelationFamilyClase, IUpdateClase, IUpdateDynamicInformationCI, IUpdateFamily, IUpdateGeneralInformation, IUpdateNameAttribute, IUpdateNameOptionListOfAtt, IaddIP } from '../views/inventory/Types'
import { ApiManagementCCS } from './ApiV2'

const InventoryService = {

   getDataFilter: (params: any) => ApiManagementCCS.post("/administracion/proyecto/listar", params).then((data) => data.data),
   addNewEquipment: (params: any) => ApiManagementCCS.post("/inventario/insertar", params).then((data) => data.data),
   modifyEquipment: (params: any) => ApiManagementCCS.put("/inventario/actualizar", params).then((data) => data.data),
   exportServices: (params: any) => ApiManagementCCS.post("/inventario/exportar", params).then((data) => data.data),
   deleteEquipment: (idEquipment: any) => ApiManagementCCS.delete(`/inventario/eliminar/${idEquipment}`).then((data) => data.data),
   listIP: (idEquipment: any) => ApiManagementCCS.get(`/inventario/listarIp/${idEquipment}`).then((data) => data.data),
   addIP: (params: any) => ApiManagementCCS.post("/inventario/insertarip", params).then((data) => data.data),
   getStatusOfBulkLoad: (idJob: string) => ApiManagementCCS.get(`/inventario/consultar_job/${idJob}`,).then((data) => data.data),
   //Nuevos endpoints de nueva version
   getDataFromMonitorOptions: (params: { tabla: string, filtro: string }) => ApiManagementCCS.post("/administracion/opcion/listar", params).then((data) => data),
   createAttribute: (idOption: string, params: ICreateAttribute) => ApiManagementCCS.post(`/inventario/agregar_nuevo_metadata/${idOption}`, params).then((data) => data),
   getAttributesByFamilyClase: (idOption: string) => ApiManagementCCS.get(`/inventario/listar_metadata_by_opcion/${idOption}`).then((data) => data),
   changeStatusOfAttribute: (idAttribute: string, status: string) => ApiManagementCCS.patch(`/inventario/modificar_estado_metadata/${idAttribute}/${status}`).then((data) => data),
   addOptionListOfAttribute: (idFamilyClase: string, idAttribute: string, params: IAddOptionListOfAtt) => ApiManagementCCS.post(`/inventario/agregar_opcion_lista/${idFamilyClase}/${idAttribute}`, params).then((data) => data),
   updateNameOfOptionListOfAtt: (idOptionList: string, params: IUpdateNameOptionListOfAtt) => ApiManagementCCS.patch(`/inventario/actualizar_opcion_lista/${idOptionList}`, params).then((data) => data),
   changeStatusOfOptionListOfAtt: (idOptionList: string, status: string) => ApiManagementCCS.patch(`/inventario/modificar_estado_opcion_lista/${idOptionList}/${status}`).then((data) => data),
   getListOptionsOfAtt: (idFamilyClase: string, idAttribute: string) => ApiManagementCCS.get(`/inventario/listar_listas_by_opcion_metadata/${idFamilyClase}/${idAttribute}`).then((data) => data),
   updateNameAttribute: (idAttribute: string, params: IUpdateNameAttribute) => ApiManagementCCS.patch(`/inventario/actualizar_metadata/${idAttribute}`, params).then((data) => data),
   getFamiliesWithClases: () => ApiManagementCCS.get(`/inventario/listar_familias_clases/`).then((data) => data),
   createFamilyClase: (params: ICreateFamilyClase) => ApiManagementCCS.post(`/inventario/agregar_nuevo_familia_clase/`, params).then((data) => data),
   updateFamilyName: (familyToUpdate: string, params: IUpdateFamily) => ApiManagementCCS.patch(`/inventario/actualizar_familia/${familyToUpdate}`, params).then((data) => data),
   updateClaseName: (idOption: string, params: IUpdateClase) => ApiManagementCCS.patch(`/inventario/actualizar_clase/${idOption}`, params).then((data) => data),
   createRelationFamilyClase: (params: ICreateRelationFamilyClase) => ApiManagementCCS.post(`/inventario/crear_relacion_familia_clase/`, params).then((data) => data),
   listConfigurationItems: (params: IGetConfigurationItems) => ApiManagementCCS.post("/inventario/listar", params).then((data) => data),
   listConfigurationItemsWithHierarchy: (params: IGetConfigurationItems) => ApiManagementCCS.post("/inventario/listar_new", params).then((data) => data),
   getValuesOfDynamicAttributesByCI: (idOptionFamilyClase: string, idCI: string) => ApiManagementCCS.get(`/inventario/listar_datos_campos_personalizados_ci/${idOptionFamilyClase}/${idCI}`).then((data) => data),
   updateGeneralInformationCI: (params: IUpdateGeneralInformation) => ApiManagementCCS.put("/inventario/actualizar", params).then((data) => data),
   updateDynamicInformationCI: (idCI: string, userName: string, params: IUpdateDynamicInformationCI) => ApiManagementCCS.patch(`/inventario/actualizar_datos_campos_personalizados_ci/${idCI}/${userName}`, params).then((data) => data),
   createCI: (params: ICreateCI) => ApiManagementCCS.post("/inventario/insertar", params).then((data) => data),
   getIPsByCI: (idCI: string) => ApiManagementCCS.get(`/inventario/listarIp/${idCI}`).then((data) => data),
   addIPCI: (params: IaddIP) => ApiManagementCCS.post("/inventario/insertarip", params).then((data) => data),
   assignChildrensCI: (params: IAssignChildrenCI) => ApiManagementCCS.post("/inventario/asignar_hijos/", params).then((data) => data),
   exportCIs: (params: IFilterToExport) => ApiManagementCCS.post("/inventario/exportar", params).then((data) => data),
   deleteRelationFamilyClase: (params: IDeleteRelationFamilyClase) => ApiManagementCCS.post("/inventario/quitar_relacion_familia_clase/", params).then((data) => data),
   listAuditCILogs: (idEquipo: string, params: any) => ApiManagementCCS.get(`/inventario/listar_auditoria_ci/${idEquipo}`, params).then((data) => data),
   exportAuditLogs: (idCI: number) => ApiManagementCCS.get(`/inventario/exportar_auditoria_ci/${idCI}`).then((data) => data),
   generateCI: (params: IFilterToExport) => ApiManagementCCS.post("/inventario/exportar_todo", params).then((data) => data),
}

export { InventoryService }