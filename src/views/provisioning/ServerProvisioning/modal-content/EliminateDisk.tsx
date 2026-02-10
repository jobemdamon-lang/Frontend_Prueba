import { Disco, RequestVM } from "../../Types"
import { useServerProvisioningContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { warningNotification } from "../../../../helpers/notifications"
import { extractDriveLetter } from "../utils"

export const PROTECTED_DISKS = {
    WINDOWS: ['C', 'P'],
    LINUX: ['/']
}

export const EliminateDisk = () => {

    const {
        modalHook,
        updateRequestHook: { eliminateDiskVM, loadingEliminateDisk },
        requestVMHook: { getRequestVM }
    } = useServerProvisioningContext()
    const { requestInformation, diskInformation }: { requestInformation: RequestVM, diskInformation: Disco } = modalHook.modalInformation

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Validación para evitar eliminar discos necesarios
        const { WINDOWS, LINUX } = PROTECTED_DISKS
        const isWindows = requestInformation?.SO.toLowerCase() === 'windows'
        const driveLetter = extractDriveLetter(diskInformation?.NOMBRE_UNIDAD) || ''

        if (isWindows && WINDOWS.includes(driveLetter)) {
            warningNotification(`No se puede eliminar el disco ${driveLetter} ya que es un disco necesario`)
            return;
        }

        if (!isWindows && diskInformation.PARTICIONES?.some(p => LINUX.includes(p.PUNTO_MONTAJE))) {
            warningNotification('Este disco no puede ser eliminado')
            return;
        }

        eliminateDiskVM(requestInformation.ID_SOLICITUD, diskInformation.ID_DISCO).then(result => {
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
                    ELIMINAR DISCO
                </h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <form onSubmit={handleSubmit} className="d-flex flex-column">
                <div className='modal-body px-10 text-center'>
                    <p className="fs-5 text-gray-700">
                        ¿Estás seguro que deseas eliminar el disco con el nombre <strong>{diskInformation?.NOMBRE_UNIDAD}</strong> ?
                    </p>
                    {requestInformation?.SO.toLowerCase() === 'linux' && (
                        <p className="fs-6 text-gray-600">Todas las particiones asociadas también serán eliminadas.</p>
                    )}
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
                        disabled={loadingEliminateDisk}
                    >
                        <i className="bi bi-x-circle fs-3 me-2"></i>
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-sm btn-danger"
                        disabled={loadingEliminateDisk}
                    >
                        {loadingEliminateDisk ?
                            <>
                                Eliminando &nbsp;
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                            </> :
                            <>
                                <i className="bi bi-trash-fill fs-3 me-2"></i>
                                Eliminar Disco
                            </>
                        }
                    </button>
                </div>
            </form>
        </>
    )
}