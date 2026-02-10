import { FC, useState, useMemo, useEffect, useCallback } from "react";
import { useMonitoringPoliciesContext } from "../Context";
import { KTSVG } from "../../../../helpers";
import { useTypedSelector } from "../../../../store/ConfigStore";
import { MetricVersionFront } from "../Types"
import { useCI } from "../../../inventory/hooks/useCI";

interface ProcessedCI {
    ID_EQUIPO: number;
    NOMBRE_CI: string;
    NOMBRE: string;
    IP: string;
    FAMILIA: string;
    CLASE: string;
    ID_FAMILIA_CLASE: number;
    AVAILABLE_IPS: string[];
    SELECTED_IP: string;
    hasMultipleIPs: boolean;
}

export const ValidateMassiveCI: FC = () => {
    const { modalHook,changesHook, globalParams } = useMonitoringPoliciesContext();
    const { CIIps } = useCI()

    const [toolType, setToolType] = useState<string>("");
    const [compatibleTools, setCompatibleTools] = useState<any[]>([]);
    const [loadingCompatibleTools, setLoadingCompatibleTools] = useState<boolean>(false);
    const [ciIPSelections, setCiIPSelections] = useState<Map<number, string>>(new Map());

    const userName = useTypedSelector(({ auth }) => auth.usuario)

    const selectedCIs = useMemo(() => {
        return modalHook.modalInformation?.selectedCIs || [];
    }, [modalHook.modalInformation?.selectedCIs]);

    useEffect(() => {
        if (selectedCIs.length === 0) {
            setCompatibleTools([]);
            return;
        }
        const idsString = selectedCIs.map((ci: any) => ci.ID_EQUIPO).join(",");
        setLoadingCompatibleTools(true);
        changesHook.getCompatibleTools(idsString)
            .then((data: any) => {
                if (data && data.lista) {
                    setCompatibleTools(data.lista);
                } else {
                    setCompatibleTools([]);
                }
            })
            .catch((error: any) => {
                console.error("Error al cargar herramientas compatibles:", error);
                setCompatibleTools([]);
            })
            .finally(() => setLoadingCompatibleTools(false));
    }, [selectedCIs]);// eslint-disable-line react-hooks/exhaustive-deps

    const getIpIdForCI = (ciId: number, ip: string) => {
        const ipObj = CIIps.find(item => String(item.ID_EQUIPO) === String(ciId) && item.NRO_IP === ip);
        return ipObj ? Number(ipObj.ID_EQUIPO_IP) : 0;
    };

    const processedCIs = useMemo<ProcessedCI[]>(() => {
        return selectedCIs.map((ci: any) => {
            const availableIPs = ci.IP ? ci.IP.split('|').filter((ip: string) => ip.trim() !== "") : [];
            const selectedIP = ciIPSelections.get(ci.ID_EQUIPO) || availableIPs[0] || "";
            return {
                ...ci,
                AVAILABLE_IPS: availableIPs,
                SELECTED_IP: selectedIP,
                hasMultipleIPs: availableIPs.length > 1
            };
        })
    }, [selectedCIs, ciIPSelections]);

    useEffect(() => {
        const initialSelections = new Map<number, string>();

        selectedCIs.forEach((ci: any) => {
            const availableIPs = ci.IP ? ci.IP.split('|').filter((ip: string) => ip.trim() !== "") : [];
            if (availableIPs.length > 0) {
                initialSelections.set(ci.ID_EQUIPO, availableIPs[0]);
            }
        });

        setCiIPSelections(initialSelections);
    }, [selectedCIs]);

    const toolOptions = useMemo(() => {
        const base = [{ value: "", label: "Selecciona una herramienta" }];
        const tools = compatibleTools.map((t: any) => ({
            value: String(t.ID_HERRAMIENTA),
            label: t.HERRAMIENTA
        })) || [];
        return [...base, ...tools];
    }, [compatibleTools]);

    const updateCISelection = useCallback((ciID: number, selectedIP: string) => {
        setCiIPSelections(prev => {
            const newSelections = new Map(prev);
            newSelections.set(ciID, selectedIP);
            return newSelections;
        });
    }, []);

    const validation = useMemo(() => {
        const errors: string[] = [];
        const usedIPs = new Set<string>();
        
        if(!toolType) {
            errors.push("Debe seleccionar un tipo de herramienta.");
        }

        processedCIs.forEach((ci: ProcessedCI) => {
            const selectedIP = ci.SELECTED_IP;
            if (!selectedIP) {
                errors.push(`El CI "${ci.NOMBRE_CI}" no tiene una IP seleccionada.`);
            } else {
                usedIPs.add(selectedIP);
            }
        });

        return {
            isValid: errors.length === 0,
            errors,
            cisWithMultipleIPs: processedCIs.filter(ci => ci.hasMultipleIPs).length
        };
    }, [toolType, processedCIs]);

    const handleCancel = () => {
        modalHook.closeModal();
    };

    const handleConfirm = async () => {
        if (!validation.isValid) return;

        const toolObj = compatibleTools.find((t: any) => String(t.ID_HERRAMIENTA) === toolType);
        
        // Construir payload con IPs específicas seleccionadas
        const finalCIs = processedCIs.map(ci => ({
            clase: ci.CLASE,
            familia: ci.FAMILIA,
            id_equipo: ci.ID_EQUIPO,
            id_familia_clase: ci.ID_FAMILIA_CLASE,
            ip: ci.SELECTED_IP,
            nombre: ci.NOMBRE,
            nombre_ci: ci.NOMBRE_CI
        }));

        const payload = {
            toolCodigo: toolObj?.ID_HERRAMIENTA ?? null,
            toolNombre: toolObj?.HERRAMIENTA ?? toolType,
            selectedCIs: finalCIs
        };

        console.log("Payload final con IPs específicas:", payload);

        const response = await changesHook.obtainDefaultMassiveMetric(payload);

        // --- Generar payloads tipo MetricVersionFront para masivo ---
        const fecha = new Date().toISOString(); // O usa toSQLServerFormat(fecha) si tienes esa función

        const addPayloads: MetricVersionFront[] = [];

        if (response && Array.isArray(response.data)) {
            response.data.forEach((ci: any) => {
                (ci.metricas || []).forEach((metrica: any) => {
                    addPayloads.push({
                        ID_FRONT: (window as any).uniqid ? (window as any).uniqid() : Math.random().toString(36).slice(2),
                        TIPO_CAMBIO: 'NUEVO CI',
                        CLASE: metrica.CLASE,
                        DETALLE: metrica.DETALLE,
                        ESTADO: 1,
                        FAMILIA: metrica.FAMILIA,
                        FECHA_CREACION: fecha,
                        FECHA_MODIFICACION: fecha,
                        FRECUENCIA: metrica.FRECUENCIA,
                        HERRAMIENTA: metrica.HERRAMIENTA,
                        HOSTNAME: ci.NOMBRE_CI,
                        ID_DETALLE_POLITICA: 0,
                        ID_EQUIPO: ci.ID_EQUIPO,
                        ID_EQUIPO_IP: getIpIdForCI(ci.ID_EQUIPO, ci.SELECTED_IP),
                        ID_FAMILIA_CLASE: metrica.ID_FAMILIA_CLASE || ci.ID_FAMILIA_CLASE || 0,
                        ID_HERRAMIENTA: metrica.ID_HERRAMIENTA,
                        ID_METRICA: metrica.ID_METRICA,
                        ID_POLITICA: globalParams.policyID || 0,
                        ID_VERSION: globalParams.versionID || 0,
                        ID_TIPO_EQUIPO: metrica.ID_TIPOEQUIPO,
                        NOMBRE: metrica.NOMBRE,
                        NOMBRE_CI: ci.NOMBRE_CI,
                        NRO_IP: ci.SELECTED_IP,
                        TIPO_EQUIPO: metrica.TIPOEQUIPO,
                        USUARIO_CREACION: userName,
                        USUARIO_MODIFICACION: userName,
                        VALORES_PARAMETROS: (metrica.parametros || []).map((param: any) => ({
                            ESTADO: 1,
                            FECHA_CREACION: fecha,
                            FECHA_MODIFICACION: fecha,
                            ID_DETALLE_METRICA_VALOR: 0,
                            NRO_POOLEOS: param.NRO_POOLEOS || '',
                            PARAMETRO_VALOR: param.VALOR_PARAMETRO || '',
                            UMBRAL: param.UMBRAL || '',
                            URGENCIA: param.URGENCIA || '',
                            USUARIO_CREACION: userName,
                            USUARIO_MODIFICACION: userName,
                            ID_METRICA_PARAMETRO: param.ID_METRICA_PARAMETRO,
                            PARAMETRO: param.PARAMETRO,
                            UNIDADES: param.UNIDADES,
                        })),
                    });
                });
            });
        }

        console.log("Payloads tipo MetricVersionFront generados:", addPayloads);

        console.log("Antes de setUpdates, prev:", modalHook.modalInformation?.updates);
        console.log("Nuevos addPayloads:", addPayloads);
        modalHook.modalInformation.setUpdates((prev: MetricVersionFront[]) => {
            console.log("Prev en setUpdates:", prev);
            return [...prev, ...addPayloads];
        });

        if (addPayloads.length > 0 && modalHook.modalInformation?.setUpdates) {
            modalHook.modalInformation.setUpdates((prev: MetricVersionFront[]) => [...prev, ...addPayloads]);
        }

        modalHook.closeModal();
    };

    return (
        <div className="p-4">
            <div className='modal-header py-4'>
                <h2 className="modal-title">
                    <div className="d-flex align-items-center">
                        <div className="symbol symbol-40px me-3">
                            <span className="symbol-label bg-light-primary">
                                <i className="bi bi-server fs-2 text-primary"></i>
                            </span>
                        </div>
                        <div>
                            <span className="fw-bold">Configuración Masiva de CIs</span>
                            <span className="text-muted d-block fs-7">
                                Selecciona herramienta e IPs para {processedCIs.length} CI{processedCIs.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={handleCancel} aria-label="Cerrar">
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>

            {validation.cisWithMultipleIPs > 0 && (
                <div className="alert alert-info mb-4">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>{validation.cisWithMultipleIPs}</strong> CI{validation.cisWithMultipleIPs !== 1 ? 's tienen' : ' tiene'} múltiples IPs disponibles. 
                    Selecciona la IP específica para cada uno.
                </div>
            )}

            <div className="mb-4">
                <label className="form-label fw-semibold">Tipo de herramienta</label>
                <select
                    className={`form-select ${!toolType ? 'is-invalid' : ''}`}
                    value={toolType}
                    onChange={(e) => setToolType(e.target.value)}
                    disabled={loadingCompatibleTools} // Agregar esta línea
                >
                    {loadingCompatibleTools ? ( // Agregar esta condición
                        <option value="">Cargando herramientas compatibles...</option>
                    ) : (
                        toolOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))
                    )}
                </select>
                {loadingCompatibleTools && ( // Agregar este indicador visual
                    <div className="form-text">
                        <i className="bi bi-arrow-clockwise spinner-border spinner-border-sm me-1"></i>
                        Obteniendo herramientas compatibles...
                    </div>
                )}
            </div>

            <div className="mb-4" style={{maxHeight: 400, overflowY: "auto" }}>
                <div className="row g-3">
                    {processedCIs.map((ci) => (
                        <div key={ci.ID_EQUIPO} className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className={`card h-100 shadow-sm ${
                                validation.errors.some(e => e.includes(ci.NOMBRE_CI)) ? 'border-danger' : 
                                ci.hasMultipleIPs ? 'border-warning' : 'border-primary'
                            }`}>
                                <div className="card-body p-3">
                                    {/* Header del CI */}
                                    <div className="d-flex align-items-start justify-content-between mb-2">
                                        <div className="flex-grow-1">
                                            <h6 className="fw-bold text-truncate mb-1" title={ci.NOMBRE_CI}>
                                                {ci.NOMBRE_CI}
                                            </h6>
                                            <small className="text-muted">ID: {ci.ID_EQUIPO}</small>
                                        </div>
                                        {ci.hasMultipleIPs && (
                                            <span className="badge bg-warning text-dark">
                                                <i className="bi bi-layers me-1"></i>
                                                {ci.AVAILABLE_IPS.length} IPs
                                            </span>
                                        )}
                                    </div>

                                    {/* Selección de IP */}
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold mb-1">
                                            <i className="bi bi-hdd-network me-1"></i>
                                            IP a usar:
                                        </label>
                                        
                                        {ci.hasMultipleIPs ? (
                                            <select
                                                className={`form-select form-select-sm ${
                                                    !ci.SELECTED_IP ? 'is-invalid' : ''
                                                }`}
                                                value={ci.SELECTED_IP || ''}
                                                onChange={(e) => updateCISelection(ci.ID_EQUIPO, e.target.value)}
                                            >
                                                {ci.AVAILABLE_IPS.map((ip, index) => (
                                                    <option key={`${ci.ID_EQUIPO}-${index}`} value={ip}>{ip}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className="form-control form-control-sm bg-light">
                                                <code>{ci.AVAILABLE_IPS[0] || 'N/A'}</code>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tags de familia y clase */}
                                    <div className="d-flex flex-wrap gap-1">
                                        <span className="badge bg-light text-dark border small text-truncate" title={ci.FAMILIA}>
                                            {ci.FAMILIA}
                                        </span>
                                        <span className="badge bg-light text-dark border small text-truncate" title={ci.CLASE}>
                                            {ci.CLASE}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {processedCIs.length === 0 && (
                        <div className="col-12">
                            <div className="text-center text-muted py-4">No hay CIs seleccionados</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="d-flex justify-content-end gap-3 pt-3 border-top">
                <button className="btn btn-danger" onClick={handleCancel}>
                    <i className="bi bi-x-circle me-1"></i>Cancelar
                </button>
                <button
                    className="btn btn-success"
                    disabled={!validation.isValid || loadingCompatibleTools}
                    onClick={handleConfirm}
                >
                    <i className="bi bi-check-circle me-1"></i>
                    Confirmar y Aplicar ({processedCIs.length})
                </button>
            </div>
        </div>
    );
};