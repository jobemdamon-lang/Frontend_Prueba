import { FC, useContext } from "react"
import SVG from 'react-inlinesvg'
import { toAbsoluteUrl } from "../../../../../../helpers/AssetHelpers"
import { useRequestTasks } from "../../../../hooks/useRequestTasks"
import { Context } from "../../Context"
import { IDataRequestChangesOR, ModalSize, ModalView } from "../../Types"
import { IDataRowRequestChanges } from "../../content/TableData/RequestChangeOR/TypesRequest"

type Props = {
  rowInformation: IDataRowRequestChanges
}
const RequestChangeDetailButton:FC<Props> = ({rowInformation})=> {

  const { openModal } = useContext(Context)
  const { fetchRequestAndTask } = useRequestTasks()

  return (
    <button
      onClick={()=>{
        //Llama a la API para recuperar información del detalle de la Solicitud y sus tareas asociadas .
        fetchRequestAndTask(rowInformation.id_solicitud).then((data:IDataRequestChangesOR)=>{
          //Abre el modal con la vista de detalles de solo lectura y la infomacion recuperada.
          openModal(ModalView.REQUEST_CHANGE_DETAIL_OR,ModalSize.XL, data)
        })   
      }}
      style={{backgroundColor: "transparent", color:"blue"}}
    >
      {rowInformation.nro_ticket}
      <SVG
          width={25}
          height={25}
          src={toAbsoluteUrl("/media/icons/duotune/arrows/arr094.svg")}
          className="category-item"
        />
    </button>
  )
}
export { RequestChangeDetailButton }