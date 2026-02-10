import { FC } from "react"
import { CreateFormProps } from "./VMCreateForm"
import { useServerProvisioningContext } from "../../Context"
import { ModalViewForServerProvisioning } from "../../../Types"
import { ModalSize } from "../../../../administration/Types"

export const AditionalServices: FC<CreateFormProps> = ({
    formData,
    handleUpdateFormData,
}) => {
    const { modalHook, paramsHook } = useServerProvisioningContext()

    const handleEDRChange = () => {
        const edrSelected = paramsHook.requestParams.find(
            (p) => p.TIPOATRIBUTO === "TIPO_EDR_APROVISIONAMIENTO" && p.IDOPCION === formData.implementar_edr
        )

        const isEdrCanvia = edrSelected?.VALOR === "EDR_CANVIA"

        if (isEdrCanvia) {
            modalHook.openModal(
                ModalViewForServerProvisioning.EDR_WARNING,
                ModalSize.SM,
                undefined,
                { handleUpdateFormData, formData }
            )
        } else {
            const edrCANVIA = paramsHook.requestParams.find(
                (p) => p.TIPOATRIBUTO === "TIPO_EDR_APROVISIONAMIENTO" && p.VALOR === "EDR_CANVIA"
            )
            if (edrCANVIA) handleUpdateFormData("implementar_edr", edrCANVIA.IDOPCION)
        }
    }

    return (
        <div className="container mt-5 mb-8">
            {/* Header */}
            <div className="pb-10">
                <h2 className="fw-bolder d-flex align-items-center text-gray-900">
                    <i className="bi bi-gear-wide-connected text-primary fs-2 me-2"></i>
                    Servicios Requeridos
                    <i
                        className="fas fa-exclamation-circle ms-2 fs-7 text-gray-500"
                        data-bs-toggle="tooltip"
                        title="Todos los campos son necesarios para el aprovisionamiento automático"
                    ></i>
                </h2>
                <div className="text-gray-500 fw-bold fs-6">
                    Selecciona los servicios complementarios que son obligatorios para la administración de CANVIA. <br />
                    El desistir de estos aplicaría para servidores que no estén en administración de CANVIA.
                </div>
            </div>

            {/* Servicios */}
            <div className="d-flex justify-content-around gap-10 py-15">
                {/* Backup */}
                <div
                    className={`card cursor-pointer hover-elevate-up transition-all shadow-sm ${formData.implementar_backup ? "border border-primary border-dashed" : ""
                        }`}
                >
                    <div className="ribbon">
                        <div className="ribbon-label bg-primary">Próximamente</div>
                    </div>
                    <div className="card-body d-flex flex-column">
                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={formData.implementar_backup}
                                onChange={() => { }}
                            />
                            <label className="form-check-label w-100 ms-2">
                                <h5 className="card-title mb-1">
                                    <i className="bi bi-hdd-network text-primary me-2"></i>
                                    Implementar Backup
                                </h5>
                            </label>
                        </div>
                        <p className="card-text text-gray-700 mb-1">
                            Se implementará la política de Backup y el servicio asociado.
                        </p>
                        <i className="text-gray-500 fs-8">Disponible próximamente.</i>
                    </div>
                </div>

                {/* Monitoreo */}
                <div
                    className={`card cursor-pointer hover-elevate-up transition-all shadow-sm ${formData.implementar_monitoreo ? "border border-primary border-dashed" : ""
                        }`}
                    onClick={() => handleUpdateFormData("implementar_monitoreo", !formData.implementar_monitoreo)}
                >
                    <div className="card-body d-flex flex-column">
                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={formData.implementar_monitoreo}
                                onChange={() => { }}
                            />
                            <label className="form-check-label w-100 ms-2">
                                <h5 className="card-title mb-1">
                                    <i className="bi bi-activity text-success me-2"></i>
                                    Implementar Monitoreo
                                </h5>
                            </label>
                        </div>
                        <p className="card-text text-gray-700 mb-1">
                            Se implementará la política y servicio de Monitoreo.
                        </p>
                        <i className="text-gray-500 fs-8">
                            El monitoreo será implementado a nivel de Sistema Operativo con Zabbix.
                        </i>
                    </div>
                </div>

                {/* EDR */}
                <div
                    className={`card cursor-pointer hover-elevate-up transition-all shadow-sm ${formData.implementar_edr ? "border border-primary border-dashed" : ""
                        }`}
                    onClick={handleEDRChange}
                >
                    <div className="card-body d-flex flex-column">
                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={
                                    paramsHook.requestParams.find(
                                        (p) => p.TIPOATRIBUTO === "TIPO_EDR_APROVISIONAMIENTO" &&
                                            p.IDOPCION === formData.implementar_edr
                                    )?.VALOR === "EDR_CANVIA"
                                }
                                onChange={() => { }}
                            />
                            <label className="form-check-label w-100 ms-2">
                                <h5 className="card-title mb-1">
                                    <i className="bi bi-shield-check text-danger me-2"></i>
                                    Implementar EDR de CANVIA
                                </h5>
                            </label>
                        </div>
                        <p className="card-text text-gray-700 mb-1">
                            Se implementará el servicio de EDR.
                        </p>
                        <i className="text-gray-500 fs-8">
                            El CI de EDR será agregado a la lista de configuraciones en la CMDB.
                        </i>
                    </div>
                </div>
            </div>
        </div>
    )
}
