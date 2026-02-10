import { useState } from "react"
import { useServerProvisioningContext } from "../../Context"
import { formateDate, getBadgeLocation, getBadgeRequestState, getBadgeService } from "../../utils"
import { useNavigate } from "react-router-dom"
import { TableSkeleton } from "../../../../../components/datatable/TableSkeleton"
import { Pagination } from "../../../../../components/datatable/Pagination"
import { usePagination } from "../../../../../hooks/usePagination"
import { ModalSize } from "../../../../../hooks/Types"
import { ModalViewForServerProvisioning } from "../../../Types"
import { AccessController } from "../../../../../components/AccessControler"

export const Requests = () => {

    const { requestVMHook: { requestsVM, loadingRequestsVM, getRequestsVM, exportarAprovisionamiento, loadingExport }, setCurrentView, modalHook, rol } = useServerProvisioningContext()
    const navigate = useNavigate()
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchedValue, setSearchedValue] = useState('');

    // Filtrar datos
    const filteredRequests = requestsVM.filter(request => {
        const matchesStatus = selectedStatus === 'all' || request.ESTADO_SOLICITUD === selectedStatus

        // Búsqueda en múltiples campos
        const matchesSearch = !searchedValue ||
            String(request.ID_SOLICITUD).includes(searchedValue) ||
            request.PROYECTO?.toLowerCase().includes(searchedValue.toLowerCase()) ||
            request.UBICACION?.toLowerCase().includes(searchedValue.toLowerCase()) ||
            request.NRO_TICKET?.toLowerCase()?.includes(searchedValue.toLowerCase()) ||
            request.SO?.toLowerCase()?.includes(searchedValue.toLowerCase())

        // Manejo de fechas con hora
        try {
            const requestDate = new Date(request.FECHA_CREACION.replace(' ', 'T'))
            const startDateObj = startDate ? new Date(`${startDate}T00:00:00`) : null
            const endDateObj = endDate ? new Date(`${endDate}T23:59:59.999`) : null

            const matchesDate =
                (!startDateObj || requestDate >= startDateObj) &&
                (!endDateObj || requestDate <= endDateObj)

            return matchesStatus && matchesDate && matchesSearch
        } catch (e) {
            return false
        }
    })

    const {
        currentPage,
        itemsPerPage,
        currentItems,
        totalPages,
        setCurrentPage,
        setItemsPerPage,
    } = usePagination({
        data: filteredRequests,
        initialPage: 1,
        initialItemsPerPage: 10,
    });

    const styleColumn = "text-gray-800 fw-normal text-hover-primary fs-7"

    const handleExportRequests = async () => {
        await exportarAprovisionamiento({
            fecha_inicio: startDate,
            fecha_fin: endDate,
        });
    }

    return (
        <div className="card mb-5 mb-xl-8">
            <div className="card-header border-0 pt-5">
                <h3 className="card-title align-items-start flex-column">
                    <span className="card-label fw-bold fs-3 mb-1">Solicitudes de Aprovisionamiento</span>
                    <span className="text-muted mt-1 fw-semibold fs-7">
                        {loadingRequestsVM ?
                            <span className="placeholder col-3"></span> :
                            `${filteredRequests.length} SOLICITUDES`
                        }
                    </span>
                </h3>
                <div className="card-toolbar align-items-end gap-2">
                    {/* Filtros */}
                    <div className="d-flex align-items-end gap-2">
                        <div>
                            <label htmlFor="state_request" className="form-label fs-7 text-gray-700">Busqueda</label>
                            <div className="input-group">
                                <span className="input-group-text"><i className="bi bi-search fs-4"></i></span>
                                <input
                                    type="text"
                                    value={searchedValue}
                                    className="form-control form-control-sm"
                                    onChange={(e) => setSearchedValue(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="state_request" className="form-label fs-7 text-gray-700">Estado</label>
                            <select
                                className="form-select form-select-sm w-150px"
                                name="state_request"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="all">Todos los estados</option>
                                <option value="REGISTRADO">Registrado</option>
                                <option value="PENDIENTE APROBACION">Pendiente aprobación</option>
                                <option value="EN APROVISIONAMIENTO">En Aprovisionamiento</option>
                                <option value="APROVISIONADO">Aprovisionado</option>
                                <option value="APROBADO">Aprobado</option>
                                <option value="CANCELADO">Cancelado</option>
                            </select>
                        </div>
                        <div className="d-flex align-items-end gap-2">
                            <div>
                                <label htmlFor="creation_date" className="form-label fs-7 text-gray-700">Creación desde</label>
                                <input
                                    type="date"
                                    name="creation_date"
                                    className="form-control form-control-sm w-125px"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="end_date" className="form-label fs-7 text-gray-700">Creación hasta</label>
                                <input
                                    type="date"
                                    name="end-date"
                                    className="form-control form-control-sm w-125px"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex align-items-end gap-2">
                        <AccessController allowedRoles={['ejecutor', 'admin']} rol={rol}>
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={handleExportRequests}
                                disabled={loadingExport}
                            >
                                <i className="bi bi-file-earmark-arrow-down"></i>
                                {loadingExport ? ' Exportando...' : ' Exportar Solicitudes'}
                            </button>
                        </AccessController>
                        <AccessController allowedRoles={['ejecutor', 'admin']} rol={rol}>
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() => setCurrentView('create_request')}
                            >
                                <i className="bi bi-plus-square"></i>
                                Crear solicitud
                            </button>
                        </AccessController>
                        <AccessController allowedRoles={['ejecutor']} rol={rol}>
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() => modalHook.openModal(ModalViewForServerProvisioning.MANAGE_ACCOUNTS, ModalSize.LG, undefined)}
                            >
                                <i className="bi bi-gear"></i>
                                Administrar
                            </button>
                        </AccessController>
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={() => getRequestsVM()}
                        >
                            <i className="bi bi-arrow-clockwise fs-3"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="card-body py-3">
                <div className="table-responsive">
                    <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                        <thead>
                            <tr className="fw-bold text-muted">
                                <th className="w-auto">ID</th>
                                <th className="w-200px">Proyecto ALP</th>
                                <th className="w-auto">Criticidad</th>
                                <th className="w-150px">Hostname</th>
                                <th className="w-auto">Ubicación</th>
                                <th className="w-200px">S.O</th>
                                <th className="w-150px">Tipo de Servicio</th>
                                <th className="w-150px">Nro. Ticket</th>
                                <th className="w-200px">Estado Solicitud</th>
                                <th className="w-150px text-end">Datos creación</th>
                                <th className="w-150px text-end">Última actualización</th>
                                <th className="w-75px text-end">Detalle</th>
                            </tr>
                        </thead>
                        <tbody className={loadingRequestsVM ? 'placeholder-glow' : ''}>
                            {loadingRequestsVM ?
                                <TableSkeleton size={10} columns={12} />
                                :
                                currentItems.length > 0 ? (
                                    currentItems.map(request => (
                                        <tr key={request.ID_SOLICITUD}>
                                            <td>
                                                <div
                                                    className="text-gray-600 fw-bold text-hover-primary fs-6"
                                                >
                                                    #{request.ID_SOLICITUD}
                                                </div>
                                            </td>
                                            <td>
                                                <div
                                                    className={styleColumn}
                                                >
                                                    {request.PROYECTO}
                                                </div>
                                            </td>
                                            <td>
                                                <div
                                                    className="text-gray-900 fw-normal text-hover-primary d-block mb-1"
                                                >
                                                    <span className={`badge ${getBadgeLocation(request.CRITICIDAD)}`}>{request.CRITICIDAD}</span>
                                                </div>

                                            </td>
                                            <td>
                                                <div
                                                    className={`${styleColumn} fw-bold`}
                                                >
                                                    {request.HOSTNAME?.toUpperCase()}
                                                </div>
                                            </td>
                                            <td>
                                                <div
                                                    className={styleColumn}
                                                >
                                                    {request.UBICACION}
                                                </div>
                                            </td>
                                            <td>
                                                <div
                                                    className={styleColumn}
                                                >
                                                    {request.SO}
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <span
                                                        className={`badge fw-normal fs-7 ${getBadgeService(request.TIPO_SERVICIO)}`}
                                                    >
                                                        {request.TIPO_SERVICIO}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div
                                                    className={styleColumn}
                                                >
                                                    {request?.NRO_TICKET ? (
                                                        <a
                                                            href={`https://csm3.serviceaide.com/NimsoftServiceDesk/servicedesk/sso/canvia.com?redirectUrl=%2F%3FdisplayTicketType%3DChange%20Request%26ticketType%3DChangeRequest%26MdrElementID%3D${request?.MDR_ELEMENT_ID}%26MdrProduct%3DCA%253A00050%26MdrProdInstance%3D6962cb27-5309-4417-a3ae-660053962f85%23WORKSPACES-SERVICE-DESK-Ticket-Details`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            <i className="bi bi-ticket-fill fs-5 text-warning"></i>  &nbsp;
                                                            {request?.NRO_TICKET || "Sin registro"}
                                                        </a>
                                                    ) : (
                                                        <>{request?.NRO_TICKET || "Sin registro"}</>
                                                    )}

                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <span className={`badge fw-normal fs-7 ${getBadgeRequestState(request.ESTADO_SOLICITUD)}`}>
                                                        {request.ESTADO_SOLICITUD}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div
                                                    className={styleColumn}
                                                >
                                                    <div
                                                        className="fw-bold"
                                                    >
                                                        {formateDate(request.FECHA_CREACION)}
                                                    </div>
                                                    <span className="text-muted fw-semibold">
                                                        {request.USUARIO_CREACION}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div
                                                    className={styleColumn}
                                                >
                                                    <div
                                                        className="fw-bold"
                                                    >
                                                        {formateDate(request.FECHA_MODIFICACION)}
                                                    </div>
                                                    <span className="text-muted fw-semibold">
                                                        {request.USUARIO_MODIFICACION || 'No modificado'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                                                    onClick={() => navigate(`/aprovisionamiento/solicitudes?id=${request.ID_SOLICITUD}`)}
                                                >
                                                    <i className="bi bi-info-square fs-2"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={13} className="text-center py-10 fs-6 text-gray-600">
                                            No se encontraron resultados
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
                {/* Paginación */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            </div>
        </div>
    )
}
