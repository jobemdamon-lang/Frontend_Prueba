import DataTable, { TableColumn } from "react-data-table-component"
import { EmptyData } from "../../../../components/datatable/EmptyData"
import { LoadingTable } from "../../../../components/loading/LoadingTable"
import { ModalViewForIncident, IncidentCenterStates, TicketToolStates } from "../../Types"
import { ToolTip } from "../../../../components/tooltip/ToolTip"
import { useCallback, useEffect, useState } from "react"
import { useIncidentContext } from "../Context"
import { Options } from "./Options"
import { SearchInput } from "../../../../components/SearchInput/SearchInput"
import { cloneDeep } from "lodash"
import { customStyles } from "../../../../helpers/tableStyles"
import { ModalSize } from "../../../../hooks/Types"
import { IncidentItem } from "../../Types"
import { notNull, timestampToDateTime, truncateText } from "../../../../helpers/general"

const ActiveIncidents = () => {

    const { useTicketHook, modalHook, useIncidentHook } = useIncidentContext()
    const { activeTickets, activeTicketsLoading, getClosedTickets, getActiveTickets } = useTicketHook
    const { getListHistoricIncidents } = useIncidentHook

    const [filteredTickets, setFilteredTickets] = useState<IncidentItem[]>(cloneDeep(activeTickets))
    const [searchedValue, setSearchedValue] = useState("")
    const [wantPriorityP1, setWantPriorityP1] = useState(true)
    const [wantWithTracking, setWantWithTracking] = useState(false)
    const [wantDesprioritized, setDesprioritized] = useState(false)
    const [wantClosed, setWantClosed] = useState(false)
    
    //Use Effecto que filtra los valores de los tickets por cada cambio en sus dependencias
    useEffect(() => {
        setFilteredTickets(activeTickets.filter(tickets => {
            const matchesIncidentNumber = tickets.TicketIdentifier?.includes(searchedValue) ||
                tickets.RequesterOrgName?.toLowerCase()?.includes(searchedValue.toLowerCase()) ||
                tickets.AssignedIndividual?.toLowerCase()?.includes(searchedValue.toLowerCase()) ||
                tickets.AssignedGroup?.toLowerCase()?.includes(searchedValue.toLowerCase())
            const matchesPriority = !wantPriorityP1 || tickets.PriorityCode === "1";
            const matchesDespriorization = !wantDesprioritized || tickets.IS_INICIADO === "DESPRIORIZADO";
            const matchesIsIniciado = !wantWithTracking || (tickets.IS_INICIADO === 'INICIADO' || tickets.IS_INICIADO === 'EN WAR ROOM');
            const isActive = !['resolved', 'resuelto'].includes(tickets.TicketStatus?.toLowerCase() || '');
            const matchesClosed = !wantClosed || tickets.TicketStatus?.toUpperCase() === "CLOSED";
            return matchesIncidentNumber && matchesPriority && matchesIsIniciado && matchesDespriorization && isActive && matchesClosed;
        }))
    }, [activeTickets, searchedValue, wantWithTracking, wantPriorityP1, wantDesprioritized, wantClosed])

    const handleUpdate = useCallback(() => {
        // Calcular los últimos 6 meses desde hoy
        const today = new Date()
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(today.getMonth() - 6)
        
        // Formatear como DD/MM/YYYY 
        const fecha_fin = today.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
        const fecha_inicio = sixMonthsAgo.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
        
        getActiveTickets()
        console.log('Fechas calculadas:', { fecha_inicio, fecha_fin })

        getClosedTickets(fecha_inicio, fecha_fin)
        getListHistoricIncidents()
    }, [getActiveTickets, getClosedTickets, getListHistoricIncidents])

    return (
        <section>
            <div className="d-flex justify-content-between align-items-center flex-wrap mb-5">
                <div className="d-flex justify-content-center align-items-center">
                    <button
                        className="btn btn-primary mx-10"
                        type="button"
                        onClick={() => { modalHook.openModal(ModalViewForIncident.CREATE_INCIDENT, ModalSize.LG, undefined, {}) }}
                    >
                        Crear Incidencia
                    </button>
                    <button
                        type="button"
                        className="btn btn-info"
                        onClick={handleUpdate}
                    >
                        Actualizar
                    </button>
                </div>
                <div className="d-flex justify-content-center align-items-center my-3 mx-10 gap-8 flex-wrap">
                    <div className="form-check">
                        <input
                            className="form-check-input border border-secondary"
                            type="checkbox"
                            checked={wantDesprioritized}
                            id="despriorizados"
                            onChange={() => setDesprioritized(prev => !prev)}
                        />
                        <label className="form-check-label" htmlFor="despriorizados">
                            <span className="fs-5 fw-bold" style={{ color: "gray" }}>DESPRIORIZADOS</span>
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input border border-secondary"
                            type="checkbox"
                            checked={wantClosed}
                            id="closed"
                            onChange={() => setWantClosed((prev: boolean) => !prev)}
                        />
                        <label className="form-check-label" htmlFor="closed2">
                            <span className="fs-5 fw-bold" style={{ color: "gray" }}>CERRADOS</span>
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input border border-secondary"
                            type="checkbox"
                            checked={wantPriorityP1}
                            id="priority"
                            onChange={() => setWantPriorityP1(prev => !prev)}
                        />
                        <label className="form-check-label" htmlFor="priority">
                            <span className="fs-5 fw-bold" style={{ color: "gray" }}>SOLO P1</span>
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input border border-secondary"
                            type="checkbox"
                            checked={wantWithTracking}
                            id="seguimiento"
                            onChange={() => setWantWithTracking(prev => !prev)}
                        />
                        <label className="form-check-label" htmlFor="seguimiento">
                            <span className="fs-5 fw-bold" style={{ color: "gray" }}>CON SEGUIMIENTO</span>
                        </label>
                    </div>
                    <ToolTip message="Busque coincidencias en: Nro Ticket | Organización | Grupo Asignado | Asignado " placement='top'>
                        <div>
                            <SearchInput placeholder="Ingrese su busqueda..." setValue={setSearchedValue} value={searchedValue} />
                        </div>
                    </ToolTip>
                </div>
            </div>
            <div className="position-relative">
                <DataTable
                    columns={ActiveIncidentsColumns()}
                    pagination
                    highlightOnHover
                    persistTableHead
                    disabled={activeTicketsLoading}
                    customStyles={customStyles}
                    paginationPerPage={15}
                    noDataComponent={<EmptyData loading={activeTicketsLoading} />}
                    data={filteredTickets.reverse()}
                />
                {activeTicketsLoading && <LoadingTable description='Cargando' />}
            </div>
        </section>
    )
}
export { ActiveIncidents }

