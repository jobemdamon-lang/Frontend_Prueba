import { useCallback, useState } from "react"
import { AdministrationService } from "../../../../services/Administration.service"
import { ICreateCollab, IUpdateOwners, IUseAdministration } from "../../Types"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../../../../helpers/handleAxiosError"
import { errorNotification, successNotification } from "../../../../helpers/notifications"
import { IComboData } from "../../../../helpers/Types"

const useAdministration = (): IUseAdministration => {

  //Estados para crear un colaborador
  const [loadingCreateCollab, setLoadingCreateCollab] = useState(false)
  //Estados para el endpoint eliminar un colaborador
  const [loadingDelete, setLoadingDelete] = useState(false)
  //Estados para el endpoint actualizar gerente o jefe de proyecto
  const [loadingUpdateOwners, setLoadingUpdateOwners] = useState(false)
  //Estado de listas de datos
  const [stateProjectData, setStateProject] = useState<IComboData[]>([])
  const [loadingStateProjects, setLoadingStateProjects] = useState(false)
  const [typeProjectData, setTypeProject] = useState<IComboData[]>([])
  const [loadingTypeProjectData, setLoadingTypeProjectData] = useState(false)
  const [managerData, setManager] = useState<Array<IComboData>>([])
  const [loadingManager, setLoadingManager] = useState(false)
  const [bossData, setBoss] = useState<Array<IComboData>>([])
  const [loadingBoss, setLoadingBoss] = useState(false)
  const [collabData, setCollab] = useState<Array<IComboData>>([])
  const [loadingCollabData, setLoadingCollabData] = useState(false)


  const createColaborator = useCallback(async function (userWhoCreate: string, params: ICreateCollab) {
    setLoadingCreateCollab(true)
    try {
      const response = await AdministrationService.createColaborator(userWhoCreate, params)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        successNotification("Se creó el colaborador correctamente."); return true
      } else {
        errorNotification(response.data.mensaje)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setLoadingCreateCollab(false)
    }
  }, [])

  const updateOwners = useCallback(async function (userWhoCreate: string, params: IUpdateOwners) {
    setLoadingUpdateOwners(true)
    try {
      const response = await AdministrationService.updateOwners(userWhoCreate, params)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        successNotification("Se actualizó el propietario correctamente."); return true
      } else {
        errorNotification(response.data.mensaje)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setLoadingUpdateOwners(false)
    }
  }, [])

  const deleteColaborator = useCallback(async function (id_proyect_collab: string) {
    setLoadingDelete(true)
    try {
      const response = await AdministrationService.deleteCollab(id_proyect_collab)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        successNotification("Se eliminó el colaborador correctamente."); return true
      } else {
        errorNotification(response.data.mensaje)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setLoadingDelete(false)
    }
  }, [])

  const getStateProjectData = useCallback(async function () {
    setLoadingStateProjects(true)
    try {
      const response = await AdministrationService.getDataFilter({
        tabla: "proyecto_estado",
        filtro: ""
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setStateProject(response.data.lista)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setLoadingStateProjects(false)
    }
  }, [])

  const getTypeProjectData = useCallback(async function () {
    setLoadingTypeProjectData(true)
    try {
      const response = await AdministrationService.getDataFilter({
        tabla: "proyecto_tipo",
        filtro: ""
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setTypeProject(response.data.lista)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setLoadingTypeProjectData(false)
    }
  }, [])

  const getManagerData = useCallback(async function () {
    setLoadingManager(true)
    try {
      const response = await AdministrationService.getDataFilter({
        tabla: "gerente",
        filtro: ""
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setManager(response.data.lista)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setLoadingManager(false)
    }
  }, [])

  const getBossData = useCallback(async function () {
    setLoadingBoss(true)
    try {
      const response = await AdministrationService.getDataFilter({
        tabla: "gerente",
        filtro: ""
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setBoss(response.data.lista)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setLoadingBoss(false)
    }
  }, [])

  const getCollabData = useCallback(async function () {
    setLoadingCollabData(true)
    try {
      const response = await AdministrationService.getDataFilter({
        tabla: "usuario_all",
        filtro: ""
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setCollab(response.data.lista)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setLoadingCollabData(false)
    }
  }, [])

  return {
    createColaborator, loadingCreateCollab,
    deleteColaborator, loadingDelete,
    updateOwners, loadingUpdateOwners,
    getStateProjectData, loadingStateProjects, stateProjectData,
    getTypeProjectData, typeProjectData, loadingTypeProjectData,
    getManagerData, managerData, loadingManager,
    getBossData, bossData, loadingBoss,
    getCollabData, collabData, loadingCollabData

  }
}
export { useAdministration }
