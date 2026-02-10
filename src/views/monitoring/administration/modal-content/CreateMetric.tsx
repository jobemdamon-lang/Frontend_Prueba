import { Loader } from "../../../../components/Loading";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { useTypedSelector } from "../../../../store/ConfigStore";
import { useDataFromMonitorOptions } from "../../../inventory/hooks/useDataFromMonitorOptions";
import { useAdministrationContext } from "../Context";
import { RegisterMetric } from "../Types";
import { useEffect, useState } from "react";

export const CreateMetric = () => {

    const { modalHook, metricHook } = useAdministrationContext()
    const { familyData, familyLoading, getFamilia, claseData, claseLoading, getClase } = useDataFromMonitorOptions()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const [formData, setFormData] = useState<RegisterMetric>({
        nombre: '',
        detalle: '',
        id_familia_clase: 0,
        id_herramienta: 0,
        id_tipoequipo: 0,
        cliente: '',
        is_opcional: 0,
        frecuencia: 0,
        usuario: userName || ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'is_opcional' || name === 'id_familia_clase' ||
                name === 'id_herramienta' || name === 'id_tipoequipo' ||
                name === 'frecuencia' ? Number(value) : value
        }))
    }

    const handleCreateMetric = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        metricHook.createMetric({
            ...formData,
            usuario: userName
        }).then(success => {
            if (success) {
                metricHook.getMetrics()
                modalHook.closeModal()
            }
        })
    }

    useEffect(() => {
        metricHook.getTools()
        metricHook.getTypeEquipment()
        getFamilia()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className='modal-header py-3'>
                <h2 className='fw-bolder'>Crear Nueva Métrica</h2>
                <div
                    className='btn btn-icon btn-sm btn-active-icon-primary'
                    onClick={() => modalHook.closeModal()}
                    data-kt-users-modal-action='close'
                >
                    <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                </div>
            </div>

            <form className="form" onSubmit={handleCreateMetric}>
                <div className="modal-body mx-5">
                    <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">Nombre de la Métrica</label>
                        <input
                            type="text"
                            className="form-control form-control mb-3 mb-lg-0"
                            placeholder="Ej: Consumo de CPU"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="fv-row mb-7">
                        <label className="required fw-bold fs-6 mb-2">Descripción</label>
                        <input
                            type="text"
                            className="form-control form-control mb-3 mb-lg-0"
                            placeholder="Detalle de lo que mide esta métrica"
                            name="detalle"
                            value={formData.detalle}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="row g-9 mb-7">
                        <div className="col-md-6 fv-row">
                            <label className="required fw-bold fs-6 mb-2">Familia</label>
                            <select
                                className="form-select form-select"
                                name="id_familia_clase"
                                onChange={(event) => {
                                    getClase(event.target.value)
                                }}
                                required
                                disabled={familyLoading}
                            >
                                <option value="">Seleccione una familia</option>
                                {Array.from(new Set(familyData)).map(family => (
                                    <option key={family.nombre} value={family.nombre}>
                                        {family.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 fv-row">
                            <label className="required fw-bold fs-6 mb-2">Clase</label>
                            <select
                                className="form-select form-select"
                                name="id_familia_clase"
                                value={formData.id_familia_clase}
                                onChange={handleInputChange}
                                required
                                disabled={claseLoading}
                            >
                                <option value="">Seleccione una clase</option>
                                {claseData.map(family => (
                                    <option key={family.codigo} value={family.codigo}>
                                        {family.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row g-9 mb-7">
                        <div className="col-md-6 fv-row">
                            <label className="required fw-bold fs-6 mb-2">Tipo de Equipo</label>
                            <select
                                className="form-select form-select"
                                name="id_tipoequipo"
                                value={formData.id_tipoequipo}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione un tipo de equipo</option>
                                {metricHook.typeEquipments.map(type => (
                                    <option key={type.codigo} value={type.codigo}>
                                        {type.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 fv-row">
                            <label className="required fw-bold fs-6 mb-2">Herramienta</label>
                            <select
                                className="form-select form-select"
                                name="id_herramienta"
                                value={formData.id_herramienta}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione una herramienta</option>
                                {metricHook.tools.map(tool => (
                                    <option key={tool.codigo} value={tool.codigo}>
                                        {tool.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row g-9 mb-7">
                        <div className="col-md-6 fv-row">
                            <label className="required fw-bold fs-6 mb-2">Cliente</label>
                            <input
                                type="text"
                                className="form-control form-control"
                                placeholder="Nombre del cliente"
                                name="cliente"
                                value={formData.cliente}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 fv-row">
                            <label className="required fw-bold fs-6 mb-2">Frecuencia (minutos)</label>
                            <input
                                type="number"
                                className="form-control form-control"
                                placeholder="Ej: 30"
                                min="1"
                                name="frecuencia"
                                value={formData.frecuencia || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="row g-9 mb-7">
                        <div className="col-md-6 fv-row">
                            <label className="required fw-bold fs-6 mb-2">¿Es opcional?</label>
                            <select
                                className="form-select form-select"
                                name="is_opcional"
                                value={formData.is_opcional}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="0">No</option>
                                <option value="1">Sí</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="modal-footer flex-center">
                    <button
                        type="button"
                        className="btn btn-light me-3"
                        onClick={() => modalHook.closeModal()}
                        disabled={metricHook.createMetricLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={metricHook.createMetricLoading || familyLoading || claseLoading}
                    >
                        {metricHook.createMetricLoading ? (
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
                                    Crear Métrica
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </>
    )
}