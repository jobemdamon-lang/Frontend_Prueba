import { useEffect, useState } from "react";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { useMonitoringPoliciesContext } from "../Context";
import { MetricParameter, MetricVersion, MetricVersionFront, ParamCatalog, Urgent } from "../Types";
import { findUrgent, getBadgeColor, THRESHOLDS, toSQLServerFormat } from "../utils";
import { useCI } from "../../../inventory/hooks/useCI";
import { cloneDeep } from "lodash";
import { useTypedSelector } from "../../../../store/ConfigStore";
import uniqid from "uniqid";

type ModalInformationProps = {
    metric: MetricVersion;
    setUpdates: React.Dispatch<React.SetStateAction<MetricVersionFront[]>>;
    setActiveView: React.Dispatch<React.SetStateAction<"update" | "addm" | "addc" | "resume">>;
}

type FormValues = {
    frequency: string;
    ip_select: string;
    tool_select: string;
    informativo_umbral: string;
    informativo_pooleo: string;
    warning_umbral: string;
    warning_pooleo: string;
    critical_umbral: string;
    critical_pooleo: string;
    fatal_umbral: string;
    fatal_pooleo: string;
    [key: `param_${number}`]: string;
}

export const UpdateMetric = () => {

    const { modalHook, catalogHook } = useMonitoringPoliciesContext()
    const { metric, setUpdates }: ModalInformationProps = modalHook.modalInformation
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const { getIPsByCI, loadingIPsByCI, CIIps } = useCI()

    // Encontrar umbrales existentes
    const informative = findUrgent(metric.VALORES_PARAMETROS, 'INFORMATIVO')
    const warning = findUrgent(metric.VALORES_PARAMETROS, 'WARNING')
    const critical = findUrgent(metric.VALORES_PARAMETROS, 'CRITICAL')
    const fatal = findUrgent(metric.VALORES_PARAMETROS, 'FATAL')

    // Obtener umbrales definidos en el catálogo
    const thresholdCatalogParams = catalogHook.metricCatalog?.VALORES_PARAMETROS.filter(
        p => p.URGENCIA && THRESHOLDS.includes(p.URGENCIA)
    ) || []
    const normalCatalogParams = catalogHook.metricCatalog?.VALORES_PARAMETROS.filter(
        p => !THRESHOLDS.includes(p.URGENCIA || '')
    ) || []

    const informativeInCatalog = thresholdCatalogParams.find(p => p.URGENCIA === 'INFORMATIVO')
    const warningInCatalog = thresholdCatalogParams.find(p => p.URGENCIA === 'WARNING')
    const criticalInCatalog = thresholdCatalogParams.find(p => p.URGENCIA === 'CRITICAL')
    const fatalInCatalog = thresholdCatalogParams.find(p => p.URGENCIA === 'FATAL')


    const initialFormValues: FormValues = {
        frequency: metric.FRECUENCIA || '',
        ip_select: metric.NRO_IP || '',
        tool_select: metric.HERRAMIENTA?.toUpperCase() || '',
        informativo_umbral: informative?.UMBRAL || '',
        informativo_pooleo: informative?.NRO_POOLEOS || '',
        warning_umbral: warning?.UMBRAL || '',
        warning_pooleo: warning?.NRO_POOLEOS || '',
        critical_umbral: critical?.UMBRAL || '',
        critical_pooleo: critical?.NRO_POOLEOS || '',
        fatal_umbral: fatal?.UMBRAL || '',
        fatal_pooleo: fatal?.NRO_POOLEOS || '',
    }
    const [formValues, setFormValues] = useState<FormValues>(initialFormValues);


    // Obtener IPs e información del catálogo
    useEffect(() => {
        getIPsByCI(metric.ID_EQUIPO)
        catalogHook.getMetricCatalog(metric.ID_METRICA)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [metric])

    // Inicializar valores de parámetros normales del formulario
    useEffect(() => {
        if (!catalogHook.metricCatalog) return;

        // Creamos un objeto con los valores iniciales para los parámetros
        const paramValues: Record<`param_${number}`, string> = {}

        normalCatalogParams.forEach(param => {
            // Buscar el valor actual en la métrica
            const metricParam = metric.VALORES_PARAMETROS.find(
                p => p.ID_METRICA_PARAMETRO === param.ID_METRICA_PARAMETRO
            )

            // Usamos clave dinámica con template literal
            const key = `param_${param.ID_METRICA_PARAMETRO}` as `param_${number}`
            paramValues[key] = metricParam?.PARAMETRO_VALOR || ''
        });

        setFormValues(prev => ({
            ...prev,
            ...paramValues
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [metric, catalogHook.metricCatalog])


    const handleInputChange = (name: keyof FormValues, value: string) => {
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        /*
        // Validar si existen cambios
        if (!hasMetricChanges(metric, formValues)) {
            warningNotification('Debes realizar al menos un cambio para actualizar la métrica');
            return;
        }*/

        // Actualizar datos base
        const clonedMetric = cloneDeep(metric);
        const findedIP = CIIps.find(ip => ip.NRO_IP === formValues.ip_select)
        const findedTool = catalogHook.tools.find(tool => tool.nombre.toUpperCase() === formValues.tool_select.toUpperCase())

        const updatedMetric: MetricVersionFront = {
            ...clonedMetric,
            ID_FRONT: uniqid(),
            TIPO_CAMBIO: 'ACTUALIZACION METRICA',
            FRECUENCIA: formValues.frequency,
            NRO_IP: formValues.ip_select,
            ID_EQUIPO_IP: Number(findedIP?.ID_EQUIPO_IP || clonedMetric.ID_EQUIPO_IP),
            HERRAMIENTA: formValues.tool_select,
            ID_HERRAMIENTA: findedTool?.codigo || clonedMetric.ID_HERRAMIENTA,
            VALORES_PARAMETROS: updateParameters(clonedMetric, formValues)
        };

        // Actualizar el estado global con los cambios
        setUpdates(prev => {
            const index = prev.findIndex(m => m.ID_DETALLE_POLITICA === metric.ID_DETALLE_POLITICA);
            if (index >= 0) {
                const updated = [...prev]
                updated[index] = updatedMetric
                return updated
            }
            return [...prev, updatedMetric]
        });

        modalHook.closeModal()
    }

    // Actualizar parámetros basados en el catálogo y valores del formulario
    const updateParameters = (clonedMetric: MetricVersion, formValues: FormValues): MetricParameter[] => {
        const date = new Date()
        const formatedDate = toSQLServerFormat(date)

        // 1. Manejar umbrales usando la lógica existente
        const handleThreshold = (type: Urgent, catalogParam: ParamCatalog) => {
            const current = findUrgent(clonedMetric.VALORES_PARAMETROS, type);
            const idx = clonedMetric.VALORES_PARAMETROS.findIndex(
                item => item.ID_DETALLE_METRICA_VALOR === current?.ID_DETALLE_METRICA_VALOR
            )

            const umbralKey = `${type.toLowerCase()}_umbral` as keyof FormValues
            const pooleoKey = `${type.toLowerCase()}_pooleo` as keyof FormValues

            if (idx >= 0) {
                // Actualizar umbral existente
                clonedMetric.VALORES_PARAMETROS[idx] = {
                    ...clonedMetric.VALORES_PARAMETROS[idx],
                    UMBRAL: formValues[umbralKey] || '',
                    NRO_POOLEOS: formValues[pooleoKey] || ''
                };
            } else if (formValues[umbralKey] || formValues[pooleoKey]) {
                // Agregar nuevo umbral si hay valores
                clonedMetric.VALORES_PARAMETROS.push({
                    ESTADO: 1,
                    ID_DETALLE_METRICA_VALOR: 0,
                    NRO_POOLEOS: formValues[pooleoKey] || '',
                    PARAMETRO_VALOR: '',
                    UMBRAL: formValues[umbralKey] || '',
                    URGENCIA: type,
                    FECHA_CREACION: userName,
                    FECHA_MODIFICACION: formatedDate,
                    USUARIO_CREACION: userName,
                    USUARIO_MODIFICACION: formatedDate,
                    ID_METRICA_PARAMETRO: catalogParam.ID_METRICA_PARAMETRO
                })
            }
        }

        informativeInCatalog && handleThreshold('INFORMATIVO', informativeInCatalog)
        warningInCatalog && handleThreshold('WARNING', warningInCatalog)
        criticalInCatalog && handleThreshold('CRITICAL', criticalInCatalog)
        fatalInCatalog && handleThreshold('FATAL', fatalInCatalog)

        // 2. Manejar parámetros normales (no umbrales) del catálogo
        normalCatalogParams.forEach(catalogParam => {
            // Buscar si existe en la métrica actual
            const existingParamIndex = clonedMetric.VALORES_PARAMETROS.findIndex(
                p => p.ID_METRICA_PARAMETRO === catalogParam.ID_METRICA_PARAMETRO
            );

            const key = `param_${catalogParam.ID_METRICA_PARAMETRO}` as keyof FormValues
            const formValue = formValues[key] || ''

            if (existingParamIndex >= 0) {
                // Actualizar parámetro existente
                clonedMetric.VALORES_PARAMETROS[existingParamIndex] = {
                    ...clonedMetric.VALORES_PARAMETROS[existingParamIndex],
                    PARAMETRO_VALOR: formValue,
                    FECHA_MODIFICACION: formatedDate,
                    USUARIO_MODIFICACION: userName
                };
            } else if (formValue) {
                // Agregar nuevo parámetro solo si tiene valor
                clonedMetric.VALORES_PARAMETROS.push({
                    ESTADO: 1,
                    ID_DETALLE_METRICA_VALOR: 0,
                    ID_METRICA_PARAMETRO: catalogParam.ID_METRICA_PARAMETRO,
                    NRO_POOLEOS: catalogParam.NRO_POOLEOS || '',
                    PARAMETRO_VALOR: formValue,
                    UMBRAL: catalogParam.UMBRAL || '',
                    URGENCIA: catalogParam.PARAMETRO || '',
                    FECHA_CREACION: formatedDate,
                    FECHA_MODIFICACION: formatedDate,
                    USUARIO_CREACION: userName,
                    USUARIO_MODIFICACION: userName
                });
            }
        });

        return clonedMetric.VALORES_PARAMETROS
    }

    // Renderizar parámetros normales del catálogo
    const renderNormalParameters = () => {
        return normalCatalogParams.map(param => {
            const key = `param_${param.ID_METRICA_PARAMETRO}` as keyof FormValues;

            return (
                <div key={param.ID_METRICA_PARAMETRO} className="col-12 col-md-6 mb-5">
                    <label htmlFor={key} className="form-label">
                        {param.PARAMETRO}
                        {param.NRO_POOLEOS && (
                            <span className="text-muted fs-8 ms-2">(Pool {param.NRO_POOLEOS})</span>
                        )}
                    </label>
                    <div className="input-group input-group-sm">
                        <span className="input-group-text">
                            <i className="bi bi-gear"></i>
                        </span>
                        <input
                            type="text"
                            id={key}
                            className="form-control"
                            placeholder={`Ingrese ${param.PARAMETRO.toLowerCase()}`}
                            value={formValues[key] || ''}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                        />
                    </div>
                </div>
            )
        })
    }

    return (
        <>
            <div className='modal-header py-3'>
                <h2 className="text-dark">ACTUALIZAR MÉTRICA</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className="modal-body">
                <form onSubmit={handleSubmit} className="d-flex flex-column px-5 form">
                    {catalogHook.metricCatalogLoading ? (
                        <div className="d-flex flex-column align-items-center justify-content-center py-10">
                            <div className="d-flex justify-content-center mb-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-gray-800 fw-bold mb-3">Cargando información</h3>
                                <div className="text-muted fs-6">
                                    Estamos cargando el catálogo de métricas y la configuración del formulario...
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="row g-5">
                            {informativeInCatalog && (
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
                                                value={formValues.informativo_umbral}
                                                onChange={(e) => handleInputChange('informativo_umbral', e.target.value)}
                                            />
                                        </div>
                                        {informativeInCatalog.URGENCIA && (
                                            <div className="mt-1">
                                                <span className={`badge ${getBadgeColor(informativeInCatalog.URGENCIA)}`}>
                                                    {informativeInCatalog.URGENCIA}
                                                </span>
                                                {informativeInCatalog.UMBRAL && (
                                                    <span className="ms-2 text-muted fs-8">
                                                        Umbral: {informativeInCatalog.UMBRAL}
                                                    </span>
                                                )}
                                            </div>
                                        )}
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
                                                value={formValues.informativo_pooleo}
                                                onChange={(e) => handleInputChange('informativo_pooleo', e.target.value)}
                                            />
                                        </div>
                                        {informativeInCatalog.URGENCIA && (
                                            <div className="mt-1">
                                                <span className={`badge ${getBadgeColor(informativeInCatalog.URGENCIA)}`}>
                                                    {informativeInCatalog.URGENCIA}
                                                </span>
                                                {informativeInCatalog.UMBRAL && (
                                                    <span className="ms-2 text-muted fs-8">
                                                        Pool: {informativeInCatalog.NRO_POOLEOS || 'N/A'}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                            {warningInCatalog && (
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
                                                value={formValues.warning_umbral}
                                                onChange={(e) => handleInputChange('warning_umbral', e.target.value)}
                                            />
                                        </div>
                                        {warningInCatalog.URGENCIA && (
                                            <div className="mt-1">
                                                <span className={`badge ${getBadgeColor(warningInCatalog.URGENCIA)}`}>
                                                    {warningInCatalog.URGENCIA}
                                                </span>
                                                {warningInCatalog.UMBRAL && (
                                                    <span className="ms-2 text-muted fs-8">
                                                        Umbral: {warningInCatalog.UMBRAL}
                                                    </span>
                                                )}
                                            </div>
                                        )}
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
                                                value={formValues.warning_pooleo}
                                                onChange={(e) => handleInputChange('warning_pooleo', e.target.value)}
                                            />
                                        </div>
                                        {warningInCatalog.URGENCIA && (
                                            <div className="mt-1">
                                                <span className={`badge ${getBadgeColor(warningInCatalog.URGENCIA)}`}>
                                                    {warningInCatalog.URGENCIA}
                                                </span>
                                                {warningInCatalog.UMBRAL && (
                                                    <span className="ms-2 text-muted fs-8">
                                                        Pool: {warningInCatalog.NRO_POOLEOS || 'N/A'}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                            {criticalInCatalog && (
                                <>
                                    <div className="col-12 col-md-6  mb-5">
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
                                                value={formValues.critical_umbral}
                                                onChange={(e) => handleInputChange('critical_umbral', e.target.value)}
                                            />
                                        </div>
                                        {criticalInCatalog.URGENCIA && (
                                            <div className="mt-1">
                                                <span className={`badge ${getBadgeColor(criticalInCatalog.URGENCIA)}`}>
                                                    {criticalInCatalog.URGENCIA}
                                                </span>
                                                {criticalInCatalog.UMBRAL && (
                                                    <span className="ms-2 text-muted fs-8">
                                                        Umbral: {criticalInCatalog.UMBRAL}
                                                    </span>
                                                )}
                                            </div>
                                        )}
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
                                                value={formValues.critical_pooleo}
                                                onChange={(e) => handleInputChange('critical_pooleo', e.target.value)}
                                            />
                                        </div>
                                        {criticalInCatalog.URGENCIA && (
                                            <div className="mt-1">
                                                <span className={`badge ${getBadgeColor(criticalInCatalog.URGENCIA)}`}>
                                                    {criticalInCatalog.URGENCIA}
                                                </span>
                                                {criticalInCatalog.UMBRAL && (
                                                    <span className="ms-2 text-muted fs-8">
                                                        Pool: {criticalInCatalog.NRO_POOLEOS || 'N/A'}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                            {fatalInCatalog && (
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
                                                value={formValues.fatal_umbral}
                                                onChange={(e) => handleInputChange('fatal_umbral', e.target.value)}
                                            />
                                        </div>
                                        {fatalInCatalog.URGENCIA && (
                                            <div className="mt-1">
                                                <span className={`badge ${getBadgeColor(fatalInCatalog.URGENCIA)}`}>
                                                    {fatalInCatalog.URGENCIA}
                                                </span>
                                                {fatalInCatalog.UMBRAL && (
                                                    <span className="ms-2 text-muted fs-8">
                                                        Umbral: {fatalInCatalog.UMBRAL}
                                                    </span>
                                                )}
                                            </div>
                                        )}
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
                                                value={formValues.fatal_pooleo}
                                                onChange={(e) => handleInputChange('fatal_pooleo', e.target.value)}
                                            />
                                        </div>
                                        {fatalInCatalog.URGENCIA && (
                                            <div className="mt-1">
                                                <span className={`badge ${getBadgeColor(fatalInCatalog.URGENCIA)}`}>
                                                    {fatalInCatalog.URGENCIA}
                                                </span>
                                                {fatalInCatalog.UMBRAL && (
                                                    <span className="ms-2 text-muted fs-8">
                                                        Pool: {fatalInCatalog.NRO_POOLEOS || 'N/A'}
                                                    </span>
                                                )}
                                            </div>
                                        )}
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
                                        value={formValues.frequency}
                                        onChange={(e) => handleInputChange('frequency', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-12 col-md-6 mb-5">
                                <label htmlFor="ip_select" className="form-label">Seleccionar IP</label>
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text">
                                        <i className="bi bi-hdd-network"></i>
                                    </span>
                                    <select
                                        id="ip_select"
                                        className="form-select"
                                        aria-label="Seleccionar IP"
                                        value={formValues.ip_select}
                                        onChange={(e) => handleInputChange('ip_select', e.target.value)}
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
                                <label htmlFor="tool_select" className="form-label">Seleccionar Herramienta</label>
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text">
                                        <i className="bi bi-gear-wide"></i>
                                    </span>
                                    <select
                                        id="tool_select"
                                        className="form-select"
                                        aria-label="Seleccionar Herramienta"
                                        value={formValues.tool_select}
                                        onChange={(e) => handleInputChange('tool_select', e.target.value)}
                                    >
                                        <option disabled value="">{catalogHook.toolsLoading ? 'Cargando' : 'Selecciona una herramienta'}</option>
                                        {catalogHook.tools.map(tool => (
                                            <option key={tool.codigo} value={tool.nombre.toUpperCase()}>
                                                {tool.nombre.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* Parámetros normales del catálogo */}
                            {catalogHook.metricCatalog ? (
                                renderNormalParameters()
                            ) : (
                                <div className="col-12">
                                    <div className="alert alert-warning">
                                        No se encontró información de catálogo para esta métrica
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="d-flex justify-content-end gap-3 mt-5">
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => modalHook.closeModal()}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={catalogHook.toolsLoading || loadingIPsByCI}
                        >
                            Actualizar Métrica
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};