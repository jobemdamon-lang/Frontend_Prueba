import "../../../../../assets/sass/components/backups-styles/_policies-requestNotification.scss"
import SVG from 'react-inlinesvg'
import { toAbsoluteUrl } from "../../../../../helpers/AssetHelpers"
import { FC, useContext } from "react"
import { Context } from "../Context"
import { IDataRequestChangeByUser, IDataRequestChangesOR, ModalSize, ModalView } from "../Types"
import { useDispatch } from "react-redux"
import { closeOffCanvas } from "../../../../../store/offcanvasSlice"
import { useRequestTasks } from "../../../hooks/useRequestTasks"
import { toast } from "react-toastify"

type Props = {
  requestInfo: IDataRequestChangeByUser
}
const RequestNotification: FC<Props> = ({ requestInfo }) => {

  const { openModal } = useContext(Context)
  const dispatch = useDispatch()
  const { fetchRequestAndTask } = useRequestTasks()

  return (
    <button
      onClick={() => {
        //Cierro el aside y solicito informacion de la solicitud y sus tareas y abro el modal con es info
        dispatch(closeOffCanvas())
        setTimeout(() => {
          fetchRequestAndTask(requestInfo.ID_SOLICITUD).then((data: IDataRequestChangesOR) => {
            if (data?.id_solicitud === undefined) {
              toast.error(`Oh No! Ocurrio un problema al solicitar la información`, {
                position: toast.POSITION.TOP_RIGHT
              })
            }
            openModal(ModalView.REQUEST_CHANGE_DETAIL_RW, ModalSize.XL, data)
          })
        }, 500)
      }}
      className="requestBox">
      <div className="d-flex flex-column">
        <div>
          <span className="number-request mb-2 request-icon"> TICKET {requestInfo.NRO_TICKET}</span>
        </div>
        <div className="d-flex justify-content-center gap-5 align-items-center request-icon">
          <div>
            <SVG src={toAbsoluteUrl("/media/icons/duotune/communication/com010.svg")} height={50} width={50} />
          </div>
          <div className="request-info">
            <p><strong>Estado:</strong> {requestInfo.ETAPA}</p>
            <p><strong>Actor Actual:</strong> {requestInfo.ACTOR_ACTUAL}</p>
            <p><strong>Fecha Registro:</strong> {requestInfo.FECHA_REGISTRO}</p>
            <p><strong>Motivo:</strong> {requestInfo.MOTIVO?.substring(0, 15) + "..."}</p>
            <p><strong>Solicitante:</strong> {requestInfo.SOLICITANTE}</p>
          </div>
        </div>
      </div>

    </button>
  )
}
export { RequestNotification }