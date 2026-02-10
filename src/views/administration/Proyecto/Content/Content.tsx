import { useState } from "react"
import { Accordion } from "../components/Accordion"
import { ManagementLayer } from "./ManagementLayer"
import { Responsible } from "./Responsible"
import { SearchProject } from "./SearchProject"
import { DetailProject } from "./DetailProject"
import "../../../../assets/sass/components/administrattion-styles/filters-section.scss"
import "../../../../assets/sass/components/InventoryFilter/data-list-input-styles.scss"
import { useProjectSubModuleContext } from "../Context"

const Content = () => {

  const [canShow, setCanShow] = useState(true)
  const { projectHook } = useProjectSubModuleContext()
  const { loadingInfoProject, InfoProjectData } = projectHook

  return (
    <>
      <Accordion title="BUSCAR PROYECTO" show={true}>
        <SearchProject setCanShow={setCanShow} />
      </Accordion>
      {(InfoProjectData.alp === undefined || InfoProjectData.alp === "") ?
        <h3 className="py-5" style={{
          opacity: canShow ? "1" : "0",
          transition: "all 0.8s ease-in-out",
          visibility: canShow ? "visible" : "hidden",
          textAlign: "center"
        }}>
          {loadingInfoProject ? "Cargando..." : "Seleccione un Proyecto para mostrar sus datos"}
        </h3>
        :
        <div style={{
          opacity: !canShow ? "0" : "1",
          transition: "all 0.8s ease-in-out",
          visibility: !canShow ? "hidden" : "visible",
        }}>
          <Accordion title="DETALLE DEL PROYECTO">
            <DetailProject InfoProjectData={InfoProjectData} />
          </Accordion>
          <Accordion title="CAPA DE GESTIÓN">
            <ManagementLayer InfoProjectData={InfoProjectData} />
          </Accordion>
          <Accordion title="RESPONSABLES">
            <Responsible InfoProjectData={InfoProjectData} />
          </Accordion>
        </div>
      }
    </>

  )
}
export { Content }