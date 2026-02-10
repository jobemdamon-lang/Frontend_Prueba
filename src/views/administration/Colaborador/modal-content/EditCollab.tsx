import { useContext, useEffect } from "react"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { Context } from "../Context"
import { Form } from "react-bootstrap"
import { IListCollaborators } from "../../Types"
import { useCollaborator } from "../hooks/useCollaborator"
import { useComboData } from "../hooks/useComboData"
import { ComboBoxInput } from "../../Proyecto/components/ComboBoxInput"

const EditColab = () => {

  const { closeModal, modalInformation, fetchCollabs }: { closeModal: any, modalInformation: IListCollaborators, fetchCollabs: any } = useContext(Context)
  const collabFunctions = useCollaborator({ modalInformation })
  const { fetchAreas, areasData } = useComboData()
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    collabFunctions.modifyCollab({
      telefono: collabFunctions.infoCollab.telefono,
      usuario: collabFunctions.infoCollab.usuario,
      estado: collabFunctions.infoCollab.estado,
      id_area: areasData.filter((area) => area.nombre === collabFunctions.infoCollab.area)[0].codigo,
    }, fetchCollabs)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchAreas() }, [])

  return (
    <>
      <div className='modal-header py-4'>
        <h2>Editar al Colaborador {modalInformation.nombre}</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body pt-5 px-lg-10'>
        <form onSubmit={handleSubmit}>
          <div className="d-flex gap-5 flex-wrap justify-content-around">
            <div>
              <Form.Label>Nombre:</Form.Label>
              <Form.Control disabled value={collabFunctions.infoCollab.nombre} type="text" onChange={e => collabFunctions.updateNombre(e.target.value)} />
            </div>
            <div>
              <Form.Label>Cargo:</Form.Label>
              <Form.Control disabled value={collabFunctions.infoCollab.cargo ?? ""} type="text" onChange={e => collabFunctions.updateCargo(e.target.value)} />
            </div>
            <div>
              <Form.Label>DNI:</Form.Label>
              <Form.Control disabled value={collabFunctions.infoCollab.dni ?? ""} type="text" onChange={e => collabFunctions.updateDni(e.target.value)} />
            </div>
            <div>
              <ComboBoxInput
                value={collabFunctions.infoCollab.area ?? ""}
                label="Area"
                data={areasData}
                setNewValue={collabFunctions.updateArea}
              />
            </div>
            <div>
              <Form.Label>Telefono:</Form.Label>
              <Form.Control value={collabFunctions.infoCollab.telefono ?? ""} type="number" onChange={e => collabFunctions.updateTelefono(e.target.value)} />
            </div>
            <div className="form-check form-switch form-check-custom form-check-solid">
              <input checked={collabFunctions.infoCollab?.estado === 1 ? true : false} onChange={(event) => collabFunctions.updateEstado(event.target.checked)} className="form-check-input" type="checkbox" value="" id="flexSwitchDefault" />
              <label className="form-check-label" htmlFor="flexSwitchDefault">
                {collabFunctions.infoCollab.estado === 1 ? "Habilitado" : "Deshabilitado"}
              </label>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-5 mt-8">
            <button
              type="submit"
              disabled={collabFunctions.loadingCollab}
              className="btn btn-success h-45px">{collabFunctions.loadingCollab ? "Modificando..." : "Modificar"}</button>
            <button type="button" className="btn btn-danger h-45px" onClick={() => closeModal()}>Cancelar</button>
          </div>
        </form>
      </div>
    </>
  )
}
export { EditColab }