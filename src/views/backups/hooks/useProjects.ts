import { useCallback, useState } from "react"
import { BackupService } from "../../../services/Backup.service"

//Custom hook que devuelve una funcion para llamar a la API /opcion y la data de los proyectos
const useProjects = ():any => {
  const [ projectsData, setFetchData ] = useState<Array<{id: number | string, value: string}>>([])

  const fetchProjects = useCallback(async function (client:string = ""){

    try {
      const response = await BackupService.getDataFilter({
        tabla: "proyecto_data",
        filtro: client
      })
      const projectsData = response.lista.map((project: any) => ({ id:project.codigo, value: project.nombre }))
      setFetchData(projectsData)
    } catch (error) {
      setFetchData([{ id: 0, value: "Something went wrong :(" }])
    }
  },[])

    return [projectsData, fetchProjects]
}

export { useProjects }