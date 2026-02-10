import { Modal } from "react-bootstrap"
import { useMonitoringPoliciesContext } from "./Context"
import { ModalViewForMonitoringPolicies } from "./Types"
import { DeleteCI } from "./modal-content/DeleteCI"
import { HistoricMain } from "./modal-content/Historic"
import { UpdateMetric } from "./modal-content/UpdateMetric"
import { DeleteMetric } from "./modal-content/DeleteMetric"
import { AddCIMetrics } from "./modal-content/AddCIMetrics"
import { DetailVersion } from "./modal-content/DetailVersion"
import { AddMetric } from "./modal-content/AddMetric"
import { DetailChange } from "./modal-content/DetailChange"
import { CancelChange } from "./modal-content/CancelChange"
import { ImplementChange } from "./modal-content/ImplementChange"
import { InitializePolicy } from "./modal-content/InitializePolicy"
import { DetailVersionOld } from "./modal-content/DetailVersionOld"
import { HistoricChangesOld } from "./modal-content/HistoricOld"
import { ValidateMassiveCI } from "./modal-content/ValidateMassiveCI"
import { ChargePolicy } from "./modal-content/ChargePolicy"

const MonitoringPoliciesModal = () => {

    const { modalHook } = useMonitoringPoliciesContext()

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
            {modalHook.modalView === ModalViewForMonitoringPolicies.DETAIL_VERSION && <DetailVersion />}
            {modalHook.modalView === ModalViewForMonitoringPolicies.DELETE_CI && <DeleteCI />}
            {modalHook.modalView === ModalViewForMonitoringPolicies.HISTORIC && <HistoricMain />}
            {modalHook.modalView === ModalViewForMonitoringPolicies.UPDATE_METRIC && <UpdateMetric />}
            {modalHook.modalView === ModalViewForMonitoringPolicies.DELETE_METRIC && <DeleteMetric />}
            {modalHook.modalView === ModalViewForMonitoringPolicies.ADD_CI_METRICS && <AddCIMetrics />}
            {modalHook.modalView === ModalViewForMonitoringPolicies.ADD_METRIC && <AddMetric />}
            {modalHook.modalView === ModalViewForMonitoringPolicies.DETAIL_CHANGE && <DetailChange />}
            {modalHook.modalView === ModalViewForMonitoringPolicies.CANCEL_CHANGE && <CancelChange />}
            {modalHook.modalView === ModalViewForMonitoringPolicies.IMPLEMENT_CHANGE && <ImplementChange />}
            {modalHook.modalView === ModalViewForMonitoringPolicies.INITIALIZE_POLICY && <InitializePolicy />}
            {modalHook.modalView === ModalViewForMonitoringPolicies.DETAIL_VERSION_OLD && <DetailVersionOld />}
            {modalHook.modalView === ModalViewForMonitoringPolicies.HISTORIC_OLD && <HistoricChangesOld />}
            {modalHook.modalView === ModalViewForMonitoringPolicies.VALIDATE_MASSIVE_CI && <ValidateMassiveCI />}
            {modalHook.modalView === ModalViewForMonitoringPolicies.CHARGE_POLICY && <ChargePolicy />}
        </Modal>
    )
}
export { MonitoringPoliciesModal }