import { useEffect, useState } from "react"
import { useWindowsPatchContext } from "../../Context"
import { KTSVG } from "../../../../../helpers"
import { ExecutionView, IListProgress, ModalSubView, ModalView } from "../../../Types"
import { ExecutionNew } from "./ExecutionNew"
import { ExecutionConfiguration } from "./ExecutionConfiguration"
import { Modal } from "react-bootstrap"
import { UnCheckConfirmation } from "./UnCheckConfirmation"
import { UnCheckConfirmationByCategory } from "./UnCheckConfirmationByCategory"

const ExecutionMain = () => {

  const { modalHook, executionModalFunctions, executionHook } = useWindowsPatchContext()
  const [executionViewToRender, setExecutionViewToRender] = useState<ExecutionView>(modalHook.modalInformation)

  useEffect(() => {
    //Cuando se 
    return () => executionHook.setProgressExecutionData({} as IListProgress)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className='modal-header py-4'>
        <h2>
          {/* Dependiendo la subvista que abran dentro del modal de Ejecuciones se renderizará un titulo u otro */}
          {executionViewToRender.execution_view === ModalSubView.NEW_EXECUTION && "CONFIGURAR NUEVA EJECUCIÓN - PARCHADO"}
          {executionViewToRender.execution_view === ModalSubView.EXECUTION_ALREADY_CONFIGURED && "ACTUALIZAR CONFIGURACIÓN DE EJECUCIÓN - PARCHADO"}
          {executionViewToRender.execution_view === ModalSubView.EXECUTION_PROCESS && "EJECUCIÓN EN PROGRESO - PARCHADO"}
          {executionViewToRender.execution_view === ModalSubView.EXECUTION_SEARCH_PATCHES && "BUSQUEDA DE PARCHES - VALIDACIÓN"}
        </h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body'>
        {/* Dependiendo la subvista que abran dentro del modal de Ejecuciones se renderizará un contenido u otro */}
        {executionViewToRender.execution_view === ModalSubView.NEW_EXECUTION &&
          <ExecutionNew
            setExecutionViewToRender={setExecutionViewToRender}
          />}
        {executionViewToRender.execution_view === ModalSubView.EXECUTION_ALREADY_CONFIGURED &&
          <ExecutionConfiguration
            setExecutionViewToRender={setExecutionViewToRender}
          />}
      </div>
      <Modal
        id='kt_modal_create_app'
        size={executionModalFunctions.sizeModal || "xl"}
        tabIndex={-1}
        fullscreen="false"
        aria-hidden='true'
        dialogClassName='modal-dialog modal-dialog-centered'
        show={executionModalFunctions.showModal}
      >
        {executionModalFunctions.modalView === ModalView.UNCHECK_CONFIRMATION_BYONE && <UnCheckConfirmation executionModalFunctions={executionModalFunctions} />}
        {executionModalFunctions.modalView === ModalView.UNCHECK_CONFIRMATION_BYCATEGORY && <UnCheckConfirmationByCategory executionModalFunctions={executionModalFunctions} />}
      </Modal>
    </>
  )
}
export { ExecutionMain }
