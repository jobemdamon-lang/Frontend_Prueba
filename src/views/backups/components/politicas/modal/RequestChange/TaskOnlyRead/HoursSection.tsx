import { FC, useEffect, useState } from "react"
import DataTable, { TableColumn } from "react-data-table-component"
import { EmptyData } from "../../../../../../../components/datatable/EmptyData"
import { IDataTableRowsHours, IListHours, ITask } from "../../../Types"
import uniqid from "uniqid"

export const columnshours: TableColumn<IDataTableRowsHours>[] = [
  {
    name: 'HORAS DE INICIOS',
    selector: (row: IDataTableRowsHours) => row.hora_inicio ?? "Sin registro",
    sortable: true
  }
]

type Props = {
  taskInfo: ITask
}

const HoursSection: FC<Props> = ({ taskInfo }) => {


  const [hoursDataWF, setHours] = useState<Array<IDataTableRowsHours>>([])

  useEffect(() => {
    const formatterData: IDataTableRowsHours[] = taskInfo.lista_hora?.map((hour: IListHours) => {
      const data: IDataTableRowsHours = {
        ...hour,
        hora_inicio: hour.descripcion,
        estado: parseInt(hour.estado),
        idRow: uniqid()
      }
      return data
    })
    setHours(formatterData)
  }, [taskInfo.lista_hora])

  const isLoading = false
  return (
    <div>
      <DataTable
        columns={columnshours}
        persistTableHead
        highlightOnHover
        pagination
        fixedHeader
        noDataComponent={<EmptyData loading={isLoading} />}
        disabled={isLoading}
        data={hoursDataWF}
      />
    </div>
  )
}
export { HoursSection }