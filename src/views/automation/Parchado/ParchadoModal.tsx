import { useWindowsPatchContext } from "./Context"
import { Modal } from "react-bootstrap"
import { ModalView } from "./../Types"
import { Planification } from "./modal-content/Planification"
import { HistoricalPatches } from "./modal-content/HistoricalPatches"
import { GroupAndTemplate } from "./modal-content/GroupAndTemplate"
import { ServerInformation } from "./modal-content/ServerInformation/ServerInformation"
import { ExecutionMain } from "./modal-content/Execution/ExecutionMain"
import { ExecutionDetail } from "./modal-content/ExecutionDetail"
import { CredentialConfiguration } from "./modal-content/Credential/CredentialConfiguration"
import { DeleteExecutionConfirmation } from "./modal-content/DeleteExecutionConfirmation"
import { ExecutionProcessMain } from "./modal-content/Execution/ProgressExecution/ExecutionProcessMain"

const ParchadoModal = (): JSX.Element => {

  const { modalHook } = useWindowsPatchContext()

  return (
    <Modal
      id='kt_modal_create_app'
      size={modalHook.sizeModal || "xl"}
      tabIndex={-1}
      fullscreen={modalHook.wantFullSize}
      aria-hidden='true'
      dialogClassName='modal-dialog modal-dialog-centered'
      show={modalHook.showModal}
    >
      {modalHook.modalView === ModalView.PLANIFICATION && <Planification />}
      {modalHook.modalView === ModalView.HISTORICAL_PATCHES && <HistoricalPatches />}
      {modalHook.modalView === ModalView.GROUP_AND_TEMPLATE && <GroupAndTemplate OPERATE_SYSTEM_ENV="WINDOWS" />}
      {modalHook.modalView === ModalView.SERVER_INFORMATION && <ServerInformation />}
      {modalHook.modalView === ModalView.EXECUTION_MAIN && <ExecutionMain />}
      {modalHook.modalView === ModalView.EXECUTION_PROCESS && <ExecutionProcessMain />}
      {modalHook.modalView === ModalView.EXECUTION_DETAIL && <ExecutionDetail />}
      {modalHook.modalView === ModalView.CREDENTIALS && <CredentialConfiguration />}
      {modalHook.modalView === ModalView.CONFIRM_DELETE_EXECUTION && <DeleteExecutionConfirmation />}
    </Modal>
  )
}
export { ParchadoModal }