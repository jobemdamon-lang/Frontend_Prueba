import { useState } from "react"
import { useBackupsPoliciesContext } from "../Context"
import { KTSVG } from "../../../../helpers";

export const DeleteCI = () => {
    const { modalHook } = useBackupsPoliciesContext();

    // TODO: Reemplazar estos estados y handlers con los del contexto de backup cuando estén disponibles
    const [selectedCIs, setSelectedCIs] = useState<number[]>([])
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [filterValue, setFilterValue] = useState("")
    const [reasonDelete, setReasonDelete] = useState("")
    const [ticket, setTicket] = useState("")

    // TODO: Reemplazar con datos reales de CIs de backup
    const dummyCIs = [
        { ID_EQUIPO: 1, NOMBRE_CI: "BackupServer01", IP: "10.0.0.1", NOMBRE: "SRV-BACKUP-01", FAMILIA: "Servidor", CLASE: "Backup" },
        { ID_EQUIPO: 2, NOMBRE_CI: "BackupServer02", IP: "10.0.0.2", NOMBRE: "SRV-BACKUP-02", FAMILIA: "Servidor", CLASE: "Backup" },
    ]

    const filteredCIs = dummyCIs.filter(ci =>
        ci.IP.includes(filterValue) ||
        ci.NOMBRE_CI.toLowerCase().includes(filterValue.toLowerCase()) ||
        ci.NOMBRE.toLowerCase().includes(filterValue.toLowerCase())
    )

    const handleSelectCI = (ciId: number) => {
        setSelectedCIs(prev =>
            prev.includes(ciId)
                ? prev.filter(id => id !== ciId)
                : [...prev, ciId]
        )
    }

    const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // TODO: Validar ticket y motivo, llamar función de eliminación real
        alert("Eliminaría los CIs: " + selectedCIs.join(", "))
    }

    return (
        <>
            <div className='modal-header py-3'>
                <h2 className="text-dark">DAR DE BAJA CI (Backup)</h2>
                <div 
                    className='btn btn-sm btn-icon btn-active-color-primary'
                    onClick={() => modalHook.closeModal()}
                >
                    <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                </div>
            </div>
            {!showConfirmation ? (
                <>
                    <div className="modal-body">
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <h5 className="fw-bold text-gray-800">Elementos de configuración de backup</h5>
                            <span className="badge badge-light-primary fs-7">
                                {selectedCIs.length} seleccionados
                            </span>
                        </div>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="bi bi-search fs-2"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por IP o nombre"
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                            />
                        </div>
                        <div className="border rounded mt-5 d-flex flex-column">
                            {(filteredCIs.length > 0) ? (
                                filteredCIs.map(ci => (
                                    <div
                                        key={ci.ID_EQUIPO}
                                        className={`p-5 border-bottom ${selectedCIs.includes(ci.ID_EQUIPO) ? 'bg-light-primary' : ''}`}
                                        onClick={() => handleSelectCI(ci.ID_EQUIPO)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className="form-check form-check-custom form-check-solid me-5">
                                                <input
                                                    className="form-check-input h-20px w-20px"
                                                    type="checkbox"
                                                    checked={selectedCIs.includes(ci.ID_EQUIPO)}
                                                    onChange={() => { }}
                                                />
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="d-flex text-gray-800 fs-6">
                                                    <div className="me-6">
                                                        {ci.NOMBRE_CI}
                                                    </div>
                                                    <div className="me-6">
                                                        <i className="bi bi-hdd-network me-2"></i>
                                                        {ci.IP}
                                                    </div>
                                                </div>
                                                <div className="d-flex gap-5 text-muted">
                                                    <div>
                                                        <i className="bi bi-diagram-3 me-2"></i>
                                                        {ci.FAMILIA} / {ci.CLASE}
                                                    </div>
                                                    <div>
                                                        <i className="bi bi-file-text me-2"></i>
                                                        {ci.NOMBRE}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-muted">
                                    <i className="bi bi-search fs-3x opacity-50"></i>
                                    <div className="fw-bold fs-5 mt-3">No se encontraron resultados</div>
                                    <div className="fs-7">Intenta con otro término de búsqueda</div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer border-0">
                        <button
                            type="button"
                            className="btn btn-light-primary"
                            onClick={() => setSelectedCIs([])}
                            disabled={selectedCIs.length === 0}
                        >
                            Deseleccionar todos
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            disabled={selectedCIs.length === 0}
                            onClick={() => setShowConfirmation(true)}
                        >
                            <i className="bi bi-trash3 me-2"></i>
                            Eliminar seleccionados
                        </button>
                    </div>
                </>
            ) : (
                <form onSubmit={handleDelete}>
                    <div className="modal-body d-flex justify-content-center flex-column align-items-center">
                        <div className="text-center mb-4">
                            <div className="bg-light-danger rounded-circle d-inline-flex p-3 mb-3">
                                <i className="bi bi-trash3 fs-2hx text-danger"></i>
                            </div>
                            <h3 className="fw-bold mb-3">Confirmar eliminación</h3>
                            <div className="text-muted fs-5">
                                Estás a punto de eliminar <strong>{selectedCIs.length}</strong> elementos de configuración
                            </div>
                        </div>
                        <div className="col-12 col-md-6 mt-5">
                            <label htmlFor="reason" className="form-label">Motivo de Cambio</label>
                            <div className="input-group input-group-sm">
                                <span className="input-group-text">
                                    <i className="bi bi-chat-square-text"></i>
                                </span>
                                <input
                                    type="text"
                                    id="reason"
                                    className="form-control"
                                    placeholder="Ingrese el motivo"
                                    value={reasonDelete}
                                    onChange={(e) => setReasonDelete(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-12 col-md-6 mt-3">
                            <label htmlFor="ticket_reason" className="form-label">Ticket Motivo</label>
                            <div className="input-group input-group-sm">
                                <span className="input-group-text">
                                    <i className="bi bi-chat-square-text"></i>
                                </span>
                                <input
                                    type="text"
                                    id="ticket_reason"
                                    className="form-control"
                                    placeholder="Nro de ticket"
                                    value={ticket}
                                    onChange={(e) => setTicket(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-6 d-flex justify-content-center">
                            <label className="form-check form-check-custom form-check-solid">
                                <input className="form-check-input" type="checkbox" required />
                                <span className="form-check-label text-gray-800">
                                    Confirmo que entiendo las consecuencias de esta acción
                                </span>
                            </label>
                        </div>
                    </div>
                    <div className="modal-footer border-0">
                        <button
                            type="button"
                            className="btn btn-light-primary"
                            onClick={() => setShowConfirmation(false)}
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Volver atrás
                        </button>
                        <button
                            type="submit"
                            className="btn btn-danger"
                        >
                            <i className="bi bi-trash3 me-2"></i>
                            Confirmar eliminación
                        </button>
                    </div>
                </form>
            )}
        </>
    )
}