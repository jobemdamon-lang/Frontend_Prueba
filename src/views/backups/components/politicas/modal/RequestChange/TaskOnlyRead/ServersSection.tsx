import { FC, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { EmptyData } from "../../../../../../../components/datatable/EmptyData"
import { columnsServers } from "../../../content/TableData/ServersColumns"
import { IDataTableRowsServers, IListServers, ITask } from "../../../Types"
import uniqid from "uniqid"

type Props = {
  taskInfo: ITask
}
const ServersSection: FC<Props> = ({ taskInfo }) => {

  const [serversDataWF, setServers] = useState<Array<IDataTableRowsServers>>([])

  useEffect(() => {
    const formatterData: IDataTableRowsServers[] = taskInfo.lista_server?.map((server: IListServers) => {
      return {
        nombreci: server.nombreci,
        ambiente: server.ambiente ?? "",
        ubicacion: server.ubicacion ?? "",
        tipo: server.tipoEquipo ?? "",
        estado: server.estado,
        id_equipo: server.id_equipo,
        ip: server.ip ?? "",
        idRow: uniqid()
      }
    })
    setServers(formatterData)
  }, [taskInfo.lista_server])

  return (
    <div>
      <DataTable
        columns={columnsServers}
        persistTableHead
        highlightOnHover
        pagination
        fixedHeader
        noDataComponent={<EmptyData loading={false} />}
        disabled={false}
        data={serversDataWF}
      />
    </div>
  )
}
export { ServersSection }