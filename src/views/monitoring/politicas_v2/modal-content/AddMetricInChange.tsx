import React, { useEffect, useRef, useState, useMemo } from "react";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { useMonitoringPoliciesContext } from "../Context";
import { CIRecord } from "./DetailChange";
import { usePagination } from "../../../../hooks/usePagination";
import { Pagination } from "../../../../components/datatable/Pagination";

interface AddMetricToCIProps {
    show: boolean;
    setShow: (show: boolean) => void;
    ci: CIRecord | null;
    idFamiliaClase?: number;
    onSelectMetric?: (metric: any) => void;
}

export const AddMetricToCI: React.FC<AddMetricToCIProps> = ({ show, setShow, ci, idFamiliaClase, onSelectMetric }) => {
    const { catalogHook } = useMonitoringPoliciesContext();
    const lastLoadedRef = useRef<number | null>(null);
    const [searchParam, setSearchParam] = useState("");

    useEffect(() => {
        if (ci && show && idFamiliaClase !== undefined && lastLoadedRef.current !== idFamiliaClase) {
            catalogHook.getMetricsByFamilyClase?.(idFamiliaClase);
            lastLoadedRef.current = idFamiliaClase;
        }
        
        if (!show) {
            lastLoadedRef.current = null;
            setSearchParam("");
        }
    }, [ci, show, idFamiliaClase, catalogHook]);

    const assignedMetrics = useMemo(() => {
        if (!ci || !ci.changes) return new Set<number>();
        
        const metricIds = new Set<number>();
        Object.values(ci.changes).forEach(changeArray => {
            changeArray.forEach(change => {
                if (change.ID_METRICA) {
                    metricIds.add(change.ID_METRICA);
                }
            });
        });
        return metricIds;
    }, [ci]);

    // Filtrar métricas por búsqueda
    const filteredMetrics = useMemo(() => {
        if (!catalogHook.familyClaseMetrics) return [];
        
        return catalogHook.familyClaseMetrics.filter(metric => 
            metric.NOMBRE?.toLowerCase().includes(searchParam.toLowerCase()) ||
            metric.DETALLE?.toLowerCase().includes(searchParam.toLowerCase())
        );
    }, [catalogHook.familyClaseMetrics, searchParam]);

    // Paginación
    const {
        currentPage,
        itemsPerPage,
        currentItems: paginatedMetrics,
        totalPages,
        totalItems,
        setCurrentPage,
        setItemsPerPage,
    } = usePagination({
        data: filteredMetrics,
        initialPage: 1,
        initialItemsPerPage: 5,
    });

    if (!show || !ci) return null

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content rounded">
                    <div className="modal-header pb-0 border-0 justify-content-end">
                        <div
                            className='btn btn-icon btn-sm btn-active-light-primary ms-2'
                            onClick={() => setShow(false)}
                        >
                            <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-2' />
                        </div>
                    </div>
                    <div className="modal-body scroll-y px-10 px-lg-15 pt-0 pb-15">
                        <div className="text-center mb-5">
                            <h3 className="mb-3">Añadir Métrica a {ci.NOMBRE_CI}</h3>
                        </div>
                        
                        {/* Barra de búsqueda */}
                        <div className="row mb-4">
                            <div className="col-md-8">
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <KTSVG path='/media/icons/duotune/general/gen021.svg' className='svg-icon-2' />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Buscar métricas por nombre o detalle..."
                                        value={searchParam}
                                        onChange={(e) => setSearchParam(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tabla de métricas */}
                        <div className="table-responsive mb-4">
                            <table className="table table-hover align-middle gs-2">
                                <thead>
                                    <tr className="fw-bold text-muted bg-light">
                                        <th className="ps-4 rounded-start">Nombre</th>
                                        <th>Detalle</th>
                                        <th className="text-center rounded-end">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedMetrics.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="text-muted text-center py-5">
                                                {!catalogHook.familyClaseMetrics ? 
                                                    "Cargando métricas..." :
                                                    filteredMetrics.length === 0 && searchParam ? 
                                                        "No se encontraron métricas con ese criterio de búsqueda." :
                                                        "No hay métricas disponibles para esta familia/clase."
                                                }
                                            </td>
                                        </tr>
                                    )}
                                    {paginatedMetrics.map(metric => {
                                        const isAssigned = assignedMetrics.has(metric.ID_METRICA);
                                        
                                        return (
                                            <tr 
                                                key={metric.ID_METRICA}
                                                style={isAssigned ? { 
                                                    backgroundColor: '#e6f4ff'
                                                } : {}}
                                            >
                                                <td className="ps-4">
                                                    <div className="fw-bold text-gray-800">
                                                        {metric.NOMBRE || 'Sin nombre'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="text-muted">
                                                        {metric.DETALLE || 'Sin detalle'}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <button
                                                        className="btn btn-sm btn-primary btn-icon"
                                                        onClick={() => {
                                                            if (onSelectMetric) {
                                                                onSelectMetric(metric);
                                                            }
                                                        }}
                                                        title={isAssigned ? "Métrica ya asignada" : "Añadir Métrica"}
                                                        disabled={isAssigned}
                                                    >
                                                        <KTSVG path='/media/icons/duotune/arrows/arr064.svg' className='svg-icon-3' />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        {filteredMetrics.length > 0 && (
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
                </div>
            </div>
        </div>
    );
};
