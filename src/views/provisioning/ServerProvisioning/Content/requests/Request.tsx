import { FC, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useServerProvisioningContext } from "../../Context";
import { getBadgeExecutionState, getBadgeRequestState, getTotalDiskSpace, parsePayload } from "../../utils";
import { ModalSize } from "../../../../../hooks/Types";
import { ModalViewForServerProvisioning } from "../../../Types";
import { AccessController } from "../../../../../components/AccessControler";

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

export const Request = () => {
	const { requestVMHook: { requestVM, loadingRequestVM, getRequestVM }, modalHook, rol, paramsHook } = useServerProvisioningContext();
	const navigate = useNavigate()
	const query = useQuery()
	const id = query.get("id")

	useEffect(() => {
		const id_request = Number(id)
		if (id && id_request) getRequestVM(id_request);
	}, [getRequestVM, id])

	const handleGoRequest = () => {
		navigate('/aprovisionamiento/solicitudes')
	}

	if (loadingRequestVM) {
		return (<RequestDetailSkeleton handleGoRequest={handleGoRequest} />)
	}

	// Determinar el estado actual para el timeline
	const getCurrentState = () => {
		const state = requestVM?.ESTADO_SOLICITUD?.toLowerCase() || '';
		const executionState = requestVM?.EJECUCION?.ESTADO?.toLowerCase() || '';
		if (executionState === 'en ejecucion') return 4; // Si está en ejecución, consideramos que está aprobado
		if (state === 'registrado') return 1;
		if (state === 'pendiente aprobacion') return 2;
		if (state === 'aprobado') return 3;
		if (state === 'aprovisionado') return 5;
		return 0;
	}

	const currentState = getCurrentState();
	const hasEDR = paramsHook.requestParams.some(r => r.TIPOATRIBUTO === 'TIPO_EDR_APROVISIONAMIENTO' && r.IDOPCION === requestVM?.IMPLEMENTAR_EDR && r.VALOR === 'EDR_CANVIA')

	return (
		<div className="container-fluid px-4">
			{/* Header with back button and actions */}
			<div className="d-flex justify-content-between align-items-center mb-4 bg-light p-3 rounded shadow-sm">
				<button
					className="btn btn-outline-primary btn-sm d-flex align-items-center"
					onClick={handleGoRequest}
				>
					<i className="bi bi-arrow-left me-2"></i>
					<span>Volver a solicitudes</span>
				</button>
			</div>

			{/* Request Header Card */}
			<div className="card border-0 shadow-sm mb-4">
				<div className="card-body p-4">
					<div className="row align-items-center">
						<div className="col-auto">
							<div
								className="d-flex justify-content-center align-items-center bg-light rounded-circle"
								style={{ width: "100px", height: "100px" }}
							>
								<i className="bi bi-hdd-rack text-primary" style={{ fontSize: "2.5rem" }}></i>
							</div>
						</div>
						<div className="col d-flex justify-content-between">
							<div className="d-flex flex-column">
								<div className="d-flex align-items-center mb-4">
									<h2 className="mb-0 me-3">Solicitud #{requestVM?.ID_SOLICITUD}</h2>
									<span className={`badge ${getBadgeRequestState(requestVM?.ESTADO_SOLICITUD || "")} fs-3`}>
										{requestVM?.ESTADO_SOLICITUD || "Sin estado"}
									</span>
								</div>
								<div className="d-flex flex-wrap gap-5 text-muted">
									<div className="fs-5">
										<i className="bi bi-person me-2 fs-3"></i>
										{requestVM?.USUARIO_CREACION || "Sin usuario"}
									</div>
									<div className="fs-5">
										<i className="bi bi-tag me-2 fs-3"></i>
										{requestVM?.PROYECTO || "Sin proyecto"}
									</div>
									<div className="fs-5">
										<a
											href={`https://csm3.serviceaide.com/NimsoftServiceDesk/servicedesk/sso/canvia.com?redirectUrl=%2F%3FdisplayTicketType%3DChange%20Request%26ticketType%3DChangeRequest%26MdrElementID%3D${requestVM?.MDR_ELEMENT_ID}%26MdrProduct%3DCA%253A00050%26MdrProdInstance%3D6962cb27-5309-4417-a3ae-660053962f85%23WORKSPACES-SERVICE-DESK-Ticket-Details`}
											target="_blank"
											rel="noreferrer"
										>
											<i className="bi bi-ticket me-2  fs-3"></i>
											{requestVM?.NRO_TICKET || "Sin registro"}
										</a>
									</div>
								</div>
							</div>
							<div className="d-flex gap-3 justify-content-center align-items-center me-10">
								{requestVM?.ESTADO_SOLICITUD.toLowerCase() === 'pendiente aprobacion' && (
									<button
										className="btn btn-primary d-flex align-items-center gap-2"
										onClick={() => {
											modalHook.openModal(ModalViewForServerProvisioning.APPROVAL_MODAL, ModalSize.LG, undefined, requestVM);
										}}
									>
										<i className="bi bi-hand-thumbs-up fs-5"></i>
										<span className="">Aprobar</span>
									</button>
								)}

								{requestVM?.ESTADO_SOLICITUD.toLowerCase() === 'registrado' && (
									<AccessController allowedRoles={['admin', 'ejecutor']} rol={rol}>
										<button
											className="btn btn-primary d-flex align-items-center gap-2"
											onClick={() => {
												modalHook.openModal(ModalViewForServerProvisioning.SEND_APPROVE, ModalSize.LG, undefined, requestVM);
											}}
										>
											<i className="bi bi-send fs-5"></i>
											<span className="">Enviar a aprobar</span>
										</button>
									</AccessController>
								)}

								{/*['registrado', 'pendiente aprobacion'].includes(requestVM?.ESTADO_SOLICITUD?.toLowerCase() || '') && (
									<button
										className="btn btn-light btn-active-color-primary d-flex align-items-center gap-2"
										onClick={() => {
											modalHook.openModal(ModalViewForServerProvisioning.CANCEL_REQUEST, ModalSize.LG, undefined, requestVM);
										}}
									>
										<i className="bi bi-x-square fs-5"></i>
										<span className="text-gray-600">Cancelar</span>
									</button>
								)*/}

								{requestVM?.ESTADO_SOLICITUD.toLowerCase() === 'pendiente aprobacion' && (
									<button
										className="btn btn-light btn-active-color-primary d-flex align-items-center gap-2"
										onClick={() => {
											modalHook.openModal(ModalViewForServerProvisioning.REVALIDATE_APPROVAL, ModalSize.SM, undefined, requestVM);
										}}
									>
										<i className="bi bi-check-all fs-1"></i>
										<span className="text-gray-600">Revalidar Aprobación</span>
									</button>
								)}
								{requestVM?.ESTADO_SOLICITUD.toLowerCase() === 'cancelado' && (
									<span className="text-gray-500">No hay acciones disponibles</span>
								)}
								{/*requestVM?.ESTADO_SOLICITUD.toLowerCase() === 'aprobado' && requestVM.EJECUCION.ESTADO.toLowerCase() === 'programado' && (
									<button
										className="btn btn-light btn-active-color-primary d-flex align-items-center gap-2"
										onClick={() => {
											modalHook.openModal(ModalViewForServerProvisioning.CONFIRM_EXECUTION, ModalSize.LG, undefined, requestVM);
										}}
									>
										<i className="bi bi-play-fill fs-4"></i>
										<span className="text-gray-600">Ejecutar aprovisionamiento</span>
									</button>
								)*/}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Timeline Card - Mejorado */}
			<div className="card border-0 shadow-sm mb-4">
				<div className="card-header bg-transparent py-3 d-flex justify-content-between align-items-center">
					<h4 className="card-title m-0 d-flex align-items-center">
						<i className="bi bi-clock-history text-primary me-2 fs-1"></i>
						Flujo de la Solicitud
					</h4>
				</div>
				<div className="card-body">
					<div className="position-relative">
						{/* Línea de progreso */}
						<div className="position-absolute" style={{ top: '2rem', left: '0', right: '0', height: '2px', backgroundColor: '#e9ecef', zIndex: '1' }}></div>
						<div className="position-absolute" style={{ top: '2rem', left: '0', width: `${currentState * 20}%`, height: '2px', backgroundColor: '#0d6efd', zIndex: '2' }}></div>

						{/* Estados */}
						<div className="d-flex justify-content-between position-relative" style={{ zIndex: '3' }}>
							<div className="text-center">
								<div className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${currentState >= 1 ? 'bg-primary' : 'bg-light'}`} style={{ width: '50px', height: '50px' }}>
									<i className={`bi bi-1-circle fs-1 ${currentState >= 1 ? 'text-white' : 'text-muted'}`}></i>
								</div>
								<div className="fw-bold">Registrado</div>
								<div className="text-muted small">{requestVM?.USUARIO_CREACION || "N/A"}</div>
								<div className="text-muted small">{requestVM?.FECHA_CREACION || "N/A"}</div>
							</div>

							<div className="text-center">
								<div className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${currentState >= 2 ? 'bg-primary' : 'bg-light'}`} style={{ width: '50px', height: '50px' }}>
									<i className={`bi bi-2-circle fs-1 ${currentState >= 2 ? 'text-white' : 'text-muted'}`}></i>
								</div>
								<div className="fw-bold">Pendiente Aprobación</div>
								<div className="text-muted small">{currentState >= 2 ? (requestVM?.USUARIO_ENVIO_APROBACION || "Pendiente") : "N/A"}</div>
								<div className="text-muted small">{currentState >= 2 ? (requestVM?.FECHA_ENVIO_APROBACION || "Pendiente") : "N/A"}</div>
							</div>

							<div className="text-center">
								<div className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${currentState >= 3 ? 'bg-primary' : 'bg-light'}`} style={{ width: '50px', height: '50px' }}>
									<i className={`bi bi-3-circle fs-1 ${currentState >= 3 ? 'text-white' : 'text-muted'}`}></i>
								</div>
								<div className="fw-bold">Aprobado</div>
								<div className="text-muted small">{currentState >= 3 ? (requestVM?.APROBADOR || "Pendiente") : "N/A"}</div>
								<div className="text-muted small">{currentState >= 3 ? (requestVM?.FECHA_APROBACION || "Pendiente") : "N/A"}</div>
							</div>

							<div className="text-center">
								<div className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${currentState >= 4 ? 'bg-primary' : 'bg-light'}`} style={{ width: '50px', height: '50px' }}>
									<i className={`bi bi-4-circle fs-1 ${currentState >= 4 ? 'text-white' : 'text-muted'}`}></i>
								</div>
								<div className="fw-bold">En ejecución</div>
								<div className="text-muted small">{currentState >= 4 ? (requestVM?.EJECUCION.EJECUTOR || "Pendiente") : "N/A"}</div>
								<div className="text-muted small">{currentState >= 4 ? (requestVM?.EJECUCION.FECHA_EJECUCION_REAL || "Pendiente") : "N/A"}</div>
							</div>

							<div className="text-center">
								<div className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${currentState >= 5 ? 'bg-primary' : 'bg-light'}`} style={{ width: '50px', height: '50px' }}>
									<i className={`bi bi-5-circle fs-1 ${currentState >= 5 ? 'text-white' : 'text-muted'}`}></i>
								</div>
								<div className="fw-bold">Aprovisionado</div>
								<div className="text-muted small">{currentState >= 5 ? (requestVM?.EJECUCION.EJECUTOR || "Pendiente") : "N/A"}</div>
								<div className="text-muted small">{currentState >= 5 ? (requestVM?.EJECUCION.FECHA_EJECUCION_REAL || "Pendiente") : "N/A"}</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="row">
				<div className="col-lg-6 mb-4">
					{/* Request Details Card */}
					<div className="card border-0 shadow-sm h-100">
						<div className="card-header bg-transparent py-3 d-flex justify-content-between align-items-center">
							<h4 className="card-title m-0 d-flex align-items-center">
								<i className="bi bi-info-circle text-primary me-2 fs-1"></i>
								Detalles de la Solicitud
							</h4>
							<AccessController allowedRoles={['admin', 'ejecutor']} rol={rol}>
								<div className="d-flex gap-3">
									<button
										className="btn btn-sm btn-light"
										onClick={() => modalHook.openModal(ModalViewForServerProvisioning.UPDATE_GENERAL, ModalSize.LG, undefined, requestVM)}
									>
										<i className="bi bi-pencil-square fs-3"></i> Datos Generales
									</button>
									<button
										className="btn btn-sm btn-light"
										onClick={() => modalHook.openModal(ModalViewForServerProvisioning.UPDATE_NETWORK, ModalSize.LG, undefined, requestVM)}
									>
										<i className="bi bi-pencil-square fs-3"></i> IP VLAN
									</button>
								</div>
							</AccessController>
						</div>
						<div className="card-body fs-6">
							<div className="row g-4 ps-8">
								<div className="col-md-6">
									<div className="d-flex flex-column">
										<span className="text-muted small">Criticidad</span>
										<span className="fw-bold">{requestVM?.CRITICIDAD || "N/A"}</span>
									</div>
								</div>
								<div className="col-md-6">
									<div className="d-flex flex-column">
										<span className="text-muted small">Ubicación</span>
										<span className="fw-bold">{requestVM?.UBICACION || "N/A"}</span>
									</div>
								</div>
								<div className="col-md-6">
									<div className="d-flex flex-column">
										<span className="text-muted small">Tipo de Servicio</span>
										<span className="fw-bold">{requestVM?.TIPO_SERVICIO || "N/A"}</span>
									</div>
								</div>
								<div className="col-md-6">
									<div className="d-flex flex-column">
										<span className="text-muted small">Sistema Operativo</span>
										<span className="fw-bold">{requestVM?.VERSION_SO || "N/A"}</span>
									</div>
								</div>
								<div className="col-md-6">
									<div className="d-flex flex-column">
										<span className="text-muted small">Proyecto</span>
										<span className="fw-bold">{requestVM?.PROYECTO || "N/A"}</span>
									</div>
								</div>
								<div className="col-md-6">
									<div className="d-flex flex-column">
										<span className="text-muted small">Administrador</span>
										<span className="fw-bold">{requestVM?.ADMIN_TORRE || "N/A"}</span>
									</div>
								</div>
								<div className="col-md-6">
									<div className="d-flex flex-column">
										<span className="text-muted small">Hostname</span>
										<span className="fw-bold">{requestVM?.HOSTNAME || "N/A"}</span>
									</div>
								</div>
								<div className="col-md-6">
									<div className="d-flex flex-column">
										<span className="text-muted small">IP</span>
										<span className="fw-bold">{requestVM?.IP || "N/A"}</span>
									</div>
								</div>
								<div className="col-md-6">
									<div className="d-flex flex-column">
										<span className="text-muted small">VLAN ID</span>
										<span className="fw-bold">{requestVM?.VLAN_ID || "N/A"}</span>
									</div>
								</div>
								<div className="col-md-6">
									<div className="d-flex flex-column">
										<span className="text-muted small">NOMBRE VM</span>
										<span className="fw-bold">{parsePayload(requestVM?.EJECUCION.PAYLOAD ?? '').extra_vars?.vm_name || "N/A"}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="col-lg-6 mb-4">
					{/* Implementation Options Card */}
					<div className="card border-0 shadow-sm mb-4">
						<div className="card-header bg-transparent py-3 d-flex justify-content-between align-items-center">
							<h4 className="card-title m-0 d-flex align-items-center">
								<i className="bi bi-gear text-primary me-2 fs-1"></i>
								Opciones de Implementación
							</h4>
							<AccessController allowedRoles={['admin', 'ejecutor']} rol={rol}>
								<button
									className="btn btn-sm btn-light"
									onClick={() => modalHook.openModal(ModalViewForServerProvisioning.UPDATE_SERVICES, ModalSize.LG, undefined, requestVM)}
								>
									<i className="bi bi-pencil-square fs-3"></i>
								</button>
							</AccessController>
						</div>
						<div className="card-body">
							<div className="row g-3">
								<div className="col-md-4">
									<div className="card h-100 border-0 bg-light py-2">
										<div className="card-body text-center p-3">
											<div className="mb-3">
												<i
													className={`bi ${requestVM?.IMPLEMENTAR_MONITOREO ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger"} fs-1`}
												></i>
											</div>
											<h6 className="card-title mb-1">Monitoreo</h6>
											<p className="card-text small mb-0">
												{requestVM?.IMPLEMENTAR_MONITOREO ? "Implementar" : "No implementar"}
											</p>
										</div>
									</div>
								</div>
								<div className="col-md-4">
									<div className="card h-100 border-0 bg-light py-2">
										<div className="card-body text-center p-3">
											<div className="mb-3">
												<i
													className={`bi ${requestVM?.IMPLEMENTAR_BACKUP ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger"} fs-1`}
												></i>
											</div>
											<h6 className="card-title mb-1">Backup</h6>
											<p className="card-text small mb-0">
												{requestVM?.IMPLEMENTAR_BACKUP ? "Implementar" : "No implementar"}
											</p>
										</div>
									</div>
								</div>
								<div className="col-md-4">
									<div className="card h-100 border-0 bg-light py-2">
										<div className="card-body text-center p-3">
											<div className="mb-3">
												<i
													className={`bi ${hasEDR ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger"} fs-1`}
												></i>
											</div>
											<h6 className="card-title mb-1">EDR</h6>
											<p className="card-text small mb-0">
												{hasEDR ? "Implementar" : "No implementar"}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Datos de Ejecución Card - NUEVA SECCIÓN */}
					<div className="card border-0 shadow-sm">
						<div className="card-header bg-transparent py-3 d-flex justify-content-between align-items-center">
							<h4 className="card-title m-0 d-flex align-items-center">
								<i className="bi bi-play-circle text-primary me-2 fs-1"></i>
								Datos de Ejecución
							</h4>
							<button
								className="btn btn-sm btn-light"
								onClick={() => modalHook.openModal(ModalViewForServerProvisioning.INFO_EXECUTION, ModalSize.LG, undefined, requestVM)}
							>
								<i className="bi bi-info fs-2"></i>
							</button>
						</div>
						<div className="card-body">
							{requestVM?.EJECUCION ? (
								<div className="row g-4">
									<div className="col-md-6">
										<div className="d-flex flex-column">
											<span className="text-muted small">Estado</span>
											<span className="fw-bold">
												<span className={`badge ${getBadgeExecutionState(requestVM.EJECUCION.ESTADO || "")}`}>
													{requestVM.EJECUCION.ESTADO || "Sin estado"}
												</span>
											</span>
										</div>
									</div>
									<div className="col-md-6">
										<div className="d-flex flex-column">
											<span className="text-muted small">Mensaje</span>
											<span className="fw-bold">{requestVM.EJECUCION.MENSAJE || "N/A"}</span>
										</div>
									</div>
									<div className="col-md-6">
										<div className="d-flex flex-column">
											<span className="text-muted small">Fecha Programada</span>
											<span className="fw-bold">{requestVM.EJECUCION.FECHA_EJECUCION_PLANIFICADA || "N/A"}</span>
										</div>
									</div>
									<div className="col-md-6">
										<div className="d-flex flex-column">
											<span className="text-muted small">Fecha Ejecutado</span>
											<span className="fw-bold">{requestVM.EJECUCION.FECHA_EJECUCION_REAL || "N/A"}</span>
										</div>
									</div>
									<div className="col-md-6">
										<div className="d-flex flex-column">
											<span className="text-muted small">Ejecutado por</span>
											<span className="fw-bold">{requestVM.EJECUCION.EJECUTOR || "N/A"}</span>
										</div>
									</div>
									<div className="col-md-6">
										<div className="d-flex flex-column">
											<span className="text-muted small">Resultado</span>
											<span className="fw-bold">{"N/A"}</span>
										</div>
									</div>
								</div>
							) : (
								<div className="alert alert-info">No hay información de ejecución disponible.</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Hardware Specifications Card */}
			<div className="card border-0 shadow-sm mb-4">
				<div className="card-header bg-transparent py-3 d-flex justify-content-between align-items-center">
					<h4 className="card-title m-0 d-flex align-items-center">
						<i className="bi bi-cpu text-primary me-2 fs-1"></i>
						Especificaciones de Hardware
					</h4>
					<AccessController allowedRoles={['admin', 'ejecutor']} rol={rol}>
						<button
							className="btn btn-sm btn-light"
							onClick={() => modalHook.openModal(ModalViewForServerProvisioning.UPDATE_HARDWARE, ModalSize.LG, undefined, requestVM)}
						>
							<i className="bi bi-pencil-square fs-3"></i>
						</button>
					</AccessController>
				</div>
				<div className="card-body">
					<div className="row g-4 mb-4">
						<div className="col-md-4">
							<div className="card h-100 border-0 bg-light">
								<div className="card-body text-center p-4">
									<i className="bi bi-cpu text-primary mb-3" style={{ fontSize: "2.5rem" }}></i>
									<h3 className="display-6 fw-bold mb-1">{requestVM?.VCPU_CORES || "0"}</h3>
									<p className="text-muted mb-0">vCPU Cores</p>
								</div>
							</div>
						</div>
						<div className="col-md-4">
							<div className="card h-100 border-0 bg-light">
								<div className="card-body text-center p-4">
									<i className="bi bi-memory text-primary mb-3" style={{ fontSize: "2.5rem" }}></i>
									<h3 className="display-6 fw-bold mb-1">{requestVM?.RAM_GB || "0"}</h3>
									<p className="text-muted mb-0">RAM (GB)</p>
								</div>
							</div>
						</div>
						<div className="col-md-4">
							<div className="card h-100 border-0 bg-light">
								<div className="card-body text-center p-4">
									<i className="bi bi-device-ssd text-primary mb-3" style={{ fontSize: "2.5rem" }}></i>
									<h3 className="display-6 fw-bold mb-1">{requestVM?.SWAP_GB || "0"}</h3>
									<p className="text-muted mb-0">SWAP (GB)</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Storage Section - Ahora como card separado */}
			<div className="card border-0 shadow-sm mb-4">
				<div className="card-header bg-transparent py-3 d-flex justify-content-between align-items-center">
					<div className="d-flex align-items-center">
						<i className="bi bi-hdd fs-3 text-primary me-2 fs-1"></i>
						<h4 className="card-title m-0">Almacenamiento</h4>
						<span className="badge bg-primary ms-2">Total: {getTotalDiskSpace(requestVM?.DISCOS || [])} GB</span>
					</div>
					<AccessController allowedRoles={['admin', 'ejecutor']} rol={rol}>
						<div className="btn-group">
							<button
								className="btn btn-sm btn-primary"
								onClick={() => modalHook.openModal(
									ModalViewForServerProvisioning.ADD_DISK,
									ModalSize.LG, undefined,
									requestVM
								)}
							>
								<i className="bi bi-plus-circle me-1"></i> Añadir Disco
							</button>
						</div>
					</AccessController>
				</div>
				<div className="card-body">
					{requestVM?.DISCOS && requestVM.DISCOS.length > 0 ? (
						<div className="row g-4">
							{requestVM.DISCOS.map((disk, diskIndex) => (
								<div key={diskIndex} className="col-lg-6">
									<div className="card border shadow-sm">
										<div className="card-header bg-light d-flex justify-content-between align-items-center">
											<div className="d-flex align-items-center">
												<i className="bi bi-hdd text-primary me-2 fs-3"></i>
												<h6 className="mb-0 text-gray-700">
													{disk.NOMBRE_UNIDAD} ({disk.GB_DISCO} GB)
												</h6>
											</div>
											<div className="btn-group">
												{requestVM.SO.toLowerCase() === 'windows' && (
													<AccessController allowedRoles={['admin', 'ejecutor']} rol={rol}>
														<button
															className="btn btn-sm btn-outline-primary"
															onClick={() => modalHook.openModal(
																ModalViewForServerProvisioning.UPDATE_DISK,
																ModalSize.LG, undefined,
																{ requestInformation: requestVM, diskInformation: disk }
															)}
														>
															<i className="bi bi-pencil fs-3"></i> Actualizar Disco
														</button>
													</AccessController>
												)}
												<AccessController allowedRoles={['admin', 'ejecutor']} rol={rol}>
													<button
														className="btn btn-sm btn-outline-danger"
														onClick={() => modalHook.openModal(
															ModalViewForServerProvisioning.ELIMINATE_DISK,
															ModalSize.LG, undefined,
															{ requestInformation: requestVM, diskInformation: disk }
														)}
													>
														<i className="bi bi-trash fs-3"></i> Eliminar disco
													</button>
												</AccessController>
												{requestVM.SO.toLowerCase() === 'linux' && (
													<AccessController allowedRoles={['admin', 'ejecutor']} rol={rol}>
														<button
															className="btn btn-sm btn-outline-success"
															onClick={() => modalHook.openModal(
																ModalViewForServerProvisioning.ADD_PARTITION,
																ModalSize.LG, undefined,
																{ requestInformation: requestVM, diskInformation: disk }
															)}
														>
															<i className="bi bi-plus-circle fs-3"></i> Partición
														</button>
													</AccessController>
												)}
											</div>
										</div>
										{disk.PARTICIONES.length > 0 && (
											<div className="card-body p-0">
												<div className="table-responsive">
													<table className="table table-striped table-hover mb-0">
														<thead className="table-light text-center">
															<tr>
																<th className="text-gray-700">Punto de Montaje</th>
																<th className="text-gray-700">Tamaño (GB)</th>
																<th className="text-gray-700">Acciones</th>
															</tr>
														</thead>
														<tbody>
															{disk.PARTICIONES.map((partition, partIndex) => (
																<tr key={partIndex}>
																	<td>
																		<div className="d-flex align-items-center justify-content-center text-gray-700 text-center">
																			<i className="bi bi-folder text-primary me-2"></i>
																			{partition.PUNTO_MONTAJE}
																		</div>
																	</td>
																	<td className="text-center text-gray-700 fw-bold">{partition.GB_PARTICION}</td>
																	<td className="text-center">
																		<AccessController allowedRoles={['admin', 'ejecutor']} rol={rol}>
																			<div className="btn-group">
																				<button
																					className="btn btn-sm btn-outline-primary"
																					onClick={() => modalHook.openModal(
																						ModalViewForServerProvisioning.UPDATE_PARTITION,
																						ModalSize.LG, undefined,
																						{ requestInformation: requestVM, partitionInformation: partition }
																					)}
																				>
																					<i className="bi bi-pencil fs-3"></i>
																				</button>
																				<button
																					className="btn btn-sm btn-outline-danger"
																					onClick={() => modalHook.openModal(
																						ModalViewForServerProvisioning.ELIMINATE_PARTITION,
																						ModalSize.LG, undefined,
																						{ requestInformation: requestVM, partitionInformation: partition }
																					)}
																				>
																					<i className="bi bi-trash fs-3"></i>
																				</button>
																			</div>
																		</AccessController>
																	</td>
																</tr>
															))}
														</tbody>
													</table>
												</div>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="alert alert-info">No hay información de discos disponible.</div>
					)}
				</div>
			</div>
		</div>
	);
};

const RequestDetailSkeleton: FC<{ handleGoRequest: Function }> = ({ handleGoRequest }) => {
	return (
		<div className="container-fluid px-4">
			{/* Header with back button and actions */}
			<div className="d-flex justify-content-between align-items-center mb-4 bg-light p-3 rounded shadow-sm">
				<button
					className="btn btn-outline-primary btn-sm d-flex align-items-center"
					onClick={() => handleGoRequest()}
				>
					<i className="bi bi-arrow-left me-2"></i>
					<span>Volver a solicitudes</span>
				</button>
			</div>

			{/* Request Header Card Skeleton */}
			<div className="card border-0 shadow-sm mb-4">
				<div className="card-body p-4">
					<div className="row align-items-center">
						<div className="col-auto">
							<div
								className="d-flex justify-content-center align-items-center bg-light rounded-circle placeholder"
								style={{ width: "100px", height: "100px" }}
							></div>
						</div>
						<div className="col">
							<div className="d-flex flex-column placeholder-glow">
								<div className="d-flex align-items-center mb-2 text-muted">
									<div className="mb-0 me-3 placeholder rounded gb-gray-500 col-3"></div>
									<span className="placeholder rounded gb-gray-500 col-2"></span>
								</div>
								<div className="d-flex flex-wrap text-muted">
									<div className="me-4 mb-2 placeholder rounded gb-gray-500 col-4"></div>
									<div className="me-4 mb-2 placeholder rounded gb-gray-500 col-4"></div>
									<div className="mb-2 placeholder rounded gb-gray-500 col-4"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Timeline Card Skeleton */}
			<div className="card border-0 shadow-sm mb-4">
				<div className="card-header bg-transparent py-3 d-flex justify-content-between align-items-center">
					<h4 className="card-title m-0 d-flex align-items-center placeholder-glow">
						<i className="bi bi-clock-history text-primary me-2"></i>
						<span className="placeholder rounded gb-gray-500 col-6"></span>
					</h4>
					<button className="btn btn-sm btn-light placeholder"></button>
				</div>
				<div className="card-body placeholder-glow">
					<div className="d-flex justify-content-between">
						{[...Array(4)].map((_, index) => (
							<div key={index} className="text-center">
								<div className="rounded-circle placeholder mx-auto mb-2" style={{ width: '50px', height: '50px' }}></div>
								<div className="placeholder rounded gb-gray-500 col-8 mb-2"></div>
								<div className="placeholder rounded gb-gray-500 col-6"></div>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="row">
				<div className="col-lg-6 mb-4">
					{/* Request Details Card Skeleton */}
					<div className="card border-0 shadow-sm h-100">
						<div className="card-header bg-transparent py-3 d-flex justify-content-between align-items-center">
							<h4 className="card-title m-0 d-flex align-items-center placeholder-glow">
								<i className="bi bi-info-circle text-primary me-2"></i>
								<span className="placeholder col-6"></span>
							</h4>
							<button className="btn btn-sm btn-light placeholder"></button>
						</div>
						<div className="card-body placeholder-glow text-muted">
							<div className="row g-4">
								{[...Array(6)].map((_, index) => (
									<div key={index} className="col-md-6">
										<div className="d-flex flex-column">
											<span className="text-muted small placeholder col-5 mb-2"></span>
											<span className="fw-bold placeholder col-8"></span>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="col-lg-6 mb-4">
					{/* Implementation Options Card Skeleton */}
					<div className="card border-0 shadow-sm mb-4">
						<div className="card-header bg-transparent py-3 d-flex justify-content-between align-items-center">
							<h4 className="card-title m-0 d-flex align-items-center placeholder-glow">
								<i className="bi bi-gear text-primary me-2"></i>
								<span className="placeholder col-6"></span>
							</h4>
							<button className="btn btn-sm btn-light placeholder"></button>
						</div>
						<div className="card-body placeholder-glow text-muted">
							<div className="row g-3">
								{[...Array(3)].map((_, index) => (
									<div key={index} className="col-md-4">
										<div className="card h-100 border-0 bg-light">
											<div className="card-body text-center p-3">
												<div className="mb-3 placeholder" style={{ width: "50px", height: "50px", margin: "0 auto" }}></div>
												<div className="card-title mb-1 placeholder col-5" style={{ margin: "0 auto" }}></div>
												<p className="card-text small mb-0 placeholder col-10" style={{ margin: "0 auto" }}></p>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Datos de Ejecución Card Skeleton */}
					<div className="card border-0 shadow-sm">
						<div className="card-header bg-transparent py-3 d-flex justify-content-between align-items-center">
							<h4 className="card-title m-0 d-flex align-items-center placeholder-glow">
								<i className="bi bi-play-circle text-primary me-2"></i>
								<span className="placeholder col-6"></span>
							</h4>
							<button className="btn btn-sm btn-light placeholder"></button>
						</div>
						<div className="card-body placeholder-glow">
							<div className="row g-4">
								{[...Array(6)].map((_, index) => (
									<div key={index} className="col-md-6">
										<div className="d-flex flex-column">
											<span className="text-muted small placeholder col-5 mb-2"></span>
											<span className="fw-bold placeholder col-8"></span>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Hardware Specifications Card Skeleton */}
			<div className="card border-0 shadow-sm mb-4">
				<div className="card-header bg-transparent py-3 d-flex justify-content-between align-items-center">
					<h4 className="card-title m-0 d-flex align-items-center placeholder-glow">
						<i className="bi bi-cpu text-primary me-2"></i>
						<span className="placeholder col-6"></span>
					</h4>
					<button className="btn btn-sm btn-light placeholder"></button>
				</div>
				<div className="card-body placeholder-glow">
					<div className="row g-4 mb-4">
						{[...Array(3)].map((_, index) => (
							<div key={index} className="col-md-4">
								<div className="card h-100 border-0 bg-light">
									<div className="card-body text-center p-4">
										<div className="placeholder mb-3" style={{ width: "50px", height: "50px", margin: "0 auto" }}></div>
										<div className="display-6 fw-bold mb-1 placeholder col-5" style={{ margin: "0 auto" }}></div>
										<p className="text-muted mb-0 placeholder col-6" style={{ margin: "0 auto" }}></p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Storage Section Skeleton */}
			<div className="card border-0 shadow-sm mb-4">
				<div className="card-header bg-transparent py-3 d-flex justify-content-between align-items-center">
					<div className="d-flex align-items-center placeholder-glow">
						<i className="bi bi-hdd fs-3 text-primary me-2"></i>
						<span className="card-title m-0 placeholder col-4"></span>
						<span className="badge bg-primary ms-2 placeholder col-2"></span>
					</div>
					<div className="btn-group placeholder-glow">
						<button className="btn btn-sm btn-primary placeholder col-8"></button>
						<button className="btn btn-sm btn-light placeholder col-4"></button>
					</div>
				</div>
				<div className="card-body placeholder-glow">
					<div className="row g-4">
						{[...Array(2)].map((_, index) => (
							<div key={index} className="col-lg-6">
								<div className="card border shadow-sm">
									<div className="card-header bg-light d-flex justify-content-between align-items-center">
										<div className="d-flex align-items-center">
											<i className="bi bi-hdd text-primary me-2"></i>
											<div className="mb-0 placeholder col-6"></div>
										</div>
										<div className="btn-group">
											<button className="btn btn-sm btn-outline-primary placeholder"></button>
											<button className="btn btn-sm btn-outline-danger placeholder"></button>
											<button className="btn btn-sm btn-outline-success placeholder"></button>
										</div>
									</div>
									<div className="card-body p-0">
										<div className="table-responsive">
											<table className="table table-striped table-hover mb-0">
												<thead className="table-light">
													<tr>
														<th className="placeholder col-6"></th>
														<th className="placeholder col-3"></th>
														<th className="placeholder col-3"></th>
													</tr>
												</thead>
												<tbody>
													{[...Array(2)].map((_, idx) => (
														<tr key={idx}>
															<td>
																<div className="d-flex align-items-center">
																	<i className="bi bi-folder text-primary me-2"></i>
																	<span className="placeholder col-8"></span>
																</div>
															</td>
															<td className="text-center fw-bold placeholder col-4"></td>
															<td className="text-center">
																<div className="btn-group">
																	<button className="btn btn-sm btn-outline-primary placeholder"></button>
																	<button className="btn btn-sm btn-outline-danger placeholder"></button>
																</div>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};