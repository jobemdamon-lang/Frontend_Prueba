import { KTSVG } from "../../../../helpers"
import { Recommendation } from "../../Types"
import { useServerProvisioningContext } from "../Context"

export const RecommendationResult = () => {
    const { modalHook } = useServerProvisioningContext()
    const recommended: {
        recommended: Recommendation | null;
        message: string;
        requestedStorageGB: number;
        requestedRAMMB: number;
        requestedCPUCores: number;
    } = modalHook.modalInformation

    if (!recommended.recommended) {
        return (
            <>
                <div className='modal-header py-4'>
                    <h2 className="text-dark">NO SE ENCONTRÓ DISPONIBILIDAD PARA APROVISIONAR</h2>
                    <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                        <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                    </div>
                </div>
                <div className='modal-body pt-3 px-10 d-flex flex-column align-items-center'>
                    <div className="d-flex flex-column">
                        <div className="text-center my-3">
                            <span className="svg-icon svg-icon-5tx svg-icon-success">
                                <i className="bi bi-x-square fs-1 text-danger"></i>
                            </span>
                        </div>
                        <div className="text-center mb-5">
                            <h4 className="mb-1">No hay disponibilidad en los recursos</h4>
                            <p className="text-gray-500">{recommended.message || "No se encontró un cluster con recursos suficientes para aprovisionar la máquina virtual."}</p>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const rec = recommended.recommended

    // Calcular valores actuales y futuros
    const storageCurrent = (rec.datastore_occuped_space_gb * 100) / rec.datastore_capacity_gb
    const storageFuture = rec.datastore_pct_future_occuped_space_gb

    const ramCurrent = (rec.cluster_used_ram_mb * 100) / rec.cluster_total_ram_mb
    const ramFuture = rec.cluster_pct_future_occuped_ram_mb

    const mhz_peer_cpu = (rec.cluster_total_cpu_mhz / rec.cluster_total_cores)
    const cpuCurrent = (rec.cluster_used_cpu_mhz * 100) / rec.cluster_total_cpu_mhz
    const cpuFuture = rec.cluster_pct_future_occuped_cpu_mhz;

    // Determinar si cada recurso excede el límite
    const storageExceeded = storageFuture > 80;
    const ramExceeded = ramFuture > 80;
    const cpuExceeded = cpuFuture > 80;

    return (
        <>
            <div className='modal-header py-4'>
                <h2 className="text-dark">NO SE ENCONTRÓ DISPONIBILIDAD PARA APROVISIONAR</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body pt-3 px-10'>
                <div className="text-center my-3">
                    <i className="bi bi-x-circle-fill fs-1 text-danger"></i>
                </div>

                <div className="text-center mb-6">
                    <h4 className="mb-1">No hay recursos suficientes para aprovisionar</h4>
                    <p className="text-gray-500">El aprovisionamiento excedería la capacidad disponible en uno o más recursos críticos.</p>
                </div>
                {/* Resumen de lo solicitado */}
                <div className="card card-dashed mb-8">
                    <div className="card-header min-h-50px">
                        <h3 className="card-title fw-bold">Recursos Solicitados</h3>
                    </div>
                    <div className="card-body py-4">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="d-flex align-items-center">
                                    <div className="symbol symbol-40px me-4">
                                        <span className="symbol-label bg-light-primary">
                                            <i className="bi bi-hdd-fill text-primary fs-3"></i>
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <span className="fw-bold fs-5">{recommended.requestedStorageGB} GB</span>
                                        <span className="text-muted">Almacenamiento solicitado</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="d-flex align-items-center">
                                    <div className="symbol symbol-40px me-4">
                                        <span className="symbol-label bg-light-success">
                                            <i className="bi bi-memory text-success fs-3"></i>
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <span className="fw-bold fs-5">{recommended.requestedRAMMB} GB</span>
                                        <span className="text-muted">RAM solicitada</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="d-flex align-items-center">
                                    <div className="symbol symbol-40px me-4">
                                        <span className="symbol-label bg-light-info">
                                            <i className="bi bi-cpu text-info fs-3"></i>
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <span className="fw-bold fs-5">{recommended.requestedCPUCores} ({recommended.requestedCPUCores * mhz_peer_cpu} MHz)</span>
                                        <span className="text-muted">CPU solicitado</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row g-6 mb-6">
                    {/* Almacenamiento */}
                    <div className="col-xl-4">
                        <div className={`card card-dashed h-xl-100 px-2 py-3 ${storageExceeded ? 'card-flush border-danger' : ''}`}>
                            <div className="card-header rounded border-0">
                                <h3 className="card-title align-items-start flex-column">
                                    <span className="card-label fw-bold text-dark">Almacenamiento</span>
                                    <span className="text-gray-400 mt-1 fw-semibold fs-6">Datastore: {rec.datastore}</span>
                                </h3>
                            </div>
                            <div className="card-body pt-4">
                                <div className="d-flex flex-column">
                                    <div className="d-flex align-items-center mb-4">
                                        <div className="symbol symbol-45px me-4">
                                            <span className="symbol-label bg-lighten">
                                                <i className="bi bi-hdd-fill text-primary fs-1"></i>
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column">
                                            <span className="fw-bold fs-5">{rec.datastore_capacity_gb} GB Total</span>
                                            <span className="text-muted fw-semibold">{rec.datastore_occuped_space_gb} GB Usados</span>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="fw-semibold text-muted">Uso actual</span>
                                        <span className="fw-bold">{storageCurrent.toFixed(1)}%</span>
                                    </div>
                                    <div className="progress h-8px mb-5">
                                        <div
                                            className="progress-bar bg-primary"
                                            role="progressbar"
                                            style={{ width: `${Math.min(storageCurrent, 100)}%` }}
                                            aria-valuenow={storageCurrent}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        ></div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="fw-semibold text-muted">Uso después del aprovisionamiento</span>
                                        <span className={`fw-bold ${storageExceeded ? 'text-danger' : ''}`}>
                                            {storageFuture.toFixed(1)}%
                                            {storageExceeded && <i className="bi bi-exclamation-triangle-fill ms-1 text-danger"></i>}
                                        </span>
                                    </div>
                                    <div className="progress h-8px">
                                        <div
                                            className={`progress-bar ${storageExceeded ? 'bg-danger' : 'bg-success'}`}
                                            role="progressbar"
                                            style={{ width: `${Math.min(storageFuture, 100)}%` }}
                                            aria-valuenow={storageFuture}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        ></div>
                                        {storageExceeded && (
                                            <div className="text-danger mt-1 fs-7">
                                                Excede la capacidad disponible
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RAM */}
                    <div className="col-xl-4">
                        <div className={`card card-dashed h-xl-100 px-2 py-3 ${ramExceeded ? 'card-flush border-danger' : ''}`}>
                            <div className="card-header rounded border-0">
                                <h3 className="card-title align-items-start flex-column">
                                    <span className="card-label fw-bold text-dark">Memoria RAM</span>
                                    <span className="text-gray-400 mt-1 fw-semibold fs-6">Cluster: {rec.cluster}</span>
                                </h3>
                            </div>
                            <div className="card-body pt-4">
                                <div className="d-flex flex-column">
                                    <div className="d-flex align-items-center mb-4">
                                        <div className="symbol symbol-45px me-4">
                                            <span className="symbol-label bg-lighten">
                                                <i className="bi bi-memory text-success fs-1"></i>
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column">
                                            <span className="fw-bold fs-5">{Math.round(rec.cluster_total_ram_mb / 1024)} GB Total</span>
                                            <span className="text-muted fw-semibold">{Math.round(rec.cluster_used_ram_mb / 1024)} GB Usados</span>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="fw-semibold text-muted">Uso actual</span>
                                        <span className="fw-bold">{ramCurrent.toFixed(1)}%</span>
                                    </div>
                                    <div className="progress h-8px mb-5">
                                        <div
                                            className="progress-bar bg-success"
                                            role="progressbar"
                                            style={{ width: `${Math.min(ramCurrent, 100)}%` }}
                                            aria-valuenow={ramCurrent}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        ></div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="fw-semibold text-muted">Uso después del aprovisionamiento</span>
                                        <span className={`fw-bold ${ramExceeded ? 'text-danger' : ''}`}>
                                            {ramFuture.toFixed(1)}%
                                            {ramExceeded && <i className="bi bi-exclamation-triangle-fill ms-1 text-danger"></i>}
                                        </span>
                                    </div>
                                    <div className="progress h-8px">
                                        <div
                                            className={`progress-bar ${ramExceeded ? 'bg-danger' : 'bg-success'}`}
                                            role="progressbar"
                                            style={{ width: `${Math.min(ramFuture, 100)}%` }}
                                            aria-valuenow={ramFuture}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        ></div>
                                        {ramExceeded && (
                                            <div className="text-danger mt-1 fs-7">
                                                Excede la capacidad disponible
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CPU */}
                    <div className="col-xl-4">
                        <div className={`card card-dashed h-xl-100 px-2 py-3 ${cpuExceeded ? 'card-flush border-danger' : ''}`}>
                            <div className="card-header rounded border-0">
                                <h3 className="card-title align-items-start flex-column">
                                    <span className="card-label fw-bold text-dark">CPU</span>
                                    <span className="text-gray-400 mt-1 fw-semibold fs-6">Cluster: {rec.cluster}</span>
                                </h3>
                            </div>
                            <div className="card-body pt-4">
                                <div className="d-flex flex-column">
                                    <div className="d-flex align-items-center mb-4">
                                        <div className="symbol symbol-45px me-4">
                                            <span className="symbol-label bg-lighten">
                                                <i className="bi bi-cpu text-info fs-1"></i>
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column">
                                            <span className="fw-bold fs-5">{rec.cluster_total_cores} Núcleos</span>
                                            <span className="text-muted fw-semibold">{rec.cluster_used_cores} Núcleos Usados</span>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="fw-semibold text-muted">Uso actual (MHz)</span>
                                        <span className="fw-bold">{cpuCurrent.toFixed(1)}%</span>
                                    </div>
                                    <div className="progress h-8px mb-5">
                                        <div
                                            className="progress-bar bg-info"
                                            role="progressbar"
                                            style={{ width: `${Math.min(cpuCurrent, 100)}%` }}
                                            aria-valuenow={cpuCurrent}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        ></div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="fw-semibold text-muted">Uso después del aprovisionamiento</span>
                                        <span className={`fw-bold ${cpuExceeded ? 'text-danger' : ''}`}>
                                            {cpuFuture.toFixed(1)}%
                                            {cpuExceeded && <i className="bi bi-exclamation-triangle-fill ms-1 text-danger"></i>}
                                        </span>
                                    </div>
                                    <div className="progress h-8px">
                                        <div
                                            className={`progress-bar ${cpuExceeded ? 'bg-danger' : 'bg-info'}`}
                                            role="progressbar"
                                            style={{ width: `${Math.min(cpuFuture, 100)}%` }}
                                            aria-valuenow={cpuFuture}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        ></div>
                                        {cpuExceeded && (
                                            <div className="text-danger mt-1 fs-7">
                                                Excede la capacidad disponible
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}