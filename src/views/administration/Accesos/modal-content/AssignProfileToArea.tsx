import { useContext, useEffect, useState } from "react"
import { Context } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { IAssignProfileToArea } from "../../Types"
import { useProfile } from "../hooks/useProfile"
import { useComboData } from "../hooks/useComboData"
import { toast } from "react-toastify"

const AssignProfileToArea = () => {

  const { closeModal, modalInformation }: { closeModal: any, modalInformation: { area: string, idArea: number, fetchProfileByArea: any } } = useContext(Context)
  const [newProfileToArea, setNewProfileToArea] = useState<IAssignProfileToArea>({ estado: 1, id_area: modalInformation.idArea, id_perfil: 0, rol: "" } as IAssignProfileToArea)
  const { assignProfileToArea, assignProfileToAreaLoading, fetchListprofile, profiles } = useProfile()
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedProfile, setSelectedProfile] = useState("")
  const { rolesData, fetchRoles } = useComboData()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (newProfileToArea.rol !== "" && newProfileToArea.id_perfil !== 0) {
      assignProfileToArea(newProfileToArea, modalInformation.fetchProfileByArea, closeModal)
    } else {
      toast.warn(`Debe seleccionar un Perfil y Rol`, {
        position: toast.POSITION.TOP_RIGHT
      })
    }
  }

  useEffect(() => {
    fetchRoles()
    fetchListprofile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className='modal-header py-4'>
        <h2>Asignar Perfil al area {modalInformation.area}</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body px-lg-10'>
        <form onSubmit={handleSubmit} className="d-flex flex-column">
          <div className="d-flex flex-wrap gap-5 mb-8 justify-content-center">
            <div>
              <label htmlFor="Role" className="required form-label">Rol a Asignar</label>
              <select
                value={selectedRole}
                className="form-select combo"
                name="Role"
                data-control="select2"
                data-placeholder="Seleccione una opcion"
                onChange={(evt) => {
                  setSelectedRole(evt.target.value)
                  setNewProfileToArea((prev) => ({ ...prev, rol: evt.target.value }))
                }}
              >
                <option value="">Todas</option>
                {rolesData.map((item) => (<option key={item.codigo} value={item.nombre}>{item.nombre}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="Icon" className="required form-label">Perfil a Asignar</label>
              <select
                value={selectedProfile}
                className="form-select combo"
                data-control="select2"
                data-placeholder="Seleccione una opcion"
                onChange={(evt) => {
                  setSelectedProfile(evt.target.value)
                  let idx = profiles.findIndex((profile) => profile.ATRIBUTO === evt.target.value)
                  idx === -1 ?
                    setNewProfileToArea((prev) => ({ ...prev, id_perfil: 0 }))
                    :
                    setNewProfileToArea((prev) => ({ ...prev, id_perfil: profiles[idx].IDOPCION }))
                }}
              >
                <option value="">Todas</option>
                {profiles.map((item) => (<option key={item.IDOPCION} value={item.ATRIBUTO}>{item.ATRIBUTO}</option>))}
              </select>
            </div>

          </div>
          <div className="d-flex justify-content-end gap-5">
            <button
              type="submit"
              className="btn btn-success"
              disabled={assignProfileToAreaLoading}
            >
              {assignProfileToAreaLoading ? "Asignando..." : "Asignar"}
            </button>
            <button type="button" className="btn btn-danger" onClick={() => closeModal()}>Cancelar</button>
          </div>
        </form>
      </div>
    </>
  )
}
export { AssignProfileToArea }