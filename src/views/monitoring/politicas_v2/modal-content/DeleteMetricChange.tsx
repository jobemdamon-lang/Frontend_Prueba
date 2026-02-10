import { FC } from "react";
import { Loader } from "../../../../components/Loading";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { MetricChange } from "../Types";

type DeleteModalProps = {
    setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedMetric: MetricChange;
    handleDeleteMetric: () => void;
    loading: boolean;
}

const DeleteMetricChange: FC<DeleteModalProps> = ({ setShowDeleteModal, selectedMetric, handleDeleteMetric, loading }) => {

    return (
        <div className="modal fade show d-block rounded" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered rounded mw-500px">
                <div className="modal-content">
                    <div className="modal-header pb-0 border-0 justify-content-end">
                        <div
                            className='btn btn-icon btn-sm btn-active-light-primary ms-2'
                            onClick={() => setShowDeleteModal(false)}
                        >
                            <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-2' />
                        </div>
                    </div>
                    <div className="modal-body scroll-y px-10 px-lg-15 pt-0 pb-15">
                        <div className="text-center mb-5">
                            <h3 className="mb-3">Confirmar Eliminación</h3>
                            <div className="text-muted fw-semibold fs-6">
                                ¿Está seguro de eliminar esta métrica del cambio?
                            </div>
                        </div>

                        <div className="border border-dashed border-danger rounded d-flex flex-column flex-sm-row p-5 mb-10">
                            <div className="d-flex flex-column pe-0 pe-sm-10">
                                <div className="d-flex align-items-center mb-2 justify-content-center">
                                    <KTSVG
                                        path="/media/icons/duotune/general/gen044.svg"
                                        className="svg-icon-2hx svg-icon-danger me-4"
                                    />
                                    <h4 className="text-danger mb-0">¡Atención!</h4>
                                </div>
                                <span className="text-gray-600  text-center">
                                    Esta acción eliminará permanentemente la métrica
                                    <strong> {selectedMetric.NOMBRE} </strong> del CI
                                    <strong> {selectedMetric.NOMBRE_CI} </strong> del cambio.
                                </span>
                            </div>
                        </div>

                        <div className="d-flex flex-center mt-10">
                            <button
                                type="button"
                                className="btn btn-light me-5 btn-sm"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={handleDeleteMetric}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader className="spinner-border-sm me-2" />
                                        Eliminando
                                    </>
                                ) : (
                                    "Confirmar Eliminación"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { DeleteMetricChange }