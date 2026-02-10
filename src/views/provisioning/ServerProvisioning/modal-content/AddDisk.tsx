import { FC, useCallback, useState } from "react"
import { useTypedSelector } from "../../../../store/ConfigStore"
import { ModalViewForServerProvisioning, NewDisk, NewDiskPartition, RequestVM } from "../../Types"
import { useServerProvisioningContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { clearFieldError, DRIVE_REGEX, extractDriveLetter, getError, getTotalDiskSpace, normalizeMountPoint, validateDriveName, validateStorageIndividual } from "../utils"
import { warningNotification } from "../../../../helpers/notifications"
import { ModalSize } from "../../../../hooks/Types"

export const AddDisk = () => {

    const {
        modalHook,
        updateRequestHook: { addDiskVM, loadingAddDisk },
        requestVMHook: { getRequestVM }
    } = useServerProvisioningContext()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const requestInformation: RequestVM = modalHook.modalInformation
    const isLinux = requestInformation.SO?.toLowerCase() === "linux"
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [newDisk, setNewDisk] = useState<NewDisk>(() => ({
        usuario_creacion: userName,
        gb_disco: 0,
        nombre_unidad: isLinux
            ? `/dev/sd${String.fromCharCode(97 + requestInformation.DISCOS.length)}`
            : '',
        particiones: isLinux ? [{ punto_montaje: '', gb_particion: 0 }] : [],
        so: requestInformation.SO
    }))

    const handleAddPartition = () => {
        setNewDisk(prev => {
            return {
                ...prev,
                particiones: [...prev.particiones, { punto_montaje: '', gb_particion: 0 }]
            }
        })
    }

    const handleUpdatePartition = useCallback((
        indexPartition: number,
        field: keyof NewDiskPartition,
        value: string | number
    ) => {
        const updatedDisk = {
            ...newDisk,
            particiones: newDisk.particiones.map((partition, j) =>
                j === indexPartition ? { ...partition, [field]: value } : partition
            )
        }
        setNewDisk(updatedDisk)
    }, [newDisk])

    const handleRemovePartition = useCallback((
        indexPartition: number
    ) => {
        clearFieldError(`particion-${indexPartition}-montaje`, setErrors)
        clearFieldError(`particion-${indexPartition}-gb`, setErrors)
        const updatedDisk = {
            ...newDisk,
            particiones: newDisk.particiones.filter((_, j) => j !== indexPartition)
        }

        setNewDisk(updatedDisk)
    }, [newDisk])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!newDisk) return;

        // Validar existencia de disco en Windows
        if (!isLinux) {
            const newDriveLetter = extractDriveLetter(newDisk.nombre_unidad)
            const alreadyExists = requestInformation.DISCOS.some(disk => {
                const existingDriveLetter = extractDriveLetter(disk.NOMBRE_UNIDAD)
                return existingDriveLetter === newDriveLetter
            })
            if (alreadyExists) {
                warningNotification(`La unidad ${newDriveLetter}: ya está en uso`)
                return;
            }

        } else {
            // Validar particiones general
            const newErrors = validateStorageIndividual(newDisk.particiones, requestInformation.SO);
            setErrors(newErrors)
            if (Object.keys(newErrors).length > 0) return;

            // Recopilar todos los puntos de montaje existentes
            const mountPointsInUse = new Set<string>()
            requestInformation.DISCOS.forEach(disk => {
                disk.PARTICIONES?.forEach(particion => {
                    if (particion.PUNTO_MONTAJE) {
                        mountPointsInUse.add(particion.PUNTO_MONTAJE)
                    }
                })
            })

            // Verificar si alguna partición nueva tiene un punto de montaje ya en uso
            const duplicateMountPoint = newDisk.particiones?.find(particion => {
                return particion.punto_montaje && mountPointsInUse.has(particion.punto_montaje);
            });

            if (duplicateMountPoint) {
                warningNotification(`El punto de montaje '${duplicateMountPoint.punto_montaje}' ya está en uso`);
                return;
            }
        }

        addDiskVM(requestInformation.ID_SOLICITUD, newDisk).then(result => {
            if (!result && !Array.isArray(result)) return;
            const [success, recommended] = result
            if (success) {
                getRequestVM(requestInformation.ID_SOLICITUD)
                modalHook.closeModal()
            } else if (recommended) {
                const gb_extra = isLinux ? newDisk.particiones.reduce((sum, e) => sum + e.gb_particion, 0): newDisk.gb_disco
                modalHook.openModal(ModalViewForServerProvisioning.VALIDATE_RECOMMENDATION, ModalSize.XL, undefined, {
                    recommended: recommended,
                    message: "No se pudo actualizar la solicitud por falta de recursos",
                    requestedStorageGB: getTotalDiskSpace(requestInformation?.DISCOS || []) + gb_extra,
                    requestedRAMMB: requestInformation.RAM_GB,
                    requestedCPUCores: requestInformation.VCPU_CORES
                })
            }
        })
    }


    return (
        <>
            <div className='modal-header py-4'>
                <h2 className="text-dark">NUEVO DISCO</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <form onSubmit={handleSubmit} className=" px-10">
                <div className='modal-body d-flex flex-column align-items-center'>
                    <div className="card card-custom">
                        <div className={`card-header px-5 py-5 d-flex justify-content-between align-items-end flex-sm-nowrap gap-3 ${isLinux && 'bg-secondary'}`}>
                            <div className="d-flex gap-3 align-items-center">
                                {isLinux ? (
                                    <span className="ms-8 text-gray-700 fs-3">{newDisk.nombre_unidad}</span>
                                ) : (
                                    <>
                                        <div>
                                            <label htmlFor="nombre_unidad" className="form-label">
                                                Nombre de unidad
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-text" id="basic-addon1">
                                                    <i className="bi bi-hdd fs-2"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    id="nombre_unidad"
                                                    required
                                                    className="form-control"
                                                    value={newDisk.nombre_unidad}
                                                    onChange={e => setNewDisk(prev => ({
                                                        ...prev,
                                                        nombre_unidad: e.target.value.toUpperCase()
                                                    }))}
                                                    pattern={DRIVE_REGEX.source}
                                                    title="Formato válido: Letra de unidad seguida de : (ej: C:) o con ruta (ej: D:\BACKUP)"
                                                />
                                                {newDisk.nombre_unidad && !validateDriveName(newDisk.nombre_unidad) && (
                                                    <div className="fv-plugins-message-container invalid-feedback">
                                                        Formato inválido. Use: Letra: (ej: C:)
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="gb-disco" className="form-label">
                                                Tamaño (GB)
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-text" id="basic-addon1"><i className="bi bi-123 fs-2"></i></span>
                                                <input
                                                    type="number"
                                                    id="gb-disco"
                                                    required
                                                    className="form-control"
                                                    value={newDisk.gb_disco === 0 ? '' : newDisk.gb_disco}
                                                    onChange={e => setNewDisk(prev => ({ ...prev, gb_disco: Number(e.target.value) }))}
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="d-flex gap-2">
                                {isLinux && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-light text-primary"
                                        onClick={() => handleAddPartition()}
                                    >
                                        Añadir partición &nbsp;
                                        <i className="bi bi-plus-circle-fill fs-4 text-primary"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        {newDisk.particiones.length > 0 && (
                            <div className="card-body">
                                {newDisk.particiones.map((partition, partitionIndex) => (
                                    <PartitionInputs
                                        key={partitionIndex}
                                        partition={partition}
                                        indexPartition={partitionIndex}
                                        errors={errors}
                                        handleUpdatePartition={handleUpdatePartition}
                                        handleRemovePartition={handleRemovePartition}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                <div className="modal-footer d-flex justify-content-between">
                    <button
                        type="button"
                        className="btn btn-sm btn-light"
                        onClick={() => modalHook.closeModal()}
                        disabled={loadingAddDisk}
                    >
                        <i className="bi bi-x-circle fs-3 me-2"></i>
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-sm btn-light-success"
                        disabled={loadingAddDisk}
                    >
                        {loadingAddDisk ?
                            <>
                                Añadiendo &nbsp;
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                            </> :
                            <>
                                <i className="bi bi-plus-circle fs-3"></i>
                                Añadir Disco
                            </>
                        }
                    </button>
                </div>
            </form>
        </>
    )
}

const PartitionInputs: FC<{
    partition: NewDiskPartition;
    indexPartition: number;
    errors: Record<string, string>
    handleUpdatePartition: (indexPartition: number, field: keyof NewDiskPartition, value: string | number) => void
    handleRemovePartition: (indexPartition: number) => void
}> = ({ partition, indexPartition, errors, handleUpdatePartition, handleRemovePartition }) => (
    <div className="mb-3">
        <div className="d-flex align-items-end gap-4 justify-content-center">
            <div className="">
                <label htmlFor={`punto_montaje-${indexPartition}`} className="form-label">
                    Punto de montaje
                </label>
                <div className="input-group">
                    <span className="input-group-text" id="basic-addon1"><i className="bi bi-folder fs-2"></i></span>
                    <input
                        type="text"
                        id={`punto_montaje-${indexPartition}`}
                        className="form-control"
                        value={partition.punto_montaje}
                        onChange={e => handleUpdatePartition(indexPartition, 'punto_montaje', normalizeMountPoint(e.target.value))}
                    />
                </div>
                {errors[`particion-${indexPartition}-montaje`] && (
                    <div className="fv-plugins-message-container invalid-feedback">
                        {getError(`particion-${indexPartition}-montaje`, errors)}
                    </div>
                )}
            </div>
            <div className="">
                <label htmlFor={`gb_particion-${indexPartition}`} className="form-label">
                    Tamaño (GB)
                </label>
                <div className="input-group">
                    <span className="input-group-text" id="basic-addon1"><i className="bi bi-123 fs-2"></i></span>
                    <input
                        type="number"
                        id={`gb_particion-${indexPartition}`}
                        className="form-control"
                        value={partition.gb_particion === 0 ? '' : partition.gb_particion}
                        onChange={e => handleUpdatePartition(indexPartition, 'gb_particion', Number(e.target.value))}
                        min="0"
                    />
                </div>
                {errors[`particion-${indexPartition}-gb`] && (
                    <div className="fv-plugins-message-container invalid-feedback">
                        {getError(`particion-${indexPartition}-gb`, errors)}
                    </div>
                )}
            </div>
            <button
                type="button"
                className="btn btn-sm btn-light text-danger"
                onClick={() => handleRemovePartition(indexPartition)}
            >
                <i className="bi bi-trash3 text-danger fs-2"></i>
            </button>
        </div>
    </div>
);
