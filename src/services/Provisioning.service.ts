import { CreateRequestVM, CreateTowerOwner, GenerateIP, NewDisk, NewPartition, ProvisioningExport, RevalidateApproval, UpdatedDisk, UpdatedGeneral, UpdatedHardware, UpdatedPartition, UpdatedServices, ValidateIP, validateRecommendation, ValidateRequestVM } from '../views/provisioning/Types'
import { ApiManagementCCS } from './ApiV2'

const ProvisioningService = {
    createRequestVM: (data: CreateRequestVM) => ApiManagementCCS.post("/aprovisionamiento/vm_solicitudes", data).then((data) => data),
    getRequestsVM: () => ApiManagementCCS.get("/aprovisionamiento/vm_solicitudes/").then((data) => data),
    getRequestFormParams: () => ApiManagementCCS.get("/aprovisionamiento/vm_solicitudes/datos_formulario").then((data) => data),
    getRequestFormTemplate: () => ApiManagementCCS.get("/aprovisionamiento/vm_solicitudes/template").then((data) => data),
    getRequestVM: (id_vm_request: number) => ApiManagementCCS.get(`/aprovisionamiento/vm_solicitudes/${id_vm_request}/`).then((data) => data),
    sendToApproveRequestVM: (id_vm_request: number, usuario: string) => ApiManagementCCS.put(`/aprovisionamiento/vm_solicitudes/${id_vm_request}/enviar_aprobacion/${usuario}`).then((data) => data),
    approveRequestVM: (id_vm_request: number, usuario: string) => ApiManagementCCS.put(`/aprovisionamiento/vm_solicitudes/${id_vm_request}/aprobar/${usuario}`).then((data) => data),
    cancelRequestVM: (id_vm_request: number, usuario: string) => ApiManagementCCS.put(`/aprovisionamiento/vm_solicitudes/${id_vm_request}/cancelar/${usuario}`).then((data) => data),
    getVlans: () => ApiManagementCCS.get("/aprovisionamiento/vm_solicitudes/vlans").then((data) => data),
    validateIPRequestVM: (data: ValidateIP) => ApiManagementCCS.post("/aprovisionamiento/vm_solicitudes/verificar_ip", data).then((data) => data),
    generateIPRequestVM: (data: GenerateIP) => ApiManagementCCS.post("/aprovisionamiento/vm_solicitudes/generar_ip", data).then((data) => data),
    getScopeByProject: (id_project: number) => ApiManagementCCS.get(`/aprovisionamiento/vm_solicitudes/proyecto_ambito/${id_project}`).then((data) => data),
    addDisk: (id_vm_request: number, data: NewDisk) => ApiManagementCCS.post(`/aprovisionamiento/vm_solicitudes/${id_vm_request}/disco/`, data).then((data) => data),
    updateDisk: (id_vm_request: number, data: UpdatedDisk) => ApiManagementCCS.put(`/aprovisionamiento/vm_solicitudes/${id_vm_request}/disco`, data).then((data) => data),
    deleteDisk: (id_vm_request: number, id_disco: number) => ApiManagementCCS.delete(`/aprovisionamiento/vm_solicitudes/${id_vm_request}/disco/${id_disco}`).then((data) => data),
    addPartition: (id_vm_request: number, data: NewPartition) => ApiManagementCCS.post(`/aprovisionamiento/vm_solicitudes/${id_vm_request}/particion/`, data).then((data) => data),
    updatePartition: (id_vm_request: number, data: UpdatedPartition) => ApiManagementCCS.put(`/aprovisionamiento/vm_solicitudes/${id_vm_request}/particion`, data).then((data) => data),
    deletePartition: (id_vm_request: number, id_partition: number) => ApiManagementCCS.delete(`/aprovisionamiento/vm_solicitudes/${id_vm_request}/particion/${id_partition}`).then((data) => data),
    updateGeneral: (id_vm_request: number, data: UpdatedGeneral) => ApiManagementCCS.put(`/aprovisionamiento/vm_solicitudes/${id_vm_request}/general`, data).then((data) => data),
    updateHardware: (id_vm_request: number, data: UpdatedHardware) => ApiManagementCCS.put(`/aprovisionamiento/vm_solicitudes/${id_vm_request}/hardware`, data).then((data) => data),
    updateServices: (id_vm_request: number, data: UpdatedServices) => ApiManagementCCS.put(`/aprovisionamiento/vm_solicitudes/${id_vm_request}/servicios`, data).then((data) => data),
    executeProvisioning: (id_vm_request: number, usuario: string) => ApiManagementCCS.get(`/aprovisionamiento/vm_solicitudes/ejecutar/${id_vm_request}/${usuario}`).then((data) => data),
    validateRequestVM: (data: ValidateRequestVM) => ApiManagementCCS.post(`/aprovisionamiento/vm_solicitudes/validar_aprovisionamiento`, data).then((data) => data),
    getProgressExecution: (id_execution: number) => ApiManagementCCS.get(`/aprovisionamiento/vm_solicitudes/${id_execution}/progreso_ejecucion`).then((data) => data),
    getTowerOwners: () => ApiManagementCCS.get(`/aprovisionamiento/vm_solicitudes/gestion_cuenta`).then((data) => data),
    createTowerOwner: (data: CreateTowerOwner) => ApiManagementCCS.post(`/aprovisionamiento/vm_solicitudes/crear_gestion_cuenta`, data).then((data) => data),
    deleteTowerOwner: (id_manage_account: number) => ApiManagementCCS.delete(`/aprovisionamiento/vm_solicitudes/gestion_cuenta/${id_manage_account}`).then((data) => data),
    revalidateApproval: (data: RevalidateApproval) => ApiManagementCCS.put(`/aprovisionamiento/vm_solicitudes/revalidar_aprobacion`, data).then((data) => data),
    validateRecommendations: (data: validateRecommendation) => ApiManagementCCS.post(`/aprovisionamiento/vm_solicitudes/validar_recomendaciones`, data).then((data) => data),
    exportarAprovisionamiento: (data: ProvisioningExport) => ApiManagementCCS.post(`/aprovisionamiento/exportarAprovisionamiento`, data, { responseType: 'blob' }).then((data) => data)}

export { ProvisioningService }