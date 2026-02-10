import { FC, useEffect, useState } from "react";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { Loader } from "../../../../components/Loading";
import { ChangeRequest, MetricChange, UpdatedParam, UpdatedVersion } from "../Types";
import { findUrgentChange, findNormalParametersChange } from "../utils";
import { useCI } from "../../../inventory/hooks/useCI";
import { useCatalog } from "../hooks/useCatalog";

type EditModalProps = {
    setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedMetric: MetricChange;
    change: ChangeRequest;
    handleEditMetric: (updatedVersion: UpdatedVersion) => Promise<void>;
    loading: boolean;
}

interface FormData {
    frequency: string;
    ip: string;
    tool: string;
    informativo_umbral: string;
    informativo_pooleo: string;
    warning_umbral: string;
    warning_pooleo: string;
    critical_umbral: string;
    critical_pooleo: string;
    fatal_umbral: string;
    fatal_pooleo: string;
    normalParams: Record<string, string>;
}

const EditMetricChange: FC<EditModalProps> = ({ setShowEditModal, selectedMetric, change, handleEditMetric, loading }) => {

    const { getIPsByCI, loadingIPsByCI, CIIps } = useCI()
    const { getTools, tools, toolsLoading } = useCatalog()

    const informative = findUrgentChange(selectedMetric.VALORES_PARAMETROS, 'INFORMATIVO')
    const warning = findUrgentChange(selectedMetric.VALORES_PARAMETROS, 'WARNING')
    const critical = findUrgentChange(selectedMetric.VALORES_PARAMETROS, 'CRITICAL')
    const fatal = findUrgentChange(selectedMetric.VALORES_PARAMETROS, 'FATAL')
    const normalChangeParameters = findNormalParametersChange(selectedMetric.VALORES_PARAMETROS)

    const [formData, setFormData] = useState<FormData>({
        frequency: selectedMetric.FRECUENCIA || '',
        ip: selectedMetric.NRO_IP || '',
        tool: selectedMetric.HERRAMIENTA?.toUpperCase() || '',
        informativo_umbral: informative?.UMBRAL || '',
        informativo_pooleo: informative?.NRO_POOLEOS || '',
        warning_umbral: warning?.UMBRAL || '',
        warning_pooleo: warning?.NRO_POOLEOS || '',
        critical_umbral: critical?.UMBRAL || '',
        critical_pooleo: critical?.NRO_POOLEOS || '',
        fatal_umbral: fatal?.UMBRAL || '',
        fatal_pooleo: fatal?.NRO_POOLEOS || '',
        normalParams: {}
    })

    useEffect(() => {
        getIPsByCI(selectedMetric.ID_EQUIPO)
        getTools()

        // Inicializar parámetros normales
        const initialNormalParams: Record<string, string> = {}
        normalChangeParameters.forEach(param => {
            initialNormalParams[`param_${param.ID_METRICA_PARAMETRO}`] = param.PARAMETRO_VALOR || ''
        })

        setFormData(prev => ({
            ...prev,
            normalParams: initialNormalParams
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target

        if (id.startsWith('param_')) {
            setFormData(prev => ({
                ...prev,
                normalParams: {
                    ...prev.normalParams,
                    [id]: value
                }
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [id]: value
            }))
        }
    };

    const handleSubmit = () => {

        const findedTool = tools.find(t => t.nombre.toUpperCase() === formData.tool)
        const findedIP = CIIps.find(ip => ip.NRO_IP === formData.ip)
        const updatedVersion: UpdatedVersion = {
            id_politica: change.ID_POLITICA,
            id_version: parseInt(change.ID_VERSION),
            usuario: change.USUARIO_CREACION,
            nro_ticket: change.NRO_TICKET,
            motivo: change.MOTIVO,
            lista_cambio_politica: [
                {
                    tipo_cambio: selectedMetric.TIPO_CAMBIO,
                    id_cambio_detalle: selectedMetric.ID_CAMBIO_DETALLE,
                    id_detalle_politica: selectedMetric.ID_DETALLE_POLITICA,
                    id_equipo: selectedMetric.ID_EQUIPO,
                    id_metrica: selectedMetric.ID_METRICA,
                    id_herramienta: findedTool?.codigo || selectedMetric.ID_HERRAMIENTA,
                    id_equipo_ip: Number(findedIP?.ID_EQUIPO_IP || selectedMetric.ID_EQUIPO_IP),
                    id_tipoequipo: selectedMetric.ID_TIPO_EQUIPO,
                    frecuencia: Number(formData.frequency || selectedMetric.FRECUENCIA),
                    estado: selectedMetric.ESTADO,
                    lista_parametros: buildUpdatedParams()
                }
            ]
        }

        handleEditMetric(updatedVersion)
    }

    const buildUpdatedParams = (): UpdatedParam[] => {
        const params: UpdatedParam[] = []

        // Agregar parámetros urgentes (WARNING, CRITICAL, FATAL, INFORMATIVO)
        if (informative) {
            params.push({
                id_cambio_metrica_valor: informative.ID_CAMBIO_METRICA_VALOR,
                nro_pooleos: Number(formData.informativo_pooleo || informative.NRO_POOLEOS),
                parametro_valor: informative.PARAMETRO_VALOR,
                umbral: formData.informativo_umbral,
                estado: informative.ESTADO.toString(),
                id_metrica_parametro: informative.ID_METRICA_PARAMETRO
            })
        }

        if (warning) {
            params.push({
                id_cambio_metrica_valor: warning.ID_CAMBIO_METRICA_VALOR,
                nro_pooleos: Number(formData.warning_pooleo || warning.NRO_POOLEOS),
                parametro_valor: warning.PARAMETRO_VALOR,
                umbral: formData.warning_umbral,
                estado: warning.ESTADO.toString(),
                id_metrica_parametro: warning.ID_METRICA_PARAMETRO
            })
        }

        if (critical) {
            params.push({
                id_cambio_metrica_valor: critical.ID_CAMBIO_METRICA_VALOR,
                nro_pooleos: Number(formData.critical_pooleo || critical.NRO_POOLEOS),
                parametro_valor: critical.PARAMETRO_VALOR,
                umbral: formData.critical_umbral,
                estado: critical.ESTADO.toString(),
                id_metrica_parametro: critical.ID_METRICA_PARAMETRO
            })
        }

        if (fatal) {
            params.push({
                id_cambio_metrica_valor: fatal.ID_CAMBIO_METRICA_VALOR,
                nro_pooleos: Number(formData.fatal_pooleo || fatal.NRO_POOLEOS),
                parametro_valor: fatal.PARAMETRO_VALOR,
                umbral: formData.fatal_umbral,
                estado: fatal.ESTADO.toString(),
                id_metrica_parametro: fatal.ID_METRICA_PARAMETRO
            })
        }

        // Agregar parámetros normales
        normalChangeParameters.forEach(param => {
            const paramKey = `param_${param.ID_METRICA_PARAMETRO}`;
            params.push({
                id_cambio_metrica_valor: param.ID_CAMBIO_METRICA_VALOR,
                nro_pooleos: Number(param.NRO_POOLEOS || 0),
                parametro_valor: formData.normalParams[paramKey] || '',
                umbral: param.UMBRAL || '',
                estado: param.ESTADO.toString(),
                id_metrica_parametro: param.ID_METRICA_PARAMETRO
            });
        });

        return params
    }

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded">
                    <div className="modal-header pb-0 border-0 justify-content-end">
                        <div
                            className='btn btn-icon btn-sm btn-active-light-primary ms-2'
                            onClick={() => setShowEditModal(false)}
                        >
                            <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-2' />
                        </div>
                    </div>
                    <div className="modal-body scroll-y px-10 px-lg-15 pt-0">
                        <div className="row g-5">
                            {/* Campos para INFORMATIVE */}
                            {informative && (
                                <>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="informativo_umbral" className="form-label">Umbral Informativo</label>
                                        <div className="input-group input-group-sm">
                                            <span className="input-group-text">
                                                <i className="bi bi-percent"></i>
                                            </span>
                                            <input
                                                type="text"
                                                id="informativo_umbral"
                                                className="form-control"
                                                placeholder="Porcentaje de umbral"
                                                value={formData.informativo_umbral}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6 mb-5">
                                        <label htmlFor="informativo_pooleo" className="form-label">Pooleo Informativo</label>
                                        <div className="input-group input-group-sm">
                                            <span className="input-group-text">
                                                <i className="bi bi-123"></i>
                                            </span>
                                            <input
                                                type="number"
                                                id="informativo_pooleo"
                                                className="form-control"
                                                placeholder="Nro. de pooleos"
                                                value={formData.informativo_pooleo}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Campos para WARNING */}
                            {warning && (
                                <>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="warning_umbral" className="form-label">Umbral Warning</label>
                                        <div className="input-group input-group-sm">
                                            <span className="input-group-text">
                                                <i className="bi bi-percent"></i>
                                            </span>
                                            <input
                                                type="text"
                                                id="warning_umbral"
                                                className="form-control"
                                                placeholder="Porcentaje de umbral"
                                                value={formData.warning_umbral}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6 mb-5">
                                        <label htmlFor="warning_pooleo" className="form-label">Pooleo Warning</label>
                                        <div className="input-group input-group-sm">
                                            <span className="input-group-text">
                                                <i className="bi bi-123"></i>
                                            </span>
                                            <input
                                                type="number"
                                                id="warning_pooleo"
                                                className="form-control"
                                                placeholder="Nro. de pooleos"
                                                value={formData.warning_pooleo}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Campos para CRITICAL */}
                            {critical && (
                                <>
                                    <div className="col-12 col-md-6 mb-5">
                                        <label htmlFor="critical_umbral" className="form-label">Umbral Critical</label>
                                        <div className="input-group input-group-sm">
                                            <span className="input-group-text">
                                                <i className="bi bi-percent"></i>
                                            </span>
                                            <input
                                                type="text"
                                                id="critical_umbral"
                                                className="form-control"
                                                placeholder="Porcentaje de umbral"
                                                value={formData.critical_umbral}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="critical_pooleo" className="form-label">Pooleo Critical</label>
                                        <div className="input-group input-group-sm">
                                            <span className="input-group-text">
                                                <i className="bi bi-123"></i>
                                            </span>
                                            <input
                                                type="number"
                                                id="critical_pooleo"
                                                className="form-control"
                                                placeholder="Nro. de pooleos"
                                                value={formData.critical_pooleo}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Campos para FATAL */}
                            {fatal && (
                                <>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="fatal_umbral" className="form-label">Umbral Fatal</label>
                                        <div className="input-group input-group-sm">
                                            <span className="input-group-text">
                                                <i className="bi bi-percent"></i>
                                            </span>
                                            <input
                                                type="text"
                                                id="fatal_umbral"
                                                className="form-control"
                                                placeholder="Porcentaje de umbral"
                                                value={formData.fatal_umbral}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6 mb-5">
                                        <label htmlFor="fatal_pooleo" className="form-label">Pooleo Fatal</label>
                                        <div className="input-group input-group-sm">
                                            <span className="input-group-text">
                                                <i className="bi bi-123"></i>
                                            </span>
                                            <input
                                                type="number"
                                                id="fatal_pooleo"
                                                className="form-control"
                                                placeholder="Nro. de pooleos"
                                                value={formData.fatal_pooleo}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Campos base */}
                            <div className="col-12 col-md-6">
                                <label htmlFor="frequency" className="form-label">Frecuencia</label>
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text">
                                        <i className="bi bi-repeat"></i>
                                    </span>
                                    <input
                                        type="text"
                                        id="frequency"
                                        className="form-control"
                                        placeholder="Frecuencia de pooleos"
                                        value={formData.frequency}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="col-12 col-md-6 mb-5">
                                <label htmlFor="ip" className="form-label">Seleccionar IP</label>
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text">
                                        <i className="bi bi-hdd-network"></i>
                                    </span>
                                    <select
                                        id="ip"
                                        className="form-select"
                                        aria-label="Seleccionar IP"
                                        value={formData.ip}
                                        onChange={handleInputChange}
                                    >
                                        <option disabled value="">{loadingIPsByCI ? 'Cargando' : 'Selecciona una IP'}</option>
                                        {CIIps.map(ip => (
                                            <option key={ip.ID_EQUIPO_IP} value={ip.NRO_IP}>
                                                {ip.NRO_IP}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="col-12 col-md-6 mb-5">
                                <label htmlFor="tool" className="form-label">Seleccionar Herramienta</label>
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text">
                                        <i className="bi bi-gear-wide"></i>
                                    </span>
                                    <select
                                        id="tool"
                                        className="form-select"
                                        aria-label="Seleccionar Herramienta"
                                        value={formData.tool}
                                        onChange={handleInputChange}
                                    >
                                        <option disabled value="">{toolsLoading ? 'Cargando' : 'Selecciona una herramienta'}</option>
                                        {tools.map(tool => (
                                            <option key={tool.codigo} value={tool.nombre.toUpperCase()}>
                                                {tool.nombre.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Parámetros normales del catálogo */}
                            {normalChangeParameters.map(param => {
                                const key = `param_${param.ID_METRICA_PARAMETRO}`;

                                return (
                                    <div key={param.ID_METRICA_PARAMETRO} className="col-12 col-md-6 mb-5">
                                        <label htmlFor={key} className="form-label">
                                            {param.URGENCIA}
                                        </label>
                                        <div className="input-group input-group-sm">
                                            <span className="input-group-text">
                                                <i className="bi bi-gear"></i>
                                            </span>
                                            <input
                                                type="text"
                                                id={key}
                                                className="form-control"
                                                placeholder={`Ingrese ${param.URGENCIA.toLowerCase()}`}
                                                value={formData.normalParams[key] || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>


                    </div>
                    <div className="modal-footer d-flex flex-center mt-10">
                        <button
                            type="button"
                            className="btn btn-light me-5 btn-sm"
                            onClick={() => setShowEditModal(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={handleSubmit}
                            disabled={loading || loadingIPsByCI || toolsLoading}
                        >
                            {loading ? (
                                <>
                                    <Loader className="spinner-border-sm me-2" />
                                    Actualizando
                                </>
                            ) : (
                                "Confirmar actualización"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { EditMetricChange }