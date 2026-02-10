import { KTSVG } from "../../../../helpers"
import { RequestVMResume } from "../../Types"
import { formateDate } from "../utils"
import { useServerProvisioningContext } from "../Context"
import { useTypedSelector } from "../../../../store/ConfigStore"

export const ConfirmExecution = () => {

    const { modalHook, requestVMHook: { executeProvisioning, loadingProvisioning, getRequestVM } } = useServerProvisioningContext()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const requestData: RequestVMResume = modalHook.modalInformation

    const handleSendRequest = () => {
        executeProvisioning(requestData.ID_SOLICITUD, userName).then(result => {
            if (result) {
                getRequestVM(requestData.ID_SOLICITUD)
                modalHook.closeModal()
            }
        })
    }

    return (
        <>
            <div className='modal-header py-4'>
                <h2 className="text-dark">EJECUTAR APROVISIONAMIENTO</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body pt-3 px-10 d-flex flex-column align-items-center'>
                <div className="d-flex flex-column">
                    <div className="text-center my-3">
                        <span className="svg-icon svg-icon-5tx svg-icon-success">
                            <i className="bi bi-check2-circle fs-1 text-success"></i>
                        </span>
                    </div>
                    <div className="text-center mb-5">
                        <h4 className="mb-1">¿Estas seguro que deseas ejecutar el aprovisionamiento de esta solicitud?</h4>
                        {/*<p className="text-gray-500">Esta acción solo se podrá revertir hasta antes de la fecha de ejecucíon.</p>*/}
                    </div>
                    <div className="border border-gray-300 border-dashed rounded p-6 mb-5">
                        <div className="d-flex align-items-center mb-3">
                            <div className="symbol symbol-40px me-3">
                                <div className="symbol-label bg-light-primary">
                                    <i className="bi bi-person-bounding-box text-primary fs-1"></i>
                                </div>
                            </div>
                            <div className="d-flex flex-column">
                                <span className="fw-bold text-gray-800 fs-6">Solicitud #{requestData.ID_SOLICITUD}</span>
                                <span className="text-gray-500 fs-7">Solicitada el: {formateDate(requestData.FECHA_CREACION)} por {requestData.USUARIO_CREACION || 'unknow'}</span>
                            </div>
                        </div>
                        <div className="separator separator-dashed my-4"></div>
                        <div className="d-flex flex-column gap-3 pt-4 align-items-center">
                            <div className="d-flex align-items-center">
                                <span className="badge badge-light-primary me-2">
                                    <i className="bi bi-display text-primary fs-1"></i> &nbsp;
                                    AWX
                                </span>
                                <span className="text-gray-600 fs-7">La solicitud será enviada a AWX para su ejecución</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    className="btn btn-sm btn-light-success"
                    disabled={loadingProvisioning}
                    onClick={handleSendRequest}
                >
                    {loadingProvisioning ?
                        <>
                            Enviando &nbsp;
                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        </> :
                        <>
                             <i className="bi bi-play-fill fs-3"></i>
                            Ejecutar aprovisionamiento
                        </>
                    }
                </button>*
            </div>
        </>

    )
}


