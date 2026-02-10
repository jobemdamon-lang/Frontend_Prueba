import { useCallback, useState } from "react"
import { AdministrationService } from "../../../../services/Administration.service"
import { IComboData } from "../../Types"

const useComboData = () => {

  const [areasData, setAreasData] = useState<Array<IComboData>>([])

  const fetchAreas = useCallback(async function () {
    try {
      const response = await AdministrationService.getDataFilter({
        tabla: "area",
        filtro: ""
      })
      setAreasData(response.data.lista)
    } catch (error) {
      setAreasData([])
    }
  }, [])

  return { areasData, fetchAreas }
}
export { useComboData }