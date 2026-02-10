import { FC, useMemo, useState } from "react";
import { Pagination } from "../../../../../components/datatable/Pagination"
import { usePagination } from "../../../../../hooks/usePagination"
import { useMonitoringPoliciesContext } from "../../Context";
import { findNormalParameters, findUrgent, getBadgeColorTypeChange, getTypeChangeLabel, isValidTicket } from "../../utils";
import { ViewProps } from "./UpdateMain";
import { MetricVersionFront, UpdatedMetric, UpdatedParam, UpdatedVersion } from "../../Types";
import { useTypedSelector } from "../../../../../store/ConfigStore";
import { Loader } from "../../../../../components/Loading";
import { warningNotification } from "../../../../../helpers/notifications";

interface CIRecord {
    ID_EQUIPO: number;
    NOMBRE_CI: string;
    NRO_IP: string;
    changes: {
        [key: string]: MetricVersionFront[];
    };
    totalChanges: number;
}

export const ResumeView: FC<ViewProps> = ({ updates, setUpdates }) => {

    const { globalParams, changesHook, setCurrentView } = useMonitoringPoliciesContext()
    const [expandedCIs, setExpandedCIs] = useState<number[]>([])
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const [motivo, setMotivo] = useState("")
    const [ticket, setTicket] = useState("")
    const [filters, setFilters] = useState({
        familyFilter: '',
        classFilter: '',
        ciNameFilter: '',
        ipFilter: '',
        metricFilter: '',
        toolFilter: '',
    })

    // Obtener valores únicos para los selects
    const uniqueFamilies = useMemo(() => [...new Set(updates.map(item => item.FAMILIA))], [updates])
    const uniqueClasses = useMemo(() => [...new Set(updates.filter(item => item.FAMILIA.includes(filters.familyFilter)).map(item => item.CLASE))], [updates, filters.familyFilter])
    const uniqueTools = useMemo(() => [...new Set(updates.map(item => item.HERRAMIENTA))], [updates])

    // Agrupar cambios por CI y versión
    const ciRecords = useMemo<CIRecord[]>(() => {
        const ciMap: { [key: string]: CIRecord } = {}; // key: ID_EQUIPO-NRO_VERSION

        updates.forEach(item => {
            const key = `${item.ID_EQUIPO}`;

            if (!ciMap[key]) {
                ciMap[key] = {
                    ID_EQUIPO: item.ID_EQUIPO,
                    NOMBRE_CI: item.NOMBRE_CI,
                    NRO_IP: item.NRO_IP || '',
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

        return Object.values(ciMap);
    }, [updates])

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
    }, [ciRecords, filters]);

    const toggleCI = (ciId: number) => {
        setExpandedCIs(prev =>
            prev.includes(ciId)
                ? prev.filter(id => id !== ciId)
                : [...prev, ciId]
        );
    };

    const handleDeleteChange = (IDFront: string) => {
        const filteredUpdates = updates.filter(item => item.ID_FRONT !== IDFront)
        setUpdates(filteredUpdates)
    }

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

    // Función para preparar los datos para el endpoint
    const prepareDataForEndpoint = (): UpdatedVersion => {
        const cambios: UpdatedMetric[] = updates.map(item => {
            const parametros: UpdatedParam[] = item.VALORES_PARAMETROS.map(param => ({
                id_cambio_metrica_valor: param.ID_DETALLE_METRICA_VALOR,
                nro_pooleos: parseInt(param.NRO_POOLEOS || '0') || 0,
                parametro_valor: param.PARAMETRO_VALOR || '',
                umbral: param.UMBRAL || '',
                estado: param.ESTADO.toString(),
                id_metrica_parametro: param.ID_METRICA_PARAMETRO
            }));

            return {
                tipo_cambio: item.TIPO_CAMBIO,
                id_cambio_detalle: 0, // Debe ser asignado por el backend
                id_detalle_politica: item.ID_DETALLE_POLITICA,
                id_equipo: item.ID_EQUIPO,
                id_metrica: item.ID_METRICA,
                id_herramienta: item.ID_HERRAMIENTA,
                id_equipo_ip: item.ID_EQUIPO_IP,
                id_tipoequipo: item.ID_TIPO_EQUIPO,
                frecuencia: parseInt(item.FRECUENCIA) || 0,
                estado: item.ESTADO,
                lista_parametros: parametros
            };
        });

        return {
            motivo: motivo,
            id_politica: globalParams.policyID,
            id_version: globalParams.versionID,
            nro_ticket: ticket,
            usuario: userName,
            lista_cambio_politica: cambios
        }
    }

    const handleSubmitChanges = () => {
        if (!isValidTicket(ticket)) {
            warningNotification("El ticket debe seguir el formato '100-12345' o '200-67890'.")
            return;
        }
        const dataToSend = prepareDataForEndpoint()
        changesHook.registerChange(dataToSend).then(success => {
            if (success) {
                //policyHook.getVersionsByProject(globalParams.projectID)
                setCurrentView('policies')
                changesHook.getListChanges(globalParams.projectID)
            }
        })
    }

    return (
        <>
            {/* Campos para motivo y ticket */}
            <div className="row mb-10">
                <div className="col-md-6">
                    <label className="form-label fw-bold">Motivo del Cambio</label>
                    <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Describa el motivo del cambio"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                    ></textarea>
                    <div className="text-muted fs-7 mt-1">Este campo es obligatorio</div>
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-bold">Ticket de Origen</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Número de ticket"
                        value={ticket}
                        onChange={(e) => setTicket(e.target.value)}
                    />
                    <div className="text-muted fs-7 mt-1">Referencia del ticket que originó el cambio</div>
                </div>
            </div>
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
                                toolFilter: ''
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
                <div className="accordion" id="historicAccordion">
                    <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                        <thead>
                            <tr className="fw-bold text-muted fs-6">
                                <th className="w-auto">CI / Equipo</th>
                                <th className="mw-150px">Tipos de Cambio</th>
                                <th className="mx-100px">Total cambios</th>
                                <th className="w-auto text-end">Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                currentItems.map((record) => {
                                    const isCIExpanded = expandedCIs.includes(record.ID_EQUIPO);

                                    return (
                                        <>
                                            <tr key={`${record.ID_EQUIPO}`}>

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
                                                        <div className="p-4 bg-white" style={{ marginLeft: '90px' }}>
                                                            <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                                                                <thead>
                                                                    <tr className="fw-bold text-muted fs-6">
                                                                        <th className="w-auto">Tipo Cambio</th>
                                                                        <th className="w-auto">Métrica</th>
                                                                        <th className="w-auto">Parametros</th>
                                                                        <th className="w-450px">Umbrales</th>
                                                                        <th className="w-auto text-end">Frecuencia</th>
                                                                        <th className="w-auto text-end">Eliminar</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {Object.entries(record.changes).flatMap(([tipo, cambios]) =>
                                                                        cambios.map((item, index) => {

                                                                            const informative = findUrgent(item.VALORES_PARAMETROS, 'INFORMATIVO');
                                                                            const warning = findUrgent(item.VALORES_PARAMETROS, 'WARNING');
                                                                            const critical = findUrgent(item.VALORES_PARAMETROS, 'CRITICAL');
                                                                            const fatal = findUrgent(item.VALORES_PARAMETROS, 'FATAL');

                                                                            return (
                                                                                <tr key={item.ID_DETALLE_POLITICA}>
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
                                                                                        <button
                                                                                            className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                                                                                            onClick={() => handleDeleteChange(item.ID_FRONT)}
                                                                                        >
                                                                                            <i className="bi bi-trash3 fs-3"></i>
                                                                                        </button>
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
            {/* Botón para enviar cambios */}
            <div className="d-flex justify-content-end mt-10">
                <button
                    className="btn btn-primary"
                    onClick={handleSubmitChanges}
                    disabled={motivo.trim() === "" || changesHook.registerChangeLoading}
                >
                    {changesHook.registerChangeLoading ? (
                        <>
                            <Loader className="spinner-border-sm me-2" />
                            Enviando
                        </>
                    ) : (
                        <>
                            <i className="bi bi-send-check-fill me-2"></i>
                            Enviar Cambios
                        </>
                    )}

                </button>
            </div>
        </>
    )
}