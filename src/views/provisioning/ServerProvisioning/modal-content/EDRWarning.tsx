import { useServerProvisioningContext } from "../Context"
import { CreateRequestVM } from "../../Types"
import { KTSVG } from "../../../../helpers"
import { useState } from "react"

export const EDRWarning = () => {

    const { modalHook, paramsHook } = useServerProvisioningContext()
    const { handleUpdateFormData, formData }: {
        handleUpdateFormData: <K extends keyof CreateRequestVM>(key: K, value: CreateRequestVM[K]) => void,
        formData: CreateRequestVM
    } = modalHook.modalInformation
    const [selectedOption, setSelectedOption] = useState(formData.implementar_edr)

    const edrOptions = paramsHook.requestParams.filter(
        (p) => p.TIPOATRIBUTO === "TIPO_EDR_APROVISIONAMIENTO" && p.VALOR !== "EDR_CANVIA"
    )

    const selectedEDR = paramsHook.requestParams.find(
        (p) => p.TIPOATRIBUTO === "TIPO_EDR_APROVISIONAMIENTO" && p.IDOPCION === selectedOption
    )

    return (
        <>
            {/* Header */}
            <div className="modal-header py-4">
                <h2 className="text-dark">ADVERTENCIA</h2>
                <div
                    className="btn btn-sm btn-icon btn-active-color-primary"
                    onClick={() => modalHook.closeModal()}
                >
                    <KTSVG className="svg-icon-1" path="/media/icons/duotune/arrows/arr061.svg" />
                </div>
            </div>

            {/* Body */}
            <div className="modal-body pt-8 px-5 d-flex flex-column align-items-center">
                <div className="d-flex flex-column w-100">

                    <div className="text-center">
                        <h4 className="mb-3">
                            El servidor no tendrá instalado el EDR de <span className="fw-bold">CANVIA</span>
                        </h4>
                        <p className="text-gray-500 fs-7">
                            Confirme si el cliente proporcionará su propio EDR:
                        </p>
                    </div>

                    {/* Opciones */}
                    <div className="px-4 mb-5 pt-2">
                        <div className="d-flex flex-wrap gap-4">
                            {edrOptions.map((e) => (
                                <div key={e.IDOPCION} className="form-check form-check-custom form-check-solid">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="EDROption"
                                        id={`edr-${e.IDOPCION}`}
                                        value={e.IDOPCION}
                                        checked={selectedOption === e.IDOPCION}
                                        onChange={() => {
                                            handleUpdateFormData("implementar_edr", e.IDOPCION)
                                            setSelectedOption(e.IDOPCION)
                                        }}
                                    />
                                    <label className="form-check-label fw-semibold text-gray-700" htmlFor={`edr-${e.IDOPCION}`}>
                                        {e.ATRIBUTO}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Advertencia adicional */}
                        {selectedEDR?.VALOR === "NO_EDR_CLIENTE" && (
                            <div className="alert alert-warning d-flex align-items-center mt-5">
                                <i className="bi bi-exclamation-triangle-fill text-warning fs-2 me-3"></i>
                                <span className="fw-light text-gray-700">
                                    El responsable del proyecto deberá solicitar al cliente una carta de riesgo
                                    por mantener el servidor sin EDR.
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <button
                    className="btn btn-sm btn-light-primary"
                    onClick={() => modalHook.closeModal()}
                >
                    <i className="bi bi-check-circle fs-3"></i> &nbsp; Continuar
                </button>
            </div>
        </>
    )
}
