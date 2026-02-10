import { FC } from "react"
import "../../../../../../assets/sass/components/backups-styles/_policies-requestChangeContent.scss"
import { IDataRequestChangesOR } from "../../Types"
import { TimeLine } from "./TimeLine"
import { InfoSection } from "./InfoSection"
import { CreateTaskContainer } from "./CreateTaskSection/CreateTaskContainer"
import { RequestTaskTableRW } from "../../content/TableData/RequestTaskTableRW"
import { ModifyTaskContainer } from "./ModifyTaskSection/ModifyTaskContainer"
import { CloneTaskContainer } from "./CloneTaskSection/CloneTaskContainer"
import { useTaskModify } from "../../../../hooks/useTaskModify"
import { useTaskClone } from "../../../../hooks/useTaskClone"
import { useTask } from "../../../../hooks/useTask"

type Props = {
  modalInformation: IDataRequestChangesOR,
  isDetailVisibility: boolean,
  setIsVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  canCreate: boolean,
  setCanCreate: React.Dispatch<React.SetStateAction<boolean>>,
  wantClone: boolean,
  setWantClone: React.Dispatch<React.SetStateAction<boolean>>
}

const RequestChangeContentRW: FC<Props> = ({ modalInformation, isDetailVisibility, setIsVisibility, canCreate, setCanCreate, setWantClone, wantClone }) => {

  //Funciones, estado y informacion de la tarea seleccionada para pasarsela a la vista de modificacion de tarea
  const taskFunctions = useTask(setIsVisibility)
  const taskModifiedFunctions = useTaskModify(setIsVisibility)
  const taskCloneFunctions = useTaskClone(setIsVisibility)

  return (
    <div style={{ overflow: "hidden" }}>
      {/*Esta sección es la principal solo se muestra cuando el estado Detalle de una tarea esta desactivada*/}
      <div className={`request-change-container ${isDetailVisibility ? "hideContent" : "showContent"}`}>
        <section className="request-change-Infosection">
          <InfoSection
            modalInformation={modalInformation}
          />
          <TimeLine modalInformation={modalInformation} />
        </section>
        <section className="request-change-Tablesection">
          <RequestTaskTableRW
            setIsVisibility={setIsVisibility}
            modalInformation={modalInformation}
            taskModifiedFunctions={taskModifiedFunctions}
            taskCloneFunctions={taskCloneFunctions}
            setCanCreate={setCanCreate}
            setWantClone={setWantClone}
          />
        </section>
      </div>
      {/*Sección compartida se muestra cuando el estado detalle de una tarea esta activada, 
        puede contener o la vista de creación, de clonación o vista de modificación de una tarea*/}
      {canCreate ?
        <div className={`request-change-container ${isDetailVisibility ? "showContent" : "hideContent"}`}>
          <CreateTaskContainer
            setIsVisibility={setIsVisibility}
            isDetailVisibility={isDetailVisibility}
            taskFunctions={taskFunctions}
          />
        </div>
        : wantClone ?
          <div className={`request-change-container ${isDetailVisibility ? "showContent" : "hideContent"}`}>
            <CloneTaskContainer taskCloneFunctions={taskCloneFunctions} />
          </div>
          :
          <div className={`request-change-container ${isDetailVisibility ? "showContent" : "hideContent"}`}>
            <ModifyTaskContainer taskModifiedFunctions={taskModifiedFunctions} />
          </div>

      }

    </div>
  )
}
export { RequestChangeContentRW }
