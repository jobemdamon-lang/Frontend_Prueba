import { Loader } from "../../../../components/Loading";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { warningNotification } from "../../../../helpers/notifications";
import { useTypedSelector } from "../../../../store/ConfigStore";
import { useAdministrationContext } from "../Context";
import { MetricCatalog, RegisterMetricParam } from "../Types";
import { useState } from "react";

export const CreateParam = () => {

    const { modalHook, metricParamHook } = useAdministrationContext()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const metric: MetricCatalog = modalHook.modalInformation

    const [formData, setFormData] = useState<RegisterMetricParam>({
        id_metrica: metric.ID_METRICA,
        parametro: '',
        urgencia: '',
        umbral: '',
        nro_pooleos: '',
        unidades: '',
        valor_parametro: '',
        usuario: userName
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCreateParam = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!formData.parametro || !formData.valor_parametro) {
            warningNotification('Por favor complete todos los campos requeridos para parámetros extra')
            return
        }

        metricParamHook.createMetricParam({
            ...formData,
            usuario: userName
        }).then(success => {
            if (success) {
                metricParamHook.getParamsByMetricId(metric.ID_METRICA)
                modalHook.closeModal()
            }
        })
    }

    return (
        <>
            <div className='modal-header py-3'>
                <h2 className='fw-bolder'>Nuevo Parámetro para {metric.NOMBRE}</h2>
                <div
                    className='btn btn-icon btn-sm btn-active-icon-primary'
                    onClick={() => modalHook.closeModal()}
                    data-kt-users-modal-action='close'
                >
                    <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                </div>
            </div>

            <form className="form" onSubmit={handleCreateParam}>
                <div className="modal-body mx-5">

                    <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">Nombre del Parámetro</label>
                        <input
                            type="text"
                            className="form-control form-control"
                            placeholder="Nombre descriptivo del parámetro"
                            name="parametro"
                            value={formData.parametro}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">Valor por Defecto</label>
                        <input
                            type="text"
                            className="form-control form-control"
                            placeholder="Valor predeterminado"
                            name="valor_parametro"
                            value={formData.valor_parametro}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                </div>

                <div className="modal-footer flex-center">
                    <button
                        type="button"
                        className="btn btn-light me-3"
                        onClick={() => modalHook.closeModal()}
                        disabled={metricParamHook.createParamLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={metricParamHook.createParamLoading}
                    >
                        {metricParamHook.createParamLoading ? (
                            <>
                                <span className="indicator-label">
                                    <Loader className="spinner-border-sm me-2" />
                                    Procesando
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="indicator-label">
                                    <i className="bi bi-save-fill me-2"></i>
                                    Crear Parámetro
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </>
    )
}