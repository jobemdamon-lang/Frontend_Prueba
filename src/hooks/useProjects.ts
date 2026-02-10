import { useCallback, useState } from "react"
import { IuseProject } from "./Types"
import { IDataListProject } from "../helpers/Types"
import { InventoryService } from "../services/Inventory.service"
import { formatProjectsDataList } from "../helpers/general"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../helpers/handleAxiosError"
import { ICreateProject, IProject, IUpdateProject, initialProject } from "../views/administration/Types"
import { errorNotification, successNotification } from "../helpers/notifications"
import { AdministrationService } from "../services/Administration.service"

const useProject = (): IuseProject => {

  //Estado para la request solicitar todos los proyectos
  const [projects, setProjects] = useState<Array<IDataListProject>>([])
  const [loadingGetProjects, setLoadingGetProjects] = useState(false)
  //Estados para el endpoint crear un proyecto
  const [loadingCreateProject, setLoadingCreateProject] = useState(false)
  //Estados para el endpoint actualizar informacion de un proyecto
  const [loadingUpdateProject, setLoadingUpdate] = useState(false)
  //Estados para el endpoint listar informacion de un Proyecto
  const [InfoProjectData, setInfoProject] = useState<IProject>(initialProject)
  const [loadingInfoProject, setLoadingInfoProject] = useState<boolean>(false)

  const getProjects = useCallback(async function (client: string = "") {
    setLoadingGetProjects(true)
    try {
      const response = await InventoryService.getDataFromMonitorOptions({
        tabla: "proyecto",
        filtro: client
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setProjects(formatProjectsDataList(response.data.lista))
      }
    } catch (e) {
      handleAxiosError(e)
      setProjects([])
    } finally {
      setLoadingGetProjects(false)
    }
  }, [])

  const createProject = useCallback(async function (params: ICreateProject) {
    setLoadingCreateProject(true)
    try {
      const response = await AdministrationService.createProject(params)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        successNotification("Se creó el proyecto correctamente."); return true
      } else {
        errorNotification(response.data.mensaje)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setLoadingCreateProject(false)
    }
  }, [])

  const updateProject = useCallback(async function (params: IUpdateProject) {
    setLoadingUpdate(true)
    try {
      const response = await AdministrationService.updateProject(params)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        successNotification("Se creó el proyecto correctamente."); return true
      } else {
        errorNotification(response.data.mensaje)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setLoadingUpdate(false)
    }
  }, [])

  const getInformationProject = useCallback(async function (projectID: string) {
    setLoadingInfoProject(true)
    try {
      const response = await AdministrationService.getInformationProject(projectID)
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setInfoProject(response.data.lista[0])
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setLoadingInfoProject(false)
    }
  }, [])

  return {
    getProjects, loadingGetProjects, projects,
    createProject, loadingCreateProject,
    updateProject, loadingUpdateProject,
    getInformationProject, InfoProjectData, loadingInfoProject
  }
}

export { useProject }
