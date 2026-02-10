import { KTSVG } from "../../../../helpers/components/KTSVG";
import { useTypedSelector } from "../../../../store/ConfigStore";
import { useCI } from "../../../inventory/hooks/useCI";
import { useMonitoringPoliciesContext } from "../Context";
import { CIGroupedMetrics, MetricFamilyClase, MetricParameter, MetricVersionFront } from "../Types";
import { findNormalParametersCatalog, findThresholdParametersCatalog, findUrgentCatalog, THRESHOLDS, toSQLServerFormat } from "../utils";
import { useEffect, useState } from "react";
import uniqid from "uniqid";

type ModalInformationProps = {
    metric: MetricFamilyClase;
    selectedCI: CIGroupedMetrics;
    setUpdates: React.Dispatch<React.SetStateAction<MetricVersionFront[]>>;
    setActiveView: React.Dispatch<React.SetStateAction<"update" | "addm" | "addc" | "resume">>;
}

export const AddMetric = () => {

    const { modalHook, globalParams, catalogHook } = useMonitoringPoliciesContext()
    const { metric, setUpdates, selectedCI }: ModalInformationProps = modalHook.modalInformation
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const { getIPsByCI, loadingIPsByCI, CIIps } = useCI()

    // Estados para los parámetros extras
    const [selectedIP, setSelectedIP] = useState<string>('')
    const [selectedTool, setSelectedTool] = useState<string>('')
    const [extraFields, setExtraFields] = useState<Array<{ key: string; label: string; value: string; units?: string }>>([]);
    const [parameters, setParameters] = useState<Record<number, string>>(
        () => {
            const initialParams: Record<number, string> = {}
            metric.valores_parametro
                .filter(p => !THRESHOLDS.includes(p.URGENCIA || ''))
                .forEach(p => {
                    initialParams[p.ID_METRICA_PARAMETRO] = p.VALOR_PARAMETRO || ''
                })
            return initialParams
        }
    )

    // Encontrar umbrales existentes
    const informative = findUrgentCatalog(metric.valores_parametro, 'INFORMATIVO')
    const warning = findUrgentCatalog(metric.valores_parametro, 'WARNING')
    const critical = findUrgentCatalog(metric.valores_parametro, 'CRITICAL')
    const fatal = findUrgentCatalog(metric.valores_parametro, 'FATAL')

    // Encontrar parámetros de datos
    const normalParameters = findNormalParametersCatalog(metric.valores_parametro)

    const handleParameterChange = (id: number, value: string) => {
        setParameters(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const handleAddExtraField = () => {
        const duplicateFields = metric.valores_parametro.filter(param => {
            const urg = param.URGENCIA;
            return urg === null || String(urg).trim() === '';
        });

        if (!duplicateFields.length) return;

        const group = uniqid();

        setExtraFields(prev => [
            ...prev,
            ...duplicateFields.map(param => ({
                key: `extra_${group}_${param.ID_METRICA_PARAMETRO}`,
                label: param.PARAMETRO || "Campo adicional",
                value: param.VALOR_PARAMETRO || "",
                units: param.UNIDADES || ""
            }))
        ]);
    };

    const handleExtraFieldChange = (key: string, value: string) => {
        setExtraFields(prev =>
            prev.map(field =>
                field.key === key ? { ...field, value } : field
            )
        );
    }

    const handleRemoveExtraField = (groupId: string) => {
        setExtraFields(prev => prev.filter(field => !field.key.startsWith(`extra_${groupId}_`)));
    }

    const handleAddMetric = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        const date = new Date()
        const formatedDate = toSQLServerFormat(date)
        const paramEntries = Object.entries(parameters)
        const findedTool = catalogHook.tools.find(t => t.nombre.toUpperCase() === selectedTool)
        const findedIP = CIIps.find(ip => ip.NRO_IP === selectedIP)

        // Crear parámetros normales
        const normalParameters: MetricParameter[] = paramEntries.map(([id, value]) => {
            const metricParam: MetricParameter = {
                ESTADO: 1,
                FECHA_CREACION: formatedDate,
                FECHA_MODIFICACION: formatedDate,
                ID_DETALLE_METRICA_VALOR: 0,
                NRO_POOLEOS: metric.valores_parametro.find(p => p.ID_METRICA_PARAMETRO === parseInt(id))?.NRO_POOLEOS || '',
                PARAMETRO_VALOR: value,
                UMBRAL: metric.valores_parametro.find(p => p.ID_METRICA_PARAMETRO === parseInt(id))?.UMBRAL || '',
                URGENCIA: metric.valores_parametro.find(p => p.ID_METRICA_PARAMETRO === parseInt(id))?.PARAMETRO || '',
                USUARIO_CREACION: userName,
                USUARIO_MODIFICACION: userName,
                ID_METRICA_PARAMETRO: parseInt(id),
            }
            return metricParam
        })

        // Separar parámetros de umbrales (WARNING, CRITICAL, FATAL) y parámetros normales
        const thresholdParams = findThresholdParametersCatalog(metric.valores_parametro)

        // Crear parámetros de umbrales
        const thresholdParameters: MetricParameter[] = [
            ...thresholdParams.map(param => ({
                ESTADO: 1,
                FECHA_CREACION: formatedDate,
                FECHA_MODIFICACION: formatedDate,
                ID_DETALLE_METRICA_VALOR: 0,
                NRO_POOLEOS: param.NRO_POOLEOS || '',
                PARAMETRO_VALOR: param.VALOR_PARAMETRO?.toString() || '',
                UMBRAL: param.UMBRAL?.toString() || '',
                URGENCIA: param.URGENCIA || '',
                USUARIO_CREACION: userName,
                USUARIO_MODIFICACION: userName,
                ID_METRICA_PARAMETRO: param.ID_METRICA_PARAMETRO
            }))
        ]

        const groupedExtraFields = extraFields.reduce<Record<string, typeof extraFields>>((acc, field) => {
            const match = field.key.match(/^extra_([^_]+)_/);
            const groupId = match ? match[1] : "default";
            if (!acc[groupId]) acc[groupId] = [];
            acc[groupId].push(field);
            return acc;
        }, {});

        const extraMetrics: MetricVersionFront[] = Object.entries(groupedExtraFields).map(([groupId, fields]) => {
            const extraParameters: MetricParameter[] = fields.map(field => ({
                ESTADO: 1,
                FECHA_CREACION: formatedDate,
                FECHA_MODIFICACION: formatedDate,
                ID_DETALLE_METRICA_VALOR: 0,
                NRO_POOLEOS: '',
                PARAMETRO_VALOR: field.value || '',
                UMBRAL: '',
                URGENCIA: field.label || '',
                USUARIO_CREACION: userName,
                USUARIO_MODIFICACION: userName,
                ID_METRICA_PARAMETRO: parseInt(field.key.split('_').pop() || '0'),
            }));

            return {
                ID_FRONT: uniqid(),
                TIPO_CAMBIO: 'NUEVA METRICA',
                ESTADO: 1,
                FECHA_CREACION: formatedDate,
                FECHA_MODIFICACION: formatedDate,
                USUARIO_CREACION: userName,
                USUARIO_MODIFICACION: userName,
                TIPO_EQUIPO: metric.TIPOEQUIPO,
                FAMILIA: metric.FAMILIA,
                CLASE: metric.CLASE,
                ID_FAMILIA_CLASE: metric.ID_FAMILIA_CLASE,
                ID_EQUIPO: selectedCI.ID_EQUIPO,
                ID_EQUIPO_IP: Number(findedIP?.ID_EQUIPO_IP) || 0,
                ID_HERRAMIENTA: findedTool?.codigo || metric.ID_HERRAMIENTA,
                ID_TIPO_EQUIPO: metric.ID_TIPOEQUIPO,
                ID_DETALLE_POLITICA: 0,
                ID_POLITICA: globalParams.policyID,
                ID_VERSION: globalParams.versionID,
                NOMBRE_CI: selectedCI.NOMBRE_CI,
                HOSTNAME: selectedCI.NOMBRE_CI,
                NRO_IP: selectedIP,
                ID_METRICA: metric.ID_METRICA,
                NOMBRE: metric.NOMBRE,
                DETALLE: metric.DETALLE,
                FRECUENCIA: metric.FRECUENCIA,
                HERRAMIENTA: selectedTool || metric.HERRAMIENTA,
                VALORES_PARAMETROS: [...extraParameters, ...thresholdParameters],
            };
        });

        const mainMetric: MetricVersionFront = {
            ID_FRONT: uniqid(),
            TIPO_CAMBIO: 'NUEVA METRICA',
            ESTADO: 1,
            FECHA_CREACION: formatedDate,
            FECHA_MODIFICACION: formatedDate,
            USUARIO_CREACION: userName,
            USUARIO_MODIFICACION: userName,
            TIPO_EQUIPO: metric.TIPOEQUIPO,
            FAMILIA: metric.FAMILIA,
            CLASE: metric.CLASE,
            ID_FAMILIA_CLASE: metric.ID_FAMILIA_CLASE,
            ID_EQUIPO: selectedCI.ID_EQUIPO,
            ID_EQUIPO_IP: Number(findedIP?.ID_EQUIPO_IP) || 0,
            ID_HERRAMIENTA: findedTool?.codigo || metric.ID_HERRAMIENTA,
            ID_TIPO_EQUIPO: metric.ID_TIPOEQUIPO,
            ID_DETALLE_POLITICA: 0,
            ID_POLITICA: globalParams.policyID,
            ID_VERSION: globalParams.versionID,
            NOMBRE_CI: selectedCI.NOMBRE_CI,
            HOSTNAME: selectedCI.NOMBRE_CI,
            NRO_IP: selectedIP,
            ID_METRICA: metric.ID_METRICA,
            NOMBRE: metric.NOMBRE,
            DETALLE: metric.DETALLE,
            FRECUENCIA: metric.FRECUENCIA,
            HERRAMIENTA: selectedTool || metric.HERRAMIENTA,
            VALORES_PARAMETROS: [...normalParameters, ...thresholdParameters],
        };

        setUpdates(prev => [...prev, mainMetric, ...extraMetrics])
        modalHook.closeModal()
    }

    const groupedExtraFields = extraFields.reduce<Record<string, typeof extraFields>>((acc, field) => {
        const match = field.key.match(/^extra_([^_]+)_/);
        const groupId = match ? match[1] : "default";
        if (!acc[groupId]) acc[groupId] = [];
        acc[groupId].push(field);
        return acc;
    }, {});

    useEffect(() => {
        getIPsByCI(selectedCI.ID_EQUIPO)
        catalogHook.getTools()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCI])

    const hasInvalidParameters = Object.values(parameters).some(value => !value.trim());
    const hasInvalidExtraFields = extraFields.some(field => !field.value.trim());
    const isSubmitDisabled = hasInvalidParameters || hasInvalidExtraFields || !selectedIP || !selectedTool;


    return (
        <>
            <div className='modal-header py-3'>
                <h2 className="text-dark">Añadir Métrica | {metric.NOMBRE}</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <form className="form" id="addMetricForm" onSubmit={handleAddMetric}>
                <div className="modal-body py-6 px-9">
                    {/* Umbrales de alerta */}
                    <div className="mb-8">
                        <h5 className="text-gray-800 fw-bold mb-4">Niveles de Alerta</h5>
                        <div className="row g-4 d-flex justify-content-center">
                            {informative && (
                                <div className="col-md-4">
                                    <div className="card border border-primary border-dashed rounded-3 p-4 h-100">
                                        <div className="d-flex align-items-center mb-3">
                                            <span className="symbol symbol-40px me-3">
                                                <span className="symbol-label bg-light-primary">
                                                    <i className="bi bi-exclamation-triangle-fill text-primary fs-2"></i>
                                                </span>
                                            </span>
                                            <h5 className="text-primary fw-bold m-0">{informative.URGENCIA}</h5>
                                        </div>
                                        <div className="d-flex flex-column">
                                            <span className="text-gray-600 mb-1">Umbral:</span>
                                            <span className="text-gray-800 fw-semibold fs-5">{informative.UMBRAL || 'No definido'}</span>
                                        </div>
                                        {informative.UNIDADES && (
                                            <div className="mt-2">
                                                <span className="badge badge-light-primary">{informative.UNIDADES}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {warning && (
                                <div className="col-md-4">
                                    <div className="card border border-warning border-dashed rounded-3 p-4 h-100">
                                        <div className="d-flex align-items-center mb-3">
                                            <span className="symbol symbol-40px me-3">
                                                <span className="symbol-label bg-light-warning">
                                                    <i className="bi bi-exclamation-triangle-fill text-warning fs-2"></i>
                                                </span>
                                            </span>
                                            <h5 className="text-warning fw-bold m-0">{warning.URGENCIA}</h5>
                                        </div>
                                        <div className="d-flex flex-column">
                                            <span className="text-gray-600 mb-1">Umbral:</span>
                                            <span className="text-gray-800 fw-semibold fs-5">{warning.UMBRAL || 'No definido'}</span>
                                        </div>
                                        {warning.UNIDADES && (
                                            <div className="mt-2">
                                                <span className="badge badge-light-warning">{warning.UNIDADES}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {critical && (
                                <div className="col-md-4">
                                    <div className="card border border-danger border-dashed rounded-3 p-4 h-100">
                                        <div className="d-flex align-items-center mb-3">
                                            <span className="symbol symbol-40px me-3">
                                                <span className="symbol-label bg-light-danger">
                                                    <i className="bi bi-exclamation-octagon-fill text-danger fs-2"></i>
                                                </span>
                                            </span>
                                            <h5 className="text-danger fw-bold m-0">{critical.URGENCIA}</h5>
                                        </div>
                                        <div className="d-flex flex-column">
                                            <span className="text-gray-600 mb-1">Umbral:</span>
                                            <span className="text-gray-800 fw-semibold fs-5">{critical.UMBRAL || 'No definido'}</span>
                                        </div>
                                        {critical.UNIDADES && (
                                            <div className="mt-2">
                                                <span className="badge badge-light-danger">{critical.UNIDADES}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {fatal && (
                                <div className="col-md-4">
                                    <div className="card border border-dark border-dashed rounded-3 p-4 h-100">
                                        <div className="d-flex align-items-center mb-3">
                                            <span className="symbol symbol-40px me-3">
                                                <span className="symbol-label bg-light-dark">
                                                    <i className="bi bi-slash-circle-fill text-dark fs-2"></i>
                                                </span>
                                            </span>
                                            <h5 className="text-dark fw-bold m-0">{fatal.URGENCIA}</h5>
                                        </div>
                                        <div className="d-flex flex-column">
                                            <span className="text-gray-600 mb-1">Umbral:</span>
                                            <span className="text-gray-800 fw-semibold fs-5">{fatal.UMBRAL || 'No definido'}</span>
                                        </div>
                                        {fatal.UNIDADES && (
                                            <div className="mt-2">
                                                <span className="badge badge-light-dark">{fatal.UNIDADES}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <h5 className="text-gray-800 fw-bold mb-5">Parámetros Adicionales</h5>
                    <div className="row mb-5">
                        {/* Sección de IP */}
                        <div className="col-12 col-md-6">
                            <label htmlFor="ip_select" className="form-label">
                                Seleccionar IP
                            </label>
                            <div className="input-group input-group-sm">
                                <span className="input-group-text">
                                    <i className="bi bi-hdd-network me-2"></i>
                                </span>
                                <select
                                    id="ip_select"
                                    name="ip_select"
                                    className="form-select"
                                    aria-label="Seleccionar IP"
                                    onChange={(e) => setSelectedIP(e.target.value)}
                                    value={selectedIP}
                                    required
                                >
                                    <option disabled value="">{loadingIPsByCI ? 'Cargando' : 'Selecciona una IP'}</option>
                                    {CIIps.map(ip => (
                                        <option key={ip.ID_EQUIPO_IP} value={ip.NRO_IP}>
                                            {ip.NRO_IP}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="text-muted fs-7 mt-1">Selecciona la IP a monitorear</div>
                        </div>

                        <div className="col-12 col-md-6">
                            <label htmlFor="tool_select" className="form-label">Seleccionar Herramienta</label>
                            <div className="input-group input-group-sm">
                                <span className="input-group-text">
                                    <i className="bi bi-gear-wide"></i>
                                </span>
                                <select
                                    id="tool_select"
                                    className="form-select"
                                    aria-label="Seleccionar Herramienta"
                                    value={selectedTool}
                                    onChange={(e) => setSelectedTool(e.target.value)}
                                    required
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
                    </div>
                    <div className="">
                        {/* Parámetros adicionales */}
                        {normalParameters.length > 0 && (
                            <div className="row g-5">
                                {normalParameters.map(param => (
                                    <div key={param.ID_METRICA_PARAMETRO} className="col-md-6 mb-4">
                                        <label htmlFor="ip_select" className="form-label fw-bold text-gray-700">
                                            <span className="svg-icon svg-icon-1 me-2">
                                                <i className="bi bi-gear-fill text-primary"></i>
                                            </span>
                                            <span className="fw-bold text-gray-700">{param.PARAMETRO}</span>
                                        </label>
                                        <div className="card-body pt-0">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Ingrese un valor"
                                                value={parameters[param.ID_METRICA_PARAMETRO] || ''}
                                                onChange={(e) => handleParameterChange(param.ID_METRICA_PARAMETRO, e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                ))}
                                {Object.entries(groupedExtraFields).map(([groupId, fields]) => (
                                    <div key={groupId} className="col-12 mb-4">
                                        <div className="card border border-dashed border-primary rounded-3 p-3 bg-light-primary">
                                            <div className="row align-items-end">
                                                {fields.map(field => (
                                                    <div key={field.key} className="col-md-6 mb-2">
                                                        <label className="form-label fw-bold text-gray-700">
                                                            <i className="bi bi-plus-circle text-primary me-2"></i>
                                                            {field.label}
                                                            {field.units && <span className="text-muted ms-2">({field.units})</span>}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder={`Valor para ${field.label}`}
                                                            value={field.value || ''}
                                                            onChange={(e) => handleExtraFieldChange(field.key, e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                ))}
                                                <div className="col-12 d-flex justify-content-end mt-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-light-danger"
                                                        onClick={() => handleRemoveExtraField(groupId)}
                                                    >
                                                        <i className="bi bi-x-circle me-1"></i> Eliminar grupo
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {normalParameters.length > 0 && (
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-light-primary"
                                            onClick={handleAddExtraField}
                                        >
                                            <i className="bi bi-plus-circle me-2"></i> Añadir Campo Adicional
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="modal-footer flex-nowrap pt-4 pb-6 px-9">
                    <button
                        type="button"
                        className="btn btn-light btn-active-light-primary me-3"
                        onClick={() => modalHook.closeModal()}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitDisabled}
                    >
                        Añadir Métrica
                    </button>
                </div>
            </form>
        </>
    )
}