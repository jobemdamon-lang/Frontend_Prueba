import { ModalView } from "../Types"
import { Modal } from 'react-bootstrap'
import { useProjectSubModuleContext } from './Context'
import { NewProject } from "./modal-content/NewProject"
import { NewClient } from "./modal-content/NewClient"
import { AddCollab } from "./modal-content/AddCollab"
import { Confirmation } from "./modal-content/Confirmation"
import { DeleteConfirmation } from "./modal-content/DeleteConfirmation"
import { UpdateOwnerConfirmation } from "./modal-content/UpdateOwnerConfirmation"

const ProjectModal = (): JSX.Element => {

   const { modalHook } = useProjectSubModuleContext()
   const { showModal, modalView, sizeModal, closeModal } = modalHook

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
         {modalView === ModalView.NEW_PROJECT && <NewProject />}
         {modalView === ModalView.NEW_CLIENT && <NewClient />}
         {modalView === ModalView.ADD_COLABORATOR && <AddCollab />}
         {modalView === ModalView.CONFIRMATION && <Confirmation />}
         {modalView === ModalView.DELETE_CONFIRMATION && <DeleteConfirmation />}
         {modalView === ModalView.UDPATE_OWNERS && <UpdateOwnerConfirmation />}
      </Modal>
   )
}
export { ProjectModal }