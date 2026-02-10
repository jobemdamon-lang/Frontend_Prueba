import { KTSVG } from "../../../../helpers/components/KTSVG";
import { useMonitoringPoliciesContext } from "../Context";
import { ChangeRequest } from "../Types";
import { Loader } from "../../../../components/Loading";
import { useTypedSelector } from "../../../../store/ConfigStore";

const CancelChange = () => {

    const { modalHook, changesHook, globalParams } = useMonitoringPoliciesContext()
    const change: ChangeRequest = modalHook.modalInformation
    const userName = useTypedSelector(({ auth }) => auth.usuario)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        changesHook.cancelImplementChange({
            accion: 0,
            id_cambio: change.ID_CAMBIO,
            usuario: userName
        }).then((success) => {
            if (success) {
                changesHook.getListChanges(globalParams.projectID)
                modalHook.closeModal()
            }
        })
    }

    return (
        <>
            <div className='modal-header py-3'>
                <h2 className="text-dark">CANCELAR CAMBIO #{change.ID_CAMBIO}</h2>
                <div
                    className='btn btn-sm btn-icon btn-active-color-primary'
                    onClick={() => !changesHook.cancelImplementChangeLoading && modalHook.closeModal()}
                >
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <form onSubmit={handleSubmit} className="form">
                <div className="modal-body py-6 px-9">
                    {/* Alerta de advertencia */}
                    <div className="border border-dashed border-danger rounded d-flex flex-column flex-sm-row p-5 mb-10">
                        <div className="d-flex flex-column pe-0 pe-sm-10">
                            <div className="d-flex align-items-center mb-2">
                                <KTSVG
                                    path="/media/icons/duotune/general/gen044.svg"
                                    className="svg-icon-2hx svg-icon-danger me-4"
                                />
                                <h4 className="text-danger mb-0">¡Atención!</h4>
                            </div>
                            <span className="text-gray-600">
                                Todas las actualizaciones realizadas en este cambio serán <span className="fw-bold">canceladas permanentemente</span>.
                                Esta acción <span className="fw-bold">no se puede deshacer</span>.
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 d-flex justify-content-center">
                            <label className="form-check form-check-custom form-check-solid">
                                <input className="form-check-input" type="checkbox" required />
                                <span className="form-check-label text-gray-800">
                                    Confirmo que entiendo las consecuencias de esta acción
                                </span>
                            </label>
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
                        className="btn btn-danger"
                        disabled={changesHook.cancelImplementChangeLoading}
                    >
                        {changesHook.cancelImplementChangeLoading ? (
                            <>
                                <Loader className="spinner-border-sm me-2" />
                                Procesando
                            </>
                        ) : (
                            "Confirmar Cancelación"
                        )}
                    </button>
                </div>
            </form>
        </>
    );
};

export { CancelChange };