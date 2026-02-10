import type React from "react"
import { Ejecucion, RequestVM } from "../../Types"
import { useServerProvisioningContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useEffect } from "react"

export const ProvisioningProgress: React.FC = () => {
    const { modalHook, requestVMHook: { getProgressExecution, loadingProgress, progressExecution } } = useServerProvisioningContext()
    const requestInformation: RequestVM = modalHook.modalInformation

    useEffect(() => {
        getProgressExecution(requestInformation.EJECUCION.ID_EJECUCION)
    }, [getProgressExecution, requestInformation.EJECUCION.ID_EJECUCION])

    return (
        <>
            <div className='modal-header py-4'>
                <h2 className="text-dark">PROGRESO DE APROVISIONAMIENTO</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className="modal-body">
                {loadingProgress ? (
                    <div className="d-flex justify-content-center align-items-center py-15">
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-3 text-muted">Cargando progreso...</p>
                        </div>
                    </div>
                ) : !progressExecution?.length ? (
                    <div className="text-center py-5">
                        <i className="bi bi-hourglass-split text-muted" style={{ fontSize: "3rem" }}></i>
                        <p className="mt-3">No hay datos de ejecución disponibles.</p>
                    </div>
                ) : (
                    <div className="timeline-container">
                        <div className="d-flex justify-content-around">
                            <div className="text-center">
                                <i className="bi bi-circle-fill fs-3 text-success me-3"></i>
                                <span className="text-muted mb-3">Tarea preaprobada automatizada</span>
                            </div>
                            <div className="text-center mb-5">
                                <i className="bi bi-circle-fill fs-3 text-primary me-3"></i>
                                <span className="text-muted mb-3">Tarea extra informativa</span>
                            </div>
                        </div>
                        <div style={{ textAlign: "end" }} className="pe-10">
                            <a
                                href={`http://awx.cloud.canvia.com/#/jobs/playbook/${requestInformation.EJECUCION.IDAWX}/output`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Ver detalle en AWX
                            </a>
                        </div>
                        {progressExecution.map((step: Ejecucion, index: number) => (
                            <div
                                key={index}
                                className={`timeline-item mb-3 ${step.es_tarea ? "border-success" : "border-primary"}`}
                                style={{
                                    borderLeft: `3px solid ${step.success ? "var(--bs-success)" : "var(--bs-danger)"}`,
                                    paddingLeft: "15px",
                                    position: "relative",
                                }}
                            >
                                <div
                                    className="timeline-marker"
                                    style={{
                                        position: "absolute",
                                        left: "-8px",
                                        top: "0",
                                        width: "13px",
                                        height: "13px",
                                        borderRadius: "50%",
                                        backgroundColor: step.es_tarea ? "var(--bs-success)" : "var(--bs-primary)",
                                    }}
                                ></div>

                                <div className="card">
                                    <div
                                        className={`card-header d-flex flex-column justify-content-center align-items-start ${step.success ? "bg-success bg-opacity-10" : "bg-danger bg-opacity-10"}`}
                                    >
                                        <div className="d-flex align-items-center">
                                            <i
                                                className={`bi ${step.success ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger"} me-2`}
                                            ></i>
                                            <span className="fw-normal fs-6">{step.step_name}</span>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between w-100">
                                            <p className="card-text text-gray-800 m-0">{step.mensaje}</p>
                                            <small className="text-muted">{step.hora}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}