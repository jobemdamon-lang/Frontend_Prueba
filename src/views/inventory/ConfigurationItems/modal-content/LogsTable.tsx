import React, { useState, useMemo } from "react";
import { IAuditCILog } from "../../Types";
import { DataList } from "../../../../components/Inputs/DataListInput";
import { usePagination } from "../../../../hooks/usePagination";
import { Pagination } from "../../../../components/datatable/Pagination";
import { useCI } from "../../hooks/useCI";

interface LogsTableProps {
    logs: IAuditCILog[];
    loading: boolean;
    idCI: number;
}

// Campos que NO queremos mostrar como filas
const EXCLUDED_FIELDS = [
    "id_ci",
    "nombre_ci", 
    "fecha",
    "usuario",
    "fecha_timestamp",
    "fecha_formatted",
    "cantidad_campos_modificados",
    "lista_campos",
    "accion"
];

interface LogGroup {
    fechaHora: string;
    usuario: string;
    accion: string;
    fecha_normalized: string;
    campos: Array<{ campo: string; valor: any }>;
    originalLog: IAuditCILog; // Para debugging
}

export const LogsTable: React.FC<LogsTableProps> = ({ logs, loading, idCI }) => {
    const { exportAuditLogs, loadingExportAuditLogs } = useCI();
    const [campoFiltro, setCampoFiltro] = useState<string>("");
    const [usuarioFiltro, setUsuarioFiltro] = useState<string>("");
    const [fechaIni, setFechaIni] = useState<string>("");
    const [fechaFin, setFechaFin] = useState<string>("");
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    // Normalizar fecha: "24-10-2025 16:17" => "2025-10-24"
    const normalizaFecha = (fecha: string): string => {
        const [datePart] = fecha.split(" ");
        const [day, month, year] = datePart.split("-");
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    // Agrupar logs por fecha-hora-usuario
    const logGroups = useMemo<LogGroup[]>(() => {
        const groups: LogGroup[] = [];
        
        logs.forEach(log => {
            const campos: Array<{ campo: string; valor: any }> = [];
            
            Object.entries(log).forEach(([key, value]) => {
                if (!EXCLUDED_FIELDS.includes(key)) {
                    campos.push({ campo: key, valor: value });
                }
            });

            if (campos.length > 0) {
                groups.push({
                    fechaHora: log.fecha_formatted,
                    usuario: log.usuario || 'Sin usuario',
                    accion: log.accion || 'Sin acción',
                    fecha_normalized: normalizaFecha(log.fecha_formatted),
                    campos,
                    originalLog: log
                });
            }
        });

        return groups.sort((a, b) => b.fechaHora.localeCompare(a.fechaHora));
    }, [logs]);

    // Aplicar filtros
    const groupsFiltrados = useMemo(() => {
        return logGroups.filter(group => {
            // Filtro por usuario
            if (usuarioFiltro && !group.usuario.toLowerCase().includes(usuarioFiltro.toLowerCase())) {
                return false;
            }
            
            // Filtro por campo - buscar en todos los campos del grupo
            if (campoFiltro && !group.campos.some(c => 
                c.campo.toLowerCase().includes(campoFiltro.toLowerCase())
            )) {
                return false;
            }
            
            // Filtro por fecha
            if (fechaIni || fechaFin) {
                const fechaGroup = group.fecha_normalized;
                if (fechaIni && fechaGroup < fechaIni) return false;
                if (fechaFin && fechaGroup > fechaFin) return false;
            }
            
            return true;
        });
    }, [logGroups, campoFiltro, usuarioFiltro, fechaIni, fechaFin]);

    // Obtener opciones únicas para los filtros
    const usuarioItems = useMemo(() => {
        const usuarios = Array.from(new Set(
            logGroups.map(g => g.usuario).filter(Boolean)
        )).sort();

        return usuarios.map(u => ({ id: u, value: u }));
    }, [logGroups]);

    // Paginación
    const {
        currentPage,
        itemsPerPage,
        currentItems,
        totalPages,
        totalItems,
        setCurrentPage,
        setItemsPerPage,
    } = usePagination({
        data: groupsFiltrados,
        initialPage: 1,
        initialItemsPerPage: 10,
    });

    // Manejar expansión/colapso de elementos
    const toggleExpanded = (fechaHora: string) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(fechaHora)) {
            newExpanded.delete(fechaHora);
        } else {
            newExpanded.add(fechaHora);
        }
        setExpandedItems(newExpanded);
    };

    // Limpiar filtro individual
    const ClearButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
        <button
            type="button"
            className="btn btn-sm btn-light"
            style={{
                position: "absolute",
                right: 10,
                top: 36,
                zIndex: 2,
                padding: "0 8px",
                borderRadius: "50%",
                border: "none"
            }}
            onClick={onClick}
            aria-label="Limpiar filtro"
        >
            ×
        </button>
    );

    // Limpiar todos los filtros
    const limpiarFiltros = () => {
        setCampoFiltro("");
        setUsuarioFiltro("");
        setFechaIni("");
        setFechaFin("");
    };

    // Renderizar filtros
    const renderFiltros = () => (
        <div className="mb-4">
            <div className="d-flex gap-4 flex-wrap align-items-end justify-content-end mb-3">
                {/*<div style={{ minWidth: 220, position: "relative" }}>
                    <DataList
                        items={campoItems}
                        label="Filtrar por campo"
                        value={campoFiltro}
                        onChange={setCampoFiltro}
                        containerClassName=""
                    />
                    {campoFiltro && <ClearButton onClick={() => setCampoFiltro("")} />}
                </div>
                */}
                <div style={{ minWidth: 220, position: "relative" }}>
                    <DataList
                        items={usuarioItems}
                        label="Filtrar por usuario"
                        value={usuarioFiltro}
                        onChange={setUsuarioFiltro}
                        containerClassName=""
                    />
                    {usuarioFiltro && <ClearButton onClick={() => setUsuarioFiltro("")} />}
                </div>

                <div style={{ minWidth: 180 }}>
                    <label className="form-label">Fecha desde</label>
                    <input
                        type="date"
                        className="form-control"
                        value={fechaIni}
                        onChange={e => setFechaIni(e.target.value)}
                    />
                </div>

                <div style={{ minWidth: 180 }}>
                    <label className="form-label">Fecha hasta</label>
                    <input
                        type="date"
                        className="form-control"
                        value={fechaFin}
                        onChange={e => setFechaFin(e.target.value)}
                    />
                </div>

                <div>
                    <button
                        type="button"
                        className="btn btn-primary mt-4"
                        onClick={() => exportAuditLogs(idCI)}
                        disabled={loadingExportAuditLogs}
                    >
                        {loadingExportAuditLogs ? (
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        ) : (
                            <i className="bi bi-download pe-3"></i>
                        )}
                        Exportar
                    </button>
                </div>
                {/* Botón para limpiar todos los filtros */}
                {(campoFiltro || usuarioFiltro || fechaIni || fechaFin) && (
                    <div className="d-flex justify-content-end">
                        <button
                            type="button"
                            className="btn btn-outline-secondary mt-4 btn-danger"
                            onClick={limpiarFiltros}
                        >
                            <i className="bi bi-x-circle me-1"></i>
                            Limpiar filtros
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    const renderAcordeon = () => (
        <div className="accordion" id="logsAccordion">
            {loading ? (
                <div className="placeholder-glow">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="accordion-item mb-2">
                            <div className="accordion-header">
                                <span className="placeholder col-12 rounded" style={{ height: 50 }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : groupsFiltrados.length === 0 ? (
                <div className="alert alert-info text-center">
                    <i className="bi bi-info-circle me-2"></i>
                    No hay registros de auditoría para mostrar.
                    {(campoFiltro || usuarioFiltro || fechaIni || fechaFin) && (
                        <div className="mt-2">
                            <small className="text-muted">
                                Intenta ajustar los filtros o{" "}
                                <button 
                                    type="button" 
                                    className="btn btn-link btn-sm p-0 text-decoration-underline"
                                    onClick={limpiarFiltros}
                                >
                                    limpiar todos
                                </button>
                            </small>
                        </div>
                    )}
                </div>
            ) : (
                currentItems.map((group, index) => {
                    const accordionId = `accordion-${currentPage}-${index}`;
                    const isExpanded = expandedItems.has(group.fechaHora);

                    return (
                        <div key={accordionId} className="accordion-item mb-2 shadow-sm">
                            <h2 className="accordion-header">
                                <button
                                    className={`accordion-button ${isExpanded ? '' : 'collapsed'}`}
                                    type="button"
                                    onClick={() => toggleExpanded(group.fechaHora)}
                                    aria-expanded={isExpanded}
                                >
                                    <div className="d-flex justify-content-between align-items-center w-100 pe-3">
                                        {/* Fecha y acción juntos */}
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-clock me-2 text-primary"></i>
                                                <strong>{group.fechaHora}</strong>
                                            </div>
                                            <span
                                                className="badge bg-primary text-white border border-primary"
                                                style={{ fontSize: '1rem', padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                                            >
                                                <i className="bi bi-bookmark me-1" style={{ color: '#fff' }}></i>
                                                <span style={{ textTransform: 'capitalize', color: '#f8f9fa' }}>{group.accion}</span>
                                            </span>
                                        </div>
                                        {/* Usuario y cantidad de campos */}
                                        <div className="d-flex align-items-center gap-3">
                                            <span className="badge bg-light text-dark border border-secondary">
                                                <i className="bi bi-person me-1"></i>
                                                {group.usuario}
                                            </span>
                                            <span className="badge bg-info">
                                                {group.campos.length} campo{group.campos.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            </h2>
                            
                            <div
                                className={`accordion-collapse collapse ${isExpanded ? 'show' : ''}`}
                                aria-labelledby={accordionId}
                            >
                                <div className="accordion-body p-4">
                                    <div className="row">
                                        {group.campos.map((campo, idx) => (
                                            <div className="col-12 col-md-6 col-xl-4 mb-3" key={idx}>
                                                <div className="border rounded p-2 h-100">
                                                    <div className="fw-bold text-dark fs-5 mb-1">{campo.campo}</div>
                                                    <div className="text-muted font-monospace fs-6">
                                                        {campo.valor || <em className="text-muted">Sin valor</em>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );

    // Renderizar skeleton de filtros
    const renderFiltrosSkeleton = () => (
        <div className="mb-4 d-flex gap-4 flex-wrap align-items-end">
            {[220, 220, 180, 180, 150].map((width, i) => (
                <div key={i} style={{ minWidth: width }}>
                    <div className="placeholder-glow">
                        <span 
                            className="placeholder col-12 rounded" 
                            style={{ height: 40, display: "block" }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div>
            {loading ? renderFiltrosSkeleton() : renderFiltros()}
            {renderAcordeon()}
            {!loading && groupsFiltrados.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            )}
        </div>
    );
};