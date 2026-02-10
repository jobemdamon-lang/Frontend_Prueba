import { FC, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { EmptyData } from "../../../../../../components/datatable/EmptyData"
import { IPolicyWithTasks, ITaksOfPolicies } from "../../Types"
import "../../../../../../assets/sass/components/backups-styles/_policies-taskPane.scss"
import { columnsTaskPolicies } from "./TaskPoliciesColumns"
import { SearchTaskInput } from "../../modal/TaskPolicies/SearchTaskInput"

type Props = {
  modalInformation: IPolicyWithTasks,
  showTaskDetail: React.Dispatch<React.SetStateAction<boolean>>,
  isTaskVisibility: boolean,
  setSelectedTask: any
}
const paginationComponentOptions = {
  rowsPerPageText: 'Filas por página',
  rangeSeparatorText: 'de',
  selectAllRowsItem: true,
}
const TaskPoliciesTable: FC<Props> = ({ modalInformation, showTaskDetail, isTaskVisibility, setSelectedTask }) => {

  const [searchedTask, setSearchedtask] = useState("")
  const [filteredData, setFilteredData] = useState<Array<ITaksOfPolicies>>([])

  useEffect(()=>{
    //Por optimizar !!
    const newTasks = modalInformation.tareas.filter((task:ITaksOfPolicies)=> task.nombre_tarea.toLocaleLowerCase().includes(searchedTask.toLocaleLowerCase()))
    setFilteredData(newTasks)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[searchedTask])

  useEffect(()=>{
    setFilteredData(modalInformation.tareas)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div
      style={{ position: 'relative' }}
      className={`${isTaskVisibility ? "hideContent" : "showContent"}`}
    >
      <SearchTaskInput searchedTask={searchedTask} setSearchedtask={setSearchedtask}/>
      <DataTable
        columns={columnsTaskPolicies(showTaskDetail, setSelectedTask)}
        persistTableHead
        highlightOnHover
        pagination
        paginationComponentOptions={paginationComponentOptions}
        noDataComponent={<EmptyData loading={false} />}
        disabled={false}
        data={filteredData}
      />
    </div>
  )
}
export { TaskPoliciesTable }