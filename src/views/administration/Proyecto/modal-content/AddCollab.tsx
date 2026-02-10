import { useState } from "react"
import { useProjectSubModuleContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { Form } from "react-bootstrap"
import DatalistInput from "react-datalist-input"
import { RootState } from "../../../../store/ConfigStore"
import { shallowEqual, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { IAuthState } from "../../../../store/auth/Types"
import { ICreateCollab } from "../../Types"
import { formatToDataList } from "../../../../helpers/general"

type CollabType = { id: number, value: string }
const AddCollab = () => {

  const { modalHook, administrateHook, projectHook } = useProjectSubModuleContext()
  const [collabInfo, setCollabInfo] = useState<CollabType>({} as CollabType)
  const user: IAuthState = useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (collabInfo.value === "") {
      toast.warn(`Debe seleccionar un Colaborador`, {
        position: toast.POSITION.TOP_RIGHT
      })
    } else {
      let collabToCreate: ICreateCollab = {
        estado: 1,
        id_proy_colab: 0,
        id_usuario: 0,
        id_proyecto: projectHook.InfoProjectData.id_proyecto,
        nombre: collabInfo.value,
        cargo: ""
      }
      administrateHook.createColaborator(user.usuario, collabToCreate).then(success => {
        if(success) {
          modalHook.closeModal()
          administrateHook.getCollabData()
        }
      })
    }
  }

  return (
    <>
      <div className='modal-header py-4'>
        <h2>Agregar Colaborador</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body pt-2 px-lg-10'>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-5">
          <div>
            <Form.Label>Proyecto</Form.Label>
            <Form.Control value={projectHook.InfoProjectData?.nombre} type="text" disabled />
          </div>
          <div>
            <Form.Label>Nombre del Colaborador</Form.Label>
            <DatalistInput
              className="administration-dt w-220px"
              value={collabInfo.value}
              placeholder=""
              label=""
              onSelect={(collab) => {
                setCollabInfo(collab)
              }}
              items={formatToDataList(administrateHook.collabData)}
            />
          </div>
          <div className="d-flex justify-content-end gap-5 mt-8">
            <button
              type="submit"
              disabled={administrateHook.loadingCreateCollab}
              className="btn btn-success h-45px">{administrateHook.loadingCreateCollab ? "Creando" : "Crear"}</button>
            <button type="button" className="btn btn-danger h-45px" onClick={() => modalHook.closeModal()}>Cancelar</button>
          </div>
        </form>
      </div>
    </>
  )
}
export { AddCollab }