import DataTable from "react-data-table-component"
import { EmptyData } from "../../../../../../components/datatable/EmptyData"
import { columnsRoutes } from "../../content/TableData/routesColumns"
import { ITaksOfPolicies } from "../../Types"
import { FC } from "react"

type Props = {
  selectedTask: ITaksOfPolicies
}

const TDRoutes:FC<Props> = ({selectedTask})=> {
  
  return (
    <div>
      <DataTable
      columns={columnsRoutes}
      persistTableHead
      highlightOnHover
      pagination
      fixedHeader
      noDataComponent={<EmptyData loading={false} />}
      disabled={false}
      data={selectedTask.lista_ruta}
    />
    </div>
  )
}
export { TDRoutes}