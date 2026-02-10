import { useEffect, useMemo, useState } from "react";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { useMonitoringPoliciesContext } from "../Context";
import { ChangeRequest, MetricChange, UpdatedVersion } from "../Types";
import { usePagination } from "../../../../hooks/usePagination";
import { TableSkeleton } from "../../../../components/datatable/TableSkeleton";
import { findUrgentChange, findNormalParametersChange, getTypeChangeLabel, getBadgeColorTypeChange } from "../utils";
import { Pagination } from "../../../../components/datatable/Pagination";
import { EditMetricChange } from "./EditMetricChange";
import { DeleteMetricChange } from "./DeleteMetricChange";
import { SelectCIModal } from "./SelectCI";
import { AddMetricToCI } from "./AddMetricInChange";
import { AddCIMetricsv2 } from "./AddCIMetricsv2";
import { AddMetricV2 } from "./AddMetricV2";

export interface CIRecord {
    ID_EQUIPO: number;
    NOMBRE_CI: string;
    NOMBRE: string;
    NRO_IP: string;
    NRO_VERSION: number;
    TICKET_CAMBIO: string;
    TICKET_IMPLEMENTADOR: string;
    SOLICITANTE: string;
    FECHA_CAMBIO: string;
    ID_FAMILIA_CLASE: number;
    FAMILIA: string;
    CLASE: string;
    changes: {
        [key: string]: MetricChange[];
    };
    totalChanges: number;
}

