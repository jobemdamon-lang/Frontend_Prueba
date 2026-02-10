import { ModalView } from "../Types"
import { Modal } from 'react-bootstrap'
import { useContext } from 'react'
import { Context } from './Context'
import { EditColab } from "./modal-content/EditCollab"

const ColabModal = (): JSX.Element => {

   const { showModal, modalView, sizeModal, closeModal } = useContext(Context)
   //Modal reutilizable la cual muestra un contenido distinto dependendiendo la vista que se indique en la funcion openModal() 
   return (
      <Modal
         id='kt_modal_create_app'
         size={sizeModal || "xl"}
         tabIndex={-1}
         aria-hidden='true'
         dialogClassName='modal-dialog modal-dialog-centered'
         onHide={() => closeModal()}
         show={showModal}
      >
         {modalView === ModalView.EDIT_COLAB && <EditColab />}
      </Modal>
   )
}
export { ColabModal }