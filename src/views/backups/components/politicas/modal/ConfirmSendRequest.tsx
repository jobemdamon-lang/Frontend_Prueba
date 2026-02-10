import { FC } from "react"
import { Modal } from "react-bootstrap"
import { KTSVG } from "../../../../../helpers"
import { useRequestChanges } from "../../../hooks/useRequestChanges"
import { IDataRequestChangesOR } from "../Types"

type Props = {
  showConfirmation: boolean,
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>,
  modalInformation: IDataRequestChangesOR
}
const ConfirmSendRequestForm: FC<Props> = ({ showConfirmation, setShowConfirmation, modalInformation }) => {

  const { sendRequestChange, loadingSendRequest } = useRequestChanges()

  return (
    <Modal
      id='kt_modal_create_app'
      size="sm"
      tabIndex={-1}
      aria-hidden='true'
      dialogClassName='modal-dialog modal-dialog-centered'
      show={showConfirmation}
    >
      <div className='modal-header py-4 bg-dark text-white'>
        <h3 className="text-danger">Confirmación de Envio</h3>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => setShowConfirmation(false)}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body pt-8 px-lg-10 gap-5 d-flex flex-column bg-dark text-center text-white'>
        <h4 className="text-secondary">¿Esta seguro que desea enviar la solicitud de Cambio?</h4>
        <h4 className="text-white">Siguiente Etapa :</h4>
        <span >{modalInformation.estado_siguiente}</span>
        <div className="d-flex justify-content-end gap-5">
          <button
            type="button"
            className="btn btn-primary"
            disabled={loadingSendRequest}
            onClick={() => {
              sendRequestChange(modalInformation.id_solicitud)
            }}
          >
            {loadingSendRequest ? "Enviando..." : "Enviar"}
          </button>
          <button type="button" className="btn btn-danger" onClick={() => setShowConfirmation(false)}>Cancelar</button>
        </div>
      </div>
    </Modal>
  )
}
export { ConfirmSendRequestForm }