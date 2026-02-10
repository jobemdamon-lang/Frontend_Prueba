import { FC, useMemo, useState } from "react";
import { Pagination } from "../../../../../components/datatable/Pagination"
import { usePagination } from "../../../../../hooks/usePagination"
import { useMonitoringPoliciesContext } from "../../Context";
import { ModalViewForMonitoringPolicies } from "../../Types";
import { ModalSize } from "../../../../../hooks/Types";
import { findNormalParameters, findUrgent } from "../../utils";
import { TableSkeleton } from "../../../../../components/datatable/TableSkeleton";
import { ViewProps } from "./UpdateMain";

export const MetricsTableView: FC<ViewProps> = ({ updates, setUpdates, setActiveView }) => {

    const { modalHook, versionHook } = useMonitoringPoliciesContext()
    const [filters, setFilters] = useState({
        familyFilter: '',
        classFilter: '',
        ciNameFilter: '',
        ipFilter: '',
        metricFilter: '',
        toolFilter: '',
        paramValue: ''
    })

    // Obtener valores únicos para los selects
    const uniqueFamilies = useMemo(() => [...new Set(versionHook.metricsVersion.map(item => item.FAMILIA))], [versionHook.metricsVersion])
    const uniqueClasses = useMemo(() => [...new Set((versionHook.metricsVersion || []).filter(item => item.FAMILIA?.includes(filters.familyFilter) ?? false).map(item => item.CLASE))], [versionHook.metricsVersion, filters.familyFilter])
    const uniqueTools = useMemo(() => [...new Set(versionHook.metricsVersion.map(item => item.HERRAMIENTA))], [versionHook.metricsVersion])

    // Filtrar los datos
    const filteredData = useMemo(() => {
        return versionHook.metricsVersion.filter(item => {
            return (
                (filters.familyFilter === '' || item.FAMILIA === filters.familyFilter) &&
                (filters.classFilter === '' || item.CLASE.includes(filters.classFilter)) &&
                (filters.ciNameFilter === '' || item.NOMBRE_CI.toLowerCase().includes(filters.ciNameFilter.toLowerCase())) &&
                (filters.ipFilter === '' || item.NRO_IP?.includes(filters.ipFilter)) &&
                (filters.metricFilter === '' || item.NOMBRE.toLowerCase().includes(filters.metricFilter.toLowerCase())) &&
                (filters.toolFilter === '' || item.HERRAMIENTA === filters.toolFilter) &&
                (filters.paramValue === '' || findNormalParameters(item.VALORES_PARAMETROS).some(
                    p => p.PARAMETRO_VALOR?.toLowerCase().includes(filters.paramValue.toLowerCase()))
                )
            );
        });
    }, [versionHook.metricsVersion, filters]);

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
        <>
            {/* Filters */}
            <div className="border-0 pt-0 pb-6 d-flex justify-content-end">

                <div className="d-flex flex-wrap align-items-center gap-2">
                    {/* Filter by Family */}
                    <div className="w-200px">
                        <select
                            className="form-select form-select-sm"
                            value={filters.familyFilter}
                            onChange={(e) => setFilters(prev => ({ ...prev, familyFilter: e.target.value, classFilter: '' }))}
                        >
                            <option value="">Todas las familias</option>
                            {uniqueFamilies.map((family, i) => (
                                <option key={i} value={family}>{family}</option>
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
                            {uniqueClasses.map((cls, i) => (
                                <option key={i} value={cls}>{cls}</option>
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
                            {uniqueTools.map((tool, i) => (
                                <option key={i} value={tool ?? ''}>{tool}</option>
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
                </div>

            </div>
            {/* Metrics Table */}
            <div className="table-responsive mx-2">
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
                            <th className="w-auto text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {versionHook.metricsVersionLoading ? (

                            <TableSkeleton size={10} columns={8} />
                        ) :
                            currentItems.map((item) => {

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
                                                <span className="text-muted fs-7">{item.DETALLE}</span>
                                                <span className="badge badge-light-primary fs-8 mt-1 w-100px">
                                                    {item.HERRAMIENTA}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column">
                                                {findNormalParameters(item.VALORES_PARAMETROS).length > 0 ? (
                                                    findNormalParameters(item.VALORES_PARAMETROS).map(param => (
                                                        <div key={param.ID_DETALLE_METRICA_VALOR} className="mb-1">
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
                                                                <th className="py-1 text-center">
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
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button
                                                    className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                                                    onClick={() => modalHook.openModal(
                                                        ModalViewForMonitoringPolicies.UPDATE_METRIC,
                                                        ModalSize.LG,
                                                        undefined,
                                                        { metric: item, setUpdates: setUpdates, setActiveView: setActiveView }
                                                    )}
                                                >
                                                    <i className="bi bi-pencil fs-3"></i>
                                                </button>

                                                <button
                                                    className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                                                    onClick={() => modalHook.openModal(
                                                        ModalViewForMonitoringPolicies.DELETE_METRIC,
                                                        ModalSize.SM,
                                                        undefined,
                                                        { metric: item, setUpdates: setUpdates, setActiveView: setActiveView }
                                                    )}
                                                >
                                                    <i className="bi bi-trash3 fs-3"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )

                            })
                        }
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
            />
        </>
    )
}