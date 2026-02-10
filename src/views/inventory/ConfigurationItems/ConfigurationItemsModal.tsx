import { Modal } from "react-bootstrap"
import { useConfigurationItemsContext } from "./Context"
import { ModalViewForConfigurationItems } from "../Types"
import { UpdateCISpecific } from "./modal-content/UpdateCISpecific"
import { InformationCI } from "./modal-content/InformationCI"
import { UpdateCIGeneral } from "./modal-content/UpdateCIGeneral"
import { CreateCI } from "./modal-content/CreateCI"
import { AdministrateIP } from "./modal-content/AdministrateIP"
import { RelationCI } from "./modal-content/RelationCI"
import { Hierarchy } from "./modal-content/Hierarchy"
import { BulkLoad } from "./modal-content/BulkLoad"

const ConfigurationItemsModal = () => {

    const { modalHook } = useConfigurationItemsContext()
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
            {modalHook.modalView === ModalViewForConfigurationItems.UPDATE_CI_GENERAL && <UpdateCIGeneral />}
            {modalHook.modalView === ModalViewForConfigurationItems.UPDATE_CI_SPECIFIC && <UpdateCISpecific />}
            {modalHook.modalView === ModalViewForConfigurationItems.INFORMATION_CI && <InformationCI />}
            {modalHook.modalView === ModalViewForConfigurationItems.CREATE_CI && <CreateCI />}
            {modalHook.modalView === ModalViewForConfigurationItems.ADMINISTRATE_IP && <AdministrateIP />}
            {modalHook.modalView === ModalViewForConfigurationItems.RELATION_CI && <RelationCI />}
            {modalHook.modalView === ModalViewForConfigurationItems.HIERARCHY && <Hierarchy />}
            {modalHook.modalView === ModalViewForConfigurationItems.BULKLOAD && <BulkLoad />}
        </Modal>
    )
}
export { ConfigurationItemsModal }