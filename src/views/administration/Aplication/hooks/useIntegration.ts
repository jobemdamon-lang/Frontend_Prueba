import { useCallback, useState } from "react"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../../../../helpers/handleAxiosError";
import { errorNotification, successNotification } from "../../../../helpers/notifications";
import { ICreateIntegration, ICreateIntegrationUrl, IIntegration, IUpdateURL, IuseIntegration } from "../../Types";
import { IntegrationService } from "../../../../services/Integration.service";

const useIntegration = (): IuseIntegration => {

    //Estado para la request activar y desactivar integracion
    const [loadingActivateDesactivate, setActivateDesactivate] = useState(false)

    //Estado para la request de creación de integracion
    const [loadingCreateIntegration, setCreateIntegration] = useState(false)

    //Estado para la request de creación integracion_url
    const [loadingCreateIntegrationUrl, setCreateIntegrationUrl] = useState(false)

    //Estado para la request de eliminación integracion_url
    const [loadingDeleteIntegrationUrl, setDeleteIntegrationUrl] = useState(false)

    //Estado para la request de actualizar la url
    const [loadingUpdateUrl, setUpdateUrl] = useState(false)

    //Estado para la request de Generación de Token
    const [loadingGenerationToken, setGenerationToken] = useState(false)

    //Estado para la request obtener todas las integraciones
    const [loadingListAllIntegrations, setLoadingListAllIntegrations] = useState(false)
    const [integrationsList, setIntegrationslist] = useState<IIntegration[]>([])

    //Estado para la request obtener la integracion por ID
    const [loadingListIntegration, setLoadingListIntegration] = useState(false)
    const [integration, setIntegration] = useState<[]>([])

    //Estado para la request obtener la integracion_url por ID
    const [loadingListIntegrationUrl, setLoadingListIntegrationUrl] = useState(false)
    const [integrationUrl, setIntegrationUrl] = useState<[]>([])


    const activateDesactivateIntegration = useCallback(async function (idIntegration: string) {
        setActivateDesactivate(true)
        try {
            const response = await IntegrationService.activateDesactivateIntegration(idIntegration)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se cambio el estado de la integración"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setActivateDesactivate(false)
        }
    }, [])

    const createIntegration = useCallback(async function (integrationInformation: ICreateIntegration) {
        setCreateIntegration(true)
        try {
            const response = await IntegrationService.createIntegration(integrationInformation)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se creo la integración correctamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setCreateIntegration(false)
        }
    }, [])

    const createIntegrationUrl = useCallback(async function (integrationInformationUrl: ICreateIntegrationUrl) {
        setCreateIntegrationUrl(true)
        try {
            const response = await IntegrationService.createIntegrationUrl(integrationInformationUrl)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se realizo la creación de URL correctamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setCreateIntegrationUrl(false)
        }
    }, [])

    const deleteUrl = useCallback(async function (idUrl: string) {
        console.log(idUrl)
        setDeleteIntegrationUrl(true)
        try {
            const response = await IntegrationService.deleteUrl(idUrl)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se elimino la URL correctamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setDeleteIntegrationUrl(false)
        }
    }, [])

    const generateTokenIntegration = useCallback(async function (idIntegration: string) {
        setGenerationToken(true)
        try {
            const response = await IntegrationService.generateTokenIntegration(idIntegration)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se realizo la creación del token correctamente "); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setGenerationToken(false)
        }
    }, [])


    const getLisAlltIntegration = useCallback(async function () {
        setLoadingListAllIntegrations(true)
        try {
            const response = await IntegrationService.lisAlltIntegration()
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setIntegrationslist(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingListAllIntegrations(false)
        }
    }, [])

    const getListIntegration = useCallback(async function (idIntegration: string) {
        setLoadingListIntegration(true)
        try {
            const response = await IntegrationService.listIntegration(idIntegration)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setIntegration(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingListIntegration(false)
        }
    }, [])

    const updateUrl = useCallback(async function (idUrl: string, integrationUpdateUrl: IUpdateURL) {
        setUpdateUrl(true)
        try {
            const response = await IntegrationService.updateUrl(idUrl, integrationUpdateUrl)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification("Se actualizo la URL correctamente"); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setUpdateUrl(false)
        }
    }, [])

    const getListIntegrationUrl = useCallback(async function (idIntegration: string) {
        setLoadingListIntegrationUrl(true)
        try {
            const response = await IntegrationService.listIntegrationUrl(idIntegration)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setIntegrationUrl(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingListIntegrationUrl(false)
        }
    }, [])





    return {
        activateDesactivateIntegration, loadingActivateDesactivate,
        createIntegration, loadingCreateIntegration,
        createIntegrationUrl, loadingCreateIntegrationUrl,
        deleteUrl, loadingDeleteIntegrationUrl,
        generateTokenIntegration, loadingGenerationToken,
        getLisAlltIntegration, loadingListAllIntegrations, integrationsList,
        getListIntegration, loadingListIntegration, integration,
        getListIntegrationUrl, loadingListIntegrationUrl, integrationUrl,
        updateUrl, loadingUpdateUrl

    }
}
export { useIntegration }