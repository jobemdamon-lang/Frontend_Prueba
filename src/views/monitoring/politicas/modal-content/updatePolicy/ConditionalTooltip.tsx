import { FC, useState, useEffect } from "react"
/* import { ToolTip } from "../../../../../../components/tooltip/ToolTip" */
import { IListMetricsPolicyVersion } from "../../Types"

type Props = {
  row: (IListMetricsPolicyVersion & { ID: string })
}
const ConditionalTooltip: FC<Props> = ({ row }) => {

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
export { ConditionalTooltip }
