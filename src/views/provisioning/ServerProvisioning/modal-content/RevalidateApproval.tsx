import { KTSVG } from "../../../../helpers"
import { RequestVMResume } from "../../Types"
import { useServerProvisioningContext } from "../Context"

export const RevalidateApproval = () => {

    const { modalHook, requestVMHook: { revalidateApproval, loadingRevalidation, getRequestVM } } = useServerProvisioningContext()
    const requestData: RequestVMResume = modalHook.modalInformation

    const handleRevalidateApproval = () => {
        revalidateApproval({ nroTicket: requestData?.NRO_TICKET || '' }).then(result => {
            if (result) {
                getRequestVM(requestData.ID_SOLICITUD)
                modalHook.closeModal()
            }
        })
    }

    return (
        <>
            <div className='modal-header py-4'>
                <h2 className="text-dark">REVALIDAR APROBACIÓN</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body pt-3 px-10 d-flex flex-column align-items-center'>
                <div className="d-flex flex-column my-5">
                    <div className="text-center">
                        <h4 className="mb-4">¿Su solicitud no refleja el estado de su ticket?</h4>
                        <p className="text-gray-500">Ejecute esta acción cuando su Ticket haya sido aprobado / rechazado     pero no se refleje en su solicitud</p>
                    </div>
                </div>
                <button
                    className="btn btn-sm btn-light-success"
                    disabled={loadingRevalidation}
                    onClick={handleRevalidateApproval}
                >
                    {loadingRevalidation ?
                        <>
                            Revalidando &nbsp;
                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        </> :
                        <>
                            <i className="bi bi-check-all fs-3"></i>
                            Revalidar aprobación
                        </>
                    }
                </button>
            </div>
        </>

    )
}


