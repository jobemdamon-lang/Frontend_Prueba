import { useMemo, useState } from 'react';
import { MetricCatalog, ModalViewForAdministration } from '../Types';
import { useAdministrationContext } from '../Context';
import { ModalSize } from '../../../../hooks/Types';
import { usePagination } from '../../../../hooks/usePagination';
import { Pagination } from '../../../../components/datatable/Pagination';
import { TableSkeleton } from '../../../../components/datatable/TableSkeleton';
import { AnalyticsService } from '../../../../helpers/analytics';

export const MetricView = () => {

	const { metricParamHook, metricHook, modalHook, setCurrentView } = useAdministrationContext()
	const { exportMetrics, loadingExportMetrics } = metricHook;
	const [filters, setFilters] = useState({
		familyFilter: '',
		classFilter: '',
		equipmentTypeFilter: '',
		toolFilter: '',
		globalFilter: ''
	})


	const uniqueFamilies = useMemo(() => [...new Set(metricHook.metrics.map(item => item.FAMILIA))], [metricHook.metrics])
	const uniqueClasses = useMemo(() => {
		if (!filters.familyFilter) return [...new Set(metricHook.metrics.map(item => item.CLASE))];
		return [...new Set(metricHook.metrics
			.filter(item => item.FAMILIA === filters.familyFilter)
			.map(item => item.CLASE))];
	}, [metricHook.metrics, filters.familyFilter])

	const uniqueEquipmentTypes = useMemo(() => {
		let filtered = metricHook.metrics;
		if (filters.familyFilter) {
			filtered = filtered.filter(item => item.FAMILIA === filters.familyFilter);
		}
		if (filters.classFilter) {
			filtered = filtered.filter(item => item.CLASE === filters.classFilter);
		}
		return [...new Set(filtered.map(item => item.TIPO_EQUIPO))];
	}, [metricHook.metrics, filters.familyFilter, filters.classFilter])

	const uniqueTools = useMemo(() => {
		let filtered = metricHook.metrics;
		if (filters.familyFilter) {
			filtered = filtered.filter(item => item.FAMILIA === filters.familyFilter);
		}
		if (filters.classFilter) {
			filtered = filtered.filter(item => item.CLASE === filters.classFilter);
		}
		return [...new Set(filtered.map(item => item.HERRAMIENTA))];
	}, [metricHook.metrics, filters.familyFilter, filters.classFilter])

	// Filtrar los datos
	const filteredData = useMemo(() => {
		return metricHook.metrics.filter(item => {
			const globalFilter = filters.globalFilter.toLowerCase();
			return (
				(filters.familyFilter === '' || item.FAMILIA === filters.familyFilter) &&
				(filters.classFilter === '' || item.CLASE === filters.classFilter) &&
				(filters.equipmentTypeFilter === '' || item.TIPO_EQUIPO === filters.equipmentTypeFilter) &&
				(filters.toolFilter === '' || item.HERRAMIENTA === filters.toolFilter) &&
				(filters.globalFilter === '' || item.NOMBRE.toLowerCase().includes(globalFilter) ||
					item.DETALLE.toLowerCase().includes(globalFilter)
				)
			)
		})
	}, [filters, metricHook.metrics])


	const {
		currentPage,
		itemsPerPage,
		currentItems,
		totalPages,
		setCurrentPage,
		setItemsPerPage,
	} = usePagination({
		data: filteredData,
		initialPage: 1,
		initialItemsPerPage: 10,
	})

	const handleViewParams = (metric: MetricCatalog) => {
		metricParamHook.getParamsByMetricId(metric.ID_METRICA)
		setCurrentView({ view: 'param', metric: metric })
	}


	const handleFamilyChange = (value: string) => {
		setFilters(prev => ({
			...prev,
			familyFilter: value,
			classFilter: '',
			equipmentTypeFilter: '',
			toolFilter: ''
		}));
	}

	const handleClassChange = (value:string) => {
		setFilters(prev => ({
			...prev,
			classFilter: value,
			equipmentTypeFilter: '',
			toolFilter: ''
		}));
	}

	const handleExportMetrics = () => {
		const payload = {
			ID_METRICA: filteredData.map(metric => metric.ID_METRICA),
		};
		exportMetrics(payload);
	}

	return (
		<div className="card mb-5 mb-xl-8">
			<div className="card-header border-0 pt-5 flex-column">
				<h3 className="card-title fw-bold fs-3 mb-1">Administración de Monitoreo</h3>
				<span className="text-muted mt-1 fw-semibold fs-7">
					Administra y configura el catalogo de monitoreo y más.
				</span>
			</div>
			<div className="card-body">
				<div className="card-toolbar justify-content-between d-flex flex-row gap-3 px-2">
					<div className='d-flex flex-row align-items-center gap-5'>
						{/* Global Filter */}
						<div className="d-flex align-items-center">
							<span className="svg-icon svg-icon-3 position-absolute ms-4">
								<i className="bi bi-search"></i>
							</span>
							<input
								type="text"
								className="form-control form-control-solid ps-12"
								placeholder="Buscar métricas..."
								value={filters.globalFilter}
								onChange={(e) => setFilters(prev => ({ ...prev, globalFilter: e.target.value }))}
							/>
						</div>
						{/* Filter by Family */}
						<div className="w-180px">
							<select
								className="form-select form-select-sm"
								value={filters.familyFilter}
								onChange={(e) => handleFamilyChange(e.target.value)}
							>
								<option value="">Todas las familias</option>
								{uniqueFamilies.map((family, i) => (
									<option key={i} value={family}>{family}</option>
								))}
							</select>
						</div>
						{/* Filter por Class */}
						<div className="w-180px">
							<select
								className="form-select form-select-sm"
								value={filters.classFilter}
								onChange={(e) => handleClassChange(e.target.value)}
							>
								<option value="">Todas las clases</option>
								{uniqueClasses.map((cls, i) => (
									<option key={i} value={cls}>{cls}</option>
								))}
							</select>
						</div>
						{/* Filter por Tipo Equipo */}
						<div className="w-180px">
							<select
								className="form-select form-select-sm"
								value={filters.equipmentTypeFilter}
								onChange={(e) => setFilters(prev => ({ ...prev, equipmentTypeFilter: e.target.value }))}
								disabled={!filters.familyFilter && !filters.classFilter}
							>
								<option value="">Todos los tipos</option>
								{uniqueEquipmentTypes.map((type, i) => (
									<option key={i} value={type}>{type}</option>
								))}
							</select>
						</div>
						{/* Filter por Herramienta */}
						<div className="w-180px">
							<select
								className="form-select form-select-sm"
								value={filters.toolFilter}
								onChange={(e) => setFilters(prev => ({ ...prev, toolFilter: e.target.value }))}
								disabled={!filters.familyFilter && !filters.classFilter}
							>
								<option value="">Todas las herramientas</option>
								{uniqueTools.map((tool, i) => (
									<option key={i} value={tool}>{tool}</option>
								))}
							</select>
						</div>
					</div>

					<div className="d-flex align-items-center">
						<div className="me-6">
							<span className="badge badge-light-primary fs-5">
								<i className="bi bi-speedometer2 me-2 fs-5 text-primary"></i>
								<span className="fw-semibold">{filteredData.length}</span>
								&nbsp; Métricas
							</span>
						</div>
						<button
							className="btn btn-primary btn-sm me-2"
							onClick={() => {
								AnalyticsService.event("create_metric", { module: "monitoreo_administracion", metadata: {} });
								modalHook.openModal(
									ModalViewForAdministration.CREATE_METRIC,
									ModalSize.LG,
									undefined,
									{}
								);
							}}
						>
							<i className="bi bi-plus-circle me-2"></i>Nueva Métrica
						</button>
						<button
							className="btn btn-success btn-sm"
							onClick={handleExportMetrics}
							disabled={loadingExportMetrics}
						>
							<i className="bi bi-file-earmark-arrow-down me-2"></i>
							{loadingExportMetrics ? ' Exportando...' : ' Exportar Métricas'}	
						</button>
					</div>
				</div>
				<div className="table-responsive">
					<table className="table align-middle table-row-dashed fs-6 gy-5">
						<thead>
							<tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
								<th className="min-w-150px">Métrica</th>
								<th className="min-w-200px">Detalle</th>
								<th className="min-w-100px">Tipo Equipo</th>
								<th className="min-w-80px">Herramienta</th>
								<th className="min-w-120px">Familia/Clase</th>
								<th className="min-w-100px">Opcional</th>
								<th className="min-w-100px">Estado</th>
								<th className="min-w-100px text-end">Frecuencia</th>
								<th className="min-w-150px text-end">Creación</th>
								<th className="min-w-150px text-end">Actualización</th>
								<th className="min-w-100px text-end">Acciones</th>
							</tr>
						</thead>
						<tbody className="fw-semibold text-gray-600">
							{metricHook.metricsLoading ? (
								<TableSkeleton size={itemsPerPage} columns={11} />
							) : currentItems.length > 0 ? (
								currentItems.map(metric => (
									<tr key={metric.ID_METRICA}>
										{/* Nombre */}
										<td>
											<div className="d-flex align-items-center">
												<div className="symbol symbol-50px me-3">
													<span className="symbol-label bg-light-primary">
														<i className="bi bi-speedometer2 fs-2 text-primary"></i>
													</span>
												</div>
												<div className="d-flex flex-column">
													<span className="text-gray-800 fw-bold fs-5">
														{metric.NOMBRE}
													</span>
													<span className="text-muted fs-7">ID: {metric.ID_METRICA}</span>
												</div>
											</div>
										</td>

										{/* Detalle */}
										<td>
											<div className="text-gray-800 fs-6 text-truncate" style={{ maxWidth: '150px' }}
												title={metric.DETALLE}>
												{metric.DETALLE}
											</div>
										</td>

										{/* Tipo de Equipo */}
										<td>
											<div className="text-gray-800 fs-6 text-truncate" style={{ maxWidth: '100px' }}
												title={metric.TIPO_EQUIPO}>
												{metric.TIPO_EQUIPO}
											</div>
										</td>

										{/* Herramienta */}
										<td>
											<div className="text-gray-800 fs-6 text-truncate" style={{ maxWidth: '80px' }}
												title={metric.HERRAMIENTA}>
												{metric.HERRAMIENTA}
											</div>
										</td>

										{/* Familia/Clase */}
										<td>
											<div className="d-flex flex-column">
												<span className="text-gray-800 fw-bold fs-6">
													<i className="bi bi-diagram-2-fill me-2 text-warning"></i>
													{metric.FAMILIA}
												</span>
												<span className="text-muted fs-7">
													<i className="bi bi-tag-fill me-2 text-info"></i>
													{metric.CLASE}
												</span>
											</div>
										</td>

										{/* Opcional */}
										<td>
											<div className="d-flex align-items-center">
												{metric.IS_OPCIONAL ? (
													<span className="badge badge-light-success">
														<i className="bi bi-check-circle-fill me-2 text-success"></i>
														Sí
													</span>
												) : (
													<span className="badge badge-light-danger">
														<i className="bi bi-x-circle-fill me-2 text-danger"></i>
														No
													</span>
												)}
											</div>
										</td>

										{/* Estado */}
										<td>
											<div className="form-check form-switch form-check-custom form-check-solid">
												<input
													className="form-check-input h-20px w-30px"
													type="checkbox"
													checked={metric.ESTADO ? true : false}
													readOnly
												/>
												<label className="form-check-label fw-bold">
													{metric.ESTADO ? (
														<span className="text-success">Activo</span>
													) : (
														<span className="text-danger">Inactivo</span>
													)}
												</label>
											</div>
										</td>

										{/* Frecuencia */}
										<td className="text-end">
											<span className="badge badge-light-info py-3 px-4 fs-6">
												<i className="bi bi-clock-history me-2"></i>
												{metric.FRECUENCIA || '0'} min
											</span>
										</td>

										{/* Creación */}
										<td className="text-end">
											<div className="d-flex flex-column">
												<span className="text-gray-800 fs-6">
													{metric.FECHA_CREACION || 'Sin registro'}
												</span>
												<span className="text-muted fs-7">
													<i className="bi bi-person-fill me-2"></i>
													{metric.USUARIO_CREACION || 'N/A'}
												</span>
											</div>
										</td>

										{/* Actualización */}
										<td className="text-end">
											<div className="d-flex flex-column">
												<span className="text-gray-800 fs-6">
													{metric.FECHA_MODIFICACION || 'Sin registro'}
												</span>
												<span className="text-muted fs-7">
													<i className="bi bi-person-fill me-2"></i>
													{metric.USUARIO_MODIFICACION || 'N/A'}
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
														AnalyticsService.event("edit_metric", { module: "monitoreo_administracion", metadata: { metricID: metric.NOMBRE } });
														modalHook.openModal(
															ModalViewForAdministration.UPDATE_METRIC,
															ModalSize.LG,
															undefined,
															metric
														);
													}}
												>
													<i className="bi bi-pencil-fill fs-4"></i>
												</button>
												<button className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2"
													title="Detalle"
													onClick={() => {
														AnalyticsService.event("view_metric_params", { module: "monitoreo_administracion", metadata: { metricID: metric.NOMBRE } });
														handleViewParams(metric)
													}}
												>
													<i className="bi bi-eye fs-4"></i>
												</button>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={9} className="text-center py-10">
										<div className="d-flex flex-column align-items-center">
											<i className="bi bi-inbox fs-4x text-gray-400 mb-4"></i>
											<h3 className="fw-bold text-gray-800 mb-2">No se encontraron métricas</h3>
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