import { Particiones, RequestVM } from "../../Types"
import { useServerProvisioningContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { warningNotification } from "../../../../helpers/notifications"

export const EliminatePartition = () => {

    const {
        modalHook,
        updateRequestHook: { eliminatePartitionVM, loadingEliminatePartition },
        requestVMHook: { getRequestVM }
    } = useServerProvisioningContext()
    const { requestInformation, partitionInformation }: { requestInformation: RequestVM, partitionInformation: Particiones } = modalHook.modalInformation

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (['/', '/boot', '/swap'].includes(partitionInformation.PUNTO_MONTAJE.toLowerCase())){
            warningNotification(`No se puede eliminar la partición ${partitionInformation.PUNTO_MONTAJE} ya que es necesaria`)
            return;
        }
        eliminatePartitionVM(requestInformation.ID_SOLICITUD, partitionInformation.ID_PARTICION).then(result => {
            if (result) {
                getRequestVM(requestInformation.ID_SOLICITUD)
                modalHook.closeModal()
            }
        })
    }

    return (
        <>
            <div className='modal-header py-4'>
                <h2 className="text-dark">
                    <i className="bi bi-exclamation-triangle-fill text-warning me-5 fs-1"></i>
                    ELIMINAR PARTICION
                </h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <form onSubmit={handleSubmit} className="d-flex flex-column">
                <div className='modal-body px-10 text-center'>
                    <p className="fs-5 text-gray-700">
                        ¿Estás seguro que deseas eliminar la particion con el nombre <strong>{partitionInformation?.PUNTO_MONTAJE}</strong> ?
                    </p>
                    <div className="text-center mt-5">
                        <span className="badge badge-light-danger fs-6 p-5 text-danger fw-normal">
                            <i className="bi bi-info-circle-fill text-danger me-2"></i>
                            Esta acción es irreversible
                        </span>
                    </div>
                </div>
                <div className="modal-footer d-flex justify-content-between">
                    <button
                        type="button"
                        className="btn btn-sm btn-light"
                        onClick={() => modalHook.closeModal()}
                        disabled={loadingEliminatePartition}
                    >
                        <i className="bi bi-x-circle fs-3 me-2"></i>
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-sm btn-danger"
                        disabled={loadingEliminatePartition}
                    >
                        {loadingEliminatePartition ?
                            <>
                                Eliminando &nbsp;
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                            </> :
                            <>
                                <i className="bi bi-trash-fill fs-3 me-2"></i>
                                Eliminar Particion
                            </>
                        }
                    </button>
                </div>
            </form>
        </>
    )
}