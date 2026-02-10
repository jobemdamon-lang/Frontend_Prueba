import { ModalView } from "../Types"
import { Modal } from 'react-bootstrap'
import { useContext } from 'react'
import { Context } from "./Context"
import { NewSubmodule } from "./modal-content/NewSubmodule"
import { NewModule } from "./modal-content/NewModule"
import { NewProfile } from "./modal-content/NewProfile"
import { AssignProfileToArea } from "./modal-content/AssignProfileToArea"

const AccesosModal = (): JSX.Element => {

  const { showModal, closeModal, modalView, sizeModal } = useContext(Context)

  return (
    <Modal
      id='kt_modal_create_app'
      size={sizeModal || "xl"}
      tabIndex={-1}
      aria-hidden='true'
      dialogClassName='modal-dialog modal-dialog-centered'
      show={showModal}
      onHide={() => closeModal()}
    >
      {modalView === ModalView.NEW_SUBMODULE && <NewSubmodule />}
      {modalView === ModalView.NEW_MODULE && <NewModule />}
      {modalView === ModalView.NEW_PROFILE && <NewProfile />}
      {modalView === ModalView.ASSIGN_PROFILE_TO_AREA && <AssignProfileToArea />}
    </Modal>
  )
}
export { AccesosModal }