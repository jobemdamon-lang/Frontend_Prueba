import { useCallback, useState } from "react"
import { IAssignProfileToArea, INewProfile, IProfile, IProfileByArea } from "../../Types"
import { AdministrationService } from "../../../../services/Administration.service"
import { toast } from "react-toastify"

const useProfile = () => {

  //Estados para el endpoint Listar Modulos
  const [profiles, setProfiles] = useState<Array<IProfile>>([])
  const [profileLoading, setProfileLoading] = useState(false)

  //Estados para el endpoint Listar SubModulos
  const [profilesByArea, setProfileByArea] = useState<Array<IProfileByArea>>([])
  const [profileByAreaLoading, setProfileByAreaLoading] = useState(false)

  //Estado para el endpoint Agregar Nuevo Submodulo
  const [creationProfileLoading, setCreationProfileLoading] = useState(false)

  //Estado para el endpoint Agregar Nuevo Submodulo
  const [assignProfileToAreaLoading, setProfileToAreaLoading] = useState(false)

  //Estado para el endpoint Eliminar un perfil de un Area
  const [deleteProfileOfAreaLoading, setDeleteProfileOfAreaLoading] = useState(false)

  const fetchListprofile = useCallback(async function () {
    setProfileLoading(true)
    try {
      const response = await AdministrationService.getProfiles()
      if (response.status === "Correcto") {
        setProfileLoading(false)
        setProfiles(response.lista)
      } else {
        setProfileLoading(false)
        setProfiles([])
      }
    } catch (error) {
      setProfileLoading(false)
      setProfiles([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchListProfileByArea = useCallback(async function (idArea: string) {
    setProfileByAreaLoading(true)
    try {
      const response = await AdministrationService.getProfileByArea(idArea)
      if (response.status === "Correcto") {
        setProfileByAreaLoading(false)
        setProfileByArea(response.lista)
      } else {
        setProfileByAreaLoading(false)
        setProfileByArea([])
      }
    } catch (error) {
      setProfileByAreaLoading(false)
      setProfileByArea([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addNewProfile = useCallback(async function (profile: INewProfile, closeModal: Function) {
    setCreationProfileLoading(true)
    console.log(profile)
    try {
      const response = await AdministrationService.newProfile(profile)
      if (response.status === "Correcto") {
        setCreationProfileLoading(false)
        toast.success(`Se añadió el nuevo Perfil. ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
        fetchListprofile()
        closeModal()
      } else {
        setCreationProfileLoading(false)
        toast.error(`Ocurrio un problema al crear ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    } catch (error) {
      setCreationProfileLoading(false)
      toast.error(`Ocurrio un error inesperado. ${error}`, {
        position: toast.POSITION.TOP_RIGHT
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const assignProfileToArea = useCallback(async function (profile: IAssignProfileToArea, fetchProfileByArea: any, closeModal: Function) {
    setProfileToAreaLoading(true)
    try {
      const response = await AdministrationService.assignProfileToArea(profile)
      if (response.status === "Correcto") {
        setProfileToAreaLoading(false)
        toast.success(`Se asignó correctamente. ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
        fetchProfileByArea(profile.id_area)
        closeModal()
      } else {
        setProfileToAreaLoading(false)
        toast.error(`Ocurrio un problema al asignar el perfil. ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    } catch (error) {
      setProfileToAreaLoading(false)
      toast.error(`Ocurrio un error inesperado. ${error}`, {
        position: toast.POSITION.TOP_RIGHT
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteProfileOfArea = useCallback(async function (id_profile_area: string, idArea: string) {
    setDeleteProfileOfAreaLoading(true)
    try {
      const response = await AdministrationService.deleteProfileOfArea(id_profile_area)
      if (response.status === "Correcto") {
        toast.success(`Se eliminó el perfil correctamente.`, {
          position: toast.POSITION.TOP_RIGHT
        })
        fetchListProfileByArea(idArea)
      } else {
        toast.error(`Ocurrio un problema al eliminar el Perfil.`, {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    } catch (error) {
      toast.error(`Ocurrio un error inesperado. ${error}`, {
        position: toast.POSITION.TOP_RIGHT
      })
    } finally {
      setDeleteProfileOfAreaLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    fetchListprofile, profiles, profileLoading, fetchListProfileByArea, profilesByArea, profileByAreaLoading,
    addNewProfile, creationProfileLoading, assignProfileToArea, assignProfileToAreaLoading, deleteProfileOfArea, deleteProfileOfAreaLoading
  }
}
export { useProfile }