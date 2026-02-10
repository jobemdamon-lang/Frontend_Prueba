import { FC, useCallback, useEffect, useState } from "react"
import { CreateFormProps } from "./VMCreateForm"
import { DataList } from "../../../../../components/Inputs/DataListInput"
import { SelectInput } from "../../../../../components/Inputs/SelectInput"
import { useServerProvisioningContext } from "../../Context"
import { useParams } from "../../../hooks/useParams"
import { mapTemplateToState } from "../../utils"
import { RequestFormOptions } from "../../../Types"
import { useClient } from "../../../../../hooks/useClient"

export const General: FC<CreateFormProps> = ({
    formData,
    handleUpdateFormData,
    errors,
    selectedSO,
    setSelectedSO
}) => {

    const { paramsHook: { requestParams, getScopeByProject, loadingScopes, projectScopes }, projectHook } = useServerProvisioningContext()
    const { getRequestFormTemplate, loadingRequestParams, template = [] } = useParams()
    const { clients, getClients, loadingGetClients } = useClient()
    const [scopeTypes, setScopeTypes] = useState<RequestFormOptions[]>([])
    const [selectedClient, setSelectedClient] = useState("")

    useEffect(() => {
        getClients()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleUpdateClient = (clientValue: string) => {
        setSelectedClient(clientValue)
        projectHook.getProjects(clientValue)
    }

    const handleUpdateProject = (projectValue: string) => {
        const findedProject = projectHook.projects.find(r => r?.value === projectValue)
        if (findedProject) {
            handleUpdateFormData('id_proyecto', findedProject.id)
            handleUpdateFormData('id_ambito', 0)
            getScopeByProject(findedProject.id)
        }
    }

    const handleUpdateRolUse = useCallback((value: string) => {
        const [name, so] = value.split("-")
        const selectedTemplate = template.find(t => t.ROL_USO === name && t.SO.toLowerCase().startsWith(so.toLowerCase()))
        if (!selectedTemplate) return;

        handleUpdateFormData('rol_uso', value)
        handleUpdateFormData('vcpu_cores', selectedTemplate.CPU ?? 0)
        handleUpdateFormData('ram_gb', selectedTemplate.RAM ?? 0)
        handleUpdateFormData('swap_gb', selectedTemplate.SWAP ?? (selectedTemplate.RAM && selectedTemplate.RAM * 2) ?? 0)
        const baseDisks = mapTemplateToState(selectedTemplate)
        handleUpdateFormData('discos', baseDisks)

    }, [handleUpdateFormData, template])

    useEffect(() => {
        const findedAdministrator = requestParams.find(r => r.IDOPCION === formData.id_admin_torre)
        setScopeTypes(requestParams.filter(r => r.TIPOATRIBUTO === 'TIPO_ALCANCE' && r.ATRIBUTO?.toString() === findedAdministrator?.ATRIBUTO?.toString()))
    }, [formData.id_admin_torre, requestParams])

    useEffect(() => {
        getRequestFormTemplate();
    }, [getRequestFormTemplate]);

    return (
        <div className="d-flex flex-column w-100">
            {/* Titulo de la sección */}
            <div className="pb-10 pb-lg-15">
                <h2 className="fw-bolder d-flex align-items-center text-gray-900">
                    Completa los datos del formulario
                    <i
                        className="fas fa-exclamation-circle ms-2 fs-7"
                        data-bs-toggle="tooltip"
                        title="Todos los campos del formulario son necesarios para el proceso de aprovisionamiento automático"
                    ></i>
                </h2>
                <div className="text-gray-500 fw-bold fs-6">
                    Si necesitas más información, porfavor revisa el manual de usuario
                    <a
                        href="https://www.google.com"
                        className="link-primary fw-bolder"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {" "}
                        aquí
                    </a>
                    .
                </div>
            </div>

            {/* Contenedor principal del formulario */}
            <div className="d-flex justify-content-around w-100">
                {/* Columna izquierda */}
                <div className="d-flex flex-column gap-5 mw-50">
                    {/* Criticidad del servidor */}
                    <div className="">
                        <SelectInput
                            label="Criticidad de la VM"
                            loading={loadingRequestParams}
                            data={
                                requestParams
                                    .filter(param => param.TIPOATRIBUTO === 'PRIORIDAD')
                                    .map(param => ({ codigo: param.IDOPCION, nombre: param.VALOR?.toUpperCase() }))
                            }
                            value={requestParams.find(r => r.IDOPCION === formData.id_criticidad)?.VALOR?.toUpperCase() ?? ""}
                            onChange={(value) => {
                                const findedPriority = requestParams.find(r => r.VALOR?.toUpperCase() === value)
                                if (findedPriority) handleUpdateFormData('id_criticidad', findedPriority.IDOPCION);
                            }}
                        />
                        {errors.id_criticidad && (
                            <div className="fv-plugins-message-container invalid-feedback">{errors.id_criticidad}</div>
                        )}
                    </div>

                    {/* Hostname */}
                    <div className="">
                        <label htmlFor="hostname" className="form-label">
                            Hostname
                        </label>
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon1"><i className="bi bi-pc-horizontal fs-2"></i></span>
                            <input
                                type="text"
                                id="hostname"
                                name="hostname"
                                className="form-control"
                                placeholder="Nombre del Hostname"
                                required
                                value={formData.hostname}
                                onChange={(e) => handleUpdateFormData('hostname', e.target.value.toUpperCase())}
                            />
                        </div>

                        {errors.hostname && (
                            <div className="fv-plugins-message-container invalid-feedback">{errors.hostname}</div>
                        )}
                    </div>

                    {/* Cliente */}
                    <div className="">
                        <DataList
                            label="Cliente"
                            loading={loadingGetClients}
                            items={clients.map(c => ({
                                id: c.id,
                                value: c.value,
                                node: <span className="text-gray-800"><i className="bi bi-person-square me-2" />{c.value}</span>
                            }))}
                            value={selectedClient}
                            onChange={handleUpdateClient}
                        />
                    </div>

                    {/* Proyecto */}
                    <div className="">
                        <DataList
                            label="Proyecto"
                            loading={projectHook.loadingGetProjects}
                            items={projectHook.projects.map(c => ({
                                id: c.id,
                                value: c.value,
                                node: <span className="text-gray-800"><i className="bi bi-kanban me-2" />{c.value}</span>
                            }))}
                            value={projectHook.projects.find(p => p.id === formData.id_proyecto)?.value ?? ""}
                            onChange={handleUpdateProject}
                        />
                        {errors.id_proyecto && (
                            <div className="fv-plugins-message-container invalid-feedback">{errors.id_proyecto}</div>
                        )}
                    </div>

                    {/* Ubicación */}
                    <div className="">
                        <SelectInput
                            label="Ubicación"
                            loading={loadingRequestParams}
                            data={
                                requestParams
                                    .filter(param => param.TIPOATRIBUTO === 'UBICACION')
                                    .map(param => ({ codigo: param.IDOPCION, nombre: param.VALOR }))
                            }
                            value={requestParams.find(r => r.IDOPCION === formData.id_ubicacion)?.VALOR ?? ""}
                            onChange={(value) => {
                                const findedLocation = requestParams.find(r => r.VALOR === value)
                                if (findedLocation) handleUpdateFormData('id_ubicacion', findedLocation.IDOPCION);
                            }}
                        />
                        {errors.id_ubicacion && (
                            <div className="fv-plugins-message-container invalid-feedback">{errors.id_ubicacion}</div>
                        )}
                    </div>

                    {/* Tipo de servicio */}
                    <div className="">
                        <SelectInput
                            label="Tipo de servicio"
                            loading={loadingRequestParams}
                            data={
                                requestParams
                                    .filter(param => param.TIPOATRIBUTO === 'TIPO_SERVICIO')
                                    .map(param => ({ codigo: param.IDOPCION, nombre: param.VALOR }))
                            }
                            value={requestParams.find(r => r.IDOPCION === formData.id_tipo_servicio)?.VALOR ?? ""}
                            onChange={(value) => {
                                const findedTypeService = requestParams.find(r => r.VALOR === value)
                                if (findedTypeService) handleUpdateFormData('id_tipo_servicio', findedTypeService.IDOPCION);
                            }}
                        />
                        {errors.id_tipo_servicio && (
                            <div className="fv-plugins-message-container invalid-feedback">{errors.id_tipo_servicio}</div>
                        )}
                    </div>

                    {/* Ambito */}
                    <div className="">
                        <SelectInput
                            label="Infraestructura"
                            loading={loadingScopes}
                            data={
                                projectScopes
                                    .map(param => ({ codigo: param.IDOPCION, nombre: param.VALOR }))
                            }
                            value={projectScopes.find(r => r.IDOPCION === formData.id_ambito)?.VALOR ?? ""}
                            onChange={(value) => {
                                const findedAmbito = projectScopes.find(r => r.VALOR === value)
                                if (findedAmbito) handleUpdateFormData('id_ambito', findedAmbito.IDOPCION);
                            }}
                        />
                        {errors.id_ambito && (
                            <div className="fv-plugins-message-container invalid-feedback">{errors.id_ambito}</div>
                        )}
                    </div>

                    {/* Abmiente */}
                    <div className="">
                        <SelectInput
                            label="Ambiente"
                            loading={loadingRequestParams}
                            data={
                                requestParams
                                    .filter(param => param.TIPOATRIBUTO === 'AMBIENTE')
                                    .map(param => ({ codigo: param.IDOPCION, nombre: param.VALOR }))
                            }
                            value={requestParams.find(r => r.IDOPCION === formData.id_ambiente)?.VALOR ?? ""}
                            onChange={(value) => {
                                const findedAmbient = requestParams.find(r => r.VALOR === value)
                                if (findedAmbient) handleUpdateFormData('id_ambiente', findedAmbient.IDOPCION);
                            }}
                        />
                        {errors.id_ambiente && (
                            <div className="fv-plugins-message-container invalid-feedback">{errors.id_ambiente}</div>
                        )}
                    </div>
                </div>

                {/* Columna derecha */}
                <div className="d-flex flex-column gap-5">

                    {/* Administrador */}
                    <div className="">
                        <SelectInput
                            label="Administrado por"
                            loading={loadingRequestParams}
                            data={
                                requestParams
                                    .filter(param => param.TIPOATRIBUTO === 'ADMIN_TORRE')
                                    .map(param => ({ codigo: param.IDOPCION, nombre: param.VALOR }))
                            }
                            value={requestParams.find(r => r.IDOPCION === formData.id_admin_torre)?.VALOR ?? ""}
                            onChange={(value) => {
                                const findedAdministrator = requestParams.find(r => r.VALOR === value)
                                if (findedAdministrator) handleUpdateFormData('id_admin_torre', findedAdministrator.IDOPCION);
                            }}
                        />
                        {errors.id_admin_torre && (
                            <div className="fv-plugins-message-container invalid-feedback">{errors.id_admin_torre}</div>
                        )}
                    </div>

                    {/* Tipo de Alcance */}
                    <div className="">
                        <SelectInput
                            label="Tipo de alcance"
                            loading={loadingRequestParams}
                            data={
                                scopeTypes
                                    .map(param => ({ codigo: param.IDOPCION, nombre: param.VALOR }))
                            }
                            value={scopeTypes.find(r => r.IDOPCION === formData.id_tipo_alcance)?.VALOR ?? ""}
                            onChange={(value) => {
                                const findedScopeType = scopeTypes.find(r => r.VALOR === value)
                                if (findedScopeType) handleUpdateFormData('id_tipo_alcance', findedScopeType.IDOPCION);
                            }}
                        />
                        {errors.id_tipo_alcance && (
                            <div className="fv-plugins-message-container invalid-feedback">{errors.id_tipo_alcance}</div>
                        )}
                    </div>

                    {/* Sistema Operativo */}
                    <div className="">
                        <SelectInput
                            label="Sistema Operativo"
                            data={[{ codigo: 1, nombre: 'WINDOWS' }, { codigo: 2, nombre: 'LINUX' }]}
                            value={selectedSO}
                            onChange={(value) => {
                                setSelectedSO(value)
                                handleUpdateFormData('id_so_version', 0)
                                handleUpdateFormData('rol_uso', '')
                                handleUpdateFormData('discos', [])
                            }}
                        />
                    </div>

                    {/* Versión de SO */}
                    <div className="">
                        <DataList
                            label="Version"
                            loading={loadingRequestParams}
                            items={
                                requestParams
                                    .filter(r => r.TIPOATRIBUTO === 'INVENTORY_LISTA_OPCIONES_ATRIBUTOS' && r.VALOR.toLowerCase() === selectedSO.toLowerCase())
                                    .map(r => ({ id: r.IDOPCION, value: r.ATRIBUTO || "" }))}
                            value={requestParams.find(r => r.IDOPCION === formData.id_so_version)?.ATRIBUTO ?? ""}
                            onChange={(value) => {
                                const findedSOVersion = requestParams.find(p => p.ATRIBUTO === value)
                                if (findedSOVersion) handleUpdateFormData('id_so_version', findedSOVersion.IDOPCION);
                            }}
                        />
                        {errors.id_so_version && (
                            <div className="fv-plugins-message-container invalid-feedback">{errors.id_so_version}</div>
                        )}
                    </div>

                    {/* Rol de Uso */}
                    <div className="">
                        <SelectInput
                            label="Rol de uso de la VM"
                            loading={loadingRequestParams}
                            data={template
                                .filter(t => t.SO?.toLowerCase() === selectedSO?.toLowerCase())
                                .map(t => ({ codigo: t.ID_TEMPLATE, nombre: `${t.ROL_USO}-${selectedSO.charAt(0)}` }))
                            }
                            value={formData.rol_uso}
                            onChange={handleUpdateRolUse}
                        />
                        {errors.rol_uso && (
                            <div className="fv-plugins-message-container invalid-feedback">{errors.rol_uso}</div>
                        )}
                    </div>

                    {/* vCPU */}
                    <div className="">
                        <label htmlFor="vcpu" className="form-label">
                            vCPU (cores)
                        </label>
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon1"><i className="bi bi-cpu fs-2"></i></span>
                            <input
                                type="number"
                                id="vcpu"
                                name="vcpu"
                                className="form-control"
                                min="1"
                                max="500"
                                value={formData.vcpu_cores === 0 ? "" : formData.vcpu_cores}
                                onChange={(e) => handleUpdateFormData('vcpu_cores', Number(e.target.value))}
                            />
                        </div>
                        {errors.vcpu_cores && (
                            <div className="fv-plugins-message-container invalid-feedback">{errors.vcpu_cores}</div>
                        )}
                    </div>

                    {/* RAM */}
                    <div className="">
                        <label htmlFor="ram" className="form-label">
                            Memoria RAM (GB)
                        </label>
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon1"><i className="bi bi-memory fs-2"></i></span>
                            <input
                                type="number"
                                className="form-control"
                                id="ram"
                                name="ram"
                                min="1"
                                max="500"
                                value={formData.ram_gb === 0 ? "" : formData.ram_gb}
                                onChange={(e) => {
                                    handleUpdateFormData('ram_gb', Number(e.target.value))
                                    handleUpdateFormData('swap_gb', Number(e.target.value) * 2)
                                }}
                            />
                        </div>
                        {errors.ram_gb && (
                            <div className="fv-plugins-message-container invalid-feedback">{errors.ram_gb}</div>
                        )}
                    </div>

                    {/* SWAP */}
                    <div className="">
                        <label htmlFor="swap" className="form-label">
                            {selectedSO.toLowerCase() === 'linux' ? 'Memoria SWAP (GB)' : 'Paginación (GB)'}
                        </label>
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon1"><i className="bi bi-memory fs-2"></i></span>
                            <input
                                type="number"
                                className="form-control"
                                id="swap"
                                name="swap"
                                min="1"
                                max="500"
                                value={formData.swap_gb === 0 ? "" : formData.swap_gb}
                                onChange={(e) => handleUpdateFormData('swap_gb', Number(e.target.value))}
                            />
                        </div>
                        {errors.swap_gb && (
                            <div className="fv-plugins-message-container invalid-feedback">{errors.swap_gb}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}