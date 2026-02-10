import { Modal } from "react-bootstrap"
import { useAdministrateCMDBContext } from "./Context"
import { ModalViewForAdministrateCMDB } from "../Types"
import { UpdateAttribute } from "./modal-content/UpdateAttribute"
import { CreateFamilyClase } from "./modal-content/CreateFamilyClase"
import { UpdateFamilyClase } from "./modal-content/UpdateFamilyClase"
import { CreateRelationFamilyClase } from "./modal-content/CreateRelationFamilyClase"
import { DeleteRelationFamilyClase } from "./modal-content/DeleteRelationFamilyClase"
import { HierarchyFamilyClase } from "./modal-content/HierarchyFamilyClase"

const AdministrateCMDBModal = () => {

   const { modalHook } = useAdministrateCMDBContext()
   //Modal reutilizable la cual muestra un contenido distinto dependendiendo la vista que se indique en la funcion openModal() 
   return (
      <Modal
         id='kt_modal_create_app'
         size={modalHook.sizeModal || "xl"}
         tabIndex={-1}
         fullscreen={modalHook.wantFullSize}
         aria-hidden='true'
         dialogClassName='modal-dialog modal-dialog-centered'
         show={modalHook.showModal}
         onHide={() => modalHook.closeModal()}
      >
         {modalHook.modalView === ModalViewForAdministrateCMDB.UPDATE_ATTRIBUTE && <UpdateAttribute/>}
         {modalHook.modalView === ModalViewForAdministrateCMDB.CREATE_FAMILY && <CreateFamilyClase/>}
         {modalHook.modalView === ModalViewForAdministrateCMDB.UPDATE_FAMILY_CLASE && <UpdateFamilyClase/>}
         {modalHook.modalView === ModalViewForAdministrateCMDB.CREATE_RELATION && <CreateRelationFamilyClase/>}
         {modalHook.modalView === ModalViewForAdministrateCMDB.DELETE_RELATION && <DeleteRelationFamilyClase/>}
         {modalHook.modalView === ModalViewForAdministrateCMDB.HIERARCHY_FAMILYCLASE && <HierarchyFamilyClase/>}
      </Modal>
   )
}
export { AdministrateCMDBModal }