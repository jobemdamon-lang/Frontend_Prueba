import { FC, useContext, useState } from "react";
import { Context } from "../../../Context";
import { ITask } from "../../../Types";
import { AdminBackupSection } from "./AdminBackupsSection";
import { GeneralData } from "./GeneralData";
import { HoursSection } from "./HoursSection";
import { RoutesSection } from "./RoutesSection";
import { ServersSection } from "./ServersSection";
import { SpecialData } from "./SpecialData";

type Props = {
  taskInfo: ITask
}

const TaskORSection:FC<Props> = ({taskInfo}) => {

  const [toggleState, setToggleState] = useState(1);
  const toggleTab = (index: number) => setToggleState(index)
  const { ComboData } = useContext(Context)

  return (
    <>
     {/* Vista de Detalle de la tarea OR - Only Read*/}
      <h4>Tarea</h4>
      <div>
        <div className="accordion mb-5">
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                <strong>Datos Generales</strong>
              </button>
            </h2>
            <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
              <GeneralData ComboData={ComboData} taskInfo={taskInfo}/>
            </div>
          </div>
        </div>
        <div className="accordion-body">
          <div className="container">
            <div className="bloc-tabs">
              <button className={toggleState === 1 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(1)} >
                Datos Especiales
              </button>
              <button className={toggleState === 2 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(2)} >
                Servidores
              </button>
              <button className={toggleState === 3 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(3)} >
                Rutas
              </button>
              <button className={toggleState === 4 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(4)} >
                Horas
              </button>
              <button className={toggleState === 5 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(5)} >
                Sección Adminitrador de Backups
              </button>
            </div>
            <div className="content-tabs">
              <div className={toggleState === 1 ? "tab-content  active-content" : "tab-content"}>
                <SpecialData ComboData={ComboData}  taskInfo={taskInfo}/>
              </div>
              <div className={toggleState === 2 ? "tab-content  active-content" : "tab-content"}>
                <ServersSection  taskInfo={taskInfo}/>
              </div>
              <div className={toggleState === 3 ? "tab-content  active-content" : "tab-content"}>
                <RoutesSection  taskInfo={taskInfo}/>
              </div>
              <div className={toggleState === 4 ? "tab-content  active-content" : "tab-content"}>
                <HoursSection  taskInfo={taskInfo}/>
              </div>
              <div className={toggleState === 5 ? "tab-content  active-content" : "tab-content"}>
                <AdminBackupSection  ComboData={ComboData} taskInfo={taskInfo}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export { TaskORSection }