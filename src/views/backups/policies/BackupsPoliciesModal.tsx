import { Modal } from "react-bootstrap"
import { useBackupsPoliciesContext } from "./Context"
import { ModalViewForBackupsPolicies } from "./Types"
import { CreateGroupPolicy } from "./modal-content/CreateGroupPolicy"
import { DeleteCI } from "./modal-content/DeleteCI"
import { CreateChangeRequest } from "./modal-content/CreateChangeRequest"
import { ChangeRequestLogs } from "./modal-content/ChangeRequestLogs"
import { CancelChangeRequest } from "./modal-content/CancelChangeRequest"
import { DetailPoliticsVersions } from "./modal-content/DetailPoliticsVersions"
import { CreateNewTask } from "./modal-content/CreateNewTask"
import { SendRequestApproval } from "./modal-content/SendRequestApproval"
import { InitializePolicy } from "./modal-content/InitializePolicy"
import { ExportPolicy } from "./modal-content/ExportPolicy"

const BackupsPoliciesModal = () => {

    const { modalHook } = useBackupsPoliciesContext()

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
        {modalHook.modalView === ModalViewForBackupsPolicies.CREATE_GROUP_POLICY && <CreateGroupPolicy />}
        {modalHook.modalView === ModalViewForBackupsPolicies.DELETE_CI && <DeleteCI />}
        {modalHook.modalView === ModalViewForBackupsPolicies.CREATE_CHANGE_REQUEST && <CreateChangeRequest />}
        {modalHook.modalView === ModalViewForBackupsPolicies.CHANGE_REQUEST_LOGS && <ChangeRequestLogs />}
        {modalHook.modalView === ModalViewForBackupsPolicies.CANCEL_CHANGE_REQUEST && <CancelChangeRequest />}
        {modalHook.modalView === ModalViewForBackupsPolicies.DETAIL_POLITICS_VERSIONS && <DetailPoliticsVersions />}
        {modalHook.modalView === ModalViewForBackupsPolicies.CREATE_NEW_TASK && <CreateNewTask />}
        {modalHook.modalView === ModalViewForBackupsPolicies.SEND_REQUEST_APPROVAL && <SendRequestApproval />}
        {modalHook.modalView === ModalViewForBackupsPolicies.INITIALIZE_POLICY && <InitializePolicy />}
        {modalHook.modalView === ModalViewForBackupsPolicies.EXPORT_POLICY && <ExportPolicy />}
        </Modal>
    )
}
export { BackupsPoliciesModal }