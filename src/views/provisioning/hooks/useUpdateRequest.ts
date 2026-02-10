import { useCallback, useState } from "react"
import { ProvisioningService } from "../../../services/Provisioning.service"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../../../helpers/handleAxiosError";
import { errorNotification, successNotification } from "../../../helpers/notifications";
import { IuseRequestUpdateVM, NewDisk, NewPartition, UpdatedDisk, UpdatedGeneral, UpdatedHardware, UpdatedPartition, UpdatedServices } from "../Types";

const useUpdateRequestVM = (): IuseRequestUpdateVM => {

    const [loadingUpdateGeneral, setLoadingUpdateGeneral] = useState(false)
    const [loadingUpdateHardware, setLoadingUpdateHardware] = useState(false)
    const [loadingUpdateServices, setLoadingUpdateServices] = useState(false)
    const [loadingAddDisk, setLoadingAddDisk] = useState(false)
    const [loadingUpdateDisk, setLoadingUpdateDisk] = useState(false)
    const [loadingEliminateDisk, setLoadingEliminateDisk] = useState(false)
    const [loadingAddPartition, setLoadingAddPartition] = useState(false)
    const [loadingUpdatePartition, setLoadingUpdatePartition] = useState(false)
    const [loadingEliminatePartition, setLoadingEliminatePartition] = useState(false)


    const updateGeneralVM = useCallback(async function (id_request: number, data: UpdatedGeneral): Promise<Array<boolean | unknown> | undefined> {
        setLoadingUpdateGeneral(true)
        try {
            const response = await ProvisioningService.updateGeneral(id_request, data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje); return [true, undefined]
            } else {
                errorNotification(response.data.mensaje)
                return [false, response.data?.recommended]
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingUpdateGeneral(false)
        }
    }, [])

    const updatehardwareVM = useCallback(async function (id_request: number, data: UpdatedHardware): Promise<Array<boolean | unknown> | undefined> {
        setLoadingUpdateHardware(true)
        try {
            const response = await ProvisioningService.updateHardware(id_request, data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje); return [true, undefined]
            } else {
                errorNotification(response.data.mensaje)
                return [false, response.data?.recommended]
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingUpdateHardware(false)
        }
    }, [])


    const updateServicesVM = useCallback(async function (id_request: number, data: UpdatedServices) {
        setLoadingUpdateServices(true)
        try {
            const response = await ProvisioningService.updateServices(id_request, data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingUpdateServices(false)
        }
    }, [])

    const addDiskVM = useCallback(async function (id_request: number, data: NewDisk): Promise<Array<boolean | unknown> | undefined> {
        setLoadingAddDisk(true)
        try {
            const response = await ProvisioningService.addDisk(id_request, data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje); return [true, undefined]
            } else {
                errorNotification(response.data.mensaje)
                return [false, response.data?.recommended]
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingAddDisk(false)
        }
    }, [])


    const updateDiskVM = useCallback(async function (id_request: number, data: UpdatedDisk): Promise<Array<boolean | unknown> | undefined> {
        setLoadingUpdateDisk(true)
        try {
            const response = await ProvisioningService.updateDisk(id_request, data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje); return [true, undefined]
            } else {
                errorNotification(response.data.mensaje)
                return [false, response.data?.recommended]
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingUpdateDisk(false)
        }
    }, [])


    const eliminateDiskVM = useCallback(async function (id_request: number, id_disco: number) {
        setLoadingEliminateDisk(true)
        try {
            const response = await ProvisioningService.deleteDisk(id_request, id_disco)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingEliminateDisk(false)
        }
    }, [])


    const addPartitionVM = useCallback(async function (id_request: number, data: NewPartition): Promise<Array<boolean | unknown> | undefined> {
        setLoadingAddPartition(true)
        try {
            const response = await ProvisioningService.addPartition(id_request, data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje); return [true, undefined]
            } else {
                errorNotification(response.data.mensaje)
                return [false, response.data?.recommended]
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingAddPartition(false)
        }
    }, [])

    const updatePartitionVM = useCallback(async function (id_request: number, data: UpdatedPartition): Promise<Array<boolean | unknown> | undefined> {
        setLoadingUpdatePartition(true)
        try {
            const response = await ProvisioningService.updatePartition(id_request, data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje); return [true, undefined]
            } else {
                errorNotification(response.data.mensaje)
                return [false, response.data?.recommended]
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingUpdatePartition(false)
        }
    }, [])

    const eliminatePartitionVM = useCallback(async function (id_request: number, id_partition: number) {
        setLoadingEliminatePartition(true)
        try {
            const response = await ProvisioningService.deletePartition(id_request, id_partition)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingEliminatePartition(false)
        }
    }, [])

    return {
        updateGeneralVM, loadingUpdateGeneral,
        updatehardwareVM, loadingUpdateHardware,
        updateServicesVM, loadingUpdateServices,
        addDiskVM, loadingAddDisk,
        updateDiskVM, loadingUpdateDisk,
        eliminateDiskVM, loadingEliminateDisk,
        addPartitionVM, loadingAddPartition,
        updatePartitionVM, loadingUpdatePartition,
        eliminatePartitionVM, loadingEliminatePartition
    }
}

export { useUpdateRequestVM }