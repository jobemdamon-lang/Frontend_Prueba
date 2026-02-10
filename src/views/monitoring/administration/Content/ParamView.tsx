import { useMemo, useState } from "react";
import 'animate.css';
import { useAdministrationContext } from "../Context";
import { usePagination } from "../../../../hooks/usePagination";
import { Pagination } from "../../../../components/datatable/Pagination";
import { TableSkeleton } from "../../../../components/datatable/TableSkeleton";
import { getBadgeColor, getIconColor, THRESHOLDS } from "../../politicas_v2/utils";
import { ModalViewForAdministration } from "../Types";
import { ModalSize } from "../../../../hooks/Types";
import { AnalyticsService } from "../../../../helpers/analytics";

export const ParamView = () => {

    const { currentView, setCurrentView, metricParamHook, modalHook } = useAdministrationContext()
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState<'addu' | 'addp'>('addu')

    const filteredParams = useMemo(() => {
        return metricParamHook.metricParams.filter(param => {
            const urgencia = param.URGENCIA?.toUpperCase() ?? '';
            const parametro = param.PARAMETRO?.toLowerCase() ?? '';
            const matchesSearch = param.URGENCIA?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                parametro.includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            if (activeTab === 'addu') {
                return THRESHOLDS.includes(urgencia);
            } else {
                return !THRESHOLDS.includes(urgencia) || !param.URGENCIA;
            }
        });
    }, [searchTerm, metricParamHook.metricParams, activeTab]);

    const {
        currentPage,
        itemsPerPage,
        currentItems,
        totalPages,
        setCurrentPage,
        setItemsPerPage,
    } = usePagination({
        data: filteredParams,
        initialPage: 1,
        initialItemsPerPage: 10,
    })

    return (
        <div className="card mb-5 mb-xl-8 min-h-500px">
            <div className="card-header border-0 pt-5 d-flex flex-column">
                <h3 className="card-title align-items-start flex-column ">
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <button
                            type="button"
                            className="btn btn-light-primary btn-icon btn-sm"
                            onClick={() => setCurrentView({ view: 'metric', metric: null })}
                            disabled={metricParamHook.paramsLoading}
                        >
                            <i className="bi bi-arrow-left fs-1"></i>
                        </button>
                        <span className="card-label fw-bold fs-3">Actualización de Parametros</span>
                    </div>

                    <span className="text-muted mt-1 fw-semibold fs-7">
                        Gestionar la actualización, añadición o eliminación de parametros de una métrica específica.
                    </span>
                </h3>
                <div className="d-flex overflow-auto py-5">
                    <ul className="w-100 nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-7 fw-bolder">
                        <li
                            className="nav-item"
                            style={{ cursor: "pointer" }}
                            onClick={() => setActiveTab('addu')}
                        >
                            <span className={`nav-link text-active-primary me-6 ${activeTab === 'addu' ? 'active' : 'false'}`} >
                                Umbrales
                            </span>
                        </li>
                        <li
                            className="nav-item"
                            style={{ cursor: "pointer" }}
                            onClick={() => setActiveTab('addp')}
                        >
                            <span className={`nav-link text-active-primary me-6 ${activeTab === 'addp' ? 'active' : 'false'}`} >
                                Parametros extras
                            </span>
                        </li>
                    </ul>
                </div>
                <div className="d-flex justify-content-end gap-5">
                    <div className="d-flex align-items-center">
                        <span className="svg-icon svg-icon-3 position-absolute ms-4">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control form-control-solid ps-12"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                            if (!currentView.metric) return;
                            AnalyticsService.event((activeTab === 'addu' ? "create_new_umbral" : "create_new_param"),
                            { module: "monitoreo_administracion", metadata: { metricID: currentView.metric.NOMBRE, type: activeTab === 'addu' ? 'new umbral' : 'new param' } });
                            modalHook.openModal(
                                activeTab === 'addu' ?
                                    ModalViewForAdministration.CREATE_UMBRAL :
                                    ModalViewForAdministration.CREATE_PARAM,
                                ModalSize.LG,
                                undefined,
                                currentView.metric
                            )
                        }}
                    >
                        <i className="bi bi-plus-circle me-2"></i>{activeTab === 'addu' ? 'Nuevo Umbral' : 'Nuevo Parametro'}
                    </button>
                </div>
            </div>
            <div className="card-body py-3">
                <div className="table-responsive">
                    <table className="table align-middle table-row-dashed fs-6 gy-5">
                        <thead>
                            <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                                <th className="min-w-150px">Parámetro</th>
                                {activeTab === 'addu' && <th className="min-w-100px">Urgencia</th>}
                                {activeTab === 'addu' && <th className="min-w-150px">Umbral</th>}
                                {activeTab === 'addu' && <th className="min-w-100px">Unidades</th>}
                                {activeTab === 'addu' && <th className="min-w-100px">N° Poleos</th>}
                                {activeTab === 'addp' && <th className="min-w-100px">Valor por defecto</th>}
                                <th className="min-w-100px">Estado</th>
                                <th className="min-w-150px text-end">Creación</th>
                                <th className="min-w-150px text-end">Actualización</th>
                                <th className="min-w-100px text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="fw-semibold text-gray-600">
                            {metricParamHook.paramsLoading ? (
                                <TableSkeleton size={itemsPerPage} columns={activeTab === 'addu' ? 9 : 6} />
                            ) : currentItems.length > 0 ? (
                                currentItems.map(param => (
                                    <tr key={param.ID_METRICA_PARAMETRO}>
                                        {/* Parámetro */}
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="symbol symbol-50px me-3">
                                                    <span className="symbol-label bg-light-info">
                                                        <i className="bi bi-sliders fs-2 text-info"></i>
                                                    </span>
                                                </div>
                                                <div className="d-flex flex-column">
                                                    <span className="text-gray-800 fw-bold fs-5">
                                                        {param.PARAMETRO}
                                                    </span>
                                                    <span className="text-muted fs-7">ID: {param.ID_METRICA_PARAMETRO}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Urgencia */}
                                        {activeTab === 'addu' && (
                                            <td>
                                                <span className={`badge py-3 px-4 fs-7 ${getBadgeColor(param.URGENCIA || '')}`}>
                                                    <i className={`bi ${getIconColor(param.URGENCIA || '')} me-2`}></i>
                                                    {param.URGENCIA || 'NO APLICA'}
                                                </span>
                                            </td>
                                        )}

                                        {/* UMBRAL */}
                                        {activeTab === 'addu' && (
                                            <td>
                                                <span className="text-gray-800 fw-bold">
                                                    {param.UMBRAL || 'N/A'}
                                                </span>
                                            </td>
                                        )}

                                        {/* UNIDADES */}
                                        {activeTab === 'addu' && (
                                            <td>
                                                <span className="badge badge-light-primary py-2 px-3 fs-6">
                                                    {param.UNIDADES || 'N/A'}
                                                </span>
                                            </td>
                                        )}

                                        {/* NRO_POOLEOS */}
                                        {activeTab === 'addu' && (
                                            <td>
                                                <span className="text-gray-800">
                                                    {param.NRO_POOLEOS || 'N/A'}
                                                </span>
                                            </td>
                                        )}

                                        {/* VALOR_PARAMETRO */}
                                        {activeTab === 'addp' && (
                                            <td>
                                                <span className="text-gray-800 fw-bold">
                                                    {param.VALOR_PARAMETRO || 'N/A'}
                                                </span>
                                            </td>
                                        )}

                                        {/* Estado */}
                                        <td>
                                            <div className="form-check form-switch form-check-custom form-check-solid">
                                                <input
                                                    className="form-check-input h-20px w-30px"
                                                    type="checkbox"
                                                    checked={param.ESTADO === 1}
                                                    readOnly
                                                />
                                                <label className="form-check-label fw-bold">
                                                    {param.ESTADO === 1 ? (
                                                        <span className="text-success">Activo</span>
                                                    ) : (
                                                        <span className="text-danger">Inactivo</span>
                                                    )}
                                                </label>
                                            </div>
                                        </td>

                                        {/* Creación */}
                                        <td className="text-end">
                                            <div className="d-flex flex-column">
                                                <span className="text-gray-800 fs-6">
                                                    {param.FECHA_CREACION || 'Sin registro'}
                                                </span>
                                                <span className="text-muted fs-7">
                                                    <i className="bi bi-person-fill me-2"></i>
                                                    {param.USUARIO_CREACION || 'N/A'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Actualización */}
                                        <td className="text-end">
                                            <div className="d-flex flex-column">
                                                <span className="text-gray-800 fs-6">
                                                    {param.FECHA_MODIFICACION || 'Sin registro'}
                                                </span>
                                                <span className="text-muted fs-7">
                                                    <i className="bi bi-person-fill me-2"></i>
                                                    {param.USUARIO_MODIFICACION || 'N/A'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Acciones */}
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end">
                                                <button
                                                    className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2"
                                                    title="Editar"
                                                    onClick={() => {
                                                        const isUrgencyParam = THRESHOLDS.includes(param.URGENCIA?.toUpperCase() || '')
                                                        AnalyticsService.event((isUrgencyParam ? "edit_umbral" : "edit_param"),
                                                        { module: "monitoreo_administracion", metadata: { metricID: currentView.metric?.NOMBRE, paramID: param.ID_METRICA_PARAMETRO, type: isUrgencyParam ? 'umbral' : 'param' } });
                                                        modalHook.openModal(
                                                            isUrgencyParam ? ModalViewForAdministration.UPDATE_UMBRAL : ModalViewForAdministration.UPDATE_PARAM,
                                                            ModalSize.LG,
                                                            undefined,
                                                            param
                                                        )
                                                    }}
                                                >
                                                    <i className="bi bi-pencil-fill fs-4"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={10} className="text-center py-10">
                                        <div className="d-flex flex-column align-items-center">
                                            <i className="bi bi-inbox fs-3x text-gray-400 mb-4"></i>
                                            <h3 className="fw-bold text-gray-800 mb-2">No se encontraron resultados</h3>
                                            <p className="text-muted fs-5">
                                                No hay resultados que coincidan con tu búsqueda
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            </div>
        </div>
    )
}