import { FC } from "react"
import DataTable from "react-data-table-component"
import { EmptyData } from "../../../../../../../components/datatable/EmptyData"
import { IDataRequestChangesOR, ITask } from "../../../Types"
import { columnsRequestTask } from "./RequestTaskColumns"

type Props = {
  setIsVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  modalInformation: IDataRequestChangesOR,
  setTaskInfo : React.Dispatch<React.SetStateAction<ITask>>
}

const RequestTaskTable:FC<Props> = ({setIsVisibility, modalInformation, setTaskInfo}) => {
  return (
    <DataTable
      columns={columnsRequestTask(setIsVisibility, setTaskInfo)}
      persistTableHead
      highlightOnHover
      pagination
      fixedHeader
      noDataComponent={<EmptyData loading={false} />}
      disabled={false}
      data={modalInformation.tareas}
    />
  )
}

export{ RequestTaskTable }