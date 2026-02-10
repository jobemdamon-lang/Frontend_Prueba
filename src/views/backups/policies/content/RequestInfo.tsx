import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRequestChange } from '../hooks/useRequestChange';
import { TimeLine } from '../modal-content/TimeLine';
import { useBackupsPoliciesContext} from '../Context';
import { ModalViewForBackupsPolicies } from '../Types';
import { ModalSize } from '../../../../hooks/Types';

/* Mockeado data para la tabla */
const mockTableData = [
    {
        estadoFlujo: "Iniciado",
        aprobador: "Miguel Angel Quiroz",
        area: "NOC",
        cambio: "Nuevo",
        nombreTarea: "100988_UNIC",
        servidor: "BFHOSRBI01 Antivirus",
        tipo: "Full",
        frecuencia: "Semanal"
    },
    {
        estadoFlujo: "Terminado",
        aprobador: "Kevin Valderrama",
        area: "Backup",
        cambio: "Actualización",
        nombreTarea: "105020_MARATHON",
        servidor: "SRV01",
        tipo: "Incremental",
        frecuencia: "Diario"
    }
];

export const RequestInfo: React.FC = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const id = query.get("id");

    const navigate = useNavigate();
    const { requestChange, requestChangeLoading, getRequestChange } = useRequestChange();

    const { modalHook } = useBackupsPoliciesContext();

    useEffect(() => {
        if (id) getRequestChange(id);
    }, [id, getRequestChange]);

    const handleGoBack = () => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete('id');
        navigate(`${location.pathname}?${searchParams.toString()}`);
    };

    const info = requestChange?.lista?.[0];

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4 bg-light p-3 rounded shadow-sm">
                <button className="btn btn-outline-primary btn-sm d-flex align-items-center" onClick={handleGoBack}>
                    <i className="bi bi-arrow-left me-2"></i>
                    Volver a Políticas de Backup
                </button>
            </div>
            {/* Card 1: Solicitud y badge con botones de acción */}
            <div className="card border-0 shadow-sm mb-4">
                {requestChangeLoading ? (
                    <div className="card-body">
                        <div className="placeholder-glow">
                            <span className="placeholder col-12 mb-2"></span>
                        </div>
                    </div>
                ) : info ? (
                    <div className="card-body">
                        <div className="d-flex align-items-start justify-content-between">
                            {/* Sección izquierda: Información */}
                            <div className="flex-grow-1">
                                <div className="d-flex align-items-center mb-2">
                                    <h2 className="mb-0 me-3 fs-1">Solicitud #{info.id_solicitud}</h2>
                                    <span className="badge bg-secondary fs-4 px-4 py-2">{info.etapa}</span>
                                </div>
                                <div className="mt-2 text-muted">
                                    <span className='fs-5 ms-4'><i className="bi bi-person me-2 fs-2"></i>{info.usuarioSolicitante}</span>
                                    <span className="fs-5 ms-4"><i className="bi bi-tag me-2 fs-2"></i>{info.proyecto}</span>
                                    <span className="fs-5 ms-4"><i className="bi bi-ticket me-2 fs-2"></i>{info.nro_ticket}</span>
                                </div>
                            </div>
                            
                            <div className="d-flex gap-2 ms-4 align-items-start flex-wrap flex-md-nowrap">
                                {/* ADVERTENCIA:1ER PASO -> NO HABRÁ BOTONES, SOLO PASA AL 2DO PASO CUANDO SE INGRESA UNA TAREA (AUTOMATICO)
                                                2DO PASO -> HABRÁ BOTON PARA ENVIAR SOLICITUD, ESTO PERMITIRÁ MANDARLO AL 3ER PASO
                                                3ER PASO -> HABRÁ BOTON PARA TERMINAR SOLICITUD, ESTO LO MANDARÁ AL ÚLTIMO PASO
                                                4TO PASO -> NADA, SE ACABÓ 
                                                CANCELADO -> ESTE BOTON NO EXISTIRÁ */}
                                {info.etapa.toUpperCase() !== 'CANCELADO' && info.etapa.toUpperCase() !== "TERMINADO" && (
                                    <button className="btn btn-primary d-flex align-items-center"
                                    onClick={() => modalHook.openModal(ModalViewForBackupsPolicies.SEND_REQUEST_APPROVAL,ModalSize.SM,undefined,{})}>
                                        <i className="bi bi-send-fill me-2"></i>
                                        Enviar Solicitud
                                    </button>
                                )}
                                {/* ADVERTENCIA:1ER, 2DO, 3ER PASO -> EXISTIRÁ CANCELAR
                                                4TO PASO -> NADA, SE ACABÓ 
                                                CANCELADO -> ESTE BOTON NO EXISTIRÁ */}
                                {info.etapa.toUpperCase() !== 'CANCELADO' && info.etapa.toUpperCase() !== "TERMINADO" && (
                                    <button
                                        className="btn btn-danger d-flex align-items-center fw-bold"
                                        onClick={() => modalHook.openModal(ModalViewForBackupsPolicies.CANCEL_CHANGE_REQUEST, ModalSize.SM, undefined, { solicitudId: info.id_solicitud })}>
                                        <i className="bi bi-slash-circle me-2"></i>
                                        Cancelar
                                    </button>
                                )}
                                {/* ADVERTENCIA: ESTO EXISTIRÁ SIEMPRE */}
                                <button 
                                    className="btn btn-secondary d-flex align-items-center fw-bold btn-logs-custom"
                                    onClick={() => modalHook.openModal(ModalViewForBackupsPolicies.CHANGE_REQUEST_LOGS, ModalSize.XL, undefined, { solicitudId: info.id_solicitud })}>
                                    <i className="bi bi-list-ul me-2"></i>
                                    Logs
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
            {/* Card 2: Timeline */}
            <div className="card border-0 shadow-sm mb-4">
                {requestChangeLoading ? (
                    <>
                        <div className="card-header bg-transparent py-3">
                            <span className="placeholder col-8"></span>
                        </div>
                        <div className="card-body">
                            <div className="placeholder-glow">
                                <span className="placeholder col-12 mb-2"></span>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="card-header bg-transparent py-3">
                            <h4 className="card-title text-center m-0">
                                <i className="bi bi-clock-history text-primary me-2 fs-1"></i>
                                Flujo de la Solicitud
                            </h4>
                        </div>
                        <div className="card-body">
                            {info ? (
                                <TimeLine modalInformation={info} />
                            ) : null}
                        </div>
                    </>
                )}
            </div>
            {/* Card 3: Tabla de tareas */}
            <div className="card border-0 shadow-sm mb-4">
                {requestChangeLoading ? (
                    <>
                        <div className="card-header bg-transparent py-3 d-flex justify-content-between align-items-center">
                            <span className="placeholder col-6"></span>
                            <span className="placeholder col-2"></span>
                        </div>
                        <div className="card-body">
                            <div className="placeholder-glow">
                                <span className="placeholder col-12 mb-2"></span>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                    <div className="card-header bg-transparent py-3 d-flex justify-content-between align-items-center">
                        <h4 className="card-title text-center m-0">
                            Detalle de Tareas de Backup
                        </h4>
                        <div>
                            <button className="btn btn-link text-dark me-2"
                            onClick={()=>modalHook.openModal(ModalViewForBackupsPolicies.CREATE_NEW_TASK,ModalSize.LG,undefined,{})}>
                                <i className="bi bi-plus-circle me-1"></i>
                                Nueva tarea
                            </button>
                            {/* Ingresar acá más botones para las tareas de backup */}
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Estado de Flujo</th>
                                        <th>Aprobador</th>
                                        <th>Área</th>
                                        <th>Cambio</th>
                                        <th>Nombre de Tarea</th>
                                        <th>Servidor</th>
                                        <th>Tipo</th>
                                        <th>Frecuencia</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockTableData.map((row, idx) => (
                                        <tr key={idx}>
                                            <td>{row.estadoFlujo}</td>
                                            <td>{row.aprobador}</td>
                                            <td>{row.area}</td>
                                            <td>{row.cambio}</td>
                                            <td>{row.nombreTarea}</td>
                                            <td>{row.servidor}</td>
                                            <td>{row.tipo}</td>
                                            <td>{row.frecuencia}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
            </div>
        </div>
    );
};