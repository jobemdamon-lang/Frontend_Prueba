import { NoFoundData } from "../../../../components/NoFoundData"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { IUpdateToken } from "../../Types"
import { useAplicationContext } from "../Context"

const ActionConfirmation = () => {
    const { modalHook, integrationHook } = useAplicationContext()
    const modalInformation: IUpdateToken = modalHook.modalInformation
    return (

        <>
            <div className='modal-header px-5 py-3'>
                <h2 className="text-dark">CONFIRMAR OPERACIÓN | {modalInformation.NOMBRE}</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>

            <div className='text-center'>
                <NoFoundData message={`ESTA SEGURO QUE DESEA ${modalInformation.estado === 1 ? "DESHABILITAR" : "HABILITAR"} ESTA INTEGRACIÓN?`} />
            </div>

            <div className="d-flex justify-content-center mb-3">
                <button className="btn btn-danger"
                    onClick={() => {
                        integrationHook.activateDesactivateIntegration(modalInformation.ID_INTEGRACION.toString()).then((success) => {
                            if (success) {
                                integrationHook.getLisAlltIntegration()
                            }
                        })


                    }}

                >
                    {
                        integrationHook.loadingActivateDesactivate ? actions[modalInformation.ESTADO].loading : actions[modalInformation.ESTADO].normal}
                </button>
            </div>


        </>
    )
}
export { ActionConfirmation }

const actions = [
    {
        loading: 'ACTIVANDO',
        normal: 'ACTIVAR'
    },
    {
        loading: 'DESACTIVANDO',
        normal: 'DESACTIVAR'
    }
]
