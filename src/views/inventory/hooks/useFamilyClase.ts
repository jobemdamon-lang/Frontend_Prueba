import { useCallback, useState } from "react"
import { InventoryService } from "../../../services/Inventory.service"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../../../helpers/handleAxiosError";
import { ICreateFamilyClase, ICreateRelationFamilyClase, IDeleteRelationFamilyClase, IFamilyClase, IUpdateClase, IUpdateFamily, IuseFamilyClase } from "../Types";
import { errorNotification, successNotification } from "../../../helpers/notifications";

const useFamilyClase = (): IuseFamilyClase => {

    const [loadingGetFamilyClase, setLoadingGetFamilyClase] = useState(false)
    const [familyClaseData, setDamilyClaseData] = useState<IFamilyClase[]>([])
    //Estado para la request crear una Familia y clase
    const [loadingCreateFamilyClase, setLoadingCreateFamilyClase] = useState(false)
    //Estado para la request actualizar el nombre de una Familia
    const [loadingUpdateFamilyName, setLoadingUpdateFamilyName] = useState(false)
    //Estado para la request actualizar el nombre de una Clase
    const [loadingUpdateClaseName, setLoadingUpdateClaseName] = useState(false)
    //Estado para la request crear relacion de padre hijo entre familia-clase
    const [loadingCreateRelationFamilyClase, setLoadingCreateRelationFamilyClase] = useState(false)
    //Estado para la request eliminar relacion de padre hijo entre familia-clase
    const [loadingDeleteRelationFamilyClase, setLoadingDeleteRelationFamilyClase] = useState(false)

    const getFamiliesWithClases = useCallback(async function () {
        setLoadingGetFamilyClase(true)
        try {
            const response = await InventoryService.getFamiliesWithClases()
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setDamilyClaseData(response.data.lista)
            } else {
                setDamilyClaseData([])
            }
        } catch (e) {
            handleAxiosError(e)
            setDamilyClaseData([])
        } finally {
            setLoadingGetFamilyClase(false)
        }
    }, [])

    const createFamilyClase = useCallback(async function (params: ICreateFamilyClase) {
        setLoadingCreateFamilyClase(true)
        try {
            const response = await InventoryService.createFamilyClase(params)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se creó la nueva familia y clase correctamente."); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingCreateFamilyClase(false)
        }
    }, [])

    const updateFamilyName = useCallback(async function (familyToUpdate: string, params: IUpdateFamily) {
        setLoadingUpdateFamilyName(true)
        try {
            const response = await InventoryService.updateFamilyName(familyToUpdate, params)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se actualizó la familia correctamente."); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingUpdateFamilyName(false)
        }
    }, [])

    const updateClaseName = useCallback(async function (idOption: number, params: IUpdateClase) {
        setLoadingUpdateClaseName(true)
        try {
            const response = await InventoryService.updateClaseName(idOption.toString(), params)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se actualizó la clase correctamente."); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingUpdateClaseName(false)
        }
    }, [])

    const createRelationFamilyClase = useCallback(async function (params: ICreateRelationFamilyClase) {
        setLoadingCreateRelationFamilyClase(true)
        try {
            const response = await InventoryService.createRelationFamilyClase(params)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se creó la relación correctamente."); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingCreateRelationFamilyClase(false)
        }
    }, [])

    const deleteRelationFamilyClase = useCallback(async function (params: IDeleteRelationFamilyClase) {
        setLoadingDeleteRelationFamilyClase(true)
        try {
            const response = await InventoryService.deleteRelationFamilyClase(params)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se creó la relación correctamente."); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingDeleteRelationFamilyClase(false)
        }
    }, [])

    return {
        getFamiliesWithClases, loadingGetFamilyClase, familyClaseData,
        createFamilyClase, loadingCreateFamilyClase,
        updateFamilyName, loadingUpdateFamilyName,
        updateClaseName, loadingUpdateClaseName,
        createRelationFamilyClase, loadingCreateRelationFamilyClase,
        deleteRelationFamilyClase, loadingDeleteRelationFamilyClase
    }
}
export { useFamilyClase }