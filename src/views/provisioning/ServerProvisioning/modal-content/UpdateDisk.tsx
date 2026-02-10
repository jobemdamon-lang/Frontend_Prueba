import { Disco, ModalViewForServerProvisioning, RequestVM, UpdatedDisk } from "../../Types"
import { useServerProvisioningContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useState } from "react"
import { useTypedSelector } from "../../../../store/ConfigStore"
import { warningNotification } from "../../../../helpers/notifications"
import { DRIVE_REGEX, extractDriveLetter, getTotalDiskSpace, validateDriveName } from "../utils"
import { ModalSize } from "../../../../hooks/Types"

export const UpdateDisk = () => {

    const {
        modalHook,
        updateRequestHook: { updateDiskVM, loadingUpdateDisk },
        requestVMHook: { getRequestVM }
    } = useServerProvisioningContext()
    const { requestInformation, diskInformation }: { requestInformation: RequestVM, diskInformation: Disco } = modalHook.modalInformation
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const [updatedDisk, setUpdatedDisk] = useState<UpdatedDisk>(() => ({
        gb_disco: diskInformation.GB_DISCO,
        id_disco: diskInformation.ID_DISCO,
        nombre_unidad: diskInformation.NOMBRE_UNIDAD,
        usuario_modificacion: userName
    }))

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const originalDriveLetter = extractDriveLetter(diskInformation.NOMBRE_UNIDAD)
        const updatedDriveLetter = extractDriveLetter(updatedDisk.nombre_unidad)
        const alreadyExists = requestInformation.DISCOS.some(disk => {
            const existingDriveLetter = extractDriveLetter(disk.NOMBRE_UNIDAD)
            return disk.ID_DISCO !== diskInformation.ID_DISCO &&
                existingDriveLetter === updatedDriveLetter
        })

        if (originalDriveLetter === 'C' && updatedDriveLetter !== 'C') {
            warningNotification(`El nombre de la unidad C: no puede ser editada`)
            return;
        }

        if (originalDriveLetter === 'P') {
            warningNotification(`La unidad P: no puede ser editada`)
            return;
        }

        if (alreadyExists) {
            warningNotification(`La unidad ${updatedDriveLetter}: ya está en uso`)
            return;
        }

        if (updatedDriveLetter === 'C' && updatedDisk.gb_disco < 30) {
            warningNotification(`El disco C: no puede tener menos de 30 GB`)
            return;
        }

        updateDiskVM(requestInformation.ID_SOLICITUD, updatedDisk).then(result => {
            if (!result && !Array.isArray(result)) return;
            const [success, recommended] = result

            if (success) {
                getRequestVM(requestInformation.ID_SOLICITUD)
                modalHook.closeModal()
            } else if (recommended) {
                modalHook.openModal(ModalViewForServerProvisioning.VALIDATE_RECOMMENDATION, ModalSize.XL, undefined, {
                    recommended: recommended,
                    message: "No se pudo actualizar la solicitud por falta de recursos",
                    requestedStorageGB: getTotalDiskSpace(requestInformation?.DISCOS || []) + updatedDisk.gb_disco,
                    requestedRAMMB: requestInformation.RAM_GB,
                    requestedCPUCores: requestInformation.VCPU_CORES
                })
            }
        })
    }

    return (
        <>
            <div className='modal-header py-4'>
                <h2 className="text-dark">
                    ACTUALIZAR DISCO
                </h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <form onSubmit={handleSubmit} className="d-flex flex-column">
                <div className='modal-body px-10 d-flex flex-column gap-5'>
                    <div className="">
                        <label htmlFor="nombre_unidad" className="form-label">
                            Nombre de la Unidad
                        </label>
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon1"><i className="bi bi-folder fs-2"></i></span>
                            <input
                                type="text"
                                id="nombre_unidad"
                                required
                                className="form-control"
                                value={updatedDisk.nombre_unidad}
                                onChange={e => setUpdatedDisk(prev => ({ ...prev, nombre_unidad: e.target.value }))}
                                pattern={DRIVE_REGEX.source}
                                title="Formato válido: Letra de unidad seguida de : (ej: C:) o con ruta (ej: D:\BACKUP)"
                            />
                            {updatedDisk.nombre_unidad && !validateDriveName(updatedDisk.nombre_unidad) && (
                                <div className="fv-plugins-message-container invalid-feedback">
                                    Formato inválido. Use: Letra: (ej: C:)
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="">
                        <label htmlFor="gb-disco" className="form-label">
                            Tamaño (GB)
                        </label>
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon1"><i className="bi bi-123 fs-2"></i></span>
                            <input
                                type="number"
                                id="gb-disco"
                                className="form-control"
                                required
                                value={updatedDisk.gb_disco === 0 ? '' : updatedDisk.gb_disco}
                                onChange={e => setUpdatedDisk(prev => ({ ...prev, gb_disco: Number(e.target.value) }))}
                                min="0"
                            />
                        </div>
                    </div>
                </div>
                <div className="modal-footer d-flex justify-content-between">
                    <button
                        type="button"
                        className="btn btn-sm btn-light"
                        onClick={() => modalHook.closeModal()}
                        disabled={loadingUpdateDisk}
                    >
                        <i className="bi bi-x-circle fs-3 me-2"></i>
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-sm btn-success"
                        disabled={loadingUpdateDisk}
                    >
                        {loadingUpdateDisk ?
                            <>
                                Actualizando &nbsp;
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                            </> :
                            <>
                                <i className="bi bi-pencil fs-3 me-2"></i>
                                Actualizar Disco
                            </>
                        }
                    </button>
                </div>
            </form>
        </>
    )
}