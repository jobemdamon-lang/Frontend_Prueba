import { useCallback, useState } from "react"
import { ProvisioningService } from "../../../services/Provisioning.service"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../../../helpers/handleAxiosError";
import { errorNotification, successNotification } from "../../../helpers/notifications";
import { CreateTowerOwner, IuseAdministrate, TowerOwner } from "../Types";

const useAdministrate = (): IuseAdministrate => {

    const [loadingAddOwner, setLoadingAddOwner] = useState(false)
    const [loadingDeleteOwner, setLoadingDeleteOwner] = useState(false)
    const [loadingGetOwners, setLoadingGetOwners] = useState(false)
    const [owners, setOwners] = useState<TowerOwner[]>([])


    const getTowerOwners = useCallback(async function () {
        setLoadingGetOwners(true)
        try {
            const response = await ProvisioningService.getTowerOwners()
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setOwners(response.data.lista)
            }
        } catch (e) {
            setOwners([])
        } finally {
            setLoadingGetOwners(false)
        }
    }, [])

    const addTowerOwner = useCallback(async function (data: CreateTowerOwner) {
        setLoadingAddOwner(true)
        try {
            const response = await ProvisioningService.createTowerOwner(data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje)
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingAddOwner(false)
        }
    }, [])


    const deleteTowerOwner = useCallback(async function (id_manage_account: number) {
        setLoadingDeleteOwner(true)
        try {
            const response = await ProvisioningService.deleteTowerOwner(id_manage_account)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje)
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingDeleteOwner(false)
        }
    }, [])



    return {
        getTowerOwners, loadingGetOwners, owners,
        addTowerOwner, loadingAddOwner,
        deleteTowerOwner, loadingDeleteOwner
    }
}

export { useAdministrate }