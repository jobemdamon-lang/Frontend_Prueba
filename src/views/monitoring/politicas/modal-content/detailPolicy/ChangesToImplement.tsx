import DataTable, { TableColumn } from "react-data-table-component"
import { EmptyData } from "../../../../../components/datatable/EmptyData"
import { LoadingTable } from "../../../../../components/loading/LoadingTable"
import { usePolicy } from "../../hooks/usePolicy"
import { FC, useContext, useEffect, useState } from "react"
import { IChangesToBeImplemented, IMonitoringPolicyVersions } from "../../Types"
import { ContextPolitica } from "../../ContextPolitica"
import { minimalistStyles } from "../../../../../helpers/tableStyles"

const ChangesToImplemnet = () => {

  const { getListChangesToImplement, changesToImplementLoading, listChangesToImplement } = usePolicy()
  const { modalInformation }: { modalInformation: IMonitoringPolicyVersions, } = useContext(ContextPolitica)

  useEffect(() => {
    getListChangesToImplement(modalInformation.ID_POLITICA.toString(), modalInformation.NRO_VERSION.toString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="position-relative">
      <DataTable
        columns={changesToImplementColumns()}
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
        noDataComponent={<EmptyData loading={changesToImplementLoading} />}
        disabled={changesToImplementLoading}
        data={listChangesToImplement}
      />
      {changesToImplementLoading && <LoadingTable description='Cargando' />}
    </div>
  )
}
export { ChangesToImplemnet }

const changesToImplementColumns = (): TableColumn<IChangesToBeImplemented>[] => [
  {
    name: 'CAMBIOS A REALIZAR',
    cell: (row: IChangesToBeImplemented) => <div>
      {row.Accion === "Nuevo" && <span className="badge badge-info">NUEVO</span>}
      {row.Accion === "Editado" && <span className="badge badge-primary">EDICIÓN</span>}
      {row.Accion === "Eliminado" && <span className="badge badge-danger">ELIMINACIÓN</span>}
    </div>,
    sortable: true
  },
  {
    name: 'NOMBRE DE CI',
    cell: (row: IChangesToBeImplemented) => row.NOMBRE_CI ?? "Sin registro",
    sortable: true
  },
  {
    name: 'IP',
    cell: (row: IChangesToBeImplemented) => row.IP ?? "Sin registro"
  },
  {
    name: 'HOSTNAME',
    cell: (row: IChangesToBeImplemented) => row.NOMBRE ?? "Sin registro",
    sortable: true
  },
  {
    name: 'CLASE',
    cell: (row: IChangesToBeImplemented) => row.CLASE ?? "Sin registro",
    sortable: true
  },
  {
    name: 'TIPO DE METRICA',
    cell: (row: IChangesToBeImplemented) => <ConditionalTooltip row={row} />,
    sortable: true
  },
  {
    name: 'ESTADO EQUIPO',
    cell: (row: IChangesToBeImplemented) => row.EQUIPO_ESTADO ?? "Sin registro",
    sortable: true
  },
  {
    name: 'HERRAMIENTA MONITOREO',
    cell: (row: IChangesToBeImplemented) => row.HERRAMIENTA_MONITOREO ?? "Sin registro",
    sortable: true
  },
  {
    name: 'TIPO DE EQUIPO',
    cell: (row: IChangesToBeImplemented) => row.TIPO_EQUIPO ?? "Sin registro",
    sortable: true
  },
  {
    name: 'UMBRALES',
    width: "500px",
    cell: (row: IChangesToBeImplemented) => (
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
    cell: (row: IChangesToBeImplemented) => row.FRECUENCIA ?? "Sin registro",
    sortable: true
  }
]

type Props = {
  row: IChangesToBeImplemented
}

const ConditionalTooltip: FC<Props> = ({ row }) => {

  const [message, setMessage] = useState("")

  useEffect(() => {
    if (row.METRICAS === "Uso de filesystem" || row.METRICAS === "Uso de filesystem C:" || row.METRICAS === "Uso de filesystem /") {
      setMessage(`RUTA: ${row.METRICA_RUTA ?? "Sin registro"}`)
    } else if (row.METRICAS === "Disponibilidad de servicio") {
      setMessage(`SERVICIO ASOCIADO: ${row.SERVICIO_ASOCIADO} | COMMANDO PROCESS: ${row.COMMAND_PROCESS}`)
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
      setMessage(`INTERFACE: ${row.NOMBRE_INTERFAZ}`)
    } else if (row.METRICAS === "Estado de Interface") {
      setMessage(`ESTADO INTERFACE : ${row.ESTADO_INTERFACE}`)
    } else if (row.METRICAS === "MSSQL AG - All replicas unhealthy") {
      setMessage(`NOMBRE DE GRUPO : ${row.ALL_REPLICAS}`)
    } else if (row.METRICAS === "MSSQL AG - Primary replica recovery health in progress") {
      setMessage(`NOMBRE DE GRUPO : ${row.PRIMARY_REPLICAS}`)
    } else if (row.METRICAS === "MSSQL AG - Some replicas unhealthy") {
      setMessage(`NOMBRE DE GRUPO : ${row.SOME_REPLICAS}`)
    } else if (row.METRICAS === "IIS: Application Pool") {
      setMessage(`APPLICATION POOL: ${row.APP_POOL}`)
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