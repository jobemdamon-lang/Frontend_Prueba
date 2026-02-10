import DataTable from "react-data-table-component"
import { columnsServersCreate, conditionalRowStyles, customStyles } from "./TableUtilities"
import { FC, useEffect, useState } from "react"
import { EmptyData } from "../../../../../../components/datatable/EmptyData"
import { KTSVG } from "../../../../../../helpers"
import { ISearchTasksWithFormat } from "../../Types"
import { LoadingTable } from "../../../../../../components/loading/LoadingTable"

type Props = {
  tasksOfPoliciesWithFormat: ISearchTasksWithFormat[],
  loadingSearchTaskOfPolicies?: boolean,
  handleRowSelected: any,
  toggleCleared: boolean
}

const ByTasks:FC<Props> = ({tasksOfPoliciesWithFormat, handleRowSelected, toggleCleared, loadingSearchTaskOfPolicies}) => {

  const [inputValue, setInputValue] = useState("")
  /* const rowDisabledCriteria = (row:ISearchTasksWithFormat) => (row.has_a_change.isInRequest || row.has_a_change.isChangeInFront) */
  const [filteredDataByName, setFilteredDataByName] = useState<Array<ISearchTasksWithFormat>>([])

  //Cada vez que cambien los datos de la politica o el valor del input se reasignan los datos
  useEffect(() => {
    const dataFiltered: ISearchTasksWithFormat[] = tasksOfPoliciesWithFormat.filter((task: ISearchTasksWithFormat) => {
      return (task.nombre_tarea.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()) || 
              task.frecuencia.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()) || 
              task.tipo_backup.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()) || 
              task.modo.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()))
    })
    setFilteredDataByName(dataFiltered)
  }, [tasksOfPoliciesWithFormat, inputValue])

  return (
    <>
      <div className="d-flex justify-content-around">
        <div className='d-flex align-items-center position-relative w-400px p-8'>
          <KTSVG path='/media/icons/duotune/general/gen021.svg' className='svg-icon-1 position-absolute ms-4' />
          <input
            style={{ fontWeight: 600 }}
            type='text'
            value={inputValue}
            onChange={(e)=> setInputValue(e.target.value)}
            data-kt-user-table-filter='search'
            className='form-control h-40px form-control-solid w-220px ps-14'
            placeholder='Buscar'
            aria-label='Search Input'
          />
          <button type='button' className='btn btn-sm btn-secondary'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              fill='currentColor'
              className='bi bi-trash3'
              viewBox='0 0 16 16'
            >
              <path d='M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z' />
            </svg>
          </button>
        </div>
      </div>
      <div className="position-relative">
        <DataTable
          columns={columnsServersCreate}
          persistTableHead
          selectableRows
          customStyles={customStyles}
          highlightOnHover
          pagination
          /* selectableRowDisabled={rowDisabledCriteria} */
          conditionalRowStyles={conditionalRowStyles}
          fixedHeader
          onSelectedRowsChange={handleRowSelected}
          clearSelectedRows={toggleCleared}
          noDataComponent={<EmptyData loading={false} />}
          disabled={loadingSearchTaskOfPolicies}
          data={filteredDataByName}
        />
        {loadingSearchTaskOfPolicies && <LoadingTable description='Cargando' />}
      </div>
    </>

  )
}
export { ByTasks }