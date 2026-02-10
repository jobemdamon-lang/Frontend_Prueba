import { KTSVG } from "../../../../helpers"
import { useBackupsPoliciesContext } from "../Context"
import { useState } from "react"

const CreateChangeRequest = () => {
    const [type, setType] = useState<"onpremise" | "cloud" | null>(null)
    const [selectedCard, setSelectedCard] = useState<"vm" | "otros" | null>(null)
    const { globalParams, modalHook } = useBackupsPoliciesContext()

    const handleBack = () => {
        setType(null)
        setSelectedCard(null)
    }

    return (
        <>
            <div className="modal-header py-4">
                <h2>Crear Nueva Solicitud de Cambio</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                </div>
            </div>
            <div className="modal-body pt-2 px-lg-10">
                {/* Selección OnPremise / Cloud */}
                {!type && (
                    <div className="d-flex flex-column align-items-center mb-5">
                        <h5 className="fw-bold mb-3 text-primary">
                            ¿Qué tipo de entorno deseas modificar?
                        </h5>
                        <p className="text-muted mb-4 text-center" style={{ maxWidth: 400 }}>
                            Selecciona si la solicitud de cambio corresponde a un entorno <strong>OnPremise</strong> (infraestructura local) o <strong>Cloud</strong> (servicios en la nube). La elección permitirá mostrarte el formulario adecuado para tu requerimiento.
                        </p>
                        <div className="d-flex gap-5 justify-content-center">
                            <button className="btn btn-outline-info px-4 py-3 d-flex flex-column align-items-center" onClick={() => setType("onpremise")}>
                                <i className="bi bi-hdd-stack fs-2 mb-2"></i>
                                <span>OnPremise</span>
                            </button>
                            <button className="btn btn-outline-info px-4 py-3 d-flex flex-column align-items-center" onClick={() => setType("cloud")}>
                                <i className="bi bi-cloud-arrow-up fs-2 mb-2"></i>
                                <span>Cloud</span>
                            </button>
                        </div>
                    </div>
                )}

                {type === "onpremise" && (
                    <>
                        <div className="d-flex gap-5 mb-5">
                            {/* Card 1 */}
                            <div
                                className={`card flex-grow-1 p-5 d-flex flex-column align-items-center justify-content-center border border-2 rounded shadow-sm ${selectedCard === "vm" ? "border-primary" : "border-gray-300"}`}
                                style={{ cursor: "pointer" }}
                                onClick={() => setSelectedCard("vm")}
                            >
                                <i className="bi bi-hdd-network fs-1 mb-3"></i>
                                <span className="fw-bold fs-2">Máquina Virtual</span>
                                <div className="text-muted text-center mb-2">
                                    Solicita cambios relacionados con servidores virtuales, recursos, configuraciones y administración de máquinas virtuales.
                                </div>
                                <div className="form-check mt-3">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        checked={selectedCard === "vm"}
                                        readOnly
                                    />
                                </div>
                            </div>
                            {/* Card 2 */}
                            <div
                                className={`card flex-grow-1 p-5 d-flex flex-column align-items-center justify-content-center border border-2 rounded shadow-sm ${selectedCard === "otros" ? "border-primary" : "border-gray-300"}`}
                                style={{ cursor: "pointer" }}
                                onClick={() => setSelectedCard("otros")}
                            >
                                <i className="bi bi-question-circle fs-1 mb-3"></i>
                                <span className="fw-bold fs-2">Otros</span>
                                <div className="text-muted text-center mb-2">
                                    Solicita cambios para otros tipos de elementos o configuraciones no relacionados con máquinas virtuales.
                                </div>
                                <div className="form-check mt-3">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        checked={selectedCard === "otros"}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Motivo del Cambio */}
                        <div className="row mb-5">
                            <div className="col-md-7">
                                <label htmlFor="reason" className="form-label fw-bold">Motivo del Cambio</label>
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text">
                                        <i className="bi bi-chat-square-text"></i>
                                    </span>
                                    <input
                                        type="text"
                                        id="reason"
                                        className="form-control"
                                        placeholder="Ingrese el motivo"
                                    />
                                </div>
                            </div>
                            <div className="col-md-5">
                                <label htmlFor="ticket_reason" className="form-label fw-bold">Ticket</label>
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text">
                                        <i className="bi bi-ticket"></i>
                                    </span>
                                    <input
                                        type="text"
                                        id="ticket_reason"
                                        className="form-control"
                                        placeholder="Nro de ticket"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Descripción */}
                        <div className="mb-5">
                            <label className="form-label fw-bold">Información</label>
                            <div className="border rounded p-3 bg-light">
                                <ul className="mb-0">
                                    <li><strong>Cliente:</strong> {globalParams.clientName || "-"}</li>
                                    <li><strong>Proyecto:</strong> {globalParams.projectName || "-"}</li>
                                    <li><strong>Grupo Política:</strong> {globalParams.alp || "-"}</li>
                                </ul>
                            </div>
                        </div>
                        {/* Botones */}
                        <div className="d-flex justify-content-end gap-3 mt-5">
                            <button className="btn btn-primary" disabled={!selectedCard}>Aceptar</button>
                            <button className="btn btn-secondary" onClick={handleBack}>Regresar</button>
                        </div>
                    </>
                )}

                {type === "cloud" && (
                    <div className="text-center py-10">
                        <i className="bi bi-cloud-arrow-up fs-1 mb-3 text-info"></i>
                        <h4 className="fw-bold mb-3">Solicitud de Cambio para Cloud</h4>
                        <p className="text-muted mb-5">
                            Aquí puedes implementar el formulario o mensaje específico para solicitudes Cloud.
                        </p>
                        <div className="d-flex justify-content-center gap-3">
                            <button className="btn btn-primary">Aceptar</button>
                            <button className="btn btn-secondary" onClick={handleBack}>Regresar</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
export { CreateChangeRequest }