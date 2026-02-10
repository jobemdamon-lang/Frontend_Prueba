import { FC } from "react"
import { IDataRequestChangesOR, ITask, estadoAprovador } from "../../Types"
import { CloneButton } from "./CloneButton"
import { EditButton } from "./EditButton"
import { ApproveButton } from "./ApproveButton"
import { DisapproveButton } from "./DisapproveButton"
/* import { UndoButton } from "./UndoButton" */
import { DeleteButton } from "./DeleteButton"
import { useRequestTasks } from "../../../../hooks/useRequestTasks"

type Props = {
  modalInformation: IDataRequestChangesOR,
  selectedRows: ITask[],
  setToggleCleared: React.Dispatch<React.SetStateAction<boolean>>,
  setCanCreate: React.Dispatch<React.SetStateAction<boolean>>,
  setWantClone: React.Dispatch<React.SetStateAction<boolean>>,
  toggleCleared: boolean,
  setIsVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  taskCloneFunctions: any,
  taskModifiedFunctions: any,
  setSelectedRows: React.Dispatch<React.SetStateAction<ITask[]>>
}

const ActionTaskSection: FC<Props> = ({ modalInformation, selectedRows, setSelectedRows, setToggleCleared, setCanCreate, setWantClone, toggleCleared, setIsVisibility, taskCloneFunctions, taskModifiedFunctions }) => {

  const { approveTask, deleteTask, disapproveTask, loadingDisapprove, loadingApprove, loadingDelete } = useRequestTasks()

  return (
    <div className="py-2">
      {modalInformation.estado_actual === estadoAprovador.ES &&
        <>
          {(selectedRows.length !== 0 && selectedRows?.every((row) => (row.proceso_estado === "Iniciado" && row.accion !== "Baja"))) &&
            <>
              <CloneButton
                selectedRows={selectedRows}
                setToggleCleared={setToggleCleared}
                setCanCreate={setCanCreate}
                setWantClone={setWantClone}
                toggleCleared={toggleCleared}
                setIsVisibility={setIsVisibility}
                taskCloneFunctions={taskCloneFunctions}
              />
              <EditButton
                selectedRows={selectedRows}
                setToggleCleared={setToggleCleared}
                setCanCreate={setCanCreate}
                setWantClone={setWantClone}
                toggleCleared={toggleCleared}
                setIsVisibility={setIsVisibility}
                taskModifiedFunctions={taskModifiedFunctions}
              />

            </>
          }
          <ApproveButton
            loadingApprove={loadingApprove}
            toggleCleared={toggleCleared}
            setToggleCleared={setToggleCleared}
            approveTask={approveTask}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
          <DeleteButton
            loadingDelete={loadingDelete}
            selectedRows={selectedRows}
            deleteTask={deleteTask}
            setToggleCleared={setToggleCleared}
            setSelectedRows={setSelectedRows}
            toggleCleared={toggleCleared}
          />
        </>
      }
      {modalInformation.estado_actual === estadoAprovador.DT &&
        <>
          {(selectedRows.length !== 0 && selectedRows?.every((row) => (row.proceso_estado === "Iniciado" && row.accion !== "Baja") || (row.proceso_estado === "Observado" && row.accion !== "Baja") || (row.proceso_estado === "Definido" && row.accion !== "Baja"))) &&
            <>
              <CloneButton
                selectedRows={selectedRows}
                setToggleCleared={setToggleCleared}
                setCanCreate={setCanCreate}
                setWantClone={setWantClone}
                toggleCleared={toggleCleared}
                setIsVisibility={setIsVisibility}
                taskCloneFunctions={taskCloneFunctions}
              />
              <EditButton
                selectedRows={selectedRows}
                setToggleCleared={setToggleCleared}
                setCanCreate={setCanCreate}
                setWantClone={setWantClone}
                toggleCleared={toggleCleared}
                setIsVisibility={setIsVisibility}
                taskModifiedFunctions={taskModifiedFunctions}
              />
            </>
          }
          <ApproveButton
            setSelectedRows={setSelectedRows}
            toggleCleared={toggleCleared}
            setToggleCleared={setToggleCleared}
            loadingApprove={loadingApprove}
            approveTask={approveTask}
            selectedRows={selectedRows}
          />
          <DeleteButton
            loadingDelete={loadingDelete}
            selectedRows={selectedRows}
            deleteTask={deleteTask}
            setToggleCleared={setToggleCleared}
            setSelectedRows={setSelectedRows}
            toggleCleared={toggleCleared}
          />
        </>
      }
      {modalInformation.estado_actual === estadoAprovador.AT &&
        <>
          {(selectedRows.length !== 0 && selectedRows?.every((row) => (row.proceso_estado === "Definido" || row.proceso_estado === "Aprobado"))) &&
            <>
              <ApproveButton
                setSelectedRows={setSelectedRows}
                toggleCleared={toggleCleared}
                setToggleCleared={setToggleCleared}
                loadingApprove={loadingApprove}
                approveTask={approveTask}
                selectedRows={selectedRows}
              />
              <DisapproveButton
                setSelectedRows={setSelectedRows}
                toggleCleared={toggleCleared}
                setToggleCleared={setToggleCleared}
                disapproveTask={disapproveTask}
                selectedRows={selectedRows}
                loadingDisapprove={loadingDisapprove}
              />
            </>
          }
        </>
      }
      {modalInformation.estado_actual === estadoAprovador.IT &&
        <>
          {(selectedRows.length !== 0 && selectedRows?.every((row) => ((row.proceso_estado === "Aprobado" && row.accion !== "Baja") || (row.proceso_estado === "Implementado" && row.accion !== "Baja")))) &&
            <>
              <EditButton
                selectedRows={selectedRows}
                setToggleCleared={setToggleCleared}
                setCanCreate={setCanCreate}
                setWantClone={setWantClone}
                toggleCleared={toggleCleared}
                setIsVisibility={setIsVisibility}
                taskModifiedFunctions={taskModifiedFunctions}
              />
            </>
          }
          <ApproveButton
            loadingApprove={loadingApprove}
            toggleCleared={toggleCleared}
            setToggleCleared={setToggleCleared}
            approveTask={approveTask}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
          <DisapproveButton
            setSelectedRows={setSelectedRows}
            toggleCleared={toggleCleared}
            setToggleCleared={setToggleCleared}
            disapproveTask={disapproveTask}
            selectedRows={selectedRows}
            loadingDisapprove={loadingDisapprove}
          />
        </>
      }
    </div>
  )
}
export { ActionTaskSection }