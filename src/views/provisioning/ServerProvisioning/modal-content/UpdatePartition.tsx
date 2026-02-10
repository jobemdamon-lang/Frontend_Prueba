import { ModalViewForServerProvisioning, Particiones, RequestVM, UpdatedPartition } from "../../Types"
import { useServerProvisioningContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useState } from "react"
import { useTypedSelector } from "../../../../store/ConfigStore"
import { warningNotification } from "../../../../helpers/notifications"
import { getTotalDiskSpace, MOUNT_POINT_REGEX, normalizeMountPoint } from "../utils"
import { ModalSize } from "../../../../hooks/Types"

export const UpdatePartition = () => {

    const {
        modalHook,
        updateRequestHook: { updatePartitionVM, loadingUpdatePartition },
        requestVMHook: { getRequestVM }
    } = useServerProvisioningContext()
    const { requestInformation, partitionInformation }: { requestInformation: RequestVM, partitionInformation: Particiones } = modalHook.modalInformation
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const [updatedPartition, setUpdatedPartition] = useState<UpdatedPartition>(() => ({
        id_particion: partitionInformation.ID_PARTICION,
        usuario_modificacion: userName,
        gb_particion: partitionInformation.GB_PARTICION,
        punto_montaje: partitionInformation.PUNTO_MONTAJE
    }))

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Recopilar todos los puntos de montaje
        const mountPointsInUse = new Set<string>();
        requestInformation.DISCOS.forEach(disk => {
            disk.PARTICIONES?.forEach(particion => {
                // Excluir la partición que estamos editando
                if (particion.PUNTO_MONTAJE && particion.ID_PARTICION !== partitionInformation.ID_PARTICION) {
                    mountPointsInUse.add(particion.PUNTO_MONTAJE)
                }
            })
        })

        if (['/boot', '/swap'].includes(partitionInformation.PUNTO_MONTAJE.toLowerCase())) {
            warningNotification(`No se puede editar la particion ${partitionInformation.PUNTO_MONTAJE}`)
            return;
        }

        if (partitionInformation.PUNTO_MONTAJE === '/' && updatedPartition.punto_montaje !== '/') {
            warningNotification('El nombre de la partición "/" no puede ser editada')
            return;
        }

        if (updatedPartition.punto_montaje && mountPointsInUse.has(updatedPartition.punto_montaje)) {
            warningNotification(`El punto de montaje '${updatedPartition.punto_montaje}' ya está en uso`)
            return;
        }

        if (updatedPartition.punto_montaje === '/' && updatedPartition.gb_particion < 10) {
            warningNotification('La partición / debe tener al menos 10GB')
            return;
        }

        updatePartitionVM(requestInformation.ID_SOLICITUD, updatedPartition).then(result => {
            if (!result && !Array.isArray(result)) return;
            const [success, recommended] = result
            if (success) {
                getRequestVM(requestInformation.ID_SOLICITUD)
                modalHook.closeModal()
            } else if (recommended) {
                modalHook.openModal(ModalViewForServerProvisioning.VALIDATE_RECOMMENDATION, ModalSize.XL, undefined, {
                    recommended: recommended,
                    message: "No se pudo actualizar la solicitud por falta de recursos",
                    requestedStorageGB: getTotalDiskSpace(requestInformation?.DISCOS || []) + updatedPartition.gb_particion,
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
                    ACTUALIZAR PARTICION
                </h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <form onSubmit={handleSubmit} className="d-flex flex-column">
                <div className='modal-body px-10 d-flex flex-column gap-5'>
                    <div className="">
                        <label htmlFor="punto_montaje" className="form-label">
                            Punto de montaje
                        </label>
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon1">
                                <i className="bi bi-folder fs-2"></i>
                            </span>
                            <input
                                type="text"
                                id="punto_montaje"
                                className="form-control"
                                required
                                value={updatedPartition.punto_montaje}
                                onChange={e => {
                                    setUpdatedPartition(prev => ({
                                        ...prev,
                                        punto_montaje: normalizeMountPoint(e.target.value)
                                    }));
                                }}
                                pattern={MOUNT_POINT_REGEX.toString().slice(1, -1)}
                                title="El punto de montaje debe comenzar con / (ej: /mnt/datos)"
                            />
                            {updatedPartition.punto_montaje && !MOUNT_POINT_REGEX.test(updatedPartition.punto_montaje) && (
                                <div className="fv-plugins-message-container invalid-feedback">
                                    El punto de montaje debe comenzar con /
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="">
                        <label htmlFor="gb_particion" className="form-label">
                            Tamaño (GB)
                        </label>
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon1"><i className="bi bi-123 fs-2"></i></span>
                            <input
                                type="number"
                                id="gb_particion"
                                className="form-control"
                                required
                                value={updatedPartition.gb_particion === 0 ? '' : updatedPartition.gb_particion}
                                onChange={e => setUpdatedPartition(prev => ({ ...prev, gb_particion: Number(e.target.value) }))}
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
                        disabled={loadingUpdatePartition}
                    >
                        <i className="bi bi-x-circle fs-3 me-2"></i>
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-sm btn-success"
                        disabled={loadingUpdatePartition}
                    >
                        {loadingUpdatePartition ?
                            <>
                                Actualizando &nbsp;
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                            </> :
                            <>
                                <i className="bi bi-pencil fs-3 me-2"></i>
                                Actualizar Particion
                            </>
                        }
                    </button>
                </div>
            </form>
        </>
    )
}