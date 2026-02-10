import { KTSVG } from "../../../../helpers"
import { useServerProvisioningContext } from "../Context"

export const CancelCreation = () => {

    const { modalHook } = useServerProvisioningContext()
    const handleExit: () => void = modalHook.modalInformation?.cancel

    return (
        <>
            <div className='modal-header py-4'>
                <h2 className="text-dark">CANCELAR CREACIÓN</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body pt-3 px-10 d-flex flex-column align-items-center'>
                <div className="d-flex flex-column">
                    <div className="text-center my-3">
                        <span className="svg-icon svg-icon-5tx svg-icon-success">
                            <i className="bi bi-x-square fs-1 text-danger"></i>
                        </span>
                    </div>
                    <div className="text-center mb-5">
                        <h4 className="mb-1">¿Estas seguro que deseas cancelar la creación de esta solicitud?</h4>
                        <p className="text-gray-500">Perderás todos los datos configurados hasta el momento.</p>
                    </div>
                </div>
                <button
                    className="btn btn-sm btn-light-danger"
                    onClick={handleExit}
                >
                    Cancelar Creación de solicitud
                </button>
            </div>
        </>

    )
}


