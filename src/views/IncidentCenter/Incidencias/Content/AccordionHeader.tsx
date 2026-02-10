import { useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { KTSVG } from '../../../../helpers'
import { useIncidentContext } from '../Context'
import { customStyles } from '../../../../helpers/tableStyles'
import { OverlayTrigger, Tooltip } from "react-bootstrap";

// Interfaz para el tipo de datos de la respuesta
interface IncidentSearchResult {
    ASIGNADO: string | null
    CLIENTE: string
    CONCLUSION: string
    DESCRIPCION: string
    ESTADO_INCIDENTE: string
    GRUPO_ASIGNADO: string | null
    INICIO_INDISPONIBILIDAD: string
    MdrElementID: string
    NRO_TICKET: string
    PRIORIDAD: string
    PROYECTO: string | null
    Priority: string
    ReasonCode: string
    SERVICIO_APLICATIVO_IMPACTADO: string
    SINTOMA: string
    TicketStatus: string
}

const AccordionHeader = () => {
    const { useIncidentHook } = useIncidentContext()
    const { exportIncidents, exportIncidentsLoading, getInfoIncidentWithServiceAideData, incidentInfoLoadingv2 } = useIncidentHook
    const [fecha_inicio, setFecha_inicio] = useState("")
    const [fecha_fin, setFecha_fin] = useState("")
    const [ticketNumber, setTicketNumber] = useState("")
    const [searchResult, setSearchResult] = useState<IncidentSearchResult | null>(null)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const handleExport = () => {
        const fecha_inicio_formatted = formatDate(fecha_inicio)
        const fecha_fin_formatted = formatDate(fecha_fin)

        exportIncidents(fecha_inicio_formatted, fecha_fin_formatted)
    }

    const handleTicketSearch = async () => {
        setErrorMsg(null)
        const result = await getInfoIncidentWithServiceAideData(ticketNumber.trim())
        if (result && result.success) {
            setSearchResult(result.data)
        } else {
            setSearchResult(null)
            setErrorMsg(result?.mensaje || "No se encontró información para el ticket ingresado.")
        }
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return ""
        const [year, month, day] = dateString.split('-')
        return `${day}/${month}/${year}`
    }

    // Definición de las columnas para la tabla estándar
    const columns: TableColumn<IncidentSearchResult>[] = [
        {
            name: 'Nro Ticket',
            selector: (row) => row.NRO_TICKET,
            sortable: true,
            width: '120px'
        },
        {
            name: 'Cliente',
            selector: (row) => row.CLIENTE,
            sortable: true,
            width: '150px'
        },
        {
            name: 'Estado',
            selector: (row) => row.ESTADO_INCIDENTE,
            sortable: true,
            width: '120px'
        },
        {
            name: 'Prioridad',
            selector: (row) => row.Priority,
            sortable: true,
            width: '120px'
        },
        {
            name: 'Síntoma',
            selector: (row) => row.SINTOMA,
            sortable: true,
            width: '120px'
        },
        {
            name: 'Servicio Impactado',
            selector: (row) => row.SERVICIO_APLICATIVO_IMPACTADO,
            sortable: true,
            wrap: true,
            width: '200px'
        },
        {
            name: 'Inicio Indisponibilidad',
            selector: (row) => row.INICIO_INDISPONIBILIDAD,
            sortable: true,
            width: '180px'
        },
        {
            name: 'Asignado',
            selector: (row) => row.ASIGNADO || 'Sin asignar',
            sortable: true,
            width: '120px'
        },
        {
            name: 'Descripción',
            selector: (row) => row.DESCRIPCION,
            wrap: true,
            width: '250px'
        }
    ]

    return (
        <div className='accordion' id='kt_accordion_incidents'>
            <div className='accordion-item'>
                <h2 className='accordion-header' id='kt_accordion_incidents_header_1'>
                    <button
                        className='accordion-button fs-4 fw-bold collapsed bg-dark bg-gradient'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#kt_accordion_incidents_body_1'
                        aria-expanded='false'
                        aria-controls='kt_accordion_incidents_body_1'
                    >
                        <div className='d-flex flex-row w-100'>
                            <span className='card-title fw-bolder mb-0 mx-5 text-white'>Opciones Avanzadas</span>
                            <KTSVG path='/media/icons/duotune/general/gen019.svg' className='svg-icon-2' />
                        </div>
                    </button>
                </h2>
                <div
                    id='kt_accordion_incidents_body_1'
                    className='accordion-collapse collapse'
                    aria-labelledby='kt_accordion_incidents_header_1'
                    data-bs-parent='#kt_accordion_incidents'
                >
                    <div className='accordion-body'>
                        <div className='d-flex justify-content-between align-items-end flex-wrap gap-3'>
                            {/* Grupo izquierdo - Exportar con fechas */}
                            <div className='d-flex gap-3 align-items-end'>
                                <div className='d-flex flex-column'>
                                    <label className='form-label mb-1 fs-6 fw-bold'>Fecha Inicio</label>
                                    <input
                                        type='date'
                                        className='form-control'
                                        placeholder='Fecha inicio'
                                        value={fecha_inicio}
                                        onChange={(e) => setFecha_inicio(e.target.value)}
                                    />
                                </div>
                                <div className='d-flex flex-column'>
                                    <label className='form-label mb-1 fs-6 fw-bold'>Fecha Fin</label>
                                    <input
                                        type='date'
                                        className='form-control'
                                        placeholder='Fecha fin'
                                        value={fecha_fin}
                                        onChange={(e) => setFecha_fin(e.target.value)}
                                    />
                                </div>
                                <button 
                                    className='btn btn-success'
                                    onClick={handleExport}
                                    disabled={!fecha_inicio || !fecha_fin || exportIncidentsLoading}
                                >
                                    {exportIncidentsLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Exportando...
                                        </>
                                    ) : (
                                        "Exportar"
                                    )}
                                </button>
                                <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                        <Tooltip id="tooltip-exportar" className="bg-light text-dark border">
                                            <ul className="mb-0 ps-3 text-start small">
                                                <li><strong>Exportar:</strong> Descarga un Excel con todos los incidentes filtrados por el rango de fechas.</li>
                                            </ul>
                                        </Tooltip>
                                    }
                                >
                                    <button
                                        type="button"
                                        className="btn btn-warning"
                                        tabIndex={-1}
                                    >
                                        <i className="bi bi-info-circle fs-5"></i>
                                    </button>
                                </OverlayTrigger>
                            </div>

                            {/* Grupo derecho - Búsqueda de ticket */}
                            <div className='d-flex gap-3 align-items-end'>
                                <div className='d-flex flex-column'>
                                    <label className='form-label mb-1 fs-6 fw-bold'>Número de Ticket</label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        placeholder='Ingrese número de ticket'
                                        value={ticketNumber}
                                        onChange={(e) => setTicketNumber(e.target.value)}
                                    />
                                </div>
                                <button 
                                    className='btn btn-primary'
                                    onClick={handleTicketSearch}
                                    disabled={!ticketNumber.trim() || incidentInfoLoadingv2}
                                >
                                    {incidentInfoLoadingv2 ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Buscando...
                                        </>
                                    ) : (
                                        "Buscar"
                                    )}
                                </button>
                                <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                        <Tooltip id="tooltip-buscar" className="bg-light text-dark border">
                                            <ul className="mb-0 ps-3 text-start small">
                                                <li><strong>Búsqueda:</strong> Hace una búsqueda del ticket seleccionado de BD y ServiceAide, para ello el incidente debe figurar como "INICIADO".</li>
                                            </ul>
                                        </Tooltip>
                                    }
                                >
                                    <button
                                        type="button"
                                        className="btn btn-warning"
                                        tabIndex={-1}
                                    >
                                        <i className="bi bi-info-circle fs-5"></i>
                                    </button>
                                </OverlayTrigger>
                            </div>
                        </div>

                        {/* Tabla de resultados */}
                        {searchResult && (
                            <div className='mt-4'>
                                <div className='d-flex justify-content-between align-items-center mb-3'>
                                    <h5 className='fw-bold text-dark mb-0'>Información del Incidente</h5>
                                    <button 
                                        className='btn btn-sm btn-light-danger'
                                        onClick={() => setSearchResult(null)}
                                    >
                                        <i className='bi bi-x-circle me-1'></i> Limpiar
                                    </button>
                                </div>
                                <div className='card shadow-sm'>
                                    <div className='card-body p-0'>
                                        <DataTable
                                            columns={columns}
                                            data={[searchResult]}
                                            customStyles={customStyles}
                                            highlightOnHover
                                            responsive
                                            dense
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mostrar mensaje cuando no hay resultados */}
                        {incidentInfoLoadingv2 && (
                            <div className='mt-4 text-center'>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                                <p className='mt-2 text-muted mb-0'>Buscando información del incidente...</p>
                            </div>
                        )}
                        {errorMsg && (
                            <div className="alert alert-danger mt-3 mb-0 py-2 px-3">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                {errorMsg}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { AccordionHeader };