import { FC, useCallback, useState } from "react"
import DataTable from "react-data-table-component"
import { EmptyData } from "../../../../../../components/datatable/EmptyData"
import { IDataRequestChangesOR, ITask } from "../../Types"
import { columnsRequestTaskRW } from "./RequestTaskColumnsRW"
import { ActionTaskSection } from "../ActionsTask/ActionTaskSection"
import "../../../../../../assets/sass/components/backups-styles/_policies-taskTable.scss"

type Props = {
  setIsVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  modalInformation: IDataRequestChangesOR,
  taskModifiedFunctions: any,
  taskCloneFunctions: any,
  setCanCreate: React.Dispatch<React.SetStateAction<boolean>>,
  setWantClone: React.Dispatch<React.SetStateAction<boolean>>
}

const RequestTaskTableRW: FC<Props> = ({ setIsVisibility, modalInformation, taskModifiedFunctions, taskCloneFunctions, setCanCreate, setWantClone }) => {

  const [selectedRows, setSelectedRows] = useState<Array<ITask>>([])
  const [toggleCleared, setToggleCleared] = useState(false);

  const handleRowSelected = useCallback((state: any) => {
    console.log(state.selectedRows)
    setSelectedRows(state.selectedRows)
  }, []);

  return (
    <>
      <div className="d-flex justify-content-end gap-5">
        <ActionTaskSection
          modalInformation={modalInformation}
          taskModifiedFunctions={taskModifiedFunctions}
          taskCloneFunctions={taskCloneFunctions}
          selectedRows={selectedRows}
          setCanCreate={setCanCreate}
          setSelectedRows={setSelectedRows}
          setIsVisibility={setIsVisibility}
          setToggleCleared={setToggleCleared}
          toggleCleared={toggleCleared}
          setWantClone={setWantClone}
        />
      </div>
      <DataTable
        className="addScrollbar"
        columns={columnsRequestTaskRW(setIsVisibility)}
        persistTableHead
        selectableRows
        highlightOnHover
        pagination
        fixedHeader
        customStyles={{
          headCells: {
            style: {
              fontSize: '13px',
              fontWeight: '600',
              padding: "0px",
              justifyContent: 'center',
              backgroundColor: "#CCCCFF"
            }
          },
          cells: {
            style: {
              justifyContent: 'center',
            },
          }
        }}
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleCleared}
        noDataComponent={<EmptyData loading={false} />}
        disabled={false}
        data={modalInformation.tareas}
      />  
    </>
  )
}

export { RequestTaskTableRW }