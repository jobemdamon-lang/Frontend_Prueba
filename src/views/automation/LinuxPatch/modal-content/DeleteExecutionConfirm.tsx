import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useLinuxPatchContext } from "../Context"
import { IListExecutionsLinux } from "../../Types"

const DeleteExecutionConfirm = () => {

    const { modalHook, executionHook, selectedOwners } = useLinuxPatchContext()
    const modalInformation: IListExecutionsLinux = modalHook.modalInformation

    const handleDeleteExecution = () => {
        executionHook.deleteExecutionLinux(modalInformation.ID_EJECUCION).then(success => {
            if (success) {
                executionHook.getListExecutionsLinux(selectedOwners.clientToExecution)
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
                <p style={{ overflow: "hidden" }} className="text-center fs-5 fw-normal ">¿ Esta seguro que desea ELIMINAR esta Ejecución {modalInformation.NOMBRE} ?</p>
                <div className="d-flex justify-content-around my-5 gap-5">
                    <button
                        type="button"
                        className="btn btn-success btn-sm"
                        disabled={executionHook.deleteExecutionLinuxLoading}
                        onClick={() => handleDeleteExecution()}
                    >
                        {executionHook.deleteExecutionLinuxLoading &&
                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        }
                        {executionHook.deleteExecutionLinuxLoading ? " Eliminando" : "Eliminar"}
                    </button>
                    <button
                        type="button"
                        onClick={() => modalHook.closeModal()}
                        className="btn btn-danger btn-sm"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </>
    )
}

export { DeleteExecutionConfirm }