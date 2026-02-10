import { Modal } from "react-bootstrap"
import { useUserAdministrationContext } from "./Context"
import { UpdateUser } from "./modal-content/UpdateUser"
import { ModalViewForUserAdministration } from "./Types"
import { AssignProfileToUser } from "./modal-content/AssignProfileUser"

const UserModal = () => {

    const { modalHook } = useUserAdministrationContext()

    return (
        <Modal
            id='kt_modal_create_app'
            size={modalHook.sizeModal || "xl"}
            tabIndex={-1}
            fullscreen={modalHook.wantFullSize}
            dialogClassName='modal-dialog modal-dialog-centered'
            show={modalHook.showModal}
            onHide={() => modalHook.closeModal()}
        >
            {modalHook.modalView === ModalViewForUserAdministration.EDIT_USER && <UpdateUser />}
            {modalHook.modalView === ModalViewForUserAdministration.ASSIGN_PROFILE_USER && <AssignProfileToUser />}
        </Modal>
    )
}

export { UserModal }