import { useState, useMemo } from "react";
import { Pagination } from "../../../../components/datatable/Pagination";
import { usePagination } from "../../../../hooks/usePagination";
import { MetricVersion } from "../Types";
import { groupByCI } from "../utils";

interface ServerListProps {
    metricsInformation: MetricVersion[];
}

export const ServerList = ({ metricsInformation }: ServerListProps) => {
    const [searchTerm, setSearchTerm] = useState('')
    
    const {
        currentPage,
        itemsPerPage,
        currentItems,
        totalPages,
        totalItems,
        setCurrentPage,
        setItemsPerPage,
    } = usePagination({
        data: useMemo(() => {
            const grouped = groupByCI(metricsInformation);
            if (!searchTerm) return grouped;

            const term = searchTerm.toLowerCase();
            return grouped.filter(server =>
                (server.NOMBRE_CI?.toLowerCase().includes(term)) ||
                (server.FAMILIA?.toLowerCase().includes(term)) ||
                (server.CLASE?.toLowerCase().includes(term))
            );
        }, [metricsInformation, searchTerm]),
        initialPage: 1,
        initialItemsPerPage: 17,
    })

    return (
        <div className="card">
            {/* Barra de búsqueda */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-6">
                <h3 className="fw-bold text-gray-800 mb-0 ms-10">Servidores monitoreados</h3>
                <div className="w-100 w-md-300px position-relative">
                    <input
                        type="text"
                        className="form-control form-control-solid ps-10"
                        placeholder="Buscar por CI o hostname"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1)
                        }}
                    />
                    <span className="position-absolute top-50 translate-middle-y start-0 ps-5">
                        <i className="bi bi-search text-muted"></i>
                    </span>
                </div>
            </div>
            <div className="card-body pt-5">
                {currentItems.length === 0 ? (
                    <div className="text-center d-flex flex-column align-items-center justify-content-center gap-10 mt-10">
                        <i className="bi bi-server text-gray-400" style={{ fontSize: '5rem' }}></i>
                        <h3 className="fw-bold text-gray-700">No hay servidores monitoreados</h3>
                    </div>
                ) : (
                    <div className="row g-6">
                        {currentItems.map((server) => (
                            <div key={server.ID_EQUIPO} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                                <div className="card shadow-sm h-100">
                                    <div className="card-body p-4 d-flex flex-column">
                                        {/* Información principal */}
                                        <div className="mb-3">
                                            <h5 className="fw-bold text-gray-800 mb-1 text-truncate">
                                                {server.NOMBRE_CI || server.IP}
                                            </h5>
                                            <div className="d-flex flex-wrap align-items-center gap-4 mt-2">
                                                <span className="text-muted">
                                                    <i className="bi bi-hdd-network me-2"></i>
                                                    {server.FAMILIA} / {server.CLASE}
                                                </span>
                                                <span className="text-muted">
                                                    <i className="bi bi-ip me-2"></i>
                                                    {server.IP}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-auto">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="badge badge-light-primary px-2 py-1 fs-7">
                                                    {server.METRICAS.length} métrica{server.METRICAS.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <div className="mt-2 pt-2 border-top">
                                                <div className="dropdown">
                                                    <button
                                                        className="btn btn-sm btn-icon btn-light-primary btn-active-light-primary w-100"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        <i className="bi bi-three-dots-vertical text-end"></i>
                                                    </button>
                                                    <div className="dropdown-menu dropdown-menu-end p-4 w-250px">
                                                        <h6 className="fw-bold mb-3">Métricas monitoreadas:</h6>
                                                        <div className="d-flex flex-column gap-2">
                                                            {server.METRICAS.map((metric) => (
                                                                <span key={metric.ID_DETALLE_POLITICA} className="badge badge-light fs-7 px-2 py-1 text-muted">
                                                                    {metric.NOMBRE}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            </div>
        </div>
    )
}