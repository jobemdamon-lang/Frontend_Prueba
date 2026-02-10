import { useContext, useState } from "react"
import { Context } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { IModule, INewSubmodule } from "../../Types"
import { useModules } from "../hooks/useModules"
import { toast } from "react-toastify"

const NewSubmodule = () => {

  const { modalInformation, closeModal }: { modalInformation: IModule, closeModal: any } = useContext(Context)
  const [newSubmodule, setNewSubmodule] = useState<INewSubmodule>({ estado: "1", aside_to: modalInformation.aside_to + "/", parentid: modalInformation.IDOPCION } as INewSubmodule)
  const { addNewSubmodule, creationSMLoading } = useModules()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    let route = newSubmodule.aside_to.split("/")[2]
    if (route === "") {
      toast.warn("Debe ingresar una ruta de redirección valida", {
        position: toast.POSITION.TOP_RIGHT
      })
    } else if (route !== newSubmodule.route_path) {
      toast.warn("La ruta de redirección debe coincidir con la ruta del submodulo", {
        position: toast.POSITION.TOP_RIGHT
      })
    } else {
      addNewSubmodule(newSubmodule, closeModal)
    }
  }

  return (
    <>
      <div className='modal-header py-4'>
        <h2>Agregar Nuevo Submodulo para {modalInformation.aside_title}</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body p-10 px-lg-10'>
        <form onSubmit={handleSubmit} className="d-flex flex-column">
          <div className="d-flex flex-wrap gap-5 justify-content-center">
            <div>
              <label htmlFor="AsideTitle" className="required form-label">Nombre en Aside - Submodulo</label>
              <input
                name="AsideTitle"
                type="text"
                className="form-control"
                required
                value={newSubmodule.aside_title}
                onChange={(event) => setNewSubmodule((prev) => ({ ...prev, aside_title: event.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="AsideTo" className="required form-label">Ruta de Redirección - Submodulo</label>
              <input
                name="AsideTo"
                type="text"
                className="form-control"
                required
                value={newSubmodule.aside_to}
                onChange={(event) => setNewSubmodule((prev) => ({ ...prev, aside_to: event.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="RouteTitle" className="required form-label">Nombre de Pagina</label>
              <input
                name="RouteTitle"
                type="text"
                className="form-control"
                required
                value={newSubmodule.routeTitle}
                onChange={(event) => setNewSubmodule((prev) => ({ ...prev, routeTitle: event.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="RoutePath" className="required form-label">Ruta del Submodulo</label>
              <input
                name="RoutePath"
                type="text"
                className="form-control"
                required
                value={newSubmodule.route_path}
                onChange={(event) => setNewSubmodule((prev) => ({ ...prev, route_path: event.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="RouteModule" className="required form-label">Vista a Renderizar</label>
              <input
                name="RouteModule"
                type="text"
                className="form-control"
                required
                value={newSubmodule.route_module}
                onChange={(event) => setNewSubmodule((prev) => ({ ...prev, route_module: event.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="Prioridad" className="required form-label">Prioridad de Submodulo</label>
              <input
                name="Prioridad"
                type="text"
                className="form-control"
                required
                value={newSubmodule.prioridad}
                onChange={(event) => setNewSubmodule((prev) => ({ ...prev, prioridad: event.target.value }))}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end gap-5">
            <button
              type="submit"
              className="btn btn-success"
              disabled={creationSMLoading}
            >
              {creationSMLoading ? "Agregando..." : "Agregar"}
            </button>
            <button type="button" className="btn btn-danger" onClick={() => closeModal()}>Cancelar</button>
          </div>
        </form>
      </div>
    </>
  )
}
export { NewSubmodule }