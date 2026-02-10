import { useCallback, useState } from "react"
import { IListCollaborators } from "../../Types"
import { AdministrationService } from "../../../../services/Administration.service"
import { toast } from "react-toastify"

const useCollaborator = ({ modalInformation }: { modalInformation?: IListCollaborators }) => {

  const [infoCollab, setInfoCollab] = useState<IListCollaborators>(modalInformation ?? {} as IListCollaborators)
  const [collabsData, setCollabsData] = useState<Array<IListCollaborators>>([])
  const [loadingCollab, setLoading] = useState(false)

  const updateNombre = (value: string) => setInfoCollab((prevState) => ({ ...prevState, nombre: value }))
  const updateCargo = (value: any) => setInfoCollab((prevState) => ({ ...prevState, cargo: value }))
  const updateDni = (value: any) => setInfoCollab((prevState) => ({ ...prevState, dni: value }))
  const updateArea = (value: any) => setInfoCollab((prevState) => ({ ...prevState, area: value }))
  const updateTelefono = (value: any) => setInfoCollab((prevState) => ({ ...prevState, telefono: value }))
  const updateEstado = (state: boolean) => setInfoCollab((prevState) => ({ ...prevState, estado: state ? 1 : 0 }))

  const fetchCollabs = useCallback(async function () {
    setLoading(true)
    try {
      const response = await AdministrationService.getCollaborators()
      if (response.status === "Correcto") {
        setLoading(false)
        setCollabsData(response.lista)
      } else {
        setLoading(false)
        setCollabsData([])
      }
    } catch (error) {
      setLoading(false)
      setCollabsData([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const modifyCollab = useCallback(async function (collab: any, funcToReFetch: any) {
    setLoading(true)
    try {
      const response = await AdministrationService.modifyCollaborator(collab)
      if (response.status === "Correcto") {
        toast.success(`Se modifico con exito. ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
        funcToReFetch()
      } else {
        toast.error(`Ocurrio un problema al modificar ${response.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    } catch (error) {
      toast.error(`Surgio un error inesperado. ${error}`, {
        position: toast.POSITION.TOP_RIGHT
      })
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    updateNombre, updateCargo, updateDni, updateArea, updateTelefono, infoCollab,
    fetchCollabs, collabsData, loadingCollab, modifyCollab, updateEstado
  }
}
export { useCollaborator }