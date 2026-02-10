import { cloneDeep } from "lodash";
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useMonitoringPoliciesContext } from "../Context"
import { MetricVersion, MetricVersionFront } from "../Types"
import uniqid from "uniqid"

type ModalInformationProps = {
    metric: MetricVersion;
    setUpdates: React.Dispatch<React.SetStateAction<MetricVersionFront[]>>;
    setActiveView: React.Dispatch<React.SetStateAction<"update" | "addm" | "addc" | "resume">>;
}

export const DeleteMetric = () => {

    const { modalHook } = useMonitoringPoliciesContext()
    const { metric, setUpdates }: ModalInformationProps = modalHook.modalInformation

    const handleDelete = () => {
        const clonedMetric = cloneDeep(metric)
        const deletedMetric: MetricVersionFront = {
            ...clonedMetric,
            ID_FRONT: uniqid(),
            TIPO_CAMBIO: 'BAJA METRICA',
            ESTADO: 0
        }
        setUpdates((prev) => ([...prev, deletedMetric]))
        modalHook.closeModal()
    }

    return (
        <>
            <div className='modal-header py-3'>
                <h2 className="text-dark">Eliminar Metrica</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className="modal-body">
                <div className="d-flex justify-content-center mb-5">
                    <div className="text-center">
                        <KTSVG
                            className='svg-icon-3x svg-icon-danger'
                            path='/media/icons/duotune/general/gen027.svg'
                        />
                        <h5 className="text-gray-700 fs-5 mt-5 fw-normal">¿Está seguro desea añadir la eliminación de esta métrica en su solicitud?</h5>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <button
                        type="button"
                        className="btn btn-sm btn-danger me-2"
                        onClick={handleDelete}
                    >
                        Eliminar
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => modalHook.closeModal()}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </>
    )
}