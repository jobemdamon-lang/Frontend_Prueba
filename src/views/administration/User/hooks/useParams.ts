import { useCallback, useState } from "react"
import { IuseParams, Profile } from "../Types"
import { isSuccessActionInBackend, isSuccessRequest } from "../../../../helpers/handleAxiosError"
import { AdministrationService } from "../../../../services/Administration.service"
import { IComboData } from "../../Types"

const useParams = (): IuseParams => {

    const [areas, setAreas] = useState<IComboData[]>([])
    const [loadingAreas, setLoadingAreas] = useState(false)
    const [roles, setRoles] = useState<IComboData[]>([])
    const [loadingRoles, setLoadingRoles] = useState(false)
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [loadingProfiles, setLoadingProfiles] = useState(false)

    const getAreas = useCallback(async function () {
        setLoadingAreas(true)
        try {
            const response = await AdministrationService.getDataFilter({
                tabla: "area",
                filtro: ""
            })
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setAreas(response.data.lista)
            }
        } catch (e) {
            setAreas([])
        } finally {
            setLoadingAreas(false)
        }
    }, [])

    const getAccessRoles = useCallback(async function () {
        setLoadingRoles(true)
        try {
            const response = await AdministrationService.getDataFilter({
                tabla: "rol_acceso",
                filtro: ""
            })
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setRoles(response.data.lista)
            }
        } catch (e) {
            setRoles([])
        } finally {
            setLoadingRoles(false)
        }
    }, [])

    const getProfiles = useCallback(async function () {
        setLoadingProfiles(true)
        try {
            const response = await AdministrationService.getAccessProfiles()
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setProfiles(response.data.lista)
            }
        } catch (e) {
            setProfiles([])
        } finally {
            setLoadingProfiles(false)
        }
    }, [])

    return {
        getAreas, areas, loadingAreas,
        getAccessRoles, roles, loadingRoles,
        getProfiles, profiles, loadingProfiles
    }
}

export { useParams }