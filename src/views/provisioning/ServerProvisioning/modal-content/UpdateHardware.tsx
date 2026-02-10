import { useState } from "react"
import { useTypedSelector } from "../../../../store/ConfigStore"
import { ModalViewForServerProvisioning, RequestVM, UpdatedHardware } from "../../Types"
import { useServerProvisioningContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { getTotalDiskSpace, validateHardware } from "../utils"
import { ModalSize } from "../../../../hooks/Types"

export const UpdateHardware = () => {

    const {
        modalHook,
        updateRequestHook: { updatehardwareVM, loadingUpdateHardware },
        requestVMHook: { getRequestVM }
    } = useServerProvisioningContext()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const requestInformation: RequestVM = modalHook.modalInformation
    const [errors, setErrors] = useState<Record<string, string> | null>(null)
    const [updatedHardware, setUpdatedHardware] = useState<UpdatedHardware>(() => ({
        usuario_modificacion: userName,
        ram_gb: requestInformation.RAM_GB,
        swap_gb: requestInformation.SWAP_GB,
        vcpu_cores: requestInformation.VCPU_CORES
    }))

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!updatedHardware) return;

        // Validar informacion General
        const newErrors = validateHardware(updatedHardware)
        setErrors(newErrors)
        if (Object.keys(newErrors).length > 0) return;
        updatehardwareVM(requestInformation.ID_SOLICITUD, updatedHardware).then(result => {
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
                    requestedRAMMB: updatedHardware.ram_gb,
                    requestedCPUCores: updatedHardware.vcpu_cores
                })
            }
        })
    }

    const handleUpdateFormData = <K extends keyof UpdatedHardware>(
        key: K,
        value: UpdatedHardware[K]
    ) => {
        setUpdatedHardware(prev => ({ ...prev, [key]: value }))
        setErrors(prev => ({ ...prev, [key]: '' }))
    }

    return (
        <>
            <div className='modal-header py-4'>
                <h2 className="text-dark">ACTUALIZAR SOLICITUD</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <form onSubmit={handleSubmit} className="px-10">
                <div className='modal-body d-flex flex-column gap-10 '>
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
                                value={updatedHardware.vcpu_cores === 0 ? "" : updatedHardware.vcpu_cores}
                                onChange={(e) => handleUpdateFormData('vcpu_cores', Number(e.target.value))}
                            />
                        </div>
                        {errors?.vcpu_cores && (
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
                                value={updatedHardware.ram_gb === 0 ? "" : updatedHardware.ram_gb}
                                onChange={(e) => {
                                    handleUpdateFormData('ram_gb', Number(e.target.value))
                                }}
                            />
                        </div>
                        {errors?.ram_gb && (
                            <div className="fv-plugins-message-container invalid-feedback">{errors.ram_gb}</div>
                        )}
                    </div>

                    {/* SWAP */}
                    {/*
                        <div className="">
                            <label htmlFor="swap" className="form-label">
                                Memoria SWAP (GB)
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
                                    value={updatedHardware.swap_gb === 0 ? "" : updatedHardware.swap_gb}
                                    onChange={(e) => handleUpdateFormData('swap_gb', Number(e.target.value))}
                                />
                            </div>
                            {errors?.swap_gb && (
                                <div className="fv-plugins-message-container invalid-feedback">{errors.swap_gb}</div>
                            )}
                        </div>
                    */}
                </div>
                <div className="modal-footer d-flex justify-content-between">
                    <button
                        type="button"
                        className="btn btn-sm btn-light"
                        onClick={() => modalHook.closeModal()}
                        disabled={loadingUpdateHardware}
                    >
                        <i className="bi bi-x-circle fs-3 me-2"></i>
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-sm btn-success"
                        disabled={loadingUpdateHardware}
                    >
                        {loadingUpdateHardware ?
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
            </form>
        </>
    )
}