const DetailChange = () => {

    const { modalHook, changesHook, rol, versionHook } = useMonitoringPoliciesContext()
    const change: ChangeRequest = modalHook.modalInformation
    const [changeDetail, setChangeDetail] = useState<MetricChange[]>([])
    const [selectedMetric, setSelectedMetric] = useState<MetricChange | null>(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showSelectCIModal, setShowSelectCIModal] = useState(false)
    const [showAddMetricModal, setShowAddMetricModal] = useState(false)
    const [selectedCIForMetric, setSelectedCIForMetric] = useState<CIRecord | null>(null)
    const [idFamiliaClaseForMetric, setIdFamiliaClaseForMetric] = useState<number | undefined>(undefined)
    const [showAddCIMetricsv2, setShowAddCIMetricsv2] = useState(false);
    const [selectedCI, setSelectedCI] = useState<CIRecord | null>(null);
    const [showAddMetricV2, setShowAddMetricV2] = useState(false);
    const [selectedMetricForV2, setSelectedMetricForV2] = useState<any>(null); // Usa el tipo correcto
    const [selectedCIForV2, setSelectedCIForV2] = useState<CIRecord | null>(null);

    const availableCIs = useMemo<CIRecord[]>(() => {
        const existingEquipmentIds = new Set(changeDetail.map(item => item.ID_EQUIPO));
        
        const filtered = versionHook.cisInVersion
            .filter(ci => !existingEquipmentIds.has(ci.ID_EQUIPO))
            .map(ci => ({
                ID_EQUIPO: ci.ID_EQUIPO,
                NOMBRE_CI: ci.NOMBRE_CI,
                NOMBRE: ci.NOMBRE || '',
                FAMILIA: ci.FAMILIA || '',
                NRO_IP: ci.IP || '',
                NRO_VERSION: 0,
                CLASE: ci.CLASE || '',
                TICKET_CAMBIO: '',
                TICKET_IMPLEMENTADOR: '',
                SOLICITANTE: '',
                ID_FAMILIA_CLASE: ci.ID_FAMILIA_CLASE,
                FECHA_CAMBIO: '',
                changes: {},
                totalChanges: 0
            }));
        
        return filtered;
    }, [changeDetail, versionHook.cisInVersion]);

    useEffect(() => {
        handleRefresh()
        versionHook.getCIsInVersion(change.ID_POLITICA, parseInt(change.ID_VERSION), false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [change.ID_CAMBIO])

    const [filters, setFilters] = useState({
        familyFilter: '',
        classFilter: '',
        ciNameFilter: '',
        ipFilter: '',
        metricFilter: '',
        toolFilter: '',
        ticketFilter: '',
        paramValue: ''
    })

    const [expandedCIs, setExpandedCIs] = useState<number[]>([])

    // Agrupar cambios por CI y versión
    const ciRecords = useMemo<CIRecord[]>(() => {
        const ciMap: { [key: string]: CIRecord } = {}; // key: ID_EQUIPO-NRO_VERSION

        changeDetail.forEach(item => {
            const key = `${item.ID_EQUIPO}-${item.NRO_VERSION}`;

            if (!ciMap[key]) {
                ciMap[key] = {
                    ID_EQUIPO: item.ID_EQUIPO,
                    NOMBRE_CI: item.NOMBRE_CI,
                    NOMBRE: item.NOMBRE || '',
                    NRO_IP: item.NRO_IP || '',
                    FAMILIA: item.FAMILIA || '',
                    ID_FAMILIA_CLASE: item.ID_FAMILIA_CLASE,
                    CLASE: item.CLASE || '',
                    NRO_VERSION: item?.NRO_VERSION || 0,
                    TICKET_CAMBIO: item.NRO_TICKET || '',
                    TICKET_IMPLEMENTADOR: item.NRO_TICKET_IMPLEMENTACION || '',

                    // item.SOLICITANTE // Persona que creó el CAMBIO
                    SOLICITANTE: item.USUARIO_CREACION || '',

                    //item.FECHA_CAMBIO // Fecha en la que se creó el CAMBIO
                    FECHA_CAMBIO: item.FECHA_MODIFICACION || item.FECHA_CREACION || item.FECHA_CAMBIO || '',

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
    }, [changeDetail])

    // Filtrar registros de CI
    const filteredRecords = useMemo(() => {
        return ciRecords.filter(record => {
            return (
                (filters.ticketFilter === '' ||
                    record.TICKET_CAMBIO.toLowerCase().includes(filters.ticketFilter.toLowerCase()) ||
                    record.TICKET_IMPLEMENTADOR.toLowerCase().includes(filters.ticketFilter.toLowerCase())) &&
                (filters.ciNameFilter === '' || record.NOMBRE_CI.toLowerCase().includes(filters.ciNameFilter.toLowerCase())) &&
                (filters.ipFilter === '' || record.NRO_IP?.includes(filters.ipFilter)) &&
                Object.values(record.changes).some(changes =>
                    changes.some(item => (
                        (filters.familyFilter === '' || item.FAMILIA === filters.familyFilter) &&
                        (filters.classFilter === '' || item.CLASE.includes(filters.classFilter)) &&
                        (filters.metricFilter === '' || item.NOMBRE.toLowerCase().includes(filters.metricFilter.toLowerCase())) &&
                        (filters.toolFilter === '' || item.HERRAMIENTA === filters.toolFilter) &&
                        (filters.paramValue === '' || findNormalParametersChange(item.VALORES_PARAMETROS).some(
                            p => p.PARAMETRO_VALOR?.toLowerCase().includes(filters.paramValue.toLowerCase()))
                        )
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
    const uniqueFamilies = useMemo(() => [...new Set(changeDetail.map(item => item.FAMILIA))], [changeDetail]);
    const uniqueClasses = useMemo(() => [...new Set(changeDetail.filter(item => item.FAMILIA.includes(filters.familyFilter)).map(item => item.CLASE))], [changeDetail, filters.familyFilter]);
    const uniqueTools = useMemo(() => [...new Set(changeDetail.map(item => item.HERRAMIENTA))], [changeDetail]);

    const handleRefresh = () => {
        changesHook.getRequestChangeDetail(change.ID_CAMBIO).then(response => {
            if (response) setChangeDetail(response)
        })
    }

    useEffect(() => {
        handleRefresh()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [change.ID_CAMBIO])

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

    const handleDeleteMetric = async () => {
        if (!selectedMetric) return;
        const response = await changesHook.deleteMetricChange(selectedMetric.ID_CAMBIO_DETALLE, 0)
        if (response) {
            handleRefresh()
            setShowDeleteModal(false)
        }
    };

    const handleEditMetric = async (updatedVersion: UpdatedVersion) => {
        const response = await changesHook.updateChange(updatedVersion)
        if (response) {
            handleRefresh()
            setShowEditModal(false)
        }
    }

    return (
        <>
            <div className='modal-header py-3 bg-dark'>
                <h2 className="text-white">ACTUALIZAR CAMBIO #{change.ID_CAMBIO}</h2>
                <div
                    className='btn btn-sm btn-icon btn-active-color-primary'
                    onClick={() => modalHook.closeModal()}
                >
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className="modal-body py-6 px-9">
                {/* Filters */}
                <div className="border-0 pt-0 pb-6 d-flex justify-content-end">
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        {/* Filter by Ticket */}
                        <div className="w-200px">
                            <div className="input-group input-group-sm">
                                <span className="input-group-text" id="basic-addon1">
                                    <i className="bi bi-ticket"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ticket"
                                    value={filters.ticketFilter}
                                    onChange={(e) => setFilters(prev => ({ ...prev, ticketFilter: e.target.value }))}
                                />
                            </div>
                        </div>

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

                        {rol === 'ejecutor' && (
                            <button
                                className="btn btn-sm btn-light-warning d-flex align-items-center"
                                onClick={() => setShowSelectCIModal(true)}
                            >
                                <i className="bi bi-plus fs-5 me-1"></i>
                                Añadir CI
                            </button>
                        )}

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
                                    ticketFilter: '',
                                    paramValue: ''
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
                                    <th className="w-auto text-end">Detalle</th>
                                    <th className="w-40px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {changesHook.changeDetailLoading ? (
                                    <TableSkeleton size={10} columns={7} />
                                ) :
                                    currentItems.map((record, index) => {
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
                                                        <button
                                                            className="btn btn-sm btn-icon btn-light"
                                                            onClick={() => toggleCI(record.ID_EQUIPO)}
                                                        >
                                                            <i className={`bi bi-chevron-${isCIExpanded ? 'up' : 'down'}`}></i>
                                                        </button>
                                                    </td>
                                                    {/* Nueva columna con el botón "+" */}
                                                    <td className="text-center">
                                                        {rol === 'ejecutor' && (
                                                            <div className="d-flex gap-1 justify-content-center">
                                                                <button 
                                                                    className="btn btn-sm btn-icon btn-light-success"
                                                                    onClick={() => {
                                                                        setSelectedCIForMetric(record);
                                                                        const idFamiliaClase = record.changes[Object.keys(record.changes)[0]]?.[0]?.ID_FAMILIA_CLASE;
                                                                        setIdFamiliaClaseForMetric(idFamiliaClase);
                                                                        setShowAddMetricModal(true);
                                                                    }}
                                                                    title="Añadir métrica"
                                                                >
                                                                    <i className="bi bi-plus"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-icon btn-light-danger"
                                                                    onClick={() => {
                                                                        // Obtener todos los ID_CAMBIO_DETALLE del CI
                                                                        const idsToDelete: string[] = [];
                                                                        Object.values(record.changes).forEach(cambios => {
                                                                            cambios.forEach(item => {
                                                                                idsToDelete.push(item.ID_CAMBIO_DETALLE.toString());
                                                                            });
                                                                        });
                                                                        
                                                                        // Crear string separado por comas
                                                                        const stringIds = idsToDelete.join(',');
                                                                        
                                                                        // Enviar al hook
                                                                        changesHook.deleteChangeCI(stringIds).then(response => {
                                                                            if (response) {
                                                                                handleRefresh();
                                                                            }
                                                                        });
                                                                    }}
                                                                    title="Eliminar CI"
                                                                >
                                                                    <i className="bi bi-dash"></i>
                                                                </button>
                                                            </div>
                                                        )}
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
                                                                            {rol === 'ejecutor' && <th className="w-auto text-end">Acciones</th>}
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
                                                                                        {rol === 'ejecutor' && (
                                                                                            <td className="text-end">
                                                                                                <div className="d-flex justify-content-end gap-2">
                                                                                                    <button
                                                                                                        className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                                                                                                        onClick={() => {
                                                                                                            setSelectedMetric(item)
                                                                                                            setShowEditModal(true)
                                                                                                        }}
                                                                                                    >
                                                                                                        <i className="bi bi-pencil fs-3"></i>
                                                                                                    </button>

                                                                                                    <button
                                                                                                        className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                                                                                                        onClick={() => {
                                                                                                            setSelectedMetric(item)
                                                                                                            setShowDeleteModal(true)
                                                                                                        }}
                                                                                                    >
                                                                                                        <i className="bi bi-trash3 fs-3"></i>
                                                                                                    </button>
                                                                                                </div>
                                                                                            </td>
                                                                                        )}
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
            </div>
            <div className="modal-footer flex-nowrap pt-4 pb-6 px-9">
                <button
                    type="button"
                    className="btn btn-light btn-active-light-primary me-3"
                    onClick={() => modalHook.closeModal()}
                    disabled={changesHook.loadingUpdateChange || changesHook.deleteMetricChangeLoading}
                >
                    Cerrar
                </button>
            </div>
            {/* Modal de selección de CI */}
            <SelectCIModal
                show={showSelectCIModal}
                setShow={setShowSelectCIModal}
                availableCIs={availableCIs} // Debes definir este array filtrado
                onSelect={(ci) => {
                    setSelectedCI(ci);
                    setShowSelectCIModal(false);
                    setShowAddCIMetricsv2(true);
                }}
            />

            {showAddCIMetricsv2 && selectedCI && 
                <AddCIMetricsv2 
                    ci={selectedCI}
                    change={change}
                    onClose={() => setShowAddCIMetricsv2(false)}
                    onRefresh={handleRefresh}
                />}

            {/* Modal de confirmación para eliminar */}
            {showDeleteModal && selectedMetric && (
                <DeleteMetricChange
                    handleDeleteMetric={handleDeleteMetric}
                    selectedMetric={selectedMetric}
                    setShowDeleteModal={setShowDeleteModal}
                    loading={changesHook.deleteMetricChangeLoading}
                />
            )}
            {/* Modal de edición de metrica */}
            {showEditModal && selectedMetric && (
                <EditMetricChange
                    change={change}
                    handleEditMetric={handleEditMetric}
                    selectedMetric={selectedMetric}
                    setShowEditModal={setShowEditModal}
                    loading={changesHook.loadingUpdateChange}
                />
            )}
            {/* Modal de añadir métrica a CI */}
            <AddMetricToCI
                show={showAddMetricModal}
                setShow={setShowAddMetricModal}
                ci={selectedCIForMetric}
                idFamiliaClase={idFamiliaClaseForMetric}
                onSelectMetric={(metric) => {
                    setSelectedMetricForV2(metric);
                    setSelectedCIForV2(selectedCIForMetric);
                    setShowAddMetricModal(false);
                    setShowAddMetricV2(true);
                }}
            />
            {showAddMetricV2 && selectedMetricForV2 && selectedCIForV2 && (
                <AddMetricV2
                    show={showAddMetricV2}
                    setShow={setShowAddMetricV2}
                    metric={selectedMetricForV2}
                    ci={selectedCIForV2}
                    change={change}
                    onRefresh={handleRefresh}
                />
            )}
        </>
    )
}

export { DetailChange }