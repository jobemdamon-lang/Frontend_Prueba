import { Modal } from "react-bootstrap"
import { useAplicationContext } from "./Context"
import { ModalViewForAplication } from "../Types"
import { ActionConfirmation } from "./Modal-Content/ActionConfirmation"
import { InsertIntegration } from "./Modal-Content/InsertIntegration"
import { InfoUrl } from "./Modal-Content/InfoUrl"
import { EditUrl } from "./Modal-Content/EditUrl"
import { DeleteUrlConfirm } from "./Modal-Content/DeleteUrlConfirm"



const AplicationModal = () => {

    const { modalHook } = useAplicationContext()
    console.log(modalHook.modalView)
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
            {modalHook.modalView === ModalViewForAplication.CONFIRMATION_DELELTE && <ActionConfirmation />}
            {modalHook.modalView === ModalViewForAplication.INSERT_TOKEN && <InsertIntegration />}
            {modalHook.modalView === ModalViewForAplication.INFO_URL && <InfoUrl />}
            {modalHook.modalView === ModalViewForAplication.EDIT_URL && <EditUrl />}
            {modalHook.modalView === ModalViewForAplication.CONFIRMATIONURL_DELELTE && <DeleteUrlConfirm />}
        </Modal>
    )
}
export { AplicationModal }