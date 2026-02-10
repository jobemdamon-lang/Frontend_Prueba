import { FC, useState, useMemo } from 'react';
import { CIGroupedMetrics, MetricFamilyClase, ModalViewForMonitoringPolicies } from '../../Types';
import { useMonitoringPoliciesContext } from '../../Context';
import { groupByCI } from '../../utils';
import { ViewProps } from './UpdateMain';
import { ModalSize } from '../../../../../hooks/Types';

export const AddMetricView: FC<ViewProps> = ({ updates, setUpdates, setActiveView }) => {

    const { versionHook, modalHook, catalogHook } = useMonitoringPoliciesContext()
    const [selectedCI, setSelectedCI] = useState<CIGroupedMetrics | null>(null)
    const [searchParam, setSearchParam] = useState("")

    // Filtrar CIs basado en el parámetro de búsqueda
    const filteredCIs = useMemo(() => {
        const grouped = groupByCI(versionHook.metricsVersion)
        if (!searchParam) return grouped

        return grouped.filter(item =>
            item.NOMBRE_CI.toLowerCase().includes(searchParam.toLowerCase()) ||
            item.FAMILIA.toLowerCase().includes(searchParam.toLowerCase()) ||
            item.CLASE.toLowerCase().includes(searchParam.toLowerCase()) ||
            item.IP?.includes(searchParam.toLowerCase())
        )
    }, [versionHook.metricsVersion, searchParam])

    // Determinar qué métricas ya están monitoreadas
    const getMonitoredMetrics = useMemo(() => {
        if (!selectedCI) return new Set<number>();
        return new Set(selectedCI.METRICAS.map(m => m.ID_METRICA))
    }, [selectedCI])

    // Función para manejar la adición de métricas
    const handleAddMetric = (metric: MetricFamilyClase) => {
        if (!selectedCI) return;
        modalHook.openModal(
            ModalViewForMonitoringPolicies.ADD_METRIC,
            ModalSize.LG,
            undefined,
            {
                metric: metric,
                selectedCI: selectedCI,
                setUpdates: setUpdates,
                setActiveView: setActiveView
            }
        )
    }

    const handleSelectCI = (item: CIGroupedMetrics) => {
        setSelectedCI(item)
        catalogHook.getMetricsByFamilyClase(item.ID_OPCION)
    }

    return (
        <div className="d-flex">
            {/* Sidebar con listado de CIs */}
            <div className="w-400px ms-5 border-end">
                <div className="fw-bold fs-5 mb-4">CIs Monitoreados</div>
                {/* Barra de búsqueda */}
                <div className="w-full pe-5 pb-5">
                    <div className="input-group input-group-sm">
                        <span className="input-group-text" id="basic-addon1">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar CI, Familia, Clase o IP"
                            value={searchParam}
                            onChange={(e) => setSearchParam(e.target.value)}
                        />
                        {searchParam && (
                            <button
                                className="btn btn-sm btn-icon btn-light"
                                onClick={() => setSearchParam("")}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        )}
                    </div>
                </div>

                {/* Lista de CIs */}
                <div className="menu menu-column menu-rounded menu-state-bg menu-state-title-primary scroll-y h-700px">
                    {versionHook.metricsVersionLoading ? (
                        <ListSkeleton size={6} />
                    ) : filteredCIs.length === 0 ? (
                        <div className="text-center py-10">
                            <i className="bi bi-database-exclamation fs-2x text-muted"></i>
                            <p className="text-muted mt-3">
                                {searchParam ?
                                    "No se encontraron CIs con ese criterio" :
                                    "No hay CIs monitoreados disponibles"}
                            </p>
                        </div>
                    ) : (
                        filteredCIs.map(item => (
                            <div
                                key={item.ID_EQUIPO}
                                style={{ cursor: "pointer" }}
                                className={`d-flex align-items-center justify-content-between menu-item py-2 ps-5 pointer rounded ${selectedCI?.ID_EQUIPO === item.ID_EQUIPO ? 'bg-light-primary text-primary' : ''}`}
                                onClick={() => handleSelectCI(item)}
                            >
                                <div className="menu-content ps-0">
                                    <span className="menu-title fw-bold fs-6">{item.NOMBRE_CI}</span>
                                    <span className="text-gray-800 fs-7 d-block">{item.FAMILIA}</span>
                                    <div className="d-flex align-items-center">
                                        <span className="text-muted fs-7">{item.CLASE}</span> &nbsp;&nbsp;
                                        <span className="fs-7 d-block badge badge-light-primary">{item.IP || 'Sin IP'}</span>
                                    </div>
                                    <span className="badge badge-light-info fs-8 mt-1">
                                        {item.METRICAS.length} métricas monitoreadas
                                    </span>
                                </div>
                                <div>
                                    <i className="bi bi-arrow-bar-right fs-1 pe-5 text-primary"></i>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Contenido principal con métricas disponibles */}
            <div className="flex-grow-1 ps-10">
                {selectedCI ? (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <div className='d-flex align-items-center '>
                                <div className="symbol symbol-50px me-3">
                                    <span className="symbol-label bg-light-primary">
                                        <span className="fs-2 text-primary">{selectedCI.NOMBRE_CI.charAt(0)}</span>
                                    </span>
                                </div>
                                <div>
                                    <h4 className="fw-bold">{selectedCI.NOMBRE_CI}</h4>
                                    <span className="text-muted">{selectedCI.FAMILIA} / {selectedCI.CLASE}</span>
                                    <div className="text-muted fs-7">
                                        {selectedCI.IP && `IP: ${selectedCI.IP}`}
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <span className="badge badge-light-info fs-7 p-5 text-info fw-normal">
                                    <i className="bi bi-info-circle-fill fs-3 text-info"></i> &nbsp;
                                    Las métricas ya monitoreadas aparecerán en la lista con información adicional
                                </span>
                            </div>
                        </div>

                        <h5 className="fw-bold mb-4 text-gray-600 pt-5">
                            Métricas disponibles para {selectedCI.FAMILIA} / {selectedCI.CLASE}
                        </h5>

                        {catalogHook.familyClaseMetricsLoading ? (
                            <MetricSkeleton />
                        ) : (
                            <div className="row g-5">
                                {catalogHook.familyClaseMetrics.map(metric => {
                                    const isMonitored = getMonitoredMetrics.has(metric.ID_METRICA);
                                    const monitoredMetric = selectedCI.METRICAS.find(m => m.ID_METRICA === metric.ID_METRICA);

                                    return (
                                        <div key={metric.ID_METRICA} className="col-md-4">
                                            <div className={`card card-bordered ${isMonitored ? 'border-info border-dashed' : ''}`}>
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                                        <h5 className="card-title m-0">
                                                            {metric.NOMBRE}
                                                            {isMonitored && (
                                                                <span className="badge badge-info ms-2">Monitoreada</span>
                                                            )}
                                                        </h5>
                                                        <i
                                                            className={`bi ${isMonitored ? 'bi-check-circle-fill text-info' : 'bi-info-circle'} fs-3`}
                                                        ></i>
                                                    </div>

                                                    <p className="card-text text-muted">{metric.DETALLE}</p>

                                                    {isMonitored && (
                                                        <div className="mt-3">
                                                            <div className="d-flex flex-column gap-1">
                                                                <span className="text-muted fs-7">
                                                                    <i className="bi bi-clock-history me-2"></i>
                                                                    Frecuencia: {monitoredMetric?.FRECUENCIA || 'No definida'}
                                                                </span>
                                                                <span className="text-muted fs-7">
                                                                    <i className="bi bi-tools me-2"></i>
                                                                    Herramienta: {monitoredMetric?.HERRAMIENTA || 'No definida'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {(!isMonitored || metric.IS_OPCIONAL) ? (
                                                        <button
                                                            className="btn btn-sm btn-primary align-self-end mt-3"
                                                            onClick={() => handleAddMetric(metric)}
                                                        >
                                                            <i className="bi bi-plus-circle me-2"></i>
                                                            Añadir métrica
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-sm btn-light w-100 mt-3"
                                                            disabled
                                                        >
                                                            <i className="bi bi-check2-circle me-2"></i>
                                                            Ya monitoreada
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="d-flex items-center justify-content-center h-100">
                        <div className="d-flex flex-column flex-center h-100">
                            <div className="symbol symbol-100px mb-5">
                                <span className="symbol-label bg-light-primary">
                                    <i className="bi bi-hdd-rack fs-2x text-primary"></i>
                                </span>
                            </div>
                            <h4 className="fw-bold text-gray-600">Añadir nuevas métricas a CIs ya monitoreados</h4>
                            <p className="text-muted text-center">
                                Seleccione un elemento de configuración de la lista para mostrar las métricas disponibles.
                                <br />
                                Podrá elegir qué métricas desea adicionar al monitoreo para cada CI.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const ListSkeleton: FC<{ size: number }> = ({ size }) => (
    <div className='d-flex flex-column gap-3 me-5' aria-hidden="true">
        {Array(size)
            .fill(0)
            .map((_, index) => (
                <div
                    key={index}
                    className="d-flex w-100 align-items-center justify-content-between p-4 rounded-3 placeholder-wave border border-dashed border-gray-300"
                    style={{
                        cursor: "pointer",
                        minHeight: "100px"
                    }}
                >
                    <div className="w-100 pe-4">
                        {/* Nombre del CI */}
                        <div className="mb-3 w-100">
                            <span className="placeholder bg-secondary placeholder-lg col-9 rounded-2" style={{ height: '24px' }}></span>
                        </div>

                        {/* Familia y detalles */}
                        <div className="d-flex flex-column gap-2 w-100 mb-3">
                            <span className="placeholder bg-secondary col-7 rounded-2" style={{ height: '18px' }}></span>
                            <div className="d-flex gap-3 align-items-center">
                                <span className="placeholder bg-secondary col-4 rounded-2" style={{ height: '16px' }}></span>
                                <span className="placeholder bg-secondary col-3 rounded-2" style={{ height: '20px' }}></span>
                            </div>
                        </div>

                        {/* Métricas monitoreadas */}
                        <div className="w-50">
                            <span className="placeholder bg-secondary col-12 rounded-2" style={{ height: '20px' }}></span>
                        </div>
                    </div>

                    {/* Icono flecha */}
                    <div>
                        <span className="placeholder bg-secondary rounded-circle" style={{
                            width: '28px',
                            height: '28px'
                        }}></span>
                    </div>
                </div>
            ))}
    </div>
);

const MetricSkeleton = () => {
    return (
        <div className="row g-5">
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="col-md-4">
                    <div className="card card-bordered rounded-3">
                        <div className="card-body p-4">
                            {/* Encabezado de la tarjeta */}
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <h5 className="card-title m-0 w-75">
                                    <span className="placeholder-wave bg-secondary w-100 rounded-2">
                                        <span className="placeholder bg-secondary col-8 rounded-2"></span>
                                    </span>
                                </h5>
                                <span className="placeholder-wave bg-secondary rounded-circle">
                                    <span className="placeholder bg-secondary col-12 rounded-circle" style={{ width: '24px', height: '24px' }}></span>
                                </span>
                            </div>

                            {/* Descripción */}
                            <p className="card-text mb-4">
                                <span className="placeholder-wave bg-secondary w-100 d-flex flex-column gap-2">
                                    <span className="placeholder bg-secondary col-12 rounded-2"></span>
                                    <span className="placeholder bg-secondary col-10 rounded-2"></span>
                                    <span className="placeholder bg-secondary col-11 rounded-2"></span>
                                </span>
                            </p>

                            {/* Detalles de monitoreo (skeleton) */}
                            <div className="mt-4 mb-4">
                                <div className="d-flex flex-column gap-3">
                                    <span className="text-muted fs-7">
                                        <span className="placeholder-wave bg-secondary w-100 rounded-2">
                                            <span className="placeholder bg-secondary col-6 rounded-2"></span>
                                        </span>
                                    </span>
                                    <span className="text-muted fs-7">
                                        <span className="placeholder-wave bg-secondary w-100 rounded-2">
                                            <span className="placeholder bg-secondary col-5 rounded-2"></span>
                                        </span>
                                    </span>
                                </div>
                            </div>

                            {/* Botón (skeleton) */}
                            <div className="mt-4">
                                <span className="placeholder-wave bg-secondary w-100 rounded-2">
                                    <span className="placeholder bg-secondary col-12 rounded-2" style={{ height: '38px' }}></span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}