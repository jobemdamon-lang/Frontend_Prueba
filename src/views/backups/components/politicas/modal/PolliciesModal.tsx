import { ModalView } from "../Types"
import { Modal } from 'react-bootstrap'
import { useContext } from 'react'
import { Context } from '../Context'
import { CreateGroupForm } from "./CreateGroupForm"
import { CreateChangeRequestForm } from "./CreateChangeRequestForm"
import { TaskPane } from "./TaskPolicies/TaskPane"
import { RequestChangeDetail } from "./RequestChange/RequestChangeDetail"
import { SearchRequest } from "./SearchRequest"
import { RequestChangeDetailRW } from "./RequestChange/RequestChangeDetailRW"

const BackupModal = ():JSX.Element => {

   const {showModal, modalView, sizeModal } = useContext(Context)
  //Modal reutilizable la cual muestra un contenido distinto dependendiendo la vista que se indique en la funcion openModal() 
  return (
    <Modal
         id='kt_modal_create_app'
         size={sizeModal || "xl"}
         tabIndex={-1}
         aria-hidden='true'
         dialogClassName='modal-dialog modal-dialog-centered'
         show={showModal}
      >
         {modalView === ModalView.CREATE_GROUP && <CreateGroupForm/>}
         {modalView === ModalView.CHANGE_REQUEST && <CreateChangeRequestForm/>}
         {modalView === ModalView.TASK_PANE && <TaskPane/>}
         {modalView === ModalView.REQUEST_CHANGE_DETAIL_OR && <RequestChangeDetail/>}
         {modalView === ModalView.REQUEST_CHANGE_DETAIL_RW && <RequestChangeDetailRW/>}
         {modalView === ModalView.SEARCH_REQUEST && <SearchRequest/>}
      </Modal>
  )
}
export { BackupModal }