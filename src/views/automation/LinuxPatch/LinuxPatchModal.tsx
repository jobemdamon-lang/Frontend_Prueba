import { Modal } from "react-bootstrap"
import { useLinuxPatchContext } from "./Context"
import { ModalViewForLinuxPatch } from "../Types"
import { GroupAndTemplate } from "./modal-content/GroupAndTemplate"
import { CredentialConfiguration } from "./modal-content/Credential/CredentialConfiguration"
import { ExecutionConfiguration } from "./modal-content/Execution/ExecutionConfiguration"
import { ExecutionProgress } from "./modal-content/Execution/ExecutionProgress"
import { ServerInformation } from "./modal-content/ServerInformation/ServerInformation"
import { HistoricExecutions } from "./modal-content/HistoricExecutions"
import { ExecutionSaved } from "./modal-content/Execution/ExecutionSaved"
import { DeleteExecutionConfirm } from "./modal-content/DeleteExecutionConfirm"
import { ExecutionDetail } from "./modal-content/Execution/ExecutionDetail"

const LinuxPatchModal = () => {

    const { modalHook } = useLinuxPatchContext()
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
            {modalHook.modalView === ModalViewForLinuxPatch.GROUPS_AND_TEMPLATES && <GroupAndTemplate OPERATE_SYSTEM_ENV='LINUX' />}
            {modalHook.modalView === ModalViewForLinuxPatch.CREDENTIALS && <CredentialConfiguration />}
            {modalHook.modalView === ModalViewForLinuxPatch.CONFIGURATION_PATCH && <ExecutionConfiguration />}
            {modalHook.modalView === ModalViewForLinuxPatch.EXECUTION_PROGRESS && <ExecutionProgress />}
            {modalHook.modalView === ModalViewForLinuxPatch.SERVER_INFORMATION && <ServerInformation />}
            {modalHook.modalView === ModalViewForLinuxPatch.HISTORIC_EXECUTIONS && <HistoricExecutions />}
            {modalHook.modalView === ModalViewForLinuxPatch.EXECUTION_SAVED && <ExecutionSaved />}
            {modalHook.modalView === ModalViewForLinuxPatch.CONFIRM_DELETE_EXECUTION && <DeleteExecutionConfirm />}
            {modalHook.modalView === ModalViewForLinuxPatch.EXECUTION_DETAIL && <ExecutionDetail />}
        </Modal>
    )
}
export { LinuxPatchModal }