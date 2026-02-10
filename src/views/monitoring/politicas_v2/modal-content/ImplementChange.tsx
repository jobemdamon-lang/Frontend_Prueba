import { Loader } from "../../../../components/Loading"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useTypedSelector } from "../../../../store/ConfigStore"
import { useMonitoringPoliciesContext } from "../Context"
import { ChangeRequest } from "../Types"

const ImplementChange = () => {

    const { modalHook, changesHook, policyHook, globalParams } = useMonitoringPoliciesContext()
    const change: ChangeRequest = modalHook.modalInformation
    const userName = useTypedSelector(({ auth }) => auth.usuario)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        changesHook.cancelImplementChange({
            accion: 1,
            id_cambio: change.ID_CAMBIO,
            usuario: userName
        }).then((success) => {
            if (success) {
                policyHook.getVersionsByProject(globalParams.projectID)
                changesHook.getListChanges(globalParams.projectID)
                modalHook.closeModal()
            }
        })
    }

    return (
        <>
            <div className='modal-header py-3'>
                <h2 className="text-dark">IMPLEMENTAR CAMBIO #{change.ID_CAMBIO}</h2>
                <div
                    className='btn btn-sm btn-icon btn-active-color-primary'
                    onClick={() => !changesHook.cancelImplementChangeLoading && modalHook.closeModal()}
                >
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <form onSubmit={handleSubmit} className="form">
                <div className="modal-body py-6 px-9">
                    {/* Alerta informativa */}
                    <div className="border border-dashed border-primary rounded d-flex flex-column flex-sm-row p-5 mb-10">
                        <div className="d-flex flex-column pe-0 pe-sm-10">
                            <div className="d-flex align-items-center mb-2">
                                <KTSVG
                                    path="/media/icons/duotune/general/gen044.svg"
                                    className="svg-icon-2hx svg-icon-primary me-4"
                                />
                                <h4 className="text-primary mb-0">Acción importante</h4>
                            </div>
                            <span className="text-gray-700">
                                Al confirmar, se <span className="fw-bold">marcará este cambio como implementado</span> y
                                se <span className="fw-bold">creará una nueva versión</span> de la política con estas modificaciones.
                            </span>
                        </div>
                    </div>
                    <div className="text-center mb-5">
                        <div className="text-muted fw-semibold fs-5">
                            Se generará una nueva versión con los cambios del ticket #{change.NRO_TICKET}
                        </div>
                    </div>
                </div>
                <div className="modal-footer flex-nowrap pt-4 pb-6 px-9">
                    <button
                        type="button"
                        className="btn btn-light btn-active-light-primary me-3"
                        onClick={() => modalHook.closeModal()}
                        disabled={changesHook.cancelImplementChangeLoading}
                    >
                        Cerrar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={changesHook.cancelImplementChangeLoading}
                    >
                        {changesHook.cancelImplementChangeLoading ? (
                            <>
                                <Loader className="spinner-border-sm me-2" />
                                Procesando
                            </>
                        ) : (
                            "Confirmar implementación"
                        )}
                    </button>
                </div>
            </form>
        </>
    )
}

export { ImplementChange }