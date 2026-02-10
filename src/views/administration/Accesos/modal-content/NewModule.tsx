import { useContext, useState } from "react"
import { Context } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { INewModule } from "../../Types"
import { useModules } from "../hooks/useModules"

const NewModule = () => {

  const [newModule, setNewModule] = useState<INewModule>({ estado: "1" } as INewModule)
  const { closeModal } = useContext(Context)
  const { addNewModule, creationMLoading } = useModules()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    addNewModule(newModule, closeModal)
  }

  return (
    <>
      <div className='modal-header py-4'>
        <h2>Agregar Nuevo Modulo</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body p-10 px-lg-10'>
        <form onSubmit={handleSubmit} className="d-flex flex-column">
          <div className="d-flex flex-wrap gap-5 my-5 justify-content-center">
            <div>
              <label htmlFor="AsideTitle" className="required form-label">Nombre en Aside - Modulo</label>
              <input
                name="AsideTitle"
                type="text"
                className="form-control"
                required
                value={newModule.aside_title}
                onChange={(event) => setNewModule((prev) => ({ ...prev, aside_title: event.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="AsideTo" className="required form-label">Ruta Base</label>
              <input
                name="AsideTo"
                type="text"
                className="form-control"
                required
                value={newModule.aside_to}
                onChange={(event) => setNewModule((prev) => ({ ...prev, aside_to: event.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="Icon" className="required form-label">Path del Icono</label>
              <input
                name="Icon"
                type="text"
                className="form-control"
                required
                value={newModule.icon}
                onChange={(event) => setNewModule((prev) => ({ ...prev, icon: event.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="prioridad" className="required form-label">Prioridad del Modulo</label>
              <input
                name="prioridad"
                type="text"
                className="form-control"
                required
                value={newModule.prioridad}
                onChange={(event) => setNewModule((prev) => ({ ...prev, prioridad: event.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="defaultRoute" className="required form-label">Ruta por defecto</label>
              <input
                name="defaultRoute"
                type="text"
                className="form-control"
                required
                value={newModule.route_defaultRoute}
                onChange={(event) => setNewModule((prev) => ({ ...prev, route_defaultRoute: event.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="ruta" className="required form-label">Ruta del Modulo</label>
              <input
                name="ruta"
                type="text"
                className="form-control"
                required
                value={newModule.routh_path}
                onChange={(event) => setNewModule((prev) => ({ ...prev, routh_path: event.target.value }))}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end gap-5">
            <button
              type="submit"
              className="btn btn-success"
              disabled={creationMLoading}
            >
              {creationMLoading ? "Agregando..." : "Agregar"}
            </button>
            <button type="button" className="btn btn-danger" onClick={() => closeModal()}>Cancelar</button>
          </div>
        </form>
      </div>
    </>
  )
}
export { NewModule }