import { FC, useContext } from "react"
import { Modal } from "react-bootstrap"
import { KTSVG } from "../../../../../helpers"
import { IDataRequestChangesOR } from "../Types"
import { Context } from "../Context"
import { useRequestChanges } from "../../../hooks/useRequestChanges"
import { IAuthState } from "../../../../../store/auth/Types"
import { RootState } from "../../../../../store/ConfigStore"
import { shallowEqual, useSelector } from "react-redux"

type Props = {
  showEliminationConfirmation: boolean,
  setShowEliminationConfirmation: React.Dispatch<React.SetStateAction<boolean>>
}
const ConfirmCancelation: FC<Props> = ({ showEliminationConfirmation, setShowEliminationConfirmation }) => {
  
  const user: IAuthState = useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState
  const { closeModal, modalInformation }: { closeModal: any, modalInformation: IDataRequestChangesOR } = useContext(Context)
  const { cancelRequestChange, cancelRequestChangeLoading } = useRequestChanges()

  return (
    <Modal
      id='kt_modal_create_app'
      size="sm"
      tabIndex={-1}
      aria-hidden='true'
      dialogClassName='modal-dialog modal-dialog-centered'
      show={showEliminationConfirmation}
    >
      <div className='modal-header py-4 bg-dark text-white'>
        <h3 className="text-danger">CANCELACIÓN</h3>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => setShowEliminationConfirmation(false)}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body pt-8 px-lg-10 gap-5 d-flex flex-column bg-dark text-center text-white'>
        <h4 className="text-secondary">¿Esta seguro que desea Cancelar esta Solicitud?</h4>
        <div className="d-flex justify-content-end gap-5">
          <button
            type="button"
            className="btn btn-primary"
            disabled={cancelRequestChangeLoading}
            onClick={() => {
              cancelRequestChange({
                id_solicitud: modalInformation.id_solicitud,
                usuario: user.usuario
              }).then((res: boolean) => {
                if (res) {
                  setShowEliminationConfirmation(false)
                  closeModal()
                }
              })
            }}
          >
            {cancelRequestChangeLoading ? "Cancelando..." : "Cancelar"}
          </button>
          <button type="button" className="btn btn-danger" onClick={() => setShowEliminationConfirmation(false)}>Cerrar</button>
        </div>
      </div>
    </Modal>
  )
}
export { ConfirmCancelation }