import { Modal } from "react-bootstrap"
import { useIncidentContext } from "./Context"
import { ModalViewForIncident } from "../Types"
import { TrackingPanel } from "./modal-content/TrackingPanel/TrackingPanel"
import { CreateIncident } from "./modal-content/CreateIncident"
import { PriorizationConfirm } from "./modal-content/PriorizationConfirm"
import { DespriorizationConfirm } from "./modal-content/DespriorizationConfirm"
import { StartTrackingConfirmation } from "./modal-content/StartTrackingConfirmation"
import { ReopenIncidentConfirmation } from "./modal-content/ReopenIncidentConfirmation"
import { HistoricIncidentInformation } from "./modal-content/HistoricIncidentInformation"
import { ExportIncidents } from "./modal-content/ExportIncidents"

const IncidentModal = () => {

    const { modalHook } = useIncidentContext()
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
            {modalHook.modalView === ModalViewForIncident.START_TRACKING_CONFIRMATION && <StartTrackingConfirmation />}
            {modalHook.modalView === ModalViewForIncident.TRACKING_PANEL && <TrackingPanel />}
            {modalHook.modalView === ModalViewForIncident.CREATE_INCIDENT && <CreateIncident />}
            {modalHook.modalView === ModalViewForIncident.PRIORIZATION_CONFIRM && <PriorizationConfirm />}
            {modalHook.modalView === ModalViewForIncident.DESPRIORIZATION_CONFIRM && <DespriorizationConfirm />}
            {modalHook.modalView === ModalViewForIncident.REOPEN_CONFIRMATION && <ReopenIncidentConfirmation />}
            {modalHook.modalView === ModalViewForIncident.HISTORIC_INFO_INCIDENT && <HistoricIncidentInformation />}
            {modalHook.modalView === ModalViewForIncident.EXPORT_INCIDENTS && <ExportIncidents />}
            {/*modalHook.modalView === ModalViewForIncident.DESPRIORIZATION_IC && <DespriorizationIC />}
            {modalHook.modalView === ModalViewForIncident.PRIORIZATION_IC && <PriorizationIC />*/}
        </Modal>
    )
}
export { IncidentModal }