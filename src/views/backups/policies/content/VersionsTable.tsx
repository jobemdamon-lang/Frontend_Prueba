import { FC } from 'react';
import { useBackupsPoliciesContext } from '../Context';
import { ModalSize } from "../../../../hooks/Types"
import { ModalViewForBackupsPolicies } from '../Types';

export const VersionsTable: FC = () => {
    const { policies, policiesLoading, modalHook } = useBackupsPoliciesContext();

    return (
        <div>
            <div className="table-responsive">
                <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                    <thead>
                        <tr className="fw-bold text-muted fs-6">
                            <th className="w-auto">Versión</th>
                            <th className="w-auto">Motivo</th>
                            <th className="w-auto">Estado</th>
                            <th className="w-auto">Fecha de Versión</th>
                            <th className="w-auto">Ticket</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policiesLoading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-10 fs-6 text-gray-600">
                                    Cargando datos...
                                </td>
                            </tr>
                        ) : policies.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-10 fs-6 text-gray-600">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="text-center py-10">
                                                <div className="mb-5">
                                                    <i className="bi bi-inbox text-gray-400 fs-5x"></i>
                                                </div>
                                                <h3 className="fw-bold text-gray-800 mb-2">No se encontraron resultados</h3>
                                                <p className="text-muted fs-4 mb-5">
                                                    No hay versiones de la política registradas.
                                                    <br />
                                                    Seleccione un cliente y proyecto para mostrar sus versiones.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            policies.map((item, index) => (
                                <tr key={item.id_bkversion || index}>
                                    <td>{item.nro_version}</td>
                                    <td>{item.motivo}</td>
                                    <td>{item.estado}</td>
                                    <td>{item.fecha_version}</td>
                                    <td>{item.nro_ticket || 'N/A'}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-light-primary"
                                            onClick={() => {modalHook.openModal(ModalViewForBackupsPolicies.DETAIL_POLITICS_VERSIONS, ModalSize.XL, true, {id_policy: item.id_politica, nro_version: item.nro_version})}}
                                        >
                                            Ver Detalles
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