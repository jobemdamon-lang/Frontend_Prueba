import { TableColumn } from "react-data-table-component"
import { IPolicyHistoryDetail } from "../../Types"
import { ToolTip } from "../../../../../components/tooltip/ToolTip"
import { useEffect, useState } from "react"

export const HistoricalChangesColumns: TableColumn<IPolicyHistoryDetail>[] = [
  {
    name: 'VERSION POLITICA',
    width: "170px",
    cell: (row: IPolicyHistoryDetail) => row.VERSION_POLITICA ?? "Sin registro"
  },
  {
    name: 'ESTADO',
    width: "180px",
    cell: (row: IPolicyHistoryDetail) => (
      <span className={`badge badge-${row.ESTADO_POLITICA_REAL === "IMPLEMENTADO" ? "primary" : row.ESTADO_POLITICA_REAL === "POR IMPLEMENTAR" ? "info" : row.ESTADO_POLITICA_REAL === "CANCELADO" ? "danger" : "success"}`}>{row.ESTADO_POLITICA_REAL}</span>)
  },
  {
    name: 'FECHA CAMBIO',
    width: "170px",
    cell: (row: IPolicyHistoryDetail) => row.FECHA?.toString() ?? "Sin registro"
  },
  {
    name: 'USUARIO',
    selector: (row: IPolicyHistoryDetail) => row.USUARIO_CREACION ?? "Sin registro"
  },
  {
    name: 'TICKET ORIGEN',
    width: "170px",
    cell: (row: IPolicyHistoryDetail) => <p className="h6">{row.NRO_TICKET}</p>
  },
  {
    name: 'TICKET MONITOREO',
    width: "190px",
    cell: (row: IPolicyHistoryDetail) => <p className="h6">{row.TICKET_MONITOREO}</p>
  },
  {
    name: 'MOTIVO CAMBIO',
    width: "170px",
    cell: (row: IPolicyHistoryDetail) => (
      <ToolTip
        message={row.MOTIVO ?? "Sin Registro de Motivo"}
        placement='top'
      >
        <u className="text-info text-center">{row.MOTIVO?.slice(0, 25)}...</u>
      </ToolTip>
    )
  }, {
    name: 'NOMBRE CI',
    cell: (row: IPolicyHistoryDetail) => row.NOMBRE_CI ?? "Sin registro",
    sortable: true
  },
  {
    name: 'NRO. IP',
    cell: (row: IPolicyHistoryDetail) => row.IP ?? "Sin registro",
    sortable: true
  },
  {
    name: 'FAMILIA',
    cell: (row: IPolicyHistoryDetail) => row.FAMILIA ?? "Sin registro",
    sortable: true
  },
  {
    name: 'CLASE',
    cell: (row: IPolicyHistoryDetail) => row.CLASE ?? "Sin registro",
    sortable: true
  },
  {
    name: 'TIPO DE CAMBIO',
    width: "180px",
    cell: (row: IPolicyHistoryDetail) => <div>
      {row.Accion === "Nuevo" && <span className="badge badge-info">NUEVO</span>}
      {row.Accion === "Editado" && <span className="badge badge-primary">EDICIÓN</span>}
      {row.Accion === "Eliminado" && <span className="badge badge-danger">ELIMINACIÓN</span>}
    </div>,
    sortable: true
  },
  {
    name: 'METRICA',
    cell: (row: IPolicyHistoryDetail) => <ConditionalTooltip row={row} />,
    sortable: true
  },
  {
    name: 'HERRAMIENTA',
    width: "170px",
    cell: (row: IPolicyHistoryDetail) => row.HERRAMIENTA_MONITOREO ?? "Sin registro",
    sortable: true
  },
  {
    name: 'TIPO DE EQUIPO',
    cell: (row: IPolicyHistoryDetail) => row.TIPO_EQUIPO ?? "Sin registro",
    sortable: true
  },
  {
    name: 'UMBRALES',
    width: "500px",
    cell: (row: IPolicyHistoryDetail) => (
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
            <td className="p-0 m-0 text-center">{row.WARNING.ID_HISTORICO_DETALLES ? row?.WARNING?.VALOR : "-"}</td>
            <td className="p-0 m-0 text-center">{row.CRITICAL.ID_HISTORICO_DETALLES ? row.CRITICAL?.VALOR : "-"}</td>
            <td className="p-0 m-0 text-center">{row.FATAL.ID_HISTORICO_DETALLES ? row?.FATAL?.VALOR : "-"}</td>
          </tr>
          <tr>
            <td className="p-0 m-0 text-center">{row.WARNING.ID_HISTORICO_DETALLES ? "NRO POOLEOS: " + row?.WARNING?.NRO_POOLEOS : "-"}</td>
            <td className="p-0 m-0 text-center">{row.CRITICAL.ID_HISTORICO_DETALLES ? "NRO POOLEOS: " + row.CRITICAL?.NRO_POOLEOS : "-"}</td>
            <td className="p-0 m-0 text-center">{row.FATAL.ID_HISTORICO_DETALLES ? "NRO POOLEOS: " + row?.FATAL?.NRO_POOLEOS : "-"}</td>
          </tr>
        </tbody>
      </table>
    ),
    sortable: true
  },
  {
    name: 'INTERVALO',
    width: "170px",
    cell: (row: IPolicyHistoryDetail) => row.FRECUENCIA ?? "Sin registro",
    sortable: true
  }
]

const ConditionalTooltip = ({ row }: { row: IPolicyHistoryDetail }) => {

  const [message, setMessage] = useState("")

  useEffect(() => {
    if (row.METRICAS === "Uso de filesystem" || row.METRICAS === "Uso de filesystem C:" || row.METRICAS === "Uso de filesystem /") {
      setMessage(`RUTA: ${row.METRICA_RUTA ?? "Sin registro"}`)
    } else if (row.METRICAS === "Disponibilidad de servicio") {
      setMessage(`SERVICIO ASOCIADO: ${row.SERVICIO_ASOCIADO}`)
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
      setMessage(`PROCESO: ${row.DISPONIBILIDAD_PROCESO ?? ""}`)
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