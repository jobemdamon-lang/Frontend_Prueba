import DataTable, { TableColumn } from "react-data-table-component"
import { EmptyData } from "../../../../../../components/datatable/EmptyData"
import { IListHourPolicy, ITaksOfPolicies } from "../../Types"
import { FC } from "react"

export const columnshours: TableColumn<IListHourPolicy>[] = [
  {
    name: 'HORAS DE INICIOS',
    selector: (row: IListHourPolicy) => row.descripcion ?? "Sin registro",
    sortable: true
  }
]

type Props = {
  selectedTask: ITaksOfPolicies
}

const TDStartTimes:FC<Props> = ({selectedTask})=> {

  return (
    <div>
      <DataTable
      columns={columnshours}
      persistTableHead
      highlightOnHover
      pagination
      fixedHeader
      noDataComponent={<EmptyData loading={false} />}
      disabled={false}
      data={selectedTask.lista_hora}
    />
    </div>
  )
}
export { TDStartTimes }