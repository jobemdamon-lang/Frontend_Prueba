import { FC, useContext } from "react"
import SVG from 'react-inlinesvg'
import { toAbsoluteUrl } from "../../../../../../helpers/AssetHelpers"
import { Context } from "../../Context"
import { IDataTableRowsPolicies, ITaksOfPolicies, ModalSize, ModalView } from "../../Types"
import { usePolitics } from "../../../../hooks/usePolitics"
/* import { usePolitics } from "../../../../hooks/usePolitics" */

type Props = {
  rowInformation: IDataTableRowsPolicies
}
const TaskPaneButton:FC<Props> = ({rowInformation})=> {

  const { openModal } = useContext(Context)
  const { fetchTaskOfPolitics } = usePolitics()

  return (
    <button
      onClick={()=>{
        //Se lista los tareas de esas politica y se abre el modal
        fetchTaskOfPolitics(rowInformation.id_politica, rowInformation.id_bkversion).then((data:ITaksOfPolicies)=>{
          openModal(ModalView.TASK_PANE,ModalSize.XL, {
            ...rowInformation,
            tareas: data
          })
        })
      }}
      style={{backgroundColor: "transparent", color: "blue"}}
    >
      {rowInformation.id_bkversion}
      <SVG
          width={25}
          height={25}
          src={toAbsoluteUrl("/media/icons/duotune/arrows/arr094.svg")}
          className="category-item"
        />
    </button>
  )
}
export { TaskPaneButton }