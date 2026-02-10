import { useState } from "react"
import { useTypedSelector } from "../../../../store/ConfigStore"
import { RequestVM, UpdatedServices } from "../../Types"
import { useServerProvisioningContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"

export const UpdateServices = () => {

    const {
        modalHook,
        paramsHook,
        updateRequestHook: { updateServicesVM, loadingUpdateServices },
        requestVMHook: { getRequestVM }
    } = useServerProvisioningContext()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const requestInformation: RequestVM = modalHook.modalInformation
    const [updateServices, setUpdateServices] = useState<UpdatedServices>(() => ({
        usuario_modificacion: userName,
        implementar_backup: requestInformation.IMPLEMENTAR_BACKUP,
        implementar_edr: requestInformation.IMPLEMENTAR_EDR,
        implementar_monitoreo: requestInformation.IMPLEMENTAR_MONITOREO
    }))

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!updateServices) return;
        updateServicesVM(requestInformation.ID_SOLICITUD, updateServices).then(result => {
            if (result) {
                getRequestVM(requestInformation.ID_SOLICITUD)
                modalHook.closeModal()
            }
        })
    }

    const handleUpdateFormData = <K extends keyof UpdatedServices>(
        key: K,
        value: UpdatedServices[K]
    ) => {
        setUpdateServices(prev => ({ ...prev, [key]: value }))
    }

    const edrOptions = paramsHook.requestParams.filter(
        (p) => p.TIPOATRIBUTO === "TIPO_EDR_APROVISIONAMIENTO"
    )

    const hasEDR = edrOptions.some(e => e.ATRIBUTO && e.VALOR === "EDR_CANVIA")

    return (
        <>
            <div className='modal-header py-4'>
                <h2 className="text-dark">ACTUALIZAR SOLICITUD</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <form onSubmit={handleSubmit} className="px-10">
                <div className='modal-body d-flex justify-content-around gap-10 flex-column '>
                    <div className={`col card cursor-pointer hover-elevate-up transition-all shadow-sm ${updateServices.implementar_backup && 'border border-primary border-dashed'}`}>
                        <div className="ribbon">
                            <div className="ribbon-label bg-primary">Próximamente</div>
                        </div>
                        <div
                        //  onClick={() => handleUpdateFormData('implementar_backup', !formData.implementar_backup)}
                        >
                            <div className="card-body d-flex flex-column">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={updateServices.implementar_backup}
                                        onChange={() => { }}
                                    />
                                    <label className="form-check-label w-100 ms-2">
                                        <h5 className="card-title">Implementar Backup</h5>
                                    </label>
                                </div>
                                <p className="card-text mt-2 text-gray-700">Se implementará la politica de Backup y el servicio de Backup</p>
                            </div>
                        </div>
                    </div>
                    <div className={`col card cursor-pointer hover-elevate-up transition-all shadow-sm ${updateServices.implementar_monitoreo && 'border border-primary border-dashed'}`}>
                        <div
                            onClick={() => handleUpdateFormData('implementar_monitoreo', !updateServices.implementar_monitoreo)}
                        >
                            <div className="card-body d-flex flex-column">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={updateServices.implementar_monitoreo}
                                        onChange={() => { }}
                                    />
                                    <label className="form-check-label w-100 ms-2">
                                        <h5 className="card-title">Implementar Monitoreo</h5>
                                    </label>
                                </div>
                                <p className="card-text mt-2 text-gray-700">Se implementará la politica de Monitoreo y el servicio de Monitoreo</p>
                            </div>
                        </div>
                    </div>
                    <div className={`col px-10 py-5 card cursor-pointer hover-elevate-up transition-all shadow-sm ${hasEDR && 'border border-primary border-dashed'}`}>
                        <label className="form-check-label w-100 mb-2">
                            <h5 className="card-title">Implementar EDR</h5>
                        </label>
                        <div className="d-flex flex-column flex-wrap gap-4">
                            {edrOptions.map((e) => (
                                <div key={e.IDOPCION} className="form-check form-check-custom form-check-solid">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="EDROption"
                                        id={`edr-${e.IDOPCION}`}
                                        value={e.IDOPCION}
                                        checked={updateServices.implementar_edr === e.IDOPCION}
                                        onChange={() => {
                                            handleUpdateFormData("implementar_edr", e.IDOPCION)
                                        }}
                                    />
                                    <label className="form-check-label fw-semibold text-gray-700" htmlFor={`edr-${e.IDOPCION}`}>
                                        {e.ATRIBUTO}
                                    </label>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
                <div className="modal-footer d-flex justify-content-between">
                    <button
                        type="button"
                        className="btn btn-sm btn-light"
                        onClick={() => modalHook.closeModal()}
                        disabled={loadingUpdateServices}
                    >
                        <i className="bi bi-x-circle fs-3 me-2"></i>
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-sm btn-success"
                        disabled={loadingUpdateServices}
                    >
                        {loadingUpdateServices ?
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


            </form >
        </>
    )
}