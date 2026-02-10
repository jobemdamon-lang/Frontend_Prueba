import { Loader } from "../../../../components/Loading";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { warningNotification } from "../../../../helpers/notifications";
import { useTypedSelector } from "../../../../store/ConfigStore";
import { useAdministrationContext } from "../Context";
import { MetricParam, UpdateMetricParam } from "../Types";
import { useState } from "react";

export const UpdateParam = () => {

    const { modalHook, metricParamHook } = useAdministrationContext()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const paramToEdit: MetricParam = modalHook.modalInformation

    const [formData, setFormData] = useState<UpdateMetricParam>({
        id_metrica_parametro: paramToEdit.ID_METRICA_PARAMETRO,
        parametro: paramToEdit.PARAMETRO,
        urgencia: paramToEdit.URGENCIA || '',
        umbral: paramToEdit.UMBRAL || '',
        nro_pooleos: paramToEdit.NRO_POOLEOS || '',
        unidades: paramToEdit.UNIDADES || '',
        valor_parametro: paramToEdit.VALOR_PARAMETRO || '',
        usuario: userName,
        estado: paramToEdit.ESTADO
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'estado' ? Number(value) : value
        }))
    }

    const handleUpdateParam = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!formData.parametro || !formData.valor_parametro) {
            warningNotification('Por favor complete todos los campos requeridos para parámetros extra')
            return;
        }

        metricParamHook.updateMetricParam({
            ...formData,
            usuario: userName || ''
        }).then(success => {
            if (success) {
                metricParamHook.getParamsByMetricId(paramToEdit.ID_METRICA)
                modalHook.closeModal();
            }
        })
    }

    return (
        <>
            <div className='modal-header py-3'>
                <h2 className='fw-bolder'>Editar Parámetro</h2>
                <div
                    className='btn btn-icon btn-sm btn-active-icon-primary'
                    onClick={() => modalHook.closeModal()}
                    data-kt-users-modal-action='close'
                >
                    <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                </div>
            </div>

            <form className="form" onSubmit={handleUpdateParam}>
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
                    <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">Estado</label>
                        <select
                            className="form-select form-select"
                            name="estado"
                            value={formData.estado}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="1">Activo</option>
                            <option value="0">Inactivo</option>
                        </select>
                    </div>
                </div>

                <div className="modal-footer flex-center">
                    <button
                        type="button"
                        className="btn btn-light me-3"
                        onClick={() => modalHook.closeModal()}
                        disabled={metricParamHook.updateParamLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={metricParamHook.updateParamLoading}
                    >
                        {metricParamHook.updateParamLoading ? (
                            <>
                                <span className="indicator-label">
                                    <Loader className="spinner-border-sm me-2" />
                                    Procesando...
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="indicator-label">
                                    <i className="bi bi-save-fill me-2"></i>
                                    Actualizar Parámetro
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </>
    )
}