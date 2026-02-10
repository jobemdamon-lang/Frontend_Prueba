import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useWindowsPatchContext } from "../Context"
import { IListExecutions } from "../../Types"

const DeleteExecutionConfirmation = () => {

  const { modalHook, executionHook, clientForExecution } = useWindowsPatchContext()
  const modalInformation: IListExecutions = modalHook.modalInformation

  const handleDeleteExecution = () => {
    executionHook.deleteExecution(modalInformation.ID_EJECUCION).then(success => {
      if (success) {
        executionHook.getListExecutions(clientForExecution === '' ? 'CANVIA' : clientForExecution)
        modalHook.closeModal()
      }
    })
  }

  return (
    <>
      <div className='modal-header py-4'>
        <h2>CONFIRMACIÓN</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body px-lg-10'>
        <p style={{ overflow: "hidden" }} className="text-center fs-3">¿Esta seguro que desea ELIMINAR esta Ejecución | {modalInformation.NOMBRE}?</p>
        <div className="d-flex justify-content-around my-5 gap-5">
          <button
            type="button"
            className="btn btn-success"
            disabled={executionHook.deleteExecutionLoading}
            onClick={() => handleDeleteExecution()}
          >
            {executionHook.deleteExecutionLoading ? "Eliminando..." : "Eliminar"}
          </button>
          <button
            type="button"
            onClick={() => modalHook.closeModal()}
            className="btn btn-danger"
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  )
}

export { DeleteExecutionConfirmation }