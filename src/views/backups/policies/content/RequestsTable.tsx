import { FC } from 'react';
import { useBackupsPoliciesContext } from '../Context';
import { useNavigate } from 'react-router-dom';

export const RequestsTable: FC = () => {
    const { requests, requestsLoading } = useBackupsPoliciesContext();
    const navigate = useNavigate();

    const handleInfoClick = (id: number) => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('id', String(id));
        navigate(`${window.location.pathname}?${searchParams.toString()}`);
    };
    
    const getEtapaBadgeClass = (etapa: string) => {
        switch (etapa) {
            case 'Iniciado': return 'badge badge-light-primary';
            case 'Terminado': return 'badge badge-light-success';
            case 'Cancelado': return 'badge badge-light-danger';
            default: return 'badge badge-light-secondary';
        }
    };

    const getTipoSolBadgeClass = (tipo: string) => {
        switch (tipo) {
            case 'Manual': return 'badge badge-light-info';
            case 'Automatica': return 'badge badge-light-warning';
            default: return 'badge badge-light-secondary';
        }
    };

    return (
        <div>
            <div className="table-responsive">
                <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                    <thead>
                        <tr className="fw-bold text-muted fs-6">
                            <th>ID</th>
                            <th>Ticket</th>
                            <th>Etapa</th>
                            <th>Tipo</th>
                            <th>Solicitante</th>
                            <th>Fecha Registro</th>
                            <th>Motivo</th>
                            <th>Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requestsLoading ? (
                            <tr>
                                <td colSpan={7} className="text-center py-10 fs-6 text-gray-600">
                                    Cargando datos...
                                </td>
                            </tr>
                        ) : !Array.isArray(requests) || requests.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-10 fs-6 text-gray-600">
                                    <div className="text-center py-10">
                                        <i className="bi bi-inbox text-gray-400 fs-5x"></i>
                                        <h3 className="fw-bold text-gray-800 mb-2">No hay cambios en proceso</h3>
                                        <p className="text-muted fs-4">
                                            No se encontraron solicitudes de cambio para este grupo de política.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            requests.map((item: any, index: number) => (
                                <tr key={item.id_solicitud || index}>
                                    <td>{item.id_solicitud}</td>
                                    <td>{item.nro_ticket}</td>
                                    <td><span className={getEtapaBadgeClass(item.etapa)}>{item.etapa}</span></td>
                                    <td><span className={getTipoSolBadgeClass(item.tipo_sol)}>{item.tipo_sol}</span></td>
                                    <td>{item.solicitante}</td>
                                    <td>{item.fecha_registro}</td>
                                    <td title={item.motivo}>
                                        {item.motivo?.length > 50 ? `${item.motivo.substring(0, 50)}...` : item.motivo}
                                    </td>
                                    <td>    
                                        <button
                                            className="btn btn-sm btn-light-primary"
                                            onClick={() => handleInfoClick(item.id_solicitud)}
                                        >
                                            Ver Info
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};