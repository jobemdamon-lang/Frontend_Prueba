import { useEffect, useState } from "react"
import { useTypedSelector } from "../../../../store/ConfigStore"
import { ModalViewForServerProvisioning, RequestFormOptions, RequestVM, UpdatedGeneral } from "../../Types"
import { useServerProvisioningContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { SelectInput } from "../../../../components/Inputs/SelectInput"
import { getTotalDiskSpace, validateUpdateGeneral } from "../utils"
import { ModalSize } from "../../../../hooks/Types"

export const UpdateGeneral = () => {

    const {
        modalHook,
        updateRequestHook: { updateGeneralVM, loadingUpdateGeneral },
        requestVMHook: { getRequestVM },
        paramsHook: { loadingRequestParams, requestParams, loadingScopes, projectScopes, getScopeByProject }
    } = useServerProvisioningContext()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const requestInformation: RequestVM = modalHook.modalInformation
    const [errors, setErrors] = useState<Record<string, string> | null>(null)
    const [scopeTypes, setScopeTypes] = useState<RequestFormOptions[]>([])
    const [updatedGeneral, setUpdatedGeneral] = useState<UpdatedGeneral>(() => ({
        usuario_modificacion: userName,
        hostname: requestInformation.HOSTNAME,
        id_admin_torre: requestInformation.ID_ADMIN_TORRE,
        id_ambito: requestInformation.ID_AMBITO,
        id_criticidad: requestInformation.ID_CRITICIDAD,
        id_tipo_servicio: requestInformation.ID_TIPO_SERVICIO,
        id_ubicacion: requestInformation.ID_UBICACION,
        ip: requestInformation.IP,
        vlan_id: requestInformation.VLAN_ID,
        gateway: requestInformation.GATEWAY,
        netmask: requestInformation.NETMASK,
        id_tipo_alcance: requestInformation.ID_TIPO_ALCANCE,
        id_ambiente: requestInformation.ID_AMBIENTE
    }))

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!updatedGeneral) return;

        // Validar informacion General
        const newErrors = validateUpdateGeneral(updatedGeneral)
        setErrors(newErrors)
        if (Object.keys(newErrors).length > 0) return;

        updateGeneralVM(requestInformation.ID_SOLICITUD, updatedGeneral).then(result => {
            if (!result && !Array.isArray(result)) return;
            const [success, recommended] = result
            if (success) {
                getRequestVM(requestInformation.ID_SOLICITUD)
                modalHook.closeModal()
            } else if (recommended) {
                modalHook.openModal(ModalViewForServerProvisioning.VALIDATE_RECOMMENDATION, ModalSize.XL, undefined, {
                    recommended: recommended,
                    message: "No se pudo actualizar la solicitud por falta de recursos",
                    requestedStorageGB: getTotalDiskSpace(requestInformation?.DISCOS || []),
                    requestedRAMMB: requestInformation.RAM_GB,
                    requestedCPUCores: requestInformation.VCPU_CORES
                })
            }
        })
    }

    const handleUpdateFormData = <K extends keyof UpdatedGeneral>(
        key: K,
        value: UpdatedGeneral[K]
    ) => {
        setUpdatedGeneral(prev => ({ ...prev, [key]: value }))
        setErrors(prev => ({ ...prev, [key]: '' }))
    }

    useEffect(() => {
        const findedAdministrator = requestParams.find(r => r.IDOPCION === updatedGeneral.id_admin_torre)
        setScopeTypes(requestParams.filter(r => r.TIPOATRIBUTO === 'TIPO_ALCANCE' && r.ATRIBUTO?.toString() === findedAdministrator?.ATRIBUTO?.toString()))
    }, [updatedGeneral.id_admin_torre, requestParams])

    useEffect(() => {
        getScopeByProject(requestInformation.ID_PROYECTO)
    }, [getScopeByProject, requestInformation.ID_PROYECTO])

    return (
        <>
            <div className='modal-header py-4'>
                <h2 className="text-dark">ACTUALIZAR SOLICITUD</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="px-10">
                <div className='modal-body px-10 d-flex flex-column gap-10'>
                    {/* Contenedor principal del formulario */}
                    <div className="d-flex justify-content-around flex-column gap-3">
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
                                value={requestParams.find(r => r.IDOPCION === updatedGeneral.id_criticidad)?.VALOR?.toUpperCase() ?? ""}
                                onChange={(value) => {
                                    const findedPriority = requestParams.find(r => r.VALOR?.toUpperCase() === value)
                                    if (findedPriority) handleUpdateFormData('id_criticidad', findedPriority.IDOPCION);
                                }}
                            />
                            {errors?.id_criticidad && (
                                <div className="fv-plugins-message-container invalid-feedback">{errors?.id_criticidad}</div>
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
                                    value={updatedGeneral.hostname}
                                    onChange={(e) => handleUpdateFormData('hostname', e.target.value)}
                                />
                            </div>

                            {errors?.hostname && (
                                <div className="fv-plugins-message-container invalid-feedback">{errors.hostname}</div>
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
                                value={requestParams.find(r => r.IDOPCION === updatedGeneral.id_ubicacion)?.VALOR ?? ""}
                                onChange={(value) => {
                                    const findedLocation = requestParams.find(r => r.VALOR === value)
                                    if (findedLocation) handleUpdateFormData('id_ubicacion', findedLocation.IDOPCION);
                                }}
                            />
                            {errors?.id_ubicacion && (
                                <div className="fv-plugins-message-container invalid-feedback">{errors.id_ubicacion}</div>
                            )}
                        </div>

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
                                value={requestParams.find(r => r.IDOPCION === updatedGeneral.id_admin_torre)?.VALOR ?? ""}
                                onChange={(value) => {
                                    const findedAdministrator = requestParams.find(r => r.VALOR === value)
                                    if (findedAdministrator) handleUpdateFormData('id_admin_torre', findedAdministrator.IDOPCION);
                                }}
                            />
                            {errors?.id_admin_torre && (
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
                                value={scopeTypes.find(r => r.IDOPCION === updatedGeneral.id_tipo_alcance)?.VALOR ?? ""}
                                onChange={(value) => {
                                    const findedScopeType = scopeTypes.find(r => r.VALOR === value)
                                    if (findedScopeType) handleUpdateFormData('id_tipo_alcance', findedScopeType.IDOPCION);
                                }}
                            />
                            {errors?.id_tipo_alcance && (
                                <div className="fv-plugins-message-container invalid-feedback">{errors.id_tipo_alcance}</div>
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
                                value={requestParams.find(r => r.IDOPCION === updatedGeneral.id_tipo_servicio)?.VALOR ?? ""}
                                onChange={(value) => {
                                    const findedTypeService = requestParams.find(r => r.VALOR === value)
                                    if (findedTypeService) handleUpdateFormData('id_tipo_servicio', findedTypeService.IDOPCION);
                                }}
                            />
                            {errors?.id_tipo_servicio && (
                                <div className="fv-plugins-message-container invalid-feedback">{errors.id_tipo_servicio}</div>
                            )}
                        </div>

                        {/* Ambito */}
                        <div className="">
                            <SelectInput
                                label="AMBITO"
                                loading={loadingScopes}
                                data={
                                    projectScopes
                                        .map(param => ({ codigo: param.IDOPCION, nombre: param.VALOR }))
                                }
                                value={projectScopes.find(r => r.IDOPCION === updatedGeneral.id_ambito)?.VALOR ?? ""}
                                onChange={(value) => {
                                    const findedAmbito = projectScopes.find(r => r.VALOR === value)
                                    if (findedAmbito) handleUpdateFormData('id_ambito', findedAmbito.IDOPCION);
                                }}
                            />
                            {errors?.id_ambito && (
                                <div className="fv-plugins-message-container invalid-feedback">{errors.id_ambito}</div>
                            )}
                        </div>

                        {/* Ambiente */}
                        <div className="">
                            <SelectInput
                                label="Ambiente"
                                loading={loadingRequestParams}
                                data={
                                    requestParams
                                        .filter(param => param.TIPOATRIBUTO === 'AMBIENTE')
                                        .map(param => ({ codigo: param.IDOPCION, nombre: param.VALOR }))
                                }
                                value={requestParams.find(r => r.IDOPCION === updatedGeneral.id_ambiente)?.VALOR ?? ""}
                                onChange={(value) => {
                                    const findedAmbient = requestParams.find(r => r.VALOR === value)
                                    if (findedAmbient) handleUpdateFormData('id_ambiente', findedAmbient.IDOPCION);
                                }}
                            />
                            {errors?.id_ambiente && (
                                <div className="fv-plugins-message-container invalid-feedback">{errors.id_ambiente}</div>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer d-flex justify-content-between">
                        <button
                            type="button"
                            className="btn btn-sm btn-light"
                            onClick={() => modalHook.closeModal()}
                            disabled={loadingUpdateGeneral}
                        >
                            <i className="bi bi-x-circle fs-3 me-2"></i>
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-sm btn-success"
                            disabled={loadingUpdateGeneral}
                        >
                            {loadingUpdateGeneral ?
                                <>
                                    Actualizando &nbsp;
                                    <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                </> :
                                <>
                                    <i className="bi bi-check-square fs-3"></i>
                                    Actualizar solicitud
                                </>
                            }
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}