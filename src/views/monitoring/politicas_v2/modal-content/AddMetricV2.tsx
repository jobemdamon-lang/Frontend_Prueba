import React, { useEffect, useState } from "react";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { useCI } from "../../../inventory/hooks/useCI";
import { useMonitoringPoliciesContext } from "../Context";
import { AddChangeDetail, ChangeRequest, MetricFamilyClase } from "../Types";
import { findNormalParametersCatalog, findUrgentCatalog, THRESHOLDS } from "../utils";
import type { CIRecord } from "./DetailChange";
import { useTypedSelector } from "../../../../store/ConfigStore";

interface AddMetricV2Props {
    show: boolean;
    setShow: (show: boolean) => void;
    metric: MetricFamilyClase;
    ci: CIRecord|null;
    change: ChangeRequest;
    onRefresh: () => void;
}

export const AddMetricV2: React.FC<AddMetricV2Props> = ({ show, setShow, metric, ci, change, onRefresh }) => {
    const { catalogHook, changesHook } = useMonitoringPoliciesContext();
    const { getIPsByCI, loadingIPsByCI, CIIps } = useCI();
    const userName = useTypedSelector(({auth}) => auth.usuario);

    // Estados para los parámetros extras
    const [selectedIP, setSelectedIP] = useState<string>('');
    const [selectedTool, setSelectedTool] = useState<string>('');
    const [parameters, setParameters] = useState<Record<number, string>>({});

    useEffect(() => {
        if (metric && metric.valores_parametro) {
            const initialParams: Record<number, string> = {};
            metric.valores_parametro
                .filter(p => !THRESHOLDS.includes(p.URGENCIA || ''))
                .forEach(p => {
                    initialParams[p.ID_METRICA_PARAMETRO] = p.VALOR_PARAMETRO || '';
                });
            setParameters(initialParams);
        }
    }, [metric]);

    // Encontrar umbrales existentes
    const informative = findUrgentCatalog(metric.valores_parametro, 'INFORMATIVO');
    const warning = findUrgentCatalog(metric.valores_parametro, 'WARNING');
    const critical = findUrgentCatalog(metric.valores_parametro, 'CRITICAL');
    const fatal = findUrgentCatalog(metric.valores_parametro, 'FATAL');

    // Encontrar parámetros de datos
    const normalParameters = findNormalParametersCatalog(metric.valores_parametro);

    const handleParameterChange = (id: number, value: string) => {
        setParameters(prev => ({
            ...prev,
            [id]: value
        }));
    };

    useEffect(() => {
        if (ci) getIPsByCI(ci.ID_EQUIPO);
        catalogHook.getTools();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ci]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ci || !metric || !selectedIP || !selectedTool) return;

        const selectedIpObj = CIIps.find(ip => ip.NRO_IP === selectedIP);
        const selectedToolObj = catalogHook.tools.find(
            tool => tool.nombre.toUpperCase() === selectedTool
        );

        if (!selectedToolObj || !selectedIpObj) return;

        // Construir lista_parametros usando SIEMPRE param
        const lista_parametros = metric.valores_parametro.map(param => ({
            id_cambio_metrica_valor: 0,
            nro_pooleos: Number(param.NRO_POOLEOS) || 0,
            parametro_valor: THRESHOLDS.includes(param.URGENCIA || '')
                ? ""
                : parameters[param.ID_METRICA_PARAMETRO] || '',
            umbral: THRESHOLDS.includes(param.URGENCIA || '')
                ? param.UMBRAL || ''
                : '',
            estado: "1",
            id_metrica_parametro: param.ID_METRICA_PARAMETRO
        }));

        const payload: AddChangeDetail = {
           usuario: userName,
            id_cambio: change.ID_CAMBIO,
            id_equipo: ci.ID_EQUIPO,
            lista_cambio_detalle: [
                {
                    tipo_cambio: 'NUEVA METRICA',
                    id_cambio_detalle: 0,
                    id_detalle_politica: 0,
                    id_metrica: metric.ID_METRICA,
                    id_herramienta: selectedToolObj?.codigo,
                    id_equipo_ip: parseInt(selectedIpObj?.ID_EQUIPO_IP),
                    id_tipoequipo: ci.ID_FAMILIA_CLASE,
                    frecuencia: parseInt(metric.FRECUENCIA) || 0,
                    estado: 1,
                    lista_parametros
                }
            ]
        };
        console.log(payload);

        const success = await changesHook.addChangeDetail(payload);

        if (success) {
            onRefresh()
            setTimeout(() => {
                setShow(false);
            }, 500);
        }
    }

    if (!show || !metric || !ci) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content rounded">
                    <div className='modal-header py-3'>
                        <h2 className="text-dark">Añadir Métrica | {metric.NOMBRE}</h2>
                        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => setShow(false)}>
                            <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                        </div>
                    </div>
                    <form className="form" id="addMetricFormV2" onSubmit={handleSubmit}>
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
                                {/* Sección de Herramienta */}
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
                            {/* Parámetros adicionales */}
                            {normalParameters.length > 0 && (
                                <div className="row g-5">
                                    {normalParameters.map(param => (
                                        <div key={param.ID_METRICA_PARAMETRO} className="col-md-6 mb-4">
                                            <label className="form-label fw-bold text-gray-700">
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
                                </div>
                            )}
                        </div>
                        <div className="modal-footer flex-nowrap pt-4 pb-6 px-9">
                            <button
                                type="button"
                                className="btn btn-light btn-active-light-primary me-3"
                                onClick={() => setShow(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >

                                {changesHook.addChangeDetailLoading ? (
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                ) : (
                                    <i className="bi bi-save me-2"></i>
                                )}
                                Añadir Métrica
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};