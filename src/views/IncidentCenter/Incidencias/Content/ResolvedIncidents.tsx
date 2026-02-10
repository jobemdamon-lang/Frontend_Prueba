import DataTable, { TableColumn } from "react-data-table-component"
import { EmptyData } from "../../../../components/datatable/EmptyData"
import { LoadingTable } from "../../../../components/loading/LoadingTable"
import { ToolTip } from "../../../../components/tooltip/ToolTip"
import { useEffect, useState } from "react"
import { useIncidentContext } from "../Context"
import { SearchInput } from "../../../../components/SearchInput/SearchInput"
import { customStyles } from "../../../../helpers/tableStyles"
import { IncidentCenterStates, IncidentItem, TicketToolStates } from "../../Types"
import { ReopenButton } from "./Options"
import { notNull, timestampToDateTime, truncateText } from "../../../../helpers/general"

const ResolvedIncidents = () => {
    const { useTicketHook } = useIncidentContext()
    const { finalizedTickets, finalizedTicketsLoading, getClosedTickets, exportTableFiltered, exportFilteredLoading } = useTicketHook
    
    const [filteredTickets, setFilteredTickets] = useState<IncidentItem[]>([])
    const [searchedValue, setSearchedValue] = useState("")
    const [wantPriorityP1, setWantPriorityP1] = useState(true)
    const [wantWithTracking, setWantWithTracking] = useState(false)
    const [wantDesprioritized, setDesprioritized] = useState(false)
    const [wantClosed, setWantClosed] = useState(false)
    const [fecha_inicio, setFecha_inicio] = useState("")
    const [fecha_fin, setFecha_fin] = useState("")

    const formatDate = (dateString: string) => {
        if (!dateString) return ""
        const [year, month, day] = dateString.split('-')
        return `${day}/${month}/${year}`
    }

    const handleDateSearch = () => {
        const fecha_inicio_formatted = formatDate(fecha_inicio)
        const fecha_fin_formatted = formatDate(fecha_fin)
        getClosedTickets(fecha_inicio_formatted, fecha_fin_formatted)
    }

    useEffect(() => {
        const matchesSearch = (ticket: IncidentItem) => {
            const searchLower = searchedValue.toLowerCase()
            return ticket.TicketIdentifier?.includes(searchedValue) ||
                ticket.RequesterOrgName?.toLowerCase()?.includes(searchLower) ||
                ticket.AssignedIndividual?.toLowerCase()?.includes(searchLower) ||
                ticket.AssignedGroup?.toLowerCase()?.includes(searchLower)
        }

        const matchesFilters = (ticket: IncidentItem) => {
            const matchesPriority = !wantPriorityP1 || ticket.PriorityCode === "1"
            const matchesDespriorization = !wantDesprioritized || ticket.IS_INICIADO === "DESPRIORIZADO"
            const matchesTracking = !wantWithTracking || 
                ['INICIADO', 'EN WAR ROOM', 'FINALIZADO'].includes(ticket.IS_INICIADO)
            const matchesClosed = !wantClosed || ticket.TicketStatus?.toUpperCase() === "CLOSED"
            
            return matchesPriority && matchesDespriorization && matchesTracking && matchesClosed
        }

        setFilteredTickets(
            finalizedTickets.filter(ticket => matchesSearch(ticket) && matchesFilters(ticket))
        )
    }, [finalizedTickets, searchedValue, wantPriorityP1, wantWithTracking, wantDesprioritized, wantClosed])

    const FilterCheckbox = ({ id, label, checked, onChange }: { 
        id: string
        label: string
        checked: boolean
        onChange: () => void 
    }) => (
        <div className="form-check">
            <input
                className="form-check-input border border-secondary"
                type="checkbox"
                checked={checked}
                id={id}
                onChange={onChange}
            />
            <label className="form-check-label" htmlFor={id}>
                <span className="fs-5 fw-bold" style={{ color: "gray" }}>{label}</span>
            </label>
        </div>
    )

    return (
        <section>
            <div className="d-flex justify-content-between align-items-end my-3 mx-10 gap-3 flex-wrap mb-3">
                <div className="d-flex gap-8 flex-wrap align-items-center">
                    <FilterCheckbox 
                        id="despriorization2" 
                        label="DESPRIORIZADOS" 
                        checked={wantDesprioritized} 
                        onChange={() => setDesprioritized(prev => !prev)} 
                    />
                    <FilterCheckbox 
                        id="closed2" 
                        label="CERRADOS" 
                        checked={wantClosed} 
                        onChange={() => setWantClosed(prev => !prev)} 
                    />
                    <FilterCheckbox 
                        id="priority2" 
                        label="SOLO P1" 
                        checked={wantPriorityP1} 
                        onChange={() => setWantPriorityP1(prev => !prev)} 
                    />
                    <FilterCheckbox 
                        id="seguimiento2" 
                        label="CON SEGUIMIENTO" 
                        checked={wantWithTracking} 
                        onChange={() => setWantWithTracking(prev => !prev)} 
                    />
                    <ToolTip message="Busque coincidencias en: Nro Ticket | ALP | Proyecto | Grupo Asignado | Asignado | Jefe | Gerente" placement='top'>
                        <div>
                            <SearchInput placeholder="Ingrese su busqueda..." setValue={setSearchedValue} value={searchedValue} />
                        </div>
                    </ToolTip>
                </div>
                
                <div className="d-flex gap-3 align-items-end">
                    <div className="d-flex flex-column">
                        <label className="form-label mb-1 fs-7 fw-bold">Fecha Inicio</label>
                        <input
                            type="date"
                            className="form-control form-control"
                            value={fecha_inicio}
                            onChange={(e) => setFecha_inicio(e.target.value)}
                        />
                    </div>
                    <div className="d-flex flex-column">
                        <label className="form-label mb-1 fs-7 fw-bold">Fecha Fin</label>
                        <input
                            type="date"
                            className="form-control form-control"
                            value={fecha_fin}
                            onChange={(e) => setFecha_fin(e.target.value)}
                        />
                    </div>
                    <button
                        className="btn btn-primary btn"
                        onClick={handleDateSearch}
                        disabled={!fecha_inicio || !fecha_fin}
                    >
                        Buscar
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={() => exportTableFiltered(filteredTickets)}
                        disabled={exportFilteredLoading || filteredTickets.length === 0}
                    >
                        {exportFilteredLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Exportando...
                            </>
                        ) : (
                            "Exportar Filtrados"
                        )}
                    </button>
                </div>
            </div>

            <div className="position-relative">
                <DataTable
                    columns={RemedyIncidentsFinalizedColumns()}
                    pagination
                    highlightOnHover
                    persistTableHead
                    customStyles={customStyles}
                    disabled={finalizedTicketsLoading}
                    noDataComponent={<EmptyData loading={finalizedTicketsLoading} />}
                    data={filteredTickets.reverse()}
                />
                {finalizedTicketsLoading && <LoadingTable description='Cargando' />}
            </div>
        </section>
    )
}
export { ResolvedIncidents }

export const RemedyIncidentsFinalizedColumns = (): TableColumn<IncidentItem>[] => [
    {
        name: 'NRO TICKET',
        width: "170px",
        cell: (row: IncidentItem) => <span className="fs-6 text-center">{notNull(row.TicketIdentifier)}</span>
    },
    {
        name: <span className="text-center">ESTADO &nbsp;SERVICEAIDE</span>,
        width: '180px',
        cell: (row: IncidentItem) => <span className={`badge fs-7 badge-${TicketToolStates[row.TicketStatus.toUpperCase().split(" ").join("")]}`}>{row.TicketStatus}</span>
    },
    {
        name: <span className="text-center">CODIGO &nbsp;MOTIVO</span>,
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
        cell: (row: IncidentItem) => (
            <span className={`badge badge-${IncidentCenterStates[row.IS_INICIADO.split(" ").join("")]}`}>
                {row.IS_INICIADO}
            </span>
        )
    },
    {
        name: 'REABRIR',
        cell: (row: IncidentItem) => <ReopenButton rowInformation={row} />
    }
]