import { FC, useContext, useState } from "react"
import { Context } from "../../Context";
import { TDGeneral } from "./TD_General";
import { TDRoutes } from "./TD_Routes";
import { TDServers } from "./TD_Servers";
import { TDStartTimes } from "./TD_StartTimes";
import { ITaksOfPolicies } from "../../Types";

type Props = {
  isTaskVisibility: boolean,
  selectedTask: ITaksOfPolicies
}

const TaskDetail: FC<Props> = ({ isTaskVisibility, selectedTask}) => {

  const [toggleState, setToggleState] = useState(1);
  const toggleTab = (index: number) => setToggleState(index)
  const { ComboData } = useContext(Context)

  return (
    <div className={isTaskVisibility ? "showContent" : "hideContent"}>
      <div className="container">
        <div className="bloc-tabs">
          <button className={toggleState === 1 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(1)} >
            Datos Generales
          </button>
          <button className={toggleState === 2 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(2)} >
            Servidores
          </button>
          <button className={toggleState === 3 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(3)} >
            Rutas
          </button>
          <button className={toggleState === 4 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(4)} >
            Horas Inicio
          </button>
        </div>
        <div className="content-tabs">
          <div className={toggleState === 1 ? "tab-content  active-content" : "tab-content"}>
            <TDGeneral ComboData ={ComboData} selectedTask={selectedTask}/>
          </div>
          <div className={toggleState === 2 ? "tab-content  active-content" : "tab-content"}>
            <TDServers  selectedTask={selectedTask}/>
          </div>
          <div className={toggleState === 3 ? "tab-content  active-content" : "tab-content"}>
            <TDRoutes  selectedTask={selectedTask}/>
          </div>
          <div className={toggleState === 4 ? "tab-content  active-content" : "tab-content"}>
            <TDStartTimes selectedTask={selectedTask}/>
          </div>
        </div>
      </div>
    </div>
  )
}
export { TaskDetail }