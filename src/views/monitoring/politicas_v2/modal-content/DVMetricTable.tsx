import { useState, useMemo } from "react";
import { Pagination } from "../../../../components/datatable/Pagination";
import { findNormalParameters, findUrgent } from "../utils";
import { MetricVersion } from "../Types";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { usePagination } from "../../../../hooks/usePagination";
import { useExport } from "../hooks/useExport";

export const MetricTable = ({ 
    metricsInformation,
    idPolicy,
    isCurrentVersion = false
}: { metricsInformation: MetricVersion[],
    idPolicy: number,
    isCurrentVersion?: boolean
}) => {
    const [filters, setFilters] = useState({
        familyFilter: '',
        classFilter: '',
        ciNameFilter: '',
        ipFilter: '',
        metricFilter: '',
        toolFilter: '',
        paramValue: ''
    })

    const [showExportConfirmModal, setShowExportConfirmModal] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const { exportPolicyMassive, loading } = useExport()

    // Obtener valores únicos para los selects
    const uniqueFamilies = useMemo(() => [...new Set(metricsInformation.map(item => item.FAMILIA))], [metricsInformation])
    const uniqueClasses = useMemo(
    () => [
        ...new Set(
        metricsInformation
            .filter(item => item.FAMILIA && item.FAMILIA.includes(filters.familyFilter))
            .map(item => item.CLASE)
        )
    ],
    [metricsInformation, filters.familyFilter]
    )
    const uniqueTools = useMemo(() => [...new Set(metricsInformation.map(item => item.HERRAMIENTA))], [metricsInformation])

    // Filtrar los datos
    const filteredData = useMemo(() => {
        return metricsInformation.filter(item => {
            return (
                (filters.familyFilter === '' || item.FAMILIA === filters.familyFilter) &&
                (filters.classFilter === '' || item.CLASE.includes(filters.classFilter)) &&
                (filters.ciNameFilter === '' || item.NOMBRE_CI.toLowerCase().includes(filters.ciNameFilter.toLowerCase())) &&
                (filters.ipFilter === '' || item.NRO_IP?.includes(filters.ipFilter)) &&
                (filters.metricFilter === '' || item.NOMBRE?.toLowerCase().includes(filters.metricFilter.toLowerCase())) &&
                (filters.toolFilter === '' || item.HERRAMIENTA === filters.toolFilter) &&
                (filters.paramValue === '' || findNormalParameters(item.VALORES_PARAMETROS).some(
                    p => p.PARAMETRO_VALOR?.toLowerCase().includes(filters.paramValue.toLowerCase()))
                )
            );
        });
    }, [filters, metricsInformation])

    const {
        currentPage,
        itemsPerPage,
        currentItems,
        totalPages,
        totalItems,
        setCurrentPage,
        setItemsPerPage,
    } = usePagination({
        data: filteredData,
        initialPage: 1,
        initialItemsPerPage: 10,
    })

    return (
        <div className="card">
            {/* Filters */}
            <div className="card-header border-0 pt-0 pb-6 d-flex justify-content-end">

                <div className="d-flex flex-wrap align-items-center gap-2">
                    {/* Filter by Family */}
                    <div className="w-200px">
                        <select
                            className="form-select form-select-sm"
                            value={filters.familyFilter}
                            onChange={(e) => setFilters(prev => ({ ...prev, familyFilter: e.target.value, classFilter: '' }))}
                        >
                            <option value="">Todas las familias</option>
                            {uniqueFamilies.map(family => (
                                <option key={family} value={family}>{family}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filter por Class */}
                    <div className="w-200px">
                        <select
                            className="form-select form-select-sm"
                            value={filters.classFilter}
                            onChange={(e) => setFilters(prev => ({ ...prev, classFilter: e.target.value }))}
                        >
                            <option value="">Todas las clases</option>
                            {uniqueClasses.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filter by Tool */}
                    <div className="w-200px">
                        <select
                            className="form-select form-select-sm"
                            value={filters.toolFilter}
                            onChange={(e) => setFilters(prev => ({ ...prev, toolFilter: e.target.value }))}
                        >
                            <option value="">Todas las herramientas</option>
                            {uniqueTools.map(tool => (
                                <option key={tool} value={tool ?? ''}>{tool}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filter by CI Name */}
                    <div className="w-200px">
                        <div className="input-group input-group-sm">
                            <span className="input-group-text" id="basic-addon1">
                                <i className="bi bi-server"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre CI"
                                value={filters.ciNameFilter}
                                onChange={(e) => setFilters(prev => ({ ...prev, ciNameFilter: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* Filter by IP */}
                    <div className="w-150px">
                        <div className="input-group input-group-sm">
                            <span className="input-group-text" id="basic-addon1">
                                <i className="bi bi-hdd-network"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Dirección IP"
                                value={filters.ipFilter}
                                onChange={(e) => setFilters(prev => ({ ...prev, ipFilter: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* Filter by Metric */}
                    <div className="w-200px">
                        <div className="input-group input-group-sm">
                            <span className="input-group-text" id="basic-addon1">
                                <i className="bi bi-speedometer2"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre métrica"
                                value={filters.metricFilter}
                                onChange={(e) => setFilters(prev => ({ ...prev, metricFilter: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* Filter by Metric Param */}
                    <div className="w-200px">
                        <div className="input-group input-group-sm">
                            <span className="input-group-text" id="basic-addon1">
                                <i className="bi bi-speedometer2"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Valor parámetro"
                                value={filters.paramValue}
                                onChange={(e) => setFilters(prev => ({ ...prev, paramValue: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* Button to clean filters */}
                    <button
                        className="btn btn-sm btn-light-primary"
                        onClick={() => {
                            setFilters({
                                familyFilter: '',
                                classFilter: '',
                                ciNameFilter: '',
                                ipFilter: '',
                                metricFilter: '',
                                toolFilter: '',
                                paramValue: ''
                            })
                        }}
                    >
                        <i className="bi bi-arrow-counterclockwise me-2"></i>
                        Limpiar
                    </button>
                    {/* Exportar solo si es la version actual de politica*/}
                    {isCurrentVersion && (
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                className="btn btn-sm btn-light-success"
                                onClick={() => setShowExportConfirmModal(true)}
                                disabled={filteredData.length === 0}>
                                <i className="bi bi-download me-2"></i>
                                Exportar ({filteredData.length})
                            </button>
                        </div>
                    )}
                </div>

            </div>
            {/* Metrics Table */}
            <div className="card-body pt-1 table-responsive">
                <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                    <thead>
                        <tr className="fw-bold text-muted fs-6">
                            <th className="w-auto">CI / Equipo</th>
                            <th className="w-auto">Familia/Clase</th>
                            <th className="w-auto">Métrica</th>
                            <th className="w-auto">Parametros</th>
                            <th className="w-450px">Umbrales</th>
                            <th className="w-auto">Frecuencia</th>
                            <th className="w-auto text-end">Última modificación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(item => {

                            const informative = findUrgent(item.VALORES_PARAMETROS, 'INFORMATIVO')
                            const warning = findUrgent(item.VALORES_PARAMETROS, 'WARNING')
                            const critical = findUrgent(item.VALORES_PARAMETROS, 'CRITICAL')
                            const fatal = findUrgent(item.VALORES_PARAMETROS, 'FATAL')

                            return (
                                <tr key={item.ID_DETALLE_POLITICA}>
                                    <td>
                                        <div className="d-flex flex-column">
                                            <span className="text-gray-800 fw-bold">{item.NOMBRE_CI}</span>
                                            <span className="text-muted fs-7">{item.NRO_IP}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex flex-column">
                                            <span className="text-gray-800">{item.FAMILIA}</span>
                                            <span className="text-muted fs-7">{item.CLASE}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex flex-column">
                                            <span className="text-gray-800 fw-bold">{item.NOMBRE}</span>
                                            <span className="text-muted fs-8">{item.DETALLE}</span>
                                            <span className="badge badge-light-primary fs-8 mt-1 w-100px">
                                                {item.HERRAMIENTA}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex flex-column flex-wrap">
                                            {findNormalParameters(item.VALORES_PARAMETROS).length > 0 ? (
                                                findNormalParameters(item.VALORES_PARAMETROS).map((param, i) => (
                                                    <div key={i} className="mb-1">
                                                        <span className="text-gray-600 fs-8 fw-semibold">{param.URGENCIA}: </span>
                                                        <span className="text-gray-800 fs-8">{param.PARAMETRO_VALOR || "-"}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-muted fs-8">Sin parámetros</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-0">
                                        <div className="d-flex justify-content-start">
                                            <table className="table table-borderless align-middle mb-0">
                                                <thead>
                                                    <tr className="w-auto">
                                                        <th className="py-1 text-center w-100px">
                                                            <span className="badge badge-light-warning fs-7 fw-bold">WARNING</span>
                                                        </th>
                                                        <th className="py-1 text-center">
                                                            <span className="badge badge-light-danger fs-7 fw-bold">CRITICAL</span>
                                                        </th>
                                                        <th className="py-1 text-center">
                                                            <span className="badge badge-light-dark fs-7 fw-bold">FATAL</span>
                                                        </th>
                                                        {informative && (
                                                            <th className="py-1 text-center w-100px">
                                                                <span className="badge badge-light-primary fs-7 fw-bold">INFORMATIVO</span>
                                                            </th>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="border-bottom border-gray-200">
                                                        <td className="py-1 text-center">
                                                            <span className="text-gray-800 fs-7 fw-semibold">
                                                                {warning?.UMBRAL || "-"}
                                                            </span>
                                                        </td>
                                                        <td className="py-1 text-center">
                                                            <span className="text-gray-800 fs-7 fw-semibold">
                                                                {critical?.UMBRAL || "-"}
                                                            </span>
                                                        </td>
                                                        <td className="py-1 text-center">
                                                            <span className="text-gray-800 fs-7 fw-semibold">
                                                                {fatal?.UMBRAL || "-"}
                                                            </span>
                                                        </td>
                                                        {informative && (
                                                            <td className="py-1 text-center">
                                                                <span className="text-gray-800 fs-7 fw-semibold">
                                                                    {informative?.UMBRAL || "-"}
                                                                </span>
                                                            </td>
                                                        )}
                                                    </tr>
                                                    <tr>
                                                        <td className="py-1 text-center">
                                                            <span className="text-muted fs-8">
                                                                {`Pool: ${warning?.NRO_POOLEOS || "-"}`}
                                                            </span>
                                                        </td>
                                                        <td className="py-1 text-center">
                                                            <span className="text-muted fs-8">
                                                                {`Pool: ${critical?.NRO_POOLEOS || "-"}`}
                                                            </span>
                                                        </td>
                                                        <td className="py-1 text-center">
                                                            <span className="text-muted fs-8">
                                                                {`Pool: ${fatal?.NRO_POOLEOS || "-"}`}
                                                            </span>
                                                        </td>
                                                        {informative && (
                                                            <td className="py-1 text-center">
                                                                <span className="text-muted fs-8">
                                                                    {`Pool: ${informative?.NRO_POOLEOS || "-"}`}
                                                                </span>
                                                            </td>
                                                        )}
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <span className="badge badge-light-info">
                                            {item.FRECUENCIA} min
                                        </span>
                                    </td>
                                    <td className="text-end">
                                        <div className="d-flex flex-column">
                                            <span className="text-gray-800 fs-7">
                                                {item.FECHA_MODIFICACION || item.FECHA_CREACION || 'Sin registro.'}
                                            </span>
                                            <span className="text-muted fs-8">
                                                {item.USUARIO_MODIFICACION || item.USUARIO_CREACION || 'Sin registro.'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <Pagination
                totalItems={totalItems}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
            />

            {/* Modal de Confirmación de Exportación */}
            {showExportConfirmModal && (
                <div 
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
                    style={{ 
                        zIndex: 9999, 
                        backgroundColor: 'rgba(0,0,0,0.7)' 
                    }}
                    onClick={() => !isExporting && setShowExportConfirmModal(false)}
                >
                    <div 
                        className="bg-white rounded shadow-lg" 
                        style={{ width: '600px', maxHeight: '80vh', overflow: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header py-4 bg-dark">
                            <h2 className="text-light fs-2">Confirmar Exportación</h2>
                            {!isExporting && (
                                <div 
                                    className="btn btn-sm btn-icon btn-active-color-primary text-white" 
                                    onClick={() => setShowExportConfirmModal(false)}
                                >
                                    <KTSVG className="svg-icon-1" path="/media/icons/duotune/arrows/arr061.svg" />
                                </div>
                            )}
                        </div>
                        
                        <div className="modal-body p-10">
                            <div className="mb-7">
                                <div className="text-center mb-5">
                                    <i className="bi bi-file-earmark-excel text-success" style={{ fontSize: '3rem' }}></i>
                                </div>
                                
                                <div className="mb-5">
                                    <p className="text-gray-800 fs-5 fw-semibold text-center mb-4">
                                        ¿Deseas exportar <strong className="text-primary">{filteredData.length} métricas</strong> seleccionadas?
                                    </p>
                                    
                                    <div className="bg-light rounded p-4 mb-4">
                                        <div className="row g-3">
                                            <div className="col-6">
                                                <span className="text-muted fs-7">Total métricas:</span>
                                                <div className="fw-bold text-primary fs-4">{filteredData.length}</div>
                                            </div>
                                            <div className="col-6">
                                                <span className="text-muted fs-7">CIs únicos:</span>
                                                <div className="fw-bold text-success fs-4">
                                                    {[...new Set(filteredData.map(item => item.NOMBRE_CI))].length}
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <span className="text-muted fs-7">Herramientas:</span>
                                                <div className="fw-bold text-info fs-4">
                                                    {[...new Set(filteredData.map(item => item.HERRAMIENTA))].length}
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <span className="text-muted fs-7">Familias:</span>
                                                <div className="fw-bold text-warning fs-4">
                                                    {[...new Set(filteredData.map(item => item.FAMILIA))].length}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {Object.entries(filters).some(([_, value]) => value !== '') && (
                                        <div className="bg-light-primary rounded p-4 mb-4">
                                            <h6 className="fw-bold text-primary mb-3">Filtros aplicados:</h6>
                                            <div className="d-flex flex-wrap gap-2">
                                                {Object.entries(filters)
                                                    .filter(([_, value]) => value !== '')
                                                    .map(([key, value]) => (
                                                        <span key={key} className="badge badge-light-primary fs-7">
                                                            {key.replace('Filter', '')}: {value}
                                                        </span>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="form-text text-center">
                                        El archivo se generará en formato Excel (.xlsx)
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-center mb-5">
                                {isExporting ? (
                                    <div className="d-flex flex-column align-items-center gap-3">
                                        <div className="spinner-border text-primary" role="status"></div>
                                        <span className="text-muted">Generando archivo de exportación...</span>
                                    </div>
                                ) : (
                                    <div className="d-flex gap-3 justify-content-center">
                                        <button 
                                            className="btn btn-danger"
                                            onClick={() => setShowExportConfirmModal(false)}
                                        >
                                            <i className="bi bi-x-circle me-2"></i>
                                            Cancelar
                                        </button>
                                        <button 
                                            className="btn btn-primary"
                                            disabled={isExporting || loading}
                                            onClick={async () => {
                                                setIsExporting(true)
                                                const metricas = [
                                                ...new Map(filteredData.map(item => [item.ID_DETALLE_POLITICA, { id_detalle_politica: item.ID_DETALLE_POLITICA }])).values()
                                                ]
                                                await exportPolicyMassive(idPolicy, metricas)
                                                setShowExportConfirmModal(false)
                                                setIsExporting(false)
                                            }}
                                        >
                                            <i className="bi bi-download me-2"></i>
                                            Confirmar Exportación
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}