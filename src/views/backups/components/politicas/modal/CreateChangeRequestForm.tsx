import { useContext, useState } from "react"
import { KTSVG } from "../../../../../helpers"
import { Context } from "../Context"
import { useRequestChanges } from "../../../hooks/useRequestChanges"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../../../../../store/ConfigStore"
import { IAuthState } from "../../../../../store/auth/Types"

const CreateChangeRequestForm = () => {

  const [ reasonRequest, setReasonRequest] = useState<string>("")
  const { closeModal, selectedOwner, selectedGroupPolicies } = useContext(Context)
  const { loadingRequestChange , createRequestChange} = useRequestChanges()
  const user: IAuthState = useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState

  return (
    <>
      <div className='modal-header py-4'>
        <h2>Nueva Solicitud</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <form 
        className='modal-body pt-2 px-lg-10'
        onSubmit={(event)=>{
          event.preventDefault()
          createRequestChange({ 
            motivo: reasonRequest,
            id_grupo: parseInt(selectedGroupPolicies.id),
            usuario: user.usuario
          })
        }}
      >
        <div className="mb-5">
          <label className="form-label" htmlFor="motivo_cambio">Motivo del Cambio</label>
          <textarea 
            required
            onChange={(e)=>setReasonRequest(e.target.value)}
            className="form-control w-100 h-150px" 
            id="motivo_cambio" 
            rows={3} 
            cols={5}
            maxLength={200}
          ></textarea>
        </div>
        <strong>INFORMACIÓN</strong>
        <ul>
          <li><strong>Cliente: </strong>{selectedOwner.cliente}</li>
          <li><strong>Proyecto: </strong>{selectedOwner.proyecto}</li>
          <li><strong>Grupo Politica: </strong>{selectedGroupPolicies.value}</li>
        </ul>
        <div className="d-flex gap-5 justify-content-around mt-5">
          <button
            type="submit"
            disabled={loadingRequestChange}
            className="btn btn-primary btn-sm"
          >
            {loadingRequestChange ? "Creando..." : "Crear Solicitud"}
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => closeModal()}
          >
            Cancelar</button>
        </div>
      </form>
    </>
  )
}
export { CreateChangeRequestForm }