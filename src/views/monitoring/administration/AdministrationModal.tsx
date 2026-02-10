import { Modal } from "react-bootstrap"
import { useAdministrationContext } from "./Context"
import { ModalViewForAdministration } from "./Types"
import { CreateMetric } from "./modal-content/CreateMetric"
import { UpdateMetric } from "./modal-content/UpdateMetric"
import { CreateParam } from "./modal-content/CreateParam"
import { UpdateParam } from "./modal-content/UpdateParam"
import { CreateUmbral } from "./modal-content/CreateUmbral"
import { UpdateUmbral } from "./modal-content/UpdateUmbral"

const AdministrationModal = () => {

    const { modalHook } = useAdministrationContext()

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
            {modalHook.modalView === ModalViewForAdministration.CREATE_METRIC && <CreateMetric />}
            {modalHook.modalView === ModalViewForAdministration.UPDATE_METRIC && <UpdateMetric />}
            {modalHook.modalView === ModalViewForAdministration.CREATE_PARAM && <CreateParam />}
            {modalHook.modalView === ModalViewForAdministration.CREATE_UMBRAL && <CreateUmbral />}
            {modalHook.modalView === ModalViewForAdministration.UPDATE_PARAM && <UpdateParam />}
            {modalHook.modalView === ModalViewForAdministration.UPDATE_UMBRAL && <UpdateUmbral />}
        </Modal>
    )
}

export { AdministrationModal }