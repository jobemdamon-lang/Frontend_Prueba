import { Loader } from "../../../../components/Loading";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { warningNotification } from "../../../../helpers/notifications";
import { useTypedSelector } from "../../../../store/ConfigStore";
import { useAdministrationContext } from "../Context";
import { MetricCatalog, RegisterMetricParam } from "../Types";
import { useState } from "react";

export const CreateUmbral = () => {

    const { modalHook, metricParamHook } = useAdministrationContext()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const metric: MetricCatalog = modalHook.modalInformation
    const [formData, setFormData] = useState<RegisterMetricParam>({
        id_metrica: metric.ID_METRICA,
        parametro: 'DEFAULT',
        urgencia: 'WARNING',
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

        if (!formData.umbral || !formData.unidades || !formData.nro_pooleos){
            warningNotification('Por favor complete todos los campos requeridos para parámetros de urgencia')
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
                <h2 className='fw-bolder'>Nuevo umbral para {metric.NOMBRE}</h2>
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
                        <label className="required fw-bold fs-6 mb-2">Nivel de Urgencia</label>
                        <select
                            className="form-select form-select"
                            name="urgencia"
                            value={formData.urgencia}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="WARNING">WARNING (Amarillo)</option>
                            <option value="CRITICAL">CRITICAL (Naranja)</option>
                            <option value="FATAL">FATAL (Rojo)</option>
                            <option value="INFORMATIVO">INFORMATIVO (azul)</option>
                        </select>
                    </div>

                    <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">Umbral</label>
                        <input
                            type="text"
                            className="form-control form-control"
                            placeholder="Valor límite para la alerta"
                            name="umbral"
                            value={formData.umbral}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="row g-9 mb-7">
                        <div className="col-md-6 fv-row">
                            <label className="required fw-bold fs-6 mb-2">Unidades</label>
                            <input
                                type="text"
                                className="form-control form-control"
                                placeholder="Ej: %, °C, MB"
                                name="unidades"
                                value={formData.unidades}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="col-md-6 fv-row">
                            <label className="required fw-bold fs-6 mb-2">N° Pooleos</label>
                            <input
                                type="text"
                                className="form-control form-control"
                                placeholder="Número de pooleos"
                                name="nro_pooleos"
                                value={formData.nro_pooleos}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
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
                                    Crear Umbral
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </>
    )
}