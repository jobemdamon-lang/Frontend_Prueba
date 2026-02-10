import { FC, useState, useMemo } from "react";
import { Pagination } from "../../../../components/datatable/Pagination";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { usePagination } from "../../../../hooks/usePagination";
import { MetricChange } from "../Types";
import { findNormalParametersChange, findUrgentChange, getBadgeColorTypeChange, getTypeChangeLabel } from "../utils";
import { TableSkeleton } from "../../../../components/datatable/TableSkeleton";

interface ChangesTableProps {
    metrics: MetricChange[];
    loading: boolean;
}

interface CIRecord {
    ID_EQUIPO: number;
    NOMBRE_CI: string;
    NRO_IP: string;
    NRO_VERSION: number;
    TICKET_CAMBIO: string;
    TICKET_IMPLEMENTADOR: string;
    SOLICITANTE: string;
    USUARIO_IMPLEMENTADOR: string;
    FECHA_CAMBIO: string;
    FECHA_IMPLEMENTACION: string;
    changes: {
        [key: string]: MetricChange[];
    };
    totalChanges: number;
}

export const ChangesTable: FC<ChangesTableProps> = ({ loading, metrics }) => {
    const [filters, setFilters] = useState({
        familyFilter: '',
        classFilter: '',
        ciNameFilter: '',
        ipFilter: '',
        metricFilter: '',
        toolFilter: '',
    })

    const [expandedCIs, setExpandedCIs] = useState<number[]>([])

    // Agrupar cambios por CI y versión
    const ciRecords = useMemo<CIRecord[]>(() => {
        const ciMap: { [key: string]: CIRecord } = {}; // key: ID_EQUIPO-NRO_VERSION

        metrics.forEach(item => {
            const key = `${item.ID_EQUIPO}-${item.NRO_VERSION}`;

            if (!ciMap[key]) {
                ciMap[key] = {
                    ID_EQUIPO: item.ID_EQUIPO,
                    NOMBRE_CI: item.NOMBRE_CI,
                    NRO_IP: item.NRO_IP || '',
                    NRO_VERSION: item?.NRO_VERSION || 0,
                    TICKET_CAMBIO: item.NRO_TICKET || '',
                    TICKET_IMPLEMENTADOR: item.NRO_TICKET_IMPLEMENTACION || '',
                    SOLICITANTE: item.SOLICITANTE || '',
                    USUARIO_IMPLEMENTADOR: item.USUARIO_IMPLEMENTADOR || '',
                    FECHA_CAMBIO: item.FECHA_CAMBIO || '',
                    FECHA_IMPLEMENTACION: item.FECHA_IMPLEMENTACION || '',
                    changes: {},
                    totalChanges: 0
                };
            }

            if (!ciMap[key].changes[item.TIPO_CAMBIO]) {
                ciMap[key].changes[item.TIPO_CAMBIO] = [];
            }

            ciMap[key].changes[item.TIPO_CAMBIO].push(item);
            ciMap[key].totalChanges++;
        });

        return Object.values(ciMap).sort((a, b) => b.NRO_VERSION - a.NRO_VERSION || a.NOMBRE_CI.localeCompare(b.NOMBRE_CI));
    }, [metrics])

    // Filtrar registros de CI
    const filteredRecords = useMemo(() => {
        return ciRecords.filter(record => {
            return (
                (filters.ciNameFilter === '' || record.NOMBRE_CI.toLowerCase().includes(filters.ciNameFilter.toLowerCase())) &&
                (filters.ipFilter === '' || record.NRO_IP?.includes(filters.ipFilter)) &&
                Object.values(record.changes).some(changes =>
                    changes.some(item => (
                        (filters.familyFilter === '' || item.FAMILIA === filters.familyFilter) &&
                        (filters.classFilter === '' || item.CLASE.includes(filters.classFilter)) &&
                        (filters.metricFilter === '' || item.NOMBRE.toLowerCase().includes(filters.metricFilter.toLowerCase())) &&
                        (filters.toolFilter === '' || item.HERRAMIENTA === filters.toolFilter)
                    ))
                )
            );
        });
    }, [ciRecords, filters])

    const toggleCI = (ciId: number) => {
        setExpandedCIs(prev =>
            prev.includes(ciId)
                ? prev.filter(id => id !== ciId)
                : [...prev, ciId]
        )
    }

    // Obtener valores únicos para los selects
    const uniqueFamilies = useMemo(() => [...new Set(metrics.map(item => item.FAMILIA))], [metrics]);
    const uniqueClasses = useMemo(
        () => [
            ...new Set(
                metrics
                    .filter(item => item.FAMILIA && item.FAMILIA.includes(filters.familyFilter))
                    .map(item => item.CLASE)
            )
        ],
        [metrics, filters.familyFilter]
    )
    const uniqueTools = useMemo(() => [...new Set(metrics.map(item => item.HERRAMIENTA))], [metrics]);

    const {
        currentPage,
        itemsPerPage,
        currentItems,
        totalPages,
        totalItems,
        setCurrentPage,
        setItemsPerPage,
    } = usePagination({
        data: filteredRecords,
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
                            });
                            setExpandedCIs([]);
                        }}
                    >
                        <i className="bi bi-arrow-counterclockwise me-2"></i>
                        Limpiar
                    </button>
                </div>
            </div>

            {/* Records Table */}
            <div className="table-responsive mx-2">
                <div className="accordion" id="historicAccordion">
                    <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                        <thead>
                            <tr className="fw-bold text-muted fs-6">
                                <th className="w-auto">CI / Equipo</th>
                                <th className="mw-150px">Tipos de Cambio</th>
                                <th className="mx-100px">Total cambios</th>
                                <th className="w-auto">Ticket Origen</th>
                                <th className="w-auto">Ticket de Cambio</th>
                                <th className="w-auto text-end">Datos cambio</th>
                                <th className="w-auto text-end">Datos implementación</th>
                                <th className="w-auto text-end">Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <TableSkeleton size={10} columns={8} />
                            ) :
                                currentItems.map((record) => {
                                    const isCIExpanded = expandedCIs.includes(record.ID_EQUIPO);

                                    return (
                                        <>
                                            <tr key={`${record.ID_EQUIPO}-${record.NRO_VERSION}`}>
                                                <td>
                                                    <div className="d-flex flex-column">
                                                        <span className="text-gray-800 fw-bold fs-6">{record.NOMBRE_CI}</span>
                                                        <span className="text-muted fs-7">{record.NRO_IP}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2 mw-150px flex-wrap">
                                                        {Object.entries(record.changes).map(([tipo, cambios]) => (
                                                            <div key={tipo} className="d-flex align-items-center gap-1">
                                                                <span className={`badge ${getBadgeColorTypeChange(tipo)} fs-7`}>
                                                                    {getTypeChangeLabel(tipo)}
                                                                </span>
                                                                <span className="badge badge-light-primary fs-8">x{cambios.length}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge badge-light-primary fs-6 fw-bold">
                                                        {record.totalChanges}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center justify-content-start">
                                                        <KTSVG
                                                            path="/media/icons/duotune/communication/com009.svg"
                                                            className="svg-icon-1 me-2"
                                                        />
                                                        <span className="text-gray-800 fs-6">{record.TICKET_CAMBIO || 'Sin registro.'}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center justify-content-start">
                                                        <KTSVG
                                                            path="/media/icons/duotune/communication/com009.svg"
                                                            className="svg-icon-1 me-2"
                                                        />
                                                        <span className="text-gray-800 fs-6">{record.TICKET_IMPLEMENTADOR || 'Sin registro.'}</span>
                                                    </div>
                                                </td>
                                                <td className="text-end">
                                                    <div className="d-flex flex-column fw-normal">
                                                        <span className="text-gray-800 fs-6">
                                                            {record.FECHA_CAMBIO || 'Sin registro.'}
                                                        </span>
                                                        <span className="text-muted fs-7">
                                                            {record.SOLICITANTE || 'Sin registro.'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="text-end">
                                                    <div className="d-flex flex-column fw-normal">
                                                        <span className="text-gray-800 fs-6">
                                                            {record.FECHA_IMPLEMENTACION || 'Sin registro.'}
                                                        </span>
                                                        <span className="text-muted fs-7">
                                                            {record.USUARIO_IMPLEMENTADOR || 'Sin registro.'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="text-end">
                                                    <button
                                                        className="btn btn-sm btn-icon btn-light"
                                                        onClick={() => toggleCI(record.ID_EQUIPO)}
                                                    >
                                                        <i className={`bi bi-chevron-${isCIExpanded ? 'up' : 'down'}`}></i>
                                                    </button>
                                                </td>
                                            </tr>

                                            {/* Expanded CI Details */}
                                            {isCIExpanded && (
                                                <tr>
                                                    <td colSpan={10} className="p-0">
                                                        <div className="p-4 bg-white">
                                                            <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                                                                <thead>
                                                                    <tr className="fw-bold text-muted fs-6">
                                                                        <th className="w-auto">Tipo Cambio</th>
                                                                        <th className="w-auto">Métrica</th>
                                                                        <th className="w-auto">Parametros</th>
                                                                        <th className="w-450px">Umbrales</th>
                                                                        <th className="w-auto text-end">Frecuencia</th>
                                                                        <th className="w-auto text-end">Datos Cambio</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {Object.entries(record.changes).flatMap(([tipo, cambios]) =>
                                                                        cambios.map(item => {
                                                                            const informative = findUrgentChange(item.VALORES_PARAMETROS, 'INFORMATIVO');
                                                                            const warning = findUrgentChange(item.VALORES_PARAMETROS, 'WARNING');
                                                                            const critical = findUrgentChange(item.VALORES_PARAMETROS, 'CRITICAL');
                                                                            const fatal = findUrgentChange(item.VALORES_PARAMETROS, 'FATAL');

                                                                            return (
                                                                                <tr key={item.ID_CAMBIO_DETALLE}>
                                                                                    <td>
                                                                                        <span className={`badge ${getBadgeColorTypeChange(item.TIPO_CAMBIO)} fs-7`}>
                                                                                            {getTypeChangeLabel(item.TIPO_CAMBIO)}
                                                                                        </span>
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
                                                                                            {findNormalParametersChange(item.VALORES_PARAMETROS).length > 0 ? (
                                                                                                findNormalParametersChange(item.VALORES_PARAMETROS).map(param => (
                                                                                                    <div key={param.ID_CAMBIO_METRICA_VALOR} className="mb-1">
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
                                                                            );
                                                                        })
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
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