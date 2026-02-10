import { useContext, useEffect, useState } from "react"
import { KTSVG } from "../../../../../helpers/components/KTSVG"
import { Context } from "../Context"
import { ICreateGroup } from "../Types"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../../../../../store/ConfigStore"
import { IAuthState } from "../../../../../store/auth/Types"

const CreateGroupForm = () => {

  const { closeModal , selectedOwner, createGroupPolitics, groupPoliticsCreateStatus, loadingCreateGroup, showNotification } = useContext(Context)
  const [groupToCreate, setGroupToCreate] = useState<ICreateGroup>()
  const user: IAuthState = useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState

  useEffect(() => {
    setGroupToCreate({
      cliente: selectedOwner.cliente,
      alp: selectedOwner.alp,
      id_proyecto: selectedOwner.id_proyecto,
      usuario: user.usuario
    })
  }, [selectedOwner, user])

  return (
    <>
      <div className='modal-header py-4'>
        <h2>Creación de Grupo</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body pt-2 px-lg-10'>
        <p>Se creará un Grupo de Politica para:</p>
        <ul>
          <li><strong>Cliente: </strong>{selectedOwner.cliente}</li>
          <li><strong>Proyecto: </strong>{selectedOwner.proyecto}</li>
          <li><strong>ALP: </strong>{selectedOwner.alp}</li>
        </ul>
        <div style={{display: showNotification ? "block" : "none"}}>
          {groupPoliticsCreateStatus ?
            <p className="text-success bi bi-check-circle-fill"> Se creó el Grupo Correctamente </p>
            :
            <p className="text-danger bi bi-x"> Ocurrió un problema </p>
          }
        </div>
        <strong>¿Desea continuar con la creación?</strong>
        <div className="d-flex gap-5 justify-content-around mt-5">
          <button
            disabled={loadingCreateGroup}
            className="btn btn-primary btn-sm"
            onClick={() => {
              createGroupPolitics(groupToCreate)
            }}
          >
            {loadingCreateGroup ? "Creando..." : "Crear Grupo"}
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => closeModal()}
          >
            Cancelar</button>
        </div>
      </div>
    </>
  )
}
export { CreateGroupForm }