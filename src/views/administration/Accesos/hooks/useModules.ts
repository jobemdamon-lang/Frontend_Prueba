import { useCallback, useState } from "react"
import { IModule, INewModule, INewSubmodule, ISubModule } from "../../Types"
import { AdministrationService } from "../../../../services/Administration.service"
import { toast } from "react-toastify"

const useModules = () => {

  //Estados para el endpoint Listar Modulos
  const [modules, setModules] = useState<Array<IModule>>([])
  const [moduleLoading, setModuleLoading] = useState(false)

  //Estados para el endpoint Listar SubModulos
  const [submodules, setSubmodules] = useState<Array<ISubModule>>([])
  const [submoduleLoading, setSubmoduleLoading] = useState(false)

  //Estado para el endpoint Agregar Nuevo Submodulo
  const [creationSMLoading, setCreationSMLoading] = useState(false)

  //Estado para el endpoint Agregar Nuevo Submodulo
  const [creationMLoading, setCreationMLoading] = useState(false)


  const fetchListModules = useCallback(async function () {
    setModuleLoading(true)
    try {
      const response = await AdministrationService.getModules()
      if (response.status === "Correcto") {
        setModuleLoading(false)
        setModules(response.lista)
      } else {
        setModuleLoading(false)
        setModules([])
      }
    } catch (error) {
      setModuleLoading(false)
      setModules([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchListSubmodules = useCallback(async function (idModule: string) {
    setSubmoduleLoading(true)
    try {
      const response = await AdministrationService.getSubmodules(idModule)
      if (response.status === "Correcto") {
        setSubmoduleLoading(false)
        setSubmodules(response.lista)
      } else {
        setSubmoduleLoading(false)
        setSubmodules([])
      }
    } catch (error) {
      setSubmoduleLoading(false)
      setSubmodules([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addNewSubmodule = useCallback(async function (submodule: INewSubmodule, closeModal: Function) {
    setCreationSMLoading(true)
    try {
      const response = await AdministrationService.newSubModule(submodule)
      if (response.status === "Correcto") {
        setCreationSMLoading(false)
        toast.success(`Se añadió el nuevo submodulo. ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
        closeModal()
      } else {
        setCreationSMLoading(false)
        toast.error(`Ocurrio un problema al agregar ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    } catch (error) {
      setCreationSMLoading(false)
      toast.error(`Ocurrio un error inesperado. ${error}`, {
        position: toast.POSITION.TOP_RIGHT
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addNewModule = useCallback(async function (submodule: INewModule, closeModal:Function) {
    setCreationMLoading(true)
    try {
      const response = await AdministrationService.newModule(submodule)
      if (response.status === "Correcto") {
        setCreationMLoading(false)
        toast.success(`Se añadió el nuevo Modulo. ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
        closeModal()
      } else {
        setCreationMLoading(false)
        toast.error(`Ocurrio un problema al agregar ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    } catch (error) {
      setCreationMLoading(false)
      toast.error(`Ocurrio un error inesperado. ${error}`, {
        position: toast.POSITION.TOP_RIGHT
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    fetchListModules, modules, moduleLoading, fetchListSubmodules, submodules, submoduleLoading, addNewSubmodule, creationSMLoading,
    addNewModule, creationMLoading
  }
}
export { useModules }