import { NoFoundData } from "../../../../components/NoFoundData"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { IUrls } from "../../Types"
import { useAplicationContext } from "../Context"

const DeleteUrlConfirm = () => {

    const { modalHook, integrationHook } = useAplicationContext()
    const modalInformation: IUrls = modalHook.modalInformation
    return (

        <>
            <div className='modal-header px-5 py-3'>
                <h2 className="text-dark">CONFIRMAR OPERACIÓN</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>

            <div className='text-center'>
                <NoFoundData message={`ESTA SEGURO QUE DESEA ELIMINAR ESTA URL ${modalInformation.URL}?`} />
            </div>

            <div className="d-flex justify-content-center mb-3">
                <button className="btn btn-danger"
                    onClick={() => {
                        integrationHook.deleteUrl(modalInformation.ID.toString()).then((success) => {
                            if (success) {
                                integrationHook.getListIntegrationUrl(modalInformation.ID_INTEGRATION.toString())
                            }
                        })
                    }}
                >
                    {integrationHook.loadingDeleteIntegrationUrl ? 'Eliminando...' : 'CONFIRMAR'}
                </button>
            </div>


        </>
    )
}
export { DeleteUrlConfirm }


