import { Modal } from "react-bootstrap"
import { useServerProvisioningContext } from "./Context"
import { ModalViewForServerProvisioning } from "../Types"
import { ApproveRequest } from "./modal-content/ApproveRequest"
import { SendToApprove } from "./modal-content/SendToApprove"
import { CancelRequest } from "./modal-content/CancelRequest"
import { UpdateGeneral } from "./modal-content/UpdateGeneral"
import { UpdateNetwork } from "./modal-content/UpdateNetwork"
import { UpdateServices } from "./modal-content/UpdateServices"
import { UpdateHardware } from "./modal-content/UpdateHardware"
import { EliminateDisk } from "./modal-content/EliminateDisk"
import { EliminatePartition } from "./modal-content/EliminatePartition"
import { AddPartition } from "./modal-content/AddPartition"
import { UpdatePartition } from "./modal-content/UpdatePartition"
import { AddDisk } from "./modal-content/AddDisk"
import { UpdateDisk } from "./modal-content/UpdateDisk"
import { ConfirmExecution } from "./modal-content/ConfirmExecution"
import { CancelCreation } from "./modal-content/CancelCreation"
import { ProvisioningProgress } from "./modal-content/ProvisioningProgress"
import { AdministrateAccounts } from "./modal-content/AdministrateAccounts"
import { RevalidateApproval } from "./modal-content/RevalidateApproval"
import { RecommendationResult } from "./modal-content/RecommendationResult"
import { EDRWarning } from "./modal-content/EDRWarning"

const ProvisioningServerModal = () => {

    const { modalHook } = useServerProvisioningContext()

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
            {modalHook.modalView === ModalViewForServerProvisioning.APPROVAL_MODAL && <ApproveRequest />}
            {modalHook.modalView === ModalViewForServerProvisioning.SEND_APPROVE && <SendToApprove />}
            {modalHook.modalView === ModalViewForServerProvisioning.CANCEL_REQUEST && <CancelRequest />}
            {modalHook.modalView === ModalViewForServerProvisioning.UPDATE_GENERAL && <UpdateGeneral />}
            {modalHook.modalView === ModalViewForServerProvisioning.UPDATE_NETWORK && <UpdateNetwork />}
            {modalHook.modalView === ModalViewForServerProvisioning.UPDATE_SERVICES && <UpdateServices />}
            {modalHook.modalView === ModalViewForServerProvisioning.UPDATE_HARDWARE && <UpdateHardware />}
            {modalHook.modalView === ModalViewForServerProvisioning.ELIMINATE_DISK && <EliminateDisk />}
            {modalHook.modalView === ModalViewForServerProvisioning.ELIMINATE_PARTITION && <EliminatePartition />}
            {modalHook.modalView === ModalViewForServerProvisioning.ADD_PARTITION && <AddPartition />}
            {modalHook.modalView === ModalViewForServerProvisioning.UPDATE_PARTITION && <UpdatePartition />}
            {modalHook.modalView === ModalViewForServerProvisioning.ADD_DISK && <AddDisk />}
            {modalHook.modalView === ModalViewForServerProvisioning.UPDATE_DISK && <UpdateDisk />}
            {modalHook.modalView === ModalViewForServerProvisioning.CONFIRM_EXECUTION && <ConfirmExecution />}
            {modalHook.modalView === ModalViewForServerProvisioning.CANCEL_CREATION && <CancelCreation />}
            {modalHook.modalView === ModalViewForServerProvisioning.INFO_EXECUTION && <ProvisioningProgress />}
            {modalHook.modalView === ModalViewForServerProvisioning.MANAGE_ACCOUNTS && <AdministrateAccounts />}
            {modalHook.modalView === ModalViewForServerProvisioning.REVALIDATE_APPROVAL && <RevalidateApproval />}
            {modalHook.modalView === ModalViewForServerProvisioning.VALIDATE_RECOMMENDATION && <RecommendationResult />}
            {modalHook.modalView === ModalViewForServerProvisioning.EDR_WARNING && <EDRWarning />}
        </Modal>
    )
}
export { ProvisioningServerModal }