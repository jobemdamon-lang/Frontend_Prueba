import { useCallback, useState } from "react"
import { InventoryService } from "../../../services/Inventory.service"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../../../helpers/handleAxiosError";
import { IAddOptionListOfAtt, IAttributeOfFamilyClase, ICreateAttribute, IOptionByAttribute, IUpdateNameAttribute, IUpdateNameOptionListOfAtt, IuseAttribute } from "../Types";
import { errorNotification, successNotification } from "../../../helpers/notifications";

const useAttribute = (): IuseAttribute => {

    //Estado para la request agregar un nuevo atributo a una familia-clase
    const [loadingAddAttribute, setLoadingAddAttribute] = useState(false)
    //Estado para la request obtener atributos de una familia-clase
    const [loadingGetAttribute, setLoadingGetAttribute] = useState(false)
    const [attributesOfFamilyClase, setAttributesOfFamilyClase] = useState<IAttributeOfFamilyClase[]>([])
    //Estado para la request agregar un nuevo atributo a una familia-clase
    const [loadingChangeStatusAtt, setLoadingChangeStatusAtt] = useState(false)
    //Estado para la request agregar una nueva opción a la lista de posibles valores del atributo
    const [loadingCreateOptionListOfAtt, setLoadingCreateOptionListOfAtt] = useState(false)
    //Estado para la request editar el nombre de la opcion de la lista de posibles valores del atributo
    const [loadingUpdateOptionNameListOfAtt, setLoadingUpdateOptionNameListOfAtt] = useState(false)
    //Estado para la request eliminar opcion de la lista de posibles valores del atributo
    const [loadingChangeStatusOptionListOfAtt, setLoadingChangeStatusptionListOfAtt] = useState(false)
    //Estado para la request obtener lista de posibles valores del atributo
    const [loadingGetOptionsListOfAtt, setLoadingGetOptionsListOfAtt] = useState(false)
    const [optionsListOfAttribute, setOptionsListOfAttributes] = useState<IOptionByAttribute[]>([])
    //Estado para la request eliminar opcion de la lista de posibles valores del atributo
    const [loadingUpdateNameAttribute, setLoadingUpdateNameAttribute] = useState(false)


    const createAttribute = useCallback(async function (idOption: number, params: ICreateAttribute) {
        setLoadingAddAttribute(true)
        try {
            const response = await InventoryService.createAttribute(idOption.toString(), params)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se añadió el nuevo atributo exitosamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingAddAttribute(false)
        }
    }, [])

    const getAttributesByFamilyClase = useCallback(async function (idOption: number) {
        setLoadingGetAttribute(true)
        try {
            const response = await InventoryService.getAttributesByFamilyClase(idOption.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setAttributesOfFamilyClase(response.data.lista)
            } else {
                setAttributesOfFamilyClase([])
            }
        } catch (e) {
            setAttributesOfFamilyClase([])
            handleAxiosError(e)
        } finally {
            setLoadingGetAttribute(false)
        }
    }, [])

    const changeStatusOfAttribute = useCallback(async function (idAttribute: number, status: number) {
        setLoadingChangeStatusAtt(true)
        try {
            const response = await InventoryService.changeStatusOfAttribute(idAttribute.toString(), status.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se cambió el estadoo del atributo correctamente."); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingChangeStatusAtt(false)
        }
    }, [])

    const addOptionListInAtt = useCallback(async function (idFamilyClase: string, idAttribute: string, params: IAddOptionListOfAtt) {
        setLoadingCreateOptionListOfAtt(true)
        try {
            const response = await InventoryService.addOptionListOfAttribute(idFamilyClase.toString(), idAttribute.toString(), params)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se añadió la nueva opción correctamente."); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingCreateOptionListOfAtt(false)
        }
    }, [])

    const updateOptionListOfAtt = useCallback(async function (idOptionList: string, params: IUpdateNameOptionListOfAtt) {
        setLoadingUpdateOptionNameListOfAtt(true)
        try {
            const response = await InventoryService.updateNameOfOptionListOfAtt(idOptionList.toString(), params)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se actualizó la opción correctamente."); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingUpdateOptionNameListOfAtt(false)
        }
    }, [])

    const changeStatusOfOptionListOfAtt = useCallback(async function (idOptionList: string, status: number) {
        setLoadingChangeStatusptionListOfAtt(true)
        try {
            const response = await InventoryService.changeStatusOfOptionListOfAtt(idOptionList.toString(), status.toString())
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se cambió el estado de la opción correctamente."); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingChangeStatusptionListOfAtt(false)
        }
    }, [])

    const getListOptionsOfAtt = useCallback(async function (idFamilyClase: string, idAttribute: string) {
        setLoadingGetOptionsListOfAtt(true)
        try {
            const response = await InventoryService.getListOptionsOfAtt(idFamilyClase, idAttribute)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setOptionsListOfAttributes(response.data.lista)
            } else {
                setOptionsListOfAttributes([])
            }
        } catch (e) {
            handleAxiosError(e)
            setOptionsListOfAttributes([])
        } finally {
            setLoadingGetOptionsListOfAtt(false)
        }
    }, [])

    const updateNameAttribute = useCallback(async function (idAttribute: string, params: IUpdateNameAttribute) {
        setLoadingUpdateNameAttribute(true)
        try {
            const response = await InventoryService.updateNameAttribute(idAttribute.toString(), params)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se actualizó el nombre de la opción correctamente."); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingUpdateNameAttribute(false)
        }
    }, [])

    return {
        createAttribute, loadingAddAttribute,
        getAttributesByFamilyClase, attributesOfFamilyClase, loadingGetAttribute,
        changeStatusOfAttribute, loadingChangeStatusAtt,
        addOptionListInAtt, loadingCreateOptionListOfAtt,
        updateOptionListOfAtt, loadingUpdateOptionNameListOfAtt,
        changeStatusOfOptionListOfAtt, loadingChangeStatusOptionListOfAtt,
        getListOptionsOfAtt, loadingGetOptionsListOfAtt, optionsListOfAttribute,
        updateNameAttribute, loadingUpdateNameAttribute,
    }
}
export { useAttribute }