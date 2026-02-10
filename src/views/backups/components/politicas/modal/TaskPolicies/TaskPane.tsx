import { useContext, useState } from "react"
import { KTSVG, toAbsoluteUrl } from "../../../../../../helpers"
import SVG from 'react-inlinesvg';
import { TaskPoliciesTable } from "../../content/TableData/TaskPoliciesTable"
import { Context } from "../../Context"
import { TaskDetail } from "./TaskDetail"
import { IPolicyWithTasks, ITaksOfPolicies, initialTask } from "../../Types";

const TaskPane = () => {

  const { closeModal, selectedGroupPolicies, modalInformation }:{closeModal:any, selectedGroupPolicies:any, modalInformation: IPolicyWithTasks} = useContext(Context)
  const [showTaskDetail, setShowtaskDetail] = useState(false)
  const [selectedTask, setSelectedTask] = useState<ITaksOfPolicies>(initialTask)

  return (
    <>
      <div className='modal-header py-4'>
        <h2>{selectedGroupPolicies.value + " - Version: " + modalInformation?.id_bkversion}</h2>
        <div>
          <button
            className="btn-access-modal"
            style={{
              opacity: showTaskDetail ? "1" : "0",
              backgroundColor: "transparent"
            }}
            onClick={() => setShowtaskDetail(false)}
          >
            <SVG src={toAbsoluteUrl("/media/icons/duotune/arrows/arr074.svg")} className="category-item" />
            <strong>Regresar</strong>
          </button>
          <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModal()}>
            <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
          </div>
        </div>
      </div>
      <div className='modal-body pt-2 px-lg-10' style={{ overflow: "hidden" }}>
        <TaskPoliciesTable
          setSelectedTask={setSelectedTask}
          modalInformation={modalInformation}
          showTaskDetail={setShowtaskDetail}
          isTaskVisibility={showTaskDetail}
        />
        <TaskDetail isTaskVisibility={showTaskDetail} selectedTask={selectedTask}/>
      </div>
    </>
  )
}
export { TaskPane }       