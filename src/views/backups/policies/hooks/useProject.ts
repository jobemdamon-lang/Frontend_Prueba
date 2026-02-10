import { useCallback, useState } from "react"
import { BackupService } from "../../../../services/Backup.service"
import type { IProject } from "../Types"

// Este endpoint se diferencia del resto porque solo trae proyectos que tienen equipos en el inventario
export const useProject = () => {
    const [projects, setProjects] = useState<IProject[]>([])
    const [loadingGetProjects, setLoadingGetProjects] = useState<boolean>(false)

    const getProjects = useCallback(async (client: string = "") => {
        setLoadingGetProjects(true)
        setProjects([]); // Reset antes de cargar nuevos datos
        
        try {
            const response = await BackupService.getDataFilter({
                tabla: "proyecto_data",
                filtro: client
            })
            
            const projectsData = response.lista.map((project: any) => ({ 
                id: project.codigo, 
                value: project.nombre 
            }))
            
            setProjects(projectsData)
        } catch (e) {
            console.error("Error fetching projects:", e)
            setProjects([])
        } finally {
            setLoadingGetProjects(false)
        }
    }, [])

    return {
        projects,
        getProjects,
        loadingGetProjects
    }
}