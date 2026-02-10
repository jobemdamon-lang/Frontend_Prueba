import { ModalView } from "./Types"
import { Modal } from 'react-bootstrap'
import { useContext } from 'react'
import { CreateNewPolicy } from "./modal-content/createPolicy/CreateNewPolicy"
import { ContextPolitica } from "./ContextPolitica"
import { UpdatePolicy } from "./modal-content/updatePolicy/UpdatePolicy"
import { DetailPolicy } from "./modal-content/detailPolicy/DetailPolicy"
import { DeleteCIOfPolicy } from "./modal-content/DeleteCIPolicy/DeleteCIOfPolicy"
import { HistoricChanges } from "./modal-content/historicalChanges/HistoricChanges"

const ModalPolitica = ():JSX.Element => {

   const {showModal, modalView, sizeModal, fullsize } = useContext(ContextPolitica)
  //Modal reutilizable la cual muestra un contenido distinto dependendiendo la vista que se indique en la funcion openModal() 
  return (
    <Modal
         id='kt_modal_create_app'
         size={sizeModal || "xl"}
         tabIndex={-1}
         fullscreen={fullsize}
         aria-hidden='true'
         dialogClassName='modal-dialog modal-dialog-centered'
         show={showModal}
      >
         {modalView === ModalView.CREATE_NEW_POLICY_MONITORING && <CreateNewPolicy/>}
         {modalView === ModalView.UPDATE_CURRENT_POLICY && <UpdatePolicy/>}
         {modalView === ModalView.DETAIL_POLICY && <DetailPolicy/>}
         {modalView === ModalView.DELETE_CI_OF_POLICY && <DeleteCIOfPolicy/>}
         {modalView === ModalView.HISTORIC_CHANGES && <HistoricChanges/>}
      </Modal>
  )
}
export { ModalPolitica }