import { Disco, ModalViewForServerProvisioning, NewPartition, RequestVM } from "../../Types"
import { useServerProvisioningContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useState } from "react"
import { useTypedSelector } from "../../../../store/ConfigStore"
import { warningNotification } from "../../../../helpers/notifications"
import { getTotalDiskSpace, MOUNT_POINT_REGEX, normalizeMountPoint } from "../utils"
import { ModalSize } from "../../../../hooks/Types"

export const AddPartition = () => {

    const {
        modalHook,
        updateRequestHook: { addPartitionVM, loadingAddPartition },
        requestVMHook: { getRequestVM }
    } = useServerProvisioningContext()
    const { requestInformation, diskInformation }: { requestInformation: RequestVM, diskInformation: Disco } = modalHook.modalInformation
    const isLinux = requestInformation.SO?.toLowerCase() === "linux"
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const [newPartition, setNewPartition] = useState<NewPartition>(() => ({
        id_disco: diskInformation.ID_DISCO,
        usuario_creacion: userName,
        gb_particion: 0,
        punto_montaje: ''
    }))

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (isLinux) {
            // Recopilar todos los puntos de montaje existentes
            const mountPointsInUse = new Set<string>()

            requestInformation.DISCOS.forEach(disk => {
                disk.PARTICIONES?.forEach(particion => {
                    if (particion.PUNTO_MONTAJE) {
                        mountPointsInUse.add(particion.PUNTO_MONTAJE)
                    }
                })
            })

            // Validar puntos de montaje duplicados
            if (newPartition.punto_montaje) {
                if (mountPointsInUse.has(newPartition.punto_montaje)) {
                    warningNotification(`El punto de montaje '${newPartition.punto_montaje}' ya está en uso`)
                    return;
                }
            }
        }

        addPartitionVM(requestInformation.ID_SOLICITUD, newPartition).then(result => {
            if (!result && !Array.isArray(result)) return;
            const [success, recommended] = result
            if (success) {
                getRequestVM(requestInformation.ID_SOLICITUD)
                modalHook.closeModal()
            } else if (recommended) {

                modalHook.openModal(ModalViewForServerProvisioning.VALIDATE_RECOMMENDATION, ModalSize.XL, undefined, {
                    recommended: recommended,
                    message: "No se pudo actualizar la solicitud por falta de recursos",
                    requestedStorageGB: getTotalDiskSpace(requestInformation?.DISCOS || []) + newPartition.gb_particion,
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
                    AGREGAR PARTICION
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
                            <span className="input-group-text" id="basic-addon1"><i className="bi bi-folder fs-2"></i></span>
                            <input
                                type="text"
                                id="punto_montaje"
                                className="form-control"
                                required
                                value={newPartition.punto_montaje}
                                onChange={e => {
                                    setNewPartition(prev => ({
                                        ...prev,
                                        punto_montaje: normalizeMountPoint(e.target.value)
                                    }));
                                }}
                                pattern={MOUNT_POINT_REGEX.toString().slice(1, -1)}
                                title="El punto de montaje debe comenzar con / (ej: /mnt/datos)"
                            />
                            {newPartition.punto_montaje && !MOUNT_POINT_REGEX.test(newPartition.punto_montaje) && (
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
                                value={newPartition.gb_particion === 0 ? '' : newPartition.gb_particion}
                                onChange={e => setNewPartition(prev => ({ ...prev, gb_particion: Number(e.target.value) }))}
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
                        disabled={loadingAddPartition}
                    >
                        <i className="bi bi-x-circle fs-3 me-2"></i>
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-sm btn-success"
                        disabled={loadingAddPartition}
                    >
                        {loadingAddPartition ?
                            <>
                                Eliminando &nbsp;
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                            </> :
                            <>
                                <i className="bi bi-plus-circle fs-3 me-2"></i>
                                Añadir Particion
                            </>
                        }
                    </button>
                </div>
            </form>
        </>
    )
}