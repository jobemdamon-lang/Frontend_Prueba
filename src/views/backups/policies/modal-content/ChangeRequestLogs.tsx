import React, { useState, useEffect } from "react";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { useBackupsPoliciesContext } from "../Context";

interface LogEntry {
    id: number;
    fecha: string;
    usuario: string;
    accion: string;
    detalles: string;
    tipo: 'info' | 'success' | 'warning' | 'error';
}

interface Props {
    solicitudId?: number;
    onClose?: () => void;
}

export const ChangeRequestLogs: React.FC<Props> = ({ solicitudId, onClose }) => {
    const { modalHook } = useBackupsPoliciesContext();
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'info' | 'success' | 'warning' | 'error'>('all');

    // Datos mock - Reemplazar con llamada real al servicio
    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                // const response = await BackupService.getRequestLogs(solicitudId);
                // setLogs(response.data);
                
                // Mock data
                setTimeout(() => {
                    setLogs([
                        {
                            id: 1,
                            fecha: '2024-10-24 10:30:15',
                            usuario: 'juan.perez',
                            accion: 'Solicitud creada',
                            detalles: 'Se creó la solicitud de cambio para actualizar políticas de backup',
                            tipo: 'info'
                        },
                        {
                            id: 2,
                            fecha: '2024-10-24 11:15:30',
                            usuario: 'maria.garcia',
                            accion: 'Solicitud revisada',
                            detalles: 'Se revisó la solicitud y se aprobó para ejecución',
                            tipo: 'success'
                        },
                        {
                            id: 3,
                            fecha: '2024-10-24 14:20:45',
                            usuario: 'sistema',
                            accion: 'Validación fallida',
                            detalles: 'Error al validar configuración: Política duplicada encontrada',
                            tipo: 'error'
                        },
                        {
                            id: 4,
                            fecha: '2024-10-24 15:05:10',
                            usuario: 'carlos.lopez',
                            accion: 'Corrección aplicada',
                            detalles: 'Se corrigió el error de política duplicada',
                            tipo: 'warning'
                        }
                    ]);
                    setLoading(false);
                }, 500);
            } catch (error) {
                console.error('Error al cargar logs:', error);
                setLoading(false);
            }
        };

        if (solicitudId) {
            fetchLogs();
        }
    }, [solicitudId]);

    const getIconByType = (tipo: string) => {
        switch (tipo) {
            case 'success':
                return 'bi-check-circle-fill text-success';
            case 'error':
                return 'bi-x-circle-fill text-danger';
            case 'warning':
                return 'bi-exclamation-triangle-fill text-warning';
            default:
                return 'bi-info-circle-fill text-info';
        }
    };

    const getBadgeByType = (tipo: string) => {
        switch (tipo) {
            case 'success':
                return 'badge-light-success';
            case 'error':
                return 'badge-light-danger';
            case 'warning':
                return 'badge-light-warning';
            default:
                return 'badge-light-info';
        }
    };

    const filteredLogs = filter === 'all' 
        ? logs 
        : logs.filter(log => log.tipo === filter);

    return (
        <>
            <div className='modal-header py-4'>
                <div className="d-flex align-items-center">
                    <i className="bi bi-clock-history me-2 fs-3"></i>
                    <div>
                        <h2 className="mb-0">Historial de Logs</h2>
                        <span className="text-muted fs-7">Solicitud #{solicitudId}</span>
                    </div>
                </div>
                <div 
                    className='btn btn-sm btn-icon btn-active-color-primary' 
                    onClick={() => modalHook.closeModal()}
                >
                    <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                </div>
            </div>

            <div className='modal-body pt-2 px-lg-10'>
                {/* Filtros */}
                <div className="d-flex gap-2 mb-5 flex-wrap">
                    <button 
                        className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-light'}`}
                        onClick={() => setFilter('all')}
                    >
                        Todos ({logs.length})
                    </button>
                    <button 
                        className={`btn btn-sm ${filter === 'info' ? 'btn-info' : 'btn-light'}`}
                        onClick={() => setFilter('info')}
                    >
                        <i className="bi bi-info-circle me-1"></i>
                        Info ({logs.filter(l => l.tipo === 'info').length})
                    </button>
                    <button 
                        className={`btn btn-sm ${filter === 'success' ? 'btn-success' : 'btn-light'}`}
                        onClick={() => setFilter('success')}
                    >
                        <i className="bi bi-check-circle me-1"></i>
                        Éxito ({logs.filter(l => l.tipo === 'success').length})
                    </button>
                    <button 
                        className={`btn btn-sm ${filter === 'warning' ? 'btn-warning' : 'btn-light'}`}
                        onClick={() => setFilter('warning')}
                    >
                        <i className="bi bi-exclamation-triangle me-1"></i>
                        Advertencias ({logs.filter(l => l.tipo === 'warning').length})
                    </button>
                    <button 
                        className={`btn btn-sm ${filter === 'error' ? 'btn-danger' : 'btn-light'}`}
                        onClick={() => setFilter('error')}
                    >
                        <i className="bi bi-x-circle me-1"></i>
                        Errores ({logs.filter(l => l.tipo === 'error').length})
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-10">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="text-muted mt-3">Cargando historial...</p>
                    </div>
                )}

                {/* Timeline de Logs */}
                {!loading && filteredLogs.length > 0 && (
                    <div className="timeline timeline-border-dashed">
                        {filteredLogs.map((log, index) => (
                            <div className="timeline-item" key={log.id}>
                                <div className="timeline-line"></div>
                                
                                <div className="timeline-icon">
                                    <i className={`bi ${getIconByType(log.tipo)} fs-2`}></i>
                                </div>
                                
                                <div className="timeline-content mb-10 mt-n1">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="fw-bold text-gray-800 fs-6">
                                                {log.accion}
                                            </span>
                                            <span className={`badge ${getBadgeByType(log.tipo)} fs-8`}>
                                                {log.tipo.toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-muted fs-7">{log.fecha}</span>
                                    </div>
                                    
                                    <p className="text-muted mb-2 fs-7">
                                        {log.detalles}
                                    </p>
                                    
                                    <div className="d-flex align-items-center text-muted fs-8">
                                        <i className="bi bi-person fs-6 me-1"></i>
                                        <span>{log.usuario}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredLogs.length === 0 && (
                    <div className="text-center py-10">
                        <i className="bi bi-inbox fs-3x text-muted mb-3"></i>
                        <p className="text-muted fs-5">
                            No hay logs {filter !== 'all' ? `de tipo "${filter}"` : ''} para mostrar
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div className="d-flex justify-content-between align-items-center mt-8 pt-5 border-top">
                    <span className="text-muted fs-7">
                        <i className="bi bi-calendar-event me-1"></i>
                        Última actualización: {new Date().toLocaleString('es-PE')}
                    </span>
                    <button 
                        className="btn btn-light-primary btn-sm"
                        onClick={() => modalHook.closeModal()}
                    >
                        <i className="bi bi-x-circle me-2"></i>
                        Cerrar
                    </button>
                </div>
            </div>
        </>
    );
};