export const ActiveIncidentsColumns = (): TableColumn<IncidentItem>[] => [
    {
        name: 'NRO TICKET',
        width: "170px",
        cell: (row: IncidentItem) => <span className="fs-6 text-center">{notNull(row.TicketIdentifier)}</span>
    },
    {
        name: <span className="text-center">ESTADO &nbsp; SERVICEAIDE</span>,
        width: '180px',
        cell: (row: IncidentItem) => <span className={`badge fs-7 badge-${TicketToolStates[row.TicketStatus.toUpperCase().split(" ").join("")]}`}>{row.TicketStatus}</span>
    },
    {
        name: <span className="text-center">CODIGO &nbsp; MOTIVO</span>,
        width: '180px',
        cell: (row: IncidentItem) => <span className={`badge fs-7 badge-secondary`}>{row.ReasonCode}</span>
    },
    {
        name: <span className="text-center">FECHA &nbsp; REGISTRO</span>,
        sortable: true,
        width: '150px',
        cell: (row: IncidentItem) => notNull(timestampToDateTime(parseInt(row.CreationTimestamp)))
    },
    {
        name: 'PRIORIDAD',
        width: '130px',
        cell: (row: IncidentItem) => row.PriorityCode === "1" ?
            <span className="badge fs-8 badge-danger">PRIORIDAD 1</span> :
            <span className="badge fs-8 badge-warning">PRIORIDAD 2</span>
    },
    {
        name: 'ORGANIZACIÓN',
        cell: (row: IncidentItem) => (
            <ToolTip message={row.RequesterOrgName} placement='top'>
                <span className="text-info fw-bold text-center">{truncateText(row.RequesterOrgName, 40)}</span>
            </ToolTip>
        )
    },
    {
        name: 'GRUPO',
        width: '100px',
        cell: (row: IncidentItem) => <span className="fs-7 text-center">{notNull(row.AssignedGroup)}</span>
    },
    {
        name: 'ASIGNADO',
        cell: (row: IncidentItem) => <span className="fs-7 text-center">{notNull(row.AssignedIndividual)}</span>
    },
    {
        name: 'RESUMEN',
        cell: (row: IncidentItem) => (
            <ToolTip message={row.Description} placement='top'>
                <span className="text-info fw-bold text-center">{truncateText(row.Description, 40)}</span>
            </ToolTip>
        )
    },
    {
        name: <span className="text-center">INCIDENT &nbsp; CENTER</span>,
        width: '100px',
        cell: (row: IncidentItem) => {
            const estado = row.IS_INICIADO ?? "Sin registro";
            return <span className={`badge badge-${IncidentCenterStates[estado.split(" ").join("")]}`}>{estado}</span>
        }
    },
    {
        name: 'ACCIONES',
        cell: (row: IncidentItem) => <Options rowInformation={row} />
    }
]