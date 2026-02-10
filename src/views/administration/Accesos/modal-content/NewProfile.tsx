import { useContext, useEffect, useState } from "react"
import { Context } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { INewProfile } from "../../Types"
import { useModules } from "../hooks/useModules"
import { toast } from "react-toastify"

const NewProfile = () => {

  const [newProfile, setNewProfile] = useState<INewProfile>({ estado: 1, atributo: "", valor: "", id_Submodulo: 0 } as INewProfile)
  const { closeModal, addNewProfile, creationProfileLoading } = useContext(Context)
  const [selectedModule, setSelectedModule] = useState("")
  const [selectedSubmodule, setSelectedSubmodule] = useState("")
  const { fetchListModules, modules, fetchListSubmodules, submodules } = useModules()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (newProfile.id_Submodulo !== 0) {
      addNewProfile(newProfile, closeModal)
    } else {
      toast.warn("Ingrese todos los valores necesarios.", {
        position: toast.POSITION.TOP_RIGHT
      })
    }
  }

  useEffect(() => {
    fetchListModules()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className='modal-header py-4'>
        <h2>Agregar Nuevo Perfil</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body p-10 px-lg-10'>
        <form onSubmit={handleSubmit} className="d-flex flex-column">
          <div className="d-flex flex-wrap gap-5 my-10 justify-content-around">
            <div>
              <label htmlFor="nameProfile" className="required form-label">Nombre del Perfil</label>
              <input
                name="nameProfile"
                type="text"
                className="form-control"
                required
                value={newProfile.atributo}
                onChange={(event) => setNewProfile((prev) => ({ ...prev, atributo: event.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="DescProfile" className="required form-label">Descripción del Perfil</label>
              <input
                name="DescProfile"
                type="text"
                className="form-control"
                required
                value={newProfile.valor}
                onChange={(event) => setNewProfile((prev) => ({ ...prev, valor: event.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="AsocModule" className="required form-label">Modulo Asociado</label>
              <select
                value={selectedModule}
                name="AsocModule"
                className="form-select combo"
                data-control="select2"
                required
                data-placeholder="Seleccione una opcion"
                onChange={(evt) => {
                  setSelectedModule(evt.target.value)
                  let idx = modules.findIndex((module) => module.aside_title === evt.target.value)
                  if (idx !== -1) {
                    fetchListSubmodules(modules[idx].IDOPCION.toString())
                  }
                }}
              >
                <option value="">Seleccione una opcion...</option>
                {modules.map((item) => (<option key={item.IDOPCION} value={item.aside_title}>{item.aside_title}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="AsocSubModule" className="required form-label">SubModulo Asociado</label>
              <select
                value={selectedSubmodule}
                name="AsocSubModule"
                className="form-select combo"
                required
                data-control="select2"
                data-placeholder="Seleccione una opcion"
                onChange={(evt) => {
                  setSelectedSubmodule(evt.target.value)
                  let idx = submodules.findIndex((submodule) => submodule.Aside_title === evt.target.value)
                  if (idx !== -1) {
                    setNewProfile((prev) => ({ ...prev, id_Submodulo: submodules[idx].IDOPCION }))
                  }
                }}
              >
                <option value="">Seleccione una opcion...</option>
                {submodules.map((item) => (<option key={item.IDOPCION} value={item.Aside_title}>{item.Aside_title}</option>))}
              </select>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-5">
            <button
              type="submit"
              className="btn btn-success"
              disabled={creationProfileLoading}
            >
              {creationProfileLoading ? "Creando..." : "Crear"}
            </button>
            <button type="button" className="btn btn-danger" onClick={() => closeModal()}>Cancelar</button>
          </div>
        </form>
      </div>
    </>
  )
}
export { NewProfile }