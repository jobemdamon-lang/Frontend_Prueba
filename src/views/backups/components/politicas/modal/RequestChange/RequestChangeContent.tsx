import { FC, useState } from "react"
import "../../../../../../assets/sass/components/backups-styles/_policies-requestChangeContent.scss"
import { IDataRequestChangesOR, ITask } from "../../Types"
import { RequestTaskTable } from "../../content/TableData/RequestChangeOR/RequestTaskTable"
import { TimeLine } from "./TimeLine"
import { InfoSection } from "./InfoSection"
import { TaskORSection } from "./TaskOnlyRead/TaskORSection"
import { initialTask } from "../../../../hooks/initialTask"

type Props = {
  modalInformation: IDataRequestChangesOR,
  isDetailVisibility: boolean,
  setIsVisibility: React.Dispatch<React.SetStateAction<boolean>>
}

const RequestChangeContent: FC<Props> = ({ modalInformation, isDetailVisibility, setIsVisibility }) => {

  //Estado para almacenar el estado de la tarea individual seleccionada en la tabla
  const [taskInfo, setTaskInfo] = useState<ITask>(initialTask)

  return (
    <div style={{ overflow: "hidden" }}>
      {/*Este contenido solo se muestra cuando el estado Detalle de las tareas de una solicitud esta desactivado*/}
      <div className={`request-change-container ${isDetailVisibility ? "hideContent" : "showContent"}`}>
        <section className="request-change-Infosection">
          <InfoSection
            modalInformation={modalInformation}
          />
          <TimeLine
            modalInformation={modalInformation}
          />
        </section>
        <section className="request-change-Tablesection">
          <RequestTaskTable setIsVisibility={setIsVisibility} modalInformation={modalInformation} setTaskInfo={setTaskInfo} />
        </section>
      </div>
      {/*Este contenido solo se muestra cuando el estado Detalle de las tareas de una solicitud esta activado*/}
      <div className={`request-change-container ${isDetailVisibility ? "showContent" : "hideContent"}`}>
        <TaskORSection taskInfo={taskInfo} />
      </div>
    </div>

  )
}
export { RequestChangeContent }
