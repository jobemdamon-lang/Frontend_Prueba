import { useEffect, useMemo, useState } from "react"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useMonitoringPoliciesContext } from "../Context"
import { Pagination } from "../../../../components/datatable/Pagination"
import { usePagination } from "../../../../hooks/usePagination"
import { useTypedSelector } from "../../../../store/ConfigStore"
import { Loader } from "../../../../components/Loading"
import { isValidTicket } from "../utils"
import { warningNotification } from "../../../../helpers/notifications"

type ModalDeleteCIProps = {
    idPolicy: number;
    idVersion: number;
}

export const DeleteCI = () => {

    const { modalHook, versionHook, changesHook, policyHook, globalParams } = useMonitoringPoliciesContext()
    const { idPolicy, idVersion }: ModalDeleteCIProps = modalHook.modalInformation
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const [selectedCIs, setSelectedCIs] = useState<number[]>([])
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [filterValue, setFilterValue] = useState("")
    const [reasonDelete, setReasonDelete] = useState("")
    const [ticket, setTicket] = useState("")

    const filteredCIs = useMemo(() => {
        return versionHook.cisInVersion.filter(ci => {
            const matchesIP = ci.IP?.includes(filterValue)
            const matchesName = ci.NOMBRE_CI?.toLowerCase().includes(filterValue.toLowerCase())
            const matchesHostname = ci.NOMBRE?.toLowerCase().includes(filterValue.toLowerCase())
            return matchesIP || matchesName || matchesHostname
        })
    }, [filterValue, versionHook.cisInVersion])

    const {
        currentPage,
        itemsPerPage,
        currentItems,
        totalPages,
        setCurrentPage,
        setItemsPerPage,
    } = usePagination({
        data: filteredCIs,
        initialPage: 1,
        initialItemsPerPage: 5
    })

    const handleSelectCI = (ciId: number) => {
        setSelectedCIs(prev =>
            prev.includes(ciId)
                ? prev.filter(id => id !== ciId)
                : [...prev, ciId]
        )
    }

    const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!isValidTicket(ticket)) {
            warningNotification("El ticket debe seguir el formato '100-12345' o '200-67890'.")
            return;
        }

        changesHook.deleteCI({
            id_politica: idPolicy,
            id_version: idVersion,
            motivo: reasonDelete,
            nro_ticket: ticket,
            usuario: userName,
            lista_baja_equipo: versionHook.cisInVersion
                .filter(ci => selectedCIs.includes(ci.ID_EQUIPO))
                .map(ci => ({ id_equipo: ci.ID_EQUIPO }))
        }).then(success => {
            if (success) {
                policyHook.getVersionsByProject(globalParams.projectID)
                changesHook.getListChanges(globalParams.projectID)
                modalHook.closeModal()
            }
        })
    }

    useEffect(() => {
        versionHook.getCIsInVersion(idPolicy, idVersion, true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idPolicy, idVersion])


    return (
        <>
            <div className='modal-header py-3'>
                <h2 className="text-dark">DAR DE BAJA CI</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            {!showConfirmation ? (
                <>
                    <div className="modal-body">
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <h5 className="fw-bold text-gray-800">Elementos de configuración monitoreados</h5>
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
                                placeholder="Ej: 10.133.15.26 o GENPRDANS01"
                                name="name"
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                            />
                        </div>
                        {versionHook.cisInVersionLoading ? (
                            <div className="modal-body d-flex flex-column align-items-center justify-content-center py-10">
                                <div className="spinner spinner-primary spinner-lg mb-5"></div>
                                <span className="text-muted fs-6">Cargando elementos de configuración...</span>
                            </div>
                        ) : (
                            <div className="border rounded mt-5 d-flex flex-column">
                                {(currentItems.length > 0) ? (
                                    currentItems.map(ci => (
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
                        )}
                        <div className="px-5">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={setItemsPerPage}
                            />
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
                        <span className="badge badge-light-danger fs-8 text-danger fw-normal">
                            <i className="bi bi-info-circle-fill fs-3 text-danger"></i> &nbsp;
                            Eliminar un CI eliminará el monitoreo de todas las métricas asociadas
                        </span>
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
                            disabled={changesHook.deleteCILoading}
                        >
                            {changesHook.deleteCILoading ? (
                                <>
                                    <Loader className="spinner-border-sm me-2" />
                                    Procesando
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-trash3 me-2"></i>
                                    Confirmar eliminación
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </>
    )
}