import DataTable from "react-data-table-component"
import { EmptyData } from "../../../../../../components/datatable/EmptyData"
import { columnsServers } from "../../content/TableData/ServersColumns"
import { FC } from "react"
import { ITaksOfPolicies } from "../../Types"

type Props = {
  selectedTask: ITaksOfPolicies
}
const TDServers:FC<Props> = ({selectedTask})=> {

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
      data={selectedTask.lista_server}
    />
    </div>
  )
}
export { TDServers }