import { useCallback, useState } from "react"
import { ProvisioningService } from "../../../services/Provisioning.service"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../../../helpers/handleAxiosError";
import { IuseParams, RequestFormOptions, Template, Vlan } from "../Types";
import { AdministrationService } from "../../../services/Administration.service";
import { IComboData } from "../../../helpers/Types";
import { IListCollaborators } from "../../administration/Types";

const useParams = (): IuseParams => {

    const [loadingRequestParams, setLoadingRequestParams] = useState(false)
    const [requestParams, setRequestParams] = useState<RequestFormOptions[]>([])
    const [loadingVlans, setLoadingVlans] = useState(false)
    const [vlans, setVlans] = useState<Vlan[]>([])
    const [loadingTemplate, setLoadingTemplate] = useState(false)
    const [template, setTemplate] = useState<Template[]>([])
    const [loadingScopes, setLoadingScopes] = useState(false)
    const [projectScopes, setScopes] = useState<RequestFormOptions[]>([])
    const [towers, setTowers] = useState<IComboData[]>([])
    const [loadingTowers, setLoadingTowers] = useState(false)
    const [collaborators, setCollaborators] = useState<Array<IListCollaborators>>([])
    const [loadingCollabs, setLoadingCollabs] = useState(false)

    const getRequestFormParams = useCallback(async function () {
        setLoadingRequestParams(true)
        try {
            const response = await ProvisioningService.getRequestFormParams()
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setRequestParams(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingRequestParams(false)
        }
    }, [])

    const getRequestFormTemplate = useCallback(async function () {
        setLoadingTemplate(true)
        try {
            const response = await ProvisioningService.getRequestFormTemplate()
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setTemplate(response.data.data)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingTemplate(false)
        }
    }, [])

    const getVlans = useCallback(async function () {
        setLoadingVlans(true)
        try {
            const response = await ProvisioningService.getVlans()
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setVlans(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingVlans(false)
        }
    }, [])

    const getScopeByProject = useCallback(async function (id_project: number) {
        setLoadingScopes(true)
        try {
            const response = await ProvisioningService.getScopeByProject(id_project)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setScopes(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingScopes(false)
        }
    }, [])

    const getTowers = useCallback(async function () {
        setLoadingTowers(true)
        try {
            const response = await AdministrationService.getDataFilter({
                filtro: "",
                tabla: "admin_torre"
            })
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setTowers(response.data.lista)
            }
        } catch (e) {
            setTowers([])
        } finally {
            setLoadingTowers(false)
        }
    }, [])


    const getCollaborators = useCallback(async function () {
        setLoadingCollabs(true)
        try {
            const response = await AdministrationService.getCollaborators()
            if (isSuccessActionInBackend(response.status)) {
                setCollaborators(response.lista)
            }else {
                console.log("no entro")
            }
        } catch (e) {
            setCollaborators([])
        } finally {
            setLoadingCollabs(false)
        }
    }, [])


    return {
        getRequestFormParams, loadingRequestParams, requestParams,
        getRequestFormTemplate, loadingTemplate, template,
        getVlans, loadingVlans, vlans,
        getScopeByProject, loadingScopes, projectScopes,
        getTowers, loadingTowers, towers,
        getCollaborators, loadingCollabs, collaborators
    }
}

export { useParams }