import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useProjectSubModuleContext } from "../Context"

const UpdateOwnerConfirmation = () => {

  const { modalHook, administrateHook } = useProjectSubModuleContext()
  const { modalInformation } = modalHook

  return (
    <>
      <div className='modal-header py-4'>
        <h4>Confirmación</h4>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body pt-5 px-lg-10'>
        <div >
          <p className="text-center text-dark font-weight-light">{modalInformation.confirmationMessage}</p>
          <div className="d-flex justify-content-end gap-3 mt-8">
            <button
              type="button"
              disabled={administrateHook.loadingUpdateOwners}
              onClick={() => modalInformation.actionFunc()}
              className="btn btn-success h-45px">
              {administrateHook.loadingUpdateOwners ? "Procesando.." : "Confirmar"}
            </button>
            <button type="button" className="btn btn-danger h-45px" onClick={() => modalHook.closeModal()}>Cancelar</button>
          </div>
        </div>
      </div>
    </>

  )
}
export { UpdateOwnerConfirmation }