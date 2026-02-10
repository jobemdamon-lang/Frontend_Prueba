import { useCallback, useState } from "react"
import { AdministrationService } from "../../../../services/Administration.service"
import { IComboData, IListCollaborators } from "../../Types"

const useComboData = () => {

  const [rolesData, setRolesData] = useState<Array<IComboData>>([])
  const [collabsData, setCollabsData] = useState<Array<{ id: number, value: string }>>([])

  const fetchRoles = useCallback(async function () {
    try {
      const response = await AdministrationService.getDataFilter({
        tabla: "rol_acceso",
        filtro: ""
      })
      setRolesData(response.data.lista)
    } catch (error) {
      setRolesData([])
    }
  }, [])

  const fetchCollabData = useCallback(async function () {
    try {
      const response = await AdministrationService.getCollaborators()
      if (response.status === "Correcto") {
        const transFormData: Array<{ id: number, value: string }> = response.lista.map((collab: IListCollaborators) => ({ id: collab.idusuario, value: collab.nombre }))
        setCollabsData(transFormData)
      } else {
        setCollabsData([])
      }
    } catch (error) {
      setCollabsData([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { rolesData, fetchRoles, fetchCollabData, collabsData }
}
export { useComboData }