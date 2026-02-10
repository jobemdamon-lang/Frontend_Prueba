import { useEffect, useMemo, useState } from "react";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { useMonitoringPoliciesContext } from "../Context";
import { MetricFamilyClase, MetricParameter, MetricVersionFront } from "../Types";
import { useCI } from "../../../inventory/hooks/useCI";
import { findNormalParametersCatalog, findThresholdParametersCatalog, toSQLServerFormat } from "../utils";
import { useTypedSelector } from "../../../../store/ConfigStore";
import uniqid from "uniqid";
import { CIRecord } from "./DetailChange";  
import type { ChangeRequest, AddChangeDetail} from "../Types";
import { useCatalog } from "../hooks/useCatalog";

type AddCIMetricsv2Props = {
    ci: CIRecord;
    change: ChangeRequest;
    onClose: () => void;
    onRefresh: () => void;
};

export const AddCIMetricsv2 = ({ ci, change, onClose, onRefresh }: AddCIMetricsv2Props) => {
    const { catalogHook, globalParams, changesHook } = useMonitoringPoliciesContext()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const { getIPsByCI, loadingIPsByCI, CIIps } = useCI()
    const [metricsFamilyClase, setMetricsFamilyClase] = useState<MetricFamilyClase[]>([])
    const [selectedIP, setSelectedIP] = useState<string>('')
    const [selectedTool, setSelectedTool] = useState<string>('')
    const [selectedTypeEquipment, setSelectedTypeEquipment] = useState<string>('')
    const [selectedMetrics, setSelectedMetrics] = useState<Record<number, boolean>>({})
    const [metricParameters, setMetricParameters] = useState<Record<number, Record<string, string>>>({})
    const [loading, setLoading] = useState(false);
    
    const { getTools, tools, toolsLoading } = useCatalog();

    useEffect(() => {
        getIPsByCI(ci.ID_EQUIPO)
        catalogHook.getMetricsByFamilyClase(ci.ID_FAMILIA_CLASE).then(res => {
            if (res) setMetricsFamilyClase(res)
        })
        getTools();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ci])

    // Filter metrics based on selected equipment type
    const metricsFamilyClaseFiltered = useMemo(() => {
        return metricsFamilyClase.filter(metric =>
            (
                metric.TIPOEQUIPO?.includes(selectedTypeEquipment) ||
                metric.TIPOEQUIPO?.toUpperCase().includes('ALL') ||
                metric.TIPOEQUIPO?.toUpperCase().includes('OPCIONAL')
            ) &&
            (
                metric.HERRAMIENTA?.includes(selectedTool) ||
                metric.HERRAMIENTA?.toUpperCase().includes('ALL')
            ))
    }, [metricsFamilyClase, selectedTypeEquipment, selectedTool])

    const uniqueTypeEquipment = useMemo(() => [...new Set(metricsFamilyClase.filter(item => !['ALL', 'OPCIONAL'].includes(item.TIPOEQUIPO?.toUpperCase())).map(item => item.TIPOEQUIPO))], [metricsFamilyClase])

    useEffect(() => {
        // Reset selections when metrics or filter changes
        setSelectedMetrics(prev => {
            const initialSelection: Record<number, boolean> = {}
            metricsFamilyClaseFiltered.forEach(metric => {
                // If metric was previously selected, keep it selected
                // Otherwise, set to recommended (IS_OPCIONAL = 0) by default
                initialSelection[metric.ID_METRICA] = prev[metric.ID_METRICA] ?? (metric.IS_OPCIONAL === 0)
            });
            return initialSelection
        })

        setMetricParameters(prev => {
            const initialParams: Record<number, Record<string, string>> = {}
            metricsFamilyClaseFiltered.forEach(metric => {
                if (metric.valores_parametro.length > 0) {
                    // Keep existing parameters if they exist
                    initialParams[metric.ID_METRICA] = { ...(prev[metric.ID_METRICA] || {}) }
                    metric.valores_parametro.forEach(param => {
                        const key = String(param.ID_METRICA_PARAMETRO)
                        if (!initialParams[metric.ID_METRICA][key]) {
                            initialParams[metric.ID_METRICA][key] = param.VALOR_PARAMETRO || ''
                        }
                    })
                }
            })
            return initialParams
        })
    }, [metricsFamilyClaseFiltered])

    const handleMetricSelect = (metricId: number, hasParams: boolean, event?: React.MouseEvent) => {
        const isInputClick = event?.target instanceof HTMLInputElement ||
            event?.target instanceof HTMLTextAreaElement ||
            event?.target instanceof HTMLSelectElement;

        if (isInputClick) return;

        setSelectedMetrics(prev => ({
            ...prev,
            [metricId]: !prev[metricId]
        }));

        if (hasParams) {
            setMetricParameters(prev => ({
                ...prev,
                [metricId]: prev[metricId] || {}
            }));
        }
    };

    const handleParameterChange = (metricId: number, paramId: string, value: string) => {
        setMetricParameters(prev => ({
            ...prev,
            [metricId]: {
                ...prev[metricId],
                [paramId]: value
            }
        }));
    };
    const addExtraField = (metricId: number, metric?: MetricFamilyClase) => {
        setMetricParameters(prev => {
            const current = { ...(prev[metricId] || {}) };

            const duplicateFields = metric?.valores_parametro.filter(param => {
                const urg = param.URGENCIA;
                return urg === null || String(urg).trim() === '';
            });
            if (!duplicateFields || duplicateFields.length === 0) return { ...prev, [metricId]: current };

            const group = uniqid(); // un groupId por click

            duplicateFields.forEach(param => {
                const key = `extra_${group}_${param.ID_METRICA_PARAMETRO}`;
                current[key] = param.VALOR_PARAMETRO || '';
                current[`label_${key}`] = param.PARAMETRO || 'Campo adicional';
                current[`units_${key}`] = param.UNIDADES || '';
                current[`origParam_${key}`] = String(param.ID_METRICA_PARAMETRO || 0);
            });

            // marca el grupo para facilitar eliminación/render
            current[`group_${group}`] = duplicateFields.map(p => p.ID_METRICA_PARAMETRO).join(',');

            return { ...prev, [metricId]: current };
        });
    };

    const removeExtraField = (metricId: number, keyOrGroup: string) => {
        setMetricParameters(prev => {
            const current = { ...(prev[metricId] || {}) };

            const m = keyOrGroup.match(/^extra_([^_]+)_/);
            if (m) {
                const group = m[1];
                Object.keys(current).forEach(k => {
                    if (k.startsWith(`extra_${group}_`) || k === `group_${group}`) {
                        delete current[k];
                    }
                    if (k.startsWith(`label_extra_${group}_`) || k.startsWith(`units_extra_${group}_`) || k.startsWith(`origParam_extra_${group}_`)) {
                        delete current[k];
                    }
                });
            } else if (keyOrGroup.startsWith('group_')) {
                const group = keyOrGroup.replace('group_', '');
                Object.keys(current).forEach(k => {
                    if (k.startsWith(`extra_${group}_`) || k === `group_${group}`) delete current[k];
                });
            } else {
                // fallback: eliminar individual
                delete current[keyOrGroup];
                delete current[`label_${keyOrGroup}`];
                delete current[`units_${keyOrGroup}`];
                delete current[`origParam_${keyOrGroup}`];
            }

            return { ...prev, [metricId]: current };
        });
    }

    const handleSubmit = async () => {
        const selectedCIIp = CIIps.find(ip => ip.NRO_IP === selectedIP);
        const selectedToolObj = tools.find(tool => tool.nombre.trim().toUpperCase() === selectedTool.trim().toUpperCase());
        const date = new Date();
        const formatedDate = toSQLServerFormat(date);

        const transformedMetrics: MetricVersionFront[] = Object.entries(selectedMetrics)
            .filter(([_, isSelected]) => isSelected)
            .flatMap(([metricId]) => {
                const metric = metricsFamilyClaseFiltered.find(m => m.ID_METRICA === Number(metricId));
                if (!metric || !selectedCIIp || !selectedToolObj) return [];

                const thresholdParams = findThresholdParametersCatalog(metric.valores_parametro);
                const normalParameters = findNormalParametersCatalog(metric.valores_parametro);

                const originalParams: MetricParameter[] = [
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
                        ID_METRICA_PARAMETRO: param.ID_METRICA_PARAMETRO,
                    })),
                    ...normalParameters.map(param => {
                        const formValue = metricParameters[metric.ID_METRICA]?.[String(param.ID_METRICA_PARAMETRO)];
                        return {
                            ESTADO: 1,
                            FECHA_CREACION: formatedDate,
                            FECHA_MODIFICACION: formatedDate,
                            ID_DETALLE_METRICA_VALOR: 0,
                            NRO_POOLEOS: param.NRO_POOLEOS || '',
                            PARAMETRO_VALOR: formValue || param.VALOR_PARAMETRO?.toString() || '',
                            UMBRAL: param.UMBRAL?.toString() || '',
                            URGENCIA: param.PARAMETRO || '',
                            USUARIO_CREACION: userName,
                            USUARIO_MODIFICACION: userName,
                            ID_METRICA_PARAMETRO: param.ID_METRICA_PARAMETRO,
                        };
                    }),
                ];

                // --- Reemplazo: agrupar extras por groupId y crear un registro por grupo ---
                const extraEntries = Object.entries(metricParameters[metric.ID_METRICA] || {})
                    .filter(([key]) => key.startsWith('extra_'));

                const groups = extraEntries.reduce((acc, [key, value]) => {
                    const m = key.match(/^extra_([^_]+)_(\d+)$/);
                    if (m) {
                        const groupId = m[1];
                        acc[groupId] = acc[groupId] || [];
                        acc[groupId].push({
                            key,
                            value: value as string,
                            origParamId: Number(metricParameters[metric.ID_METRICA]?.[`origParam_${key}`]) || Number(m[2]) || 0,
                            label: metricParameters[metric.ID_METRICA]?.[`label_${key}`] || 'Campo adicional',
                            units: metricParameters[metric.ID_METRICA]?.[`units_${key}`] || ''
                        });
                    } else {
                        // fallback: treat as its own group
                        acc[key] = acc[key] || [];
                        acc[key].push({
                            key,
                            value: value as string,
                            origParamId: Number(metricParameters[metric.ID_METRICA]?.[`origParam_${key}`]) || 0,
                            label: metricParameters[metric.ID_METRICA]?.[`label_${key}`] || 'Campo adicional',
                            units: metricParameters[metric.ID_METRICA]?.[`units_${key}`] || ''
                        });
                    }
                    return acc;
                }, {} as Record<string, Array<{key:string; value:string; origParamId:number; label:string; units:string}>>);

                const extraRecords: MetricVersionFront[] = Object.values(groups).map(groupItems => {
                    const clonedParams: MetricParameter[] = originalParams.map(p => ({ ...p }));
                    groupItems.forEach(item => {
                        if (item.origParamId) {
                            const idx = clonedParams.findIndex(p => p.ID_METRICA_PARAMETRO === item.origParamId);
                            if (idx >= 0) {
                                clonedParams[idx] = {
                                    ...clonedParams[idx],
                                    PARAMETRO_VALOR: item.value || clonedParams[idx].PARAMETRO_VALOR || '',
                                    PARAMETRO: item.label,
                                    UNIDADES: item.units,
                                } as MetricParameter;
                            } else {
                                clonedParams.push({
                                    ESTADO: 1,
                                    FECHA_CREACION: formatedDate,
                                    FECHA_MODIFICACION: formatedDate,
                                    ID_DETALLE_METRICA_VALOR: 0,
                                    NRO_POOLEOS: '',
                                    PARAMETRO_VALOR: item.value || '',
                                    UMBRAL: '',
                                    URGENCIA: '',
                                    USUARIO_CREACION: userName,
                                    USUARIO_MODIFICACION: userName,
                                    ID_METRICA_PARAMETRO: item.origParamId || 0,
                                    PARAMETRO: item.label,
                                    UNIDADES: item.units,
                                } as unknown as MetricParameter);
                            }
                        } else {
                            clonedParams.push({
                                ESTADO: 1,
                                FECHA_CREACION: formatedDate,
                                FECHA_MODIFICACION: formatedDate,
                                ID_DETALLE_METRICA_VALOR: 0,
                                NRO_POOLEOS: '',
                                PARAMETRO_VALOR: item.value || '',
                                UMBRAL: '',
                                URGENCIA: '',
                                USUARIO_CREACION: userName,
                                USUARIO_MODIFICACION: userName,
                                ID_METRICA_PARAMETRO: 0,
                                PARAMETRO: item.label,
                                UNIDADES: item.units,
                            } as unknown as MetricParameter);
                        }
                    });

                    return {
                        ID_FRONT: uniqid(),
                        TIPO_CAMBIO: 'NUEVO CI',
                        CLASE: metric.CLASE,
                        DETALLE: metric.DETALLE,
                        ESTADO: 1,
                        FAMILIA: metric.FAMILIA,
                        FECHA_CREACION: formatedDate,
                        FECHA_MODIFICACION: formatedDate,
                        FRECUENCIA: metric.FRECUENCIA,
                        HERRAMIENTA: selectedToolObj.nombre,
                        HOSTNAME: ci?.NOMBRE,
                        ID_DETALLE_POLITICA: 0,
                        ID_EQUIPO: ci.ID_EQUIPO,
                        ID_EQUIPO_IP: Number(selectedCIIp.ID_EQUIPO_IP) || 0,
                        ID_FAMILIA_CLASE: metric.ID_FAMILIA_CLASE,
                        ID_HERRAMIENTA: selectedToolObj.codigo,
                        ID_METRICA: metric.ID_METRICA,
                        ID_POLITICA: globalParams.policyID,
                        ID_VERSION: globalParams.versionID,
                        ID_TIPO_EQUIPO: metric.ID_TIPOEQUIPO,
                        NOMBRE: metric.NOMBRE,
                        NOMBRE_CI: ci?.NOMBRE_CI || '',
                        NRO_IP: selectedIP,
                        TIPO_EQUIPO: metric.TIPOEQUIPO,
                        USUARIO_CREACION: userName,
                        USUARIO_MODIFICACION: userName,
                        VALORES_PARAMETROS: clonedParams,
                    };
                });

                // devolver original + 1 registro por grupo
                return [
                    {
                        ID_FRONT: uniqid(),
                        TIPO_CAMBIO: 'NUEVO CI',
                        CLASE: metric.CLASE,
                        DETALLE: metric.DETALLE,
                        ESTADO: 1,
                        FAMILIA: metric.FAMILIA,
                        FECHA_CREACION: formatedDate,
                        FECHA_MODIFICACION: formatedDate,
                        FRECUENCIA: metric.FRECUENCIA,
                        HERRAMIENTA: selectedToolObj.nombre,
                        HOSTNAME: ci?.NOMBRE,
                        ID_DETALLE_POLITICA: 0,
                        ID_EQUIPO: ci.ID_EQUIPO,
                        ID_EQUIPO_IP: Number(selectedCIIp.ID_EQUIPO_IP) || 0,
                        ID_FAMILIA_CLASE: metric.ID_FAMILIA_CLASE,
                        ID_HERRAMIENTA: selectedToolObj.codigo,
                        ID_METRICA: metric.ID_METRICA,
                        ID_POLITICA: globalParams.policyID,
                        ID_VERSION: globalParams.versionID,
                        ID_TIPO_EQUIPO: metric.ID_TIPOEQUIPO,
                        NOMBRE: metric.NOMBRE,
                        NOMBRE_CI: ci?.NOMBRE_CI || '',
                        NRO_IP: selectedIP,
                        TIPO_EQUIPO: metric.TIPOEQUIPO,
                        USUARIO_CREACION: userName,
                        USUARIO_MODIFICACION: userName,
                        VALORES_PARAMETROS: originalParams,
                    },
                    ...extraRecords,
                ];
            });

        console.log('Datos enviados:', transformedMetrics);

        if (!selectedCIIp) console.log('No se encontró la IP', selectedIP, CIIps);
        if (!selectedToolObj) console.log('No se encontró la herramienta', selectedTool, tools);

            const payload: AddChangeDetail = {
            usuario: userName,
            id_cambio: change.ID_CAMBIO,
            id_equipo: ci.ID_EQUIPO,
            lista_cambio_detalle: transformedMetrics.map(metric => ({
                tipo_cambio: metric.TIPO_CAMBIO,
                id_cambio_detalle: 0,
                id_detalle_politica: 0,
                id_metrica: metric.ID_METRICA,
                id_herramienta: metric.ID_HERRAMIENTA,
                id_equipo_ip: metric.ID_EQUIPO_IP,
                id_tipoequipo: metric.ID_TIPO_EQUIPO,
                frecuencia: Number(metric.FRECUENCIA),
                estado: 1,
                lista_parametros: metric.VALORES_PARAMETROS.map(param => ({
                    id_cambio_metrica_valor: 0,
                    nro_pooleos: Number(param.NRO_POOLEOS || 0),
                    parametro_valor: param.PARAMETRO_VALOR || '',
                    umbral: param.UMBRAL || '',
                    estado: String(param.ESTADO),
                    id_metrica_parametro: param.ID_METRICA_PARAMETRO,
                }))
            }))
        };

        setLoading(true);
        const ok = await changesHook.addChangeDetail(payload);
        setLoading(false);
        if(ok){
            onRefresh()
            setTimeout(() => {
                onClose();
            }, 500);
        }
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content rounded">
                    <div className='modal-header py-4'>
                        <h2 className="modal-title">
                            <div className="d-flex align-items-center">
                                <div className="symbol symbol-40px me-3">
                                    <span className="symbol-label bg-light-primary">
                                        <i className="bi bi-graph-up fs-2 text-primary"></i>
                                    </span>
                                </div>
                                <div>
                                    <span className="fw-bold">{ci?.NOMBRE_CI}</span>
                                    <span className="text-muted d-block fs-7">
                                        {ci.FAMILIA} / {ci.CLASE}
                                    </span>
                                </div>
                            </div>
                        </h2>
                        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={onClose}>
                            <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                        </div>
                    </div>

                    <div className="modal-body pt-2">
                        {catalogHook.familyClaseMetricsLoading ? (
                            <div className="d-flex flex-column align-items-center justify-content-center py-10">
                                <div className="spinner spinner-primary spinner-lg mb-5"></div>
                                <span className="text-muted fs-6">Cargando métricas disponibles...</span>
                            </div>
                        ) : (
                            <>
                                <div className="alert alert-light-primary d-flex align-items-center mb-5">
                                    <i className="bi bi-info-circle-fill fs-2 text-primary me-3"></i>
                                    <div className="d-flex flex-column">
                                        <span className="fw-bold">Métricas recomendadas</span>
                                        <span className="text-gray-700">
                                            Las métricas marcadas con ★ están preseleccionadas por ser esenciales para este tipo de equipo.
                                            Puede deseleccionarlas o añadir otras según sus necesidades.
                                        </span>
                                    </div>
                                </div>

                                {/* Configuración básica */}
                                <div className="row g-4 mb-8 px-3">
                                    <div className="col-md-6">
                                        <label className="form-label required">Seleccionar IP</label>
                                        <div className="input-group input-group-solid">
                                            <span className="input-group-text">
                                                <i className="bi bi-hdd-network"></i>
                                            </span>
                                            <select
                                                className="form-select"
                                                value={selectedIP}
                                                onChange={(e) => setSelectedIP(e.target.value)}
                                                disabled={loadingIPsByCI}
                                                required
                                            >
                                                <option value="">{loadingIPsByCI ? 'Cargando...' : 'Seleccione una IP'}</option>
                                                {CIIps.map(ip => (
                                                    <option key={ip.ID_EQUIPO_IP} value={ip.NRO_IP}>
                                                        {ip.NRO_IP}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label required">Herramienta de monitoreo</label>
                                        <div className="input-group input-group-solid">
                                            <span className="input-group-text">
                                                <i className="bi bi-tools"></i>
                                            </span>
                                            <select
                                                className="form-select"
                                                value={selectedTool}
                                                onChange={(e) => setSelectedTool(e.target.value)}
                                                disabled={toolsLoading}
                                                required
                                            >
                                                <option value="">{toolsLoading ? 'Cargando...' : 'Todas las herramientas'}</option>
                                                {tools.map(tool => (
                                                    <option key={tool.codigo} value={tool.nombre}>
                                                        {tool.nombre.toUpperCase()}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Tipo de Equipo</label>
                                        <div className="input-group input-group-solid">
                                            <span className="input-group-text">
                                                <i className="bi bi-tools"></i>
                                            </span>
                                            <select
                                                disabled={uniqueTypeEquipment.length === 0}
                                                className="form-select"
                                                value={selectedTypeEquipment}
                                                onChange={(e) => setSelectedTypeEquipment(e.target.value)}
                                            >
                                                <option value="">Todos los tipos</option>
                                                {uniqueTypeEquipment.map((typeE, i) => (
                                                    <option key={i} value={typeE ?? ''}>{typeE}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {metricsFamilyClaseFiltered.length === 0 && (
                                    <div className="px-10 my-10">
                                        <div className={`card card-flush bg-light-info border border-dashed border-info rounded`}>
                                            <div className="card-body py-5 d-flex justify-content-center">
                                                <div className="d-flex align-items-center">
                                                    <KTSVG
                                                        path="/media/icons/duotune/general/gen044.svg"
                                                        className={`svg-icon-2hx me-4 svg-icon-info`}
                                                    />
                                                    <div className="flex-grow-1">
                                                        <h4 className={`fw-bold mb-1 text-gray-800' : 'text-gray-800'}`}>
                                                            No hay métricas disponibles
                                                        </h4>
                                                        <p className="text-gray-600 mb-0">
                                                            No se han encontrado metricas configuradas en el catalgo para este tipo de CI.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Listado de métricas */}
                                <div className="row g-6">
                                    {metricsFamilyClaseFiltered.map((metric) => {
                                        const normalParameters = findNormalParametersCatalog(metric.valores_parametro)
                                        const hasParams = normalParameters.length > 0
                                        const isSelected = !!selectedMetrics[metric.ID_METRICA]
                                        const isRecommended = metric.IS_OPCIONAL === 0

                                        return (
                                            <div key={metric.ID_METRICA} className="col-12">
                                                <div
                                                    className={`card card-flush ${isSelected ? 'border border-dashed border-primary border-1' : ''}`}
                                                    onClick={(e) => handleMetricSelect(metric.ID_METRICA, hasParams, e)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div className="card-header">
                                                        <div className="card-title">
                                                            <div className="form-check form-check-custom form-check-solid me-3">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    checked={isSelected}
                                                                    readOnly
                                                                />
                                                            </div>
                                                            <div className="d-flex flex-column">
                                                                <span className="fw-bold fs-5">
                                                                    {metric.NOMBRE}
                                                                    {isRecommended && <span className="text-warning ms-2">★</span>}
                                                                </span>
                                                                <span className="text-muted fs-7">{metric.DETALLE}</span>
                                                            </div>
                                                        </div>
                                                        <div className="card-toolbar">
                                                            <span className="badge badge-light-primary">
                                                                Cada {metric.FRECUENCIA} min
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {isSelected && hasParams && (
                                                        <div className="card-body pt-5 bg-light-primary">
                                                            <div className="row g-4">
                                                                {normalParameters.map((param) => (
                                                                    <div
                                                                        key={param.ID_METRICA_PARAMETRO}
                                                                        className="col-md-6"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <label className="form-label">
                                                                            {param.PARAMETRO}
                                                                            {param.UNIDADES && (
                                                                                <span className="text-muted ms-2">({param.UNIDADES})</span>
                                                                            )}
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder={`Valor para ${param.PARAMETRO}`}
                                                                            value={metricParameters[metric.ID_METRICA]?.[String(param.ID_METRICA_PARAMETRO)] || ''}
                                                                            onChange={(e) =>
                                                                                handleParameterChange(
                                                                                    metric.ID_METRICA,
                                                                                    String(param.ID_METRICA_PARAMETRO),
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        />
                                                                    </div>
                                                                ))}

                                                                {/* Campos extra añadidos por el usuario (AGRUPADOS, 1 botón por grupo) */}
                                                                {(() => {
                                                                    const entries = Object.entries(metricParameters[metric.ID_METRICA] || {});

                                                                    // Agrupar keys tipo extra_<group>_<paramId>
                                                                    const groupsMap = entries
                                                                        .filter(([k]) => k.startsWith('extra_'))
                                                                        .reduce((acc: Record<string, Array<{ key: string; val: string }>>, [key, val]) => {
                                                                            const m = key.match(/^extra_([^_]+)_/);
                                                                            const groupId = m ? m[1] : key;
                                                                            acc[groupId] = acc[groupId] || [];
                                                                            acc[groupId].push({ key, val: val as string });
                                                                            return acc;
                                                                        }, {});

                                                                    const groups = Object.entries(groupsMap);

                                                                    if (groups.length === 0) return null;

                                                                    return groups.map(([groupId, items]) => (
                                                                        <div key={`group_${groupId}`} className="w-100">
                                                                            <div className="row g-4">
                                                                                {items.map(({ key }) => (
                                                                                    <div key={key} className="col-md-6" onClick={(e) => e.stopPropagation()}>
                                                                                        <label className="form-label">
                                                                                            {metricParameters[metric.ID_METRICA]?.[`label_${key}`] || 'Campo adicional'}
                                                                                            {metricParameters[metric.ID_METRICA]?.[`units_${key}`] && (
                                                                                                <span className="text-muted ms-2">({metricParameters[metric.ID_METRICA][`units_${key}`]})</span>
                                                                                            )}
                                                                                        </label>
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            placeholder={`Valor para ${metricParameters[metric.ID_METRICA]?.[`label_${key}`] || 'Campo adicional'}`}
                                                                                            value={metricParameters[metric.ID_METRICA]?.[key] || ''}
                                                                                            onChange={(e) => handleParameterChange(metric.ID_METRICA, key, e.target.value)}
                                                                                            onClick={(e) => e.stopPropagation()}
                                                                                        />
                                                                                    </div>
                                                                                ))}
                                                                            </div>

                                                                            <div className="mt-2">
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-sm btn-link text-danger"
                                                                                    onClick={(e) => { e.stopPropagation(); removeExtraField(metric.ID_METRICA, `group_${groupId}`); }}
                                                                                >
                                                                                    <i className="bi bi-x-circle me-1"></i> Eliminar campo
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ));
                                                                })()}
                                                            </div>

                                                            <div className="mt-4">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-light-primary"
                                                                    onClick={(e) => { e.stopPropagation(); addExtraField(metric.ID_METRICA, metric); }} // Pasar el objeto `metric`
                                                                >
                                                                    <i className="bi bi-plus me-1"></i> Agregar campo
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={changesHook.addChangeDetailLoading || !selectedIP || !selectedTool || !Object.keys(selectedMetrics).some(k => selectedMetrics[Number(k)])||loading}
                        >
                            {changesHook.addChangeDetailLoading ? (
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            ) : (
                                <i className="bi bi-save me-2"></i>
                            )}
                            Guardar configuración
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};