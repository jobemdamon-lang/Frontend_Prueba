import { useEffect, useState } from "react"
import "../../../../assets/sass/components/tabs-custom.scss"
import { Spinner } from "react-bootstrap"
import { useMonitoringPoliciesContext } from "../Context"
import { Version } from "../Types"
import DataTable, { TableColumn } from "react-data-table-component"
import { EmptyData } from "../../../../components/datatable/EmptyData"
import { Input } from "../../../../components/Inputs/TextInput"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import uniqid from "uniqid"
import { useOldPolicy } from "../hooks/useOldPolicy"

type DetailVersionModalProps = {
    version: Version
}

const customStyles = {
    headCells: {
        style: {
            fontSize: '14px',
            justifyContent: 'center'
        },
    },
    cells: {
        style: {
            justifyContent: 'center'
        },
    },
}

export interface IListMetricsPolicyVersionFront {
  ID: string,
  FAMILIA: string,
  METRICS: (IListMetricsPolicyVersion & { ID: string })[]
}

const restructureInformation = (info: IListMetricsPolicyVersion[]) => {
    const dataAgrupada: any = {};
  
    // Recorremos el array original
    for (const item of info) {
      const familia = item.FAMILIA.toUpperCase();
  
      // Si la familia aún no existe en el objeto dataAgrupada, la creamos como un array vacío
      if (!dataAgrupada[familia]) {
        dataAgrupada[familia] = [];
      }
  
      // Agregamos el objeto actual al array correspondiente a su familia y se le asigna un ID a nivel Front
      dataAgrupada[familia].push({ ...item, ID: uniqid() });
    }
  
    // Convertimos el objeto dataAgrupada en un array de objetos y se le asigna un ID a nivel Front
    const resultadoFinal: IListMetricsPolicyVersionFront[] = Object.keys(dataAgrupada).map((familia) => ({
      ID: uniqid(),
      FAMILIA: familia,
      METRICS: dataAgrupada[familia],
    }))
  
    return resultadoFinal
  
  }

const DetailVersionOld = () => {

    const { modalHook } = useMonitoringPoliciesContext()
    const { version }: DetailVersionModalProps = modalHook.modalInformation
    const [toggleState, setToggleState] = useState(1)
    const [tabActive, setActiveActive] = useState("")
    const toggleTab = (index: number) => setToggleState(index)
    const { getListOfMetricsOfPolicy, getCisOfPolicyVersion, listCIsOfPolicyVersion, listCiLoading, metricsOfPolicyLoading } = useOldPolicy()
    const [originalMetricsOfPolicy, setOriginalMetrics] = useState<IListMetricsPolicyVersionFront[]>([])

    useEffect(() => {
        getCisOfPolicyVersion(version.ID_POLITICA.toString(), version.NRO_VERSION.toString())
        getListOfMetricsOfPolicy(version.ID_POLITICA.toString(), version.NRO_VERSION.toString()).then(response => {
            const originalMetrics = restructureInformation(response)
            setOriginalMetrics(originalMetrics)
            setActiveActive(originalMetrics[0]?.ID)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <>
            <div className='modal-header py-4 bg-dark'>
                <h2 className="text-white">Detalle de la politica </h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-lg-10'>
                <div className='card-body px-6 container '>
                    <div className="d-flex justify-content-between mb-5">
                        <h1 className="mb-10">DATOS DE LA POLITICA - VERSIÓN {version.NRO_VERSION}</h1>

                    </div>
                    <div className="container">
                        <div className="bloc-tabs my-2">
                            <button className={toggleState === 1 ? "tabs active-tab" : "tabs"} onClick={() => toggleTab(1)} >
                                <span >DETALLE POR FAMILIA</span>
                            </button>
                            <button className={toggleState === 2 ? "tabs active-tab" : "tabs"} onClick={() => toggleTab(2)} >
                                <span >DETALLE POR CI'S</span>
                            </button>
                        </div>
                        <div className="content-tabs my-2">
                            <div className={toggleState === 1 ? "tab-content  active-content" : "tab-content"}>
                                {metricsOfPolicyLoading ?
                                    <div className="d-flex justify-content-center my-10">
                                        <Spinner animation="border" role="status">
                                        </Spinner>
                                        <h2>&nbsp; Cargando metricas</h2>
                                    </div> :
                                    (
                                        <div>
                                            <ul className="nav nav-tabs nav-line-tabs fs-6">
                                                {originalMetricsOfPolicy.map((family: IListMetricsPolicyVersionFront) => (
                                                    <li className="nav-item" key={family.ID}>
                                                        <a
                                                            className={`nav-link ${tabActive === family.ID ? "active" : ""}`}
                                                            data-bs-toggle="tab" href={`#kt_tab_pane_${family.ID}`}
                                                            onClick={() => setActiveActive(family.ID)}>
                                                            {`${family.FAMILIA} (${family.METRICS.length})`}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="tab-content d-block" id="myTabContent2">
                                                {originalMetricsOfPolicy.map((family: IListMetricsPolicyVersionFront) => (
                                                    <div
                                                        className={`tab-pane fade ${tabActive === family.ID ? "show active" : ""}`}
                                                        id={`kt_tab_pane_${family.ID}`} role="tabpanel"
                                                        key={family.ID}
                                                    >
                                                        <ByFamilyTable metricsData={family.METRICS} />
                                                    </div>
                                                ))}

                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className={toggleState === 2 ? "tab-content  active-content" : "tab-content"}>
                                <DataTable
                                    columns={ciColumns}
                                    persistTableHead
                                    highlightOnHover
                                    pagination
                                    fixedHeader
                                    customStyles={customStyles}
                                    paginationPerPage={8}
                                    paginationRowsPerPageOptions={[2, 4, 8, 10]}
                                    noDataComponent={<EmptyData loading={listCiLoading} />}
                                    disabled={listCiLoading}
                                    data={listCIsOfPolicyVersion}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export { DetailVersionOld }

interface ICIOfPolicyDetail {
    BAJA_EQUIPO: string,
    CLASE: string;
    DESCRIPCION: string;
    EQUIPO_ESTADO: string;
    FAMILIA: string;
    ID_EQUIPO: number;
    IP: string;
    NOMBRE: string;
    NOMBRE_CI: string;
    NOMBRE_VIRTUAL: string;
    HEERAMIENTA_MONITOREO: string | null;
    TIPO_EQUIPO: string
}

const ciColumns = [
    {
        name: 'NOMBRE DE CI',
        cell: (row: ICIOfPolicyDetail) => row.NOMBRE_CI ?? "Sin registro",
        sortable: true
    },
    {
        name: 'HOSTNAME',
        cell: (row: ICIOfPolicyDetail) => row.NOMBRE ?? "Sin registro",
        sortable: true
    },
    {
        name: 'NORMBRE VIRTUAL',
        cell: (row: ICIOfPolicyDetail) => row.NOMBRE_VIRTUAL ?? "Sin registro",
        sortable: true
    },
    {
        name: 'NRO. IP',
        cell: (row: ICIOfPolicyDetail) => row.IP ?? "Sin registro",
        sortable: true
    },
    {
        name: 'FAMILIA',
        cell: (row: ICIOfPolicyDetail) => row.FAMILIA ?? "Sin registro",
        sortable: true
    },
    {
        name: 'CLASE',
        cell: (row: ICIOfPolicyDetail) => row.CLASE ?? "Sin registro",
        sortable: true
    },
    {
        name: 'DESCRIPCIÓN',
        cell: (row: ICIOfPolicyDetail) => row.DESCRIPCION ?? "Sin registro",
        sortable: true
    },
    {
        name: 'IP',
        cell: (row: ICIOfPolicyDetail) => row.IP ?? "Sin registro",
        sortable: true
    },
    {
        name: 'ESTADO CMDB',
        cell: (row: ICIOfPolicyDetail) => row.EQUIPO_ESTADO ?? "Sin registro",
        sortable: true
    },
]


interface Urgency {
    ID_DETALLE_POLITICA: number | string,
    VALOR: string,
    NRO_POOLEO: string
}

interface IListMetricsPolicyVersion {
    ALERTA: string | null;
    CLASE: string;
    CLIENTES: string;
    COMMAND_PROCESS: string | null;
    CRITICAL: Urgency;
    DATA_D: string | null;
    DESCRIPCION: string | null;
    DETALLE: string;
    EQUIPO_ESTADO: string;
    ESCALAMIENTO: string | null;
    ESTADO: number;
    FAMILIA: string;
    FATAL: Urgency;
    FECHA_CREACION: string;
    FECHA_MODIFICACION: string | null;
    FRECUENCIA: string;
    HERRAMIENTA_MONITOREO: string;
    ID_DETALLE_VERSION: number;
    ID_EQUIPO: number;
    ID_VERSION: number;
    INTERFACE: string | null;
    IP: string;
    METRICAS: string;
    UNIDADES: string | null;
    METRICA_RUTA: string | null;
    MONITOREADO_DESDE: string | null;
    NOMBRE: string;
    NOMBRE_CI: string;
    NOMBRE_MODULO: string | null;
    NRO_POOLEOS: string;
    OBSERVACION: string | null;
    PATH_D: string | null;
    PROTOCOLO: string | null;
    PUERTO: string | null;
    RECURSOS: string;
    SERVICIO_ASOCIADO: string | null;
    TIPO_EQUIPO: string;
    TIPO_MONITOREO: string | null;
    UMBRAL_CRITICAL: string | null;
    UMBRAL_WARNING: string | null;
    USUARIO_CREACION: string;
    USUARIO_MODIFICACION: string | null;
    WARNING: Urgency;
    TABLESPACE_NAME: string | null;
    NOMBRE_INSTANCIA: string | null;
    NRO_PUERTO_INSTANCIA: string | null;
    NOMBRE_DB: string;
    NOMBRE_JOB: string | null;
    DISPONIBILIDAD_PROCESO: string | null;
    COMMAND_PATH: string | null;
    NOMBRE_INTERFAZ: string | null;
    ESTADO_INTERFACE: string | null;
    ALL_REPLICAS: string | null;
    PRIMARY_REPLICAS: string | null;
    SOME_REPLICAS: string | null;
    APP_POOL: string | null;
    NAME_WEB: string | null;
}

const ConditionalTooltip = ({ row }: {
    row: (IListMetricsPolicyVersion & { ID: string })
}) => {

    const [message, setMessage] = useState("")

    useEffect(() => {
        if (row.METRICAS === "Uso de filesystem" || row.METRICAS === "Uso de filesystem C:" || row.METRICAS === "Uso de filesystem /") {
            setMessage(`RUTA: ${row.METRICA_RUTA ?? "Sin registro"}`)
        } else if (row.METRICAS === "Disponibilidad de servicio") {
            setMessage(`SERVICIO ASOCIADO: ${row.SERVICIO_ASOCIADO} | COMMAND: ${row.COMMAND_PROCESS}`)
        } else if (row.METRICAS === "Puertos") {
            setMessage(`PROTOCOLO: ${row.PROTOCOLO} | NRO PUERTO: ${row.PUERTO}`)
        } else if (row.METRICAS === "Tablespace utilization") {
            setMessage(`TABLESPACE: ${row.TABLESPACE_NAME}`)
        } else if (row.METRICAS === "Transaction Log") {
            setMessage(`INSTANCIA: ${row.NOMBRE_INSTANCIA} | NRO PUERTO: ${row.NRO_PUERTO_INSTANCIA}`)
        } else if (row.METRICAS === "MSSQL DB State") {
            setMessage(`DB STATE: ${row.NOMBRE_DB}`)
        } else if (row.METRICAS === "MSSQL Job: Failed to run") {
            setMessage(`JOB: ${row.NOMBRE_JOB}`)
        } else if (row.METRICAS === "Disponibilidad de proceso") {
            setMessage(`PROCESO: ${row.DISPONIBILIDAD_PROCESO ?? ""} | COMMAND PATH: ${row.COMMAND_PATH} `)
        } else if (row.METRICAS === "Disponibilidad de interface") {
            setMessage(`INTERFACE : ${row.NOMBRE_INTERFAZ}`)
        } else if (row.METRICAS === "Estado de Interface") {
            setMessage(`ESTADO INTERFACE : ${row.ESTADO_INTERFACE}`)
        } else if (row.METRICAS === "MSSQL AG - All replicas unhealthy") {
            setMessage(`NOMBRE DE GRUPO : ${row.ALL_REPLICAS}`)
        } else if (row.METRICAS === "MSSQL AG - Primary replica recovery health in progress") {
            setMessage(`NOMBRE DE GRUPO : ${row.PRIMARY_REPLICAS}`)
        } else if (row.METRICAS === "MSSQL AG - Some replicas unhealthy") {
            setMessage(`NOMBRE DE GRUPO : ${row.SOME_REPLICAS}`)
        } else if (row.METRICAS === "IIS: Application Pool") {
            setMessage(`APPLICATION POOL : ${row.APP_POOL}`)
        } else if (row.METRICAS === "Last error message of scenario Availability Web") {
            setMessage(`NOMBRE WEB : ${row.NAME_WEB}`)
        } else if (row.METRICAS === "Cert: SSL certificate expires soon") {
            setMessage(`NOMBRE WEB : ${row.NAME_WEB}`)
        } else if (row.METRICAS === "Cert: SSL certificate is invalid") {
            setMessage(`NOMBRE WEB : ${row.NAME_WEB}`)
        } else {
            setMessage("")
        }
    }, [row])

    return (
        <div>
            <p style={{ textAlign: "center" }}><u>{row.METRICAS}</u></p>
            <p style={{ fontSize: "11px", textAlign: "center", color: "blue" }}>{message}</p>
        </div>
    )
}

const generalMetricsColumns = (): TableColumn<(IListMetricsPolicyVersion & { ID: string })>[] => [
    {
        name: 'NOMBRE DE CI',
        cell: (row: (IListMetricsPolicyVersion & { ID: string })) => row.NOMBRE_CI ?? "Sin registro",
        sortable: true
    },
    {
        name: 'HOSTNAME',
        cell: (row: (IListMetricsPolicyVersion & { ID: string })) => row.NOMBRE ?? "Sin registro",
        sortable: true
    },
    {
        name: 'NRO. IP',
        cell: (row: (IListMetricsPolicyVersion & { ID: string })) => row.IP ?? "Sin registro",
        sortable: true
    },
    {
        name: 'CLASE',
        cell: (row: (IListMetricsPolicyVersion & { ID: string })) => row.CLASE ?? "Sin registro",
        sortable: true
    },
    {
        name: 'TIPO DE METRICA',
        cell: (row: (IListMetricsPolicyVersion & { ID: string })) => <ConditionalTooltip row={row} />,
        sortable: true
    },
    {
        name: 'ESTADO EQUIPO',
        cell: (row: (IListMetricsPolicyVersion & { ID: string })) => row.EQUIPO_ESTADO ?? "Sin registro",
        sortable: true
    },
    {
        name: 'HERRAMIENTA MONITOREO',
        cell: (row: (IListMetricsPolicyVersion & { ID: string })) => row.HERRAMIENTA_MONITOREO ?? "Sin registro",
        sortable: true
    },
    {
        name: 'TIPO DE EQUIPO',
        cell: (row: (IListMetricsPolicyVersion & { ID: string })) => row.TIPO_EQUIPO ?? "Sin registro",
        sortable: true
    },
    {
        name: 'UNIDADES',
        cell: (row: (IListMetricsPolicyVersion & { ID: string })) => row.UNIDADES ?? "Sin registro",
        sortable: true
    },
    {
        name: 'UMBRALES',
        width: "500px",
        cell: (row: (IListMetricsPolicyVersion & { ID: string })) => (
            <table id="kt_datatable_zero_configuration" className="table table-row-bordered w-100">
                <thead>
                    <tr className="fw-semibold fs-8 text-muted">
                        <th className="text-center"><span className="badge badge-info">UMBRAL WARNING</span></th>
                        <th className="text-center"><span className="badge badge-warning">UMBRAL CRITICAL</span></th>
                        <th className="text-center"><span className="badge badge-danger">UMBRAL FATAL</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="p-0 m-0 text-center">{row.WARNING.ID_DETALLE_POLITICA ? row?.WARNING?.VALOR : "-"}</td>
                        <td className="p-0 m-0 text-center">{row.CRITICAL.ID_DETALLE_POLITICA ? row.CRITICAL?.VALOR : "-"}</td>
                        <td className="p-0 m-0 text-center">{row.FATAL.ID_DETALLE_POLITICA ? row?.FATAL?.VALOR : "-"}</td>
                    </tr>
                    <tr>
                        <td className="p-0 m-0 text-center">{row.WARNING.ID_DETALLE_POLITICA ? "NRO POOLEOS: " + row?.WARNING?.NRO_POOLEO : "-"}</td>
                        <td className="p-0 m-0 text-center">{row.CRITICAL.ID_DETALLE_POLITICA ? "NRO POOLEOS: " + row.CRITICAL?.NRO_POOLEO : "-"}</td>
                        <td className="p-0 m-0 text-center">{row.FATAL.ID_DETALLE_POLITICA ? "NRO POOLEOS: " + row?.FATAL?.NRO_POOLEO : "-"}</td>
                    </tr>
                </tbody>
            </table>
        ),
        sortable: true
    },
    {
        name: 'INTERVALO',
        cell: (row: (IListMetricsPolicyVersion & { ID: string })) => row.FRECUENCIA ?? "Sin registro",
        sortable: true
    }
]


const minimalistStyles = {
    headCells: {
        style: {
            backgroundColor: "#f4f7f8",
            color: "#5b6078",
            fontWeight: '400',
            fontSize: '15px',
            justifyContent: 'center'
        },
    },
    cells: {
        style: {
            justifyContent: 'center',
            color: '#7e8485',
            fontSize: '13px'
        },
    },
    headRow: {
        style: {
            borderBottomWidth: '1px',
            borderBottomColor: '#DDE6ED',
            borderBottomStyle: 'dashed',
        },
        denseStyle: {
            minHeight: '32px',
        },
    },
}


const ByFamilyTable = ({ metricsData }: {
    metricsData: (IListMetricsPolicyVersion & { ID: string })[]
}) => {
    const [filters, setFilters] = useState({ general: "" })


    return (
        <>
            <div className="d-flex justify-content-end gap-5 align-items-end mb-4">
                <Input
                    label=""
                    placeholder="BUSCAR IP | HOSTNAME "
                    value={filters.general}
                    onChange={(value: string) => setFilters(prev => ({ ...prev, general: value }))} />
                <button
                    type="button"
                    onClick={() => setFilters({ general: "" })}
                    className="btn btn-danger btn-sm"
                >
                    <span>Limpiar Filtros </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg>
                </button>
            </div>
            <DataTable
                columns={generalMetricsColumns()}
                persistTableHead
                highlightOnHover
                pagination
                fixedHeader
                customStyles={{
                    ...minimalistStyles,
                    cells: {
                        style: {
                            justifyContent: 'center',
                            color: '#545959',
                            fontSize: '13px'
                        },
                    }
                }}
                paginationPerPage={4}
                paginationRowsPerPageOptions={[2, 4, 8, 10]}
                data={metricsData}
            />
        </>

    )
}

