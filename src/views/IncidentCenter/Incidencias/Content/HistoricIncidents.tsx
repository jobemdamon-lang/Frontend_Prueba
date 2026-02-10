import DataTable, { TableColumn } from "react-data-table-component"
import "../../../../assets/sass/components/InventoryFilter/table-styles.scss"
import { EmptyData } from "../../../../components/datatable/EmptyData"
import { LoadingTable } from "../../../../components/loading/LoadingTable"
import { IHistoricIncidents, IncidentCenterStates, ModalViewForIncident } from "../../Types"
import { useEffect, useState } from "react"
import { useIncidentContext } from "../Context"
import { SearchInput } from "../../../../components/SearchInput/SearchInput"
import { customStyles } from "../../../../helpers/tableStyles"
import { IModalFunctions, ModalSize } from "../../../../hooks/Types"
import { ToolTip } from "../../../../components/tooltip/ToolTip"
import { notNull } from "../../../../helpers/general"

const HistoricIncidents = () => {

    const { modalHook, useIncidentHook } = useIncidentContext()
    const { listHistoricINCLoading, listHistoricIncidents } = useIncidentHook
    const [filteredTickets, setFilteredTickets] = useState<IHistoricIncidents[]>([])
    const [searchedValue, setSearchedValue] = useState("")
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
        useIncidentHook.getListHistoricIncidents(fecha_inicio_formatted, fecha_fin_formatted)
    }

    useEffect(() => {
        setFilteredTickets(listHistoricIncidents.filter(tickets => {
            const matchesIncidentNumber = tickets.NRO_TICKET?.includes(searchedValue) ||
                tickets.PROYECTO?.toLowerCase()?.includes(searchedValue.toLowerCase()) ||
                tickets.ASIGNADO?.toLowerCase()?.includes(searchedValue.toLowerCase()) ||
                tickets.GRUPO_ASIGNADO?.toLowerCase()?.includes(searchedValue.toLowerCase()) ||
                tickets.SERVICIO_APLICATIVO_IMPACTADO?.toLowerCase()?.includes(searchedValue.toLowerCase().trim())
            return matchesIncidentNumber
        }))
    }, [listHistoricIncidents, searchedValue])

    return (
        <section>
            <div className="d-flex justify-content-end align-items-end my-3 mx-10 gap-3 flex-wrap mb-5">
                <ToolTip message="Numero de Ticket | Asignado | Grupo Asignado | Proyecto | Servicio Aplicativo Impactado" placement='top'>
                    <div>
                        <SearchInput placeholder="Numero de Ticket | Asignado | Grupo Asignado" setValue={setSearchedValue} value={searchedValue} />
                    </div>
                </ToolTip>
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
            </div>
            <div className="position-relative">
                <DataTable
                    className="table-responsive"
                    columns={HistoricIncidentsColumn(modalHook)}
                    pagination
                    highlightOnHover
                    persistTableHead
                    customStyles={customStyles}
                    disabled={listHistoricINCLoading}
                    paginationPerPage={30}
                    noDataComponent={<EmptyData loading={listHistoricINCLoading} />}
                    data={filteredTickets}
                />
                {listHistoricINCLoading && <LoadingTable description='Cargando' />}
            </div>
        </section>
    )
}
export { HistoricIncidents }

export const HistoricIncidentsColumn = (
    modalHook: IModalFunctions
): TableColumn<IHistoricIncidents>[] => [
        {
            name: 'NRO TICKET',
            width: "125px",
            cell: (row: IHistoricIncidents) => <span className="fs-6 text-center">{notNull(row.NRO_TICKET)}</span>
        },
        {
            name: <span className="text-center">NOMBRE &nbsp;PROYECTO</span>,
            width: '225px',
            cell: (row: IHistoricIncidents) => <span className="fs-7 text-center">{notNull(row.PROYECTO)}</span>
        },
        {
            name: <span className="text-center">FECHA &nbsp; REGISTRO</span>,
            sortable: true,
            width: '130px',
            cell: (row: IHistoricIncidents) => row.INICIO_INDISPONIBILIDAD ?? 'Sin registro'
        },
        {
            name: 'PRIORIDAD',
            width: '120px',
            cell: (row: IHistoricIncidents) => row.PRIORIDAD === "0" ? <span className="badge fs-8 badge-danger">PRIORIDAD 1</span> :
                row.PRIORIDAD === "1" ? <span className="badge fs-8 badge-warning">PRIORIDAD 2</span> :
                    row.PRIORIDAD === "2" ? <span className="badge fs-8 badge-warning">PRIORIDAD 3</span> :
                        <span className="badge fs-8 badge-warning">PRIORIDAD 4</span>
        },
        /*{
            name: 'CLIENTE',
            width: '170px',
            cell: (row: IHistoricIncidents) => <span className="fs-7 text-center">{notNull(row.CLIENTE)}</span>
        },*/
        {
            name: 'GRUPO',
            width: '150px',
            cell: (row: IHistoricIncidents) => <span className="fs-7 text-center">{notNull(row.GRUPO_ASIGNADO)}</span>
        },
        {
            name: 'ASIGNADO',
            width: '150px',
            cell: (row: IHistoricIncidents) => <span className="fs-7 text-center">{notNull(row.ASIGNADO)}</span>
        },
        {
            name: 'RESUMEN',
            width: '330px',
            cell: (row: IHistoricIncidents) => (
                <ToolTip message={row.DESCRIPCION} placement='top'>
                    <span className="text-info fw-bold text-center">{row.DESCRIPCION?.slice(0, 40)}...</span>
                </ToolTip>
            )
        },
        {
            name: 'SINTOMA',
            width: '250px',
            cell: (row: IHistoricIncidents) => <span className="fs-7 text-center">{notNull(row.SINTOMA)}</span>
        },
        {
            name: 'CONCLUSIÓN',
            width: '250px',
            cell: (row: IHistoricIncidents) => <span className="fs-7 text-center">{notNull(row.CONCLUSION)}</span>
        },
        {
            name: <span className="text-center">INCIDENT &nbsp; CENTER</span>,
            width: '100px',
            cell: (row: IHistoricIncidents) => (
                <span className={`badge badge-${IncidentCenterStates[row.ESTADO_INCIDENTE ? row.ESTADO_INCIDENTE?.split(" ").join("") : "FINALIZADO"]}`}>
                    {row.ESTADO_INCIDENTE ?? "FINALIZADO"}
                </span>
            )
        },
        {
            name: 'DETALLES',
            cell: (row: IHistoricIncidents) => (
                <button
                    className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                    onClick={() => modalHook.openModal(ModalViewForIncident.HISTORIC_INFO_INCIDENT, ModalSize.SM, true, row)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                    </svg>
                </button>
            )
        }
    ]