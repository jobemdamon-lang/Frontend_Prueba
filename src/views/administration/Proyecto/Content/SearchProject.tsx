import { useEffect, useState } from "react"
import { useProjectSubModuleContext } from "../Context"
import { ModalSize, ModalView } from "../../Types"
import { DataList } from "../../../../components/Inputs/DataListInput"

const SearchProject = ({ setCanShow }: { setCanShow: Function }) => {

  const [projectName, setProject] = useState("")
  const { projectHook, modalHook } = useProjectSubModuleContext()

  useEffect(() => {
    projectHook.getProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="d-flex justify-content-around p-5 align-items-end">
      <DataList
        items={projectHook.projects}
        label="Nombre del Proyecto"
        value={projectName}
        loading={projectHook.loadingGetProjects}
        onChange={(selectedProject) => {
          const findedProject = projectHook.projects.find(project => project.value === selectedProject)
          if (findedProject) {
            setProject(findedProject.value)
            projectHook.getInformationProject(findedProject.id.toString())
            setCanShow(true)
          }
        }}
      />
      <button
        onClick={() => modalHook.openModal(ModalView.NEW_PROJECT, ModalSize.XL, undefined, { project: "hola" })}
        className="btn btn-success h-50px">
        Nuevo Proyecto
      </button>
      <button className="btn btn-primary h-50px">
        Exportar Proyecto
      </button>
    </div>

  )
}
export { SearchProject }