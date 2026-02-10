import { FC, useEffect, useState } from 'react';
import { useBackupsPoliciesContext } from '../Context';
import { useVersion } from '../hooks/useVersion';

export const DetailPoliticsVersions: FC = () => {
    const { modalHook } = useBackupsPoliciesContext();
    const [details] = useState<any>(null);
    const [loading] = useState(false);

    // Hook para tareas de la versión
    const { tasks, loadingTasks, getTasksOfPolicy } = useVersion();

    const idPolitica = modalHook.modalInformation?.id_policy;
    const nroVersion = modalHook.modalInformation?.nro_version;

    useEffect(() => {
        if (idPolitica && nroVersion) {
            getTasksOfPolicy(idPolitica.toString(), nroVersion.toString());
        }
    }, [idPolitica, nroVersion, getTasksOfPolicy]);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4 bg-light p-3 rounded shadow-sm">
                <button className="btn btn-outline-primary btn-sm d-flex align-items-center" onClick={() => modalHook.closeModal()}>
                    <i className="bi bi-arrow-left me-2"></i>
                    Volver a la Tabla de Versiones de Políticas
                </button>
            </div>
            <h2 className="fw-bold mb-4">Detalle de Versión de Políticas</h2>
            {loading && <div>Cargando detalles...</div>}
            {!loading && details && (
                <pre>{JSON.stringify(details, null, 2)}</pre>
            )}
            <h3 className="mt-4">Tareas de la Versión</h3>
            {loadingTasks && <div>Cargando tareas...</div>}
            {!loadingTasks && tasks && Array.isArray(tasks) && (
                <div style={{maxHeight:'50vh', overflowY:'auto', padding: '0 24px',}} className="table-responsive">
                    <table className="table table-bordered table-align-middle">
                        <thead className='table-light'>
                            <tr>
                                <th>Nombre Tarea</th>
                                <th>Herramienta</th>
                                <th>Frecuencia</th>
                                <th>Contenido</th>
                                <th>Modo</th>
                                <th>Tipo Backup</th>
                                <th>Servidor</th>
                                <th>Estado</th>
                                <th>Protección</th>
                                <th>Medio</th>
                                <th>Cell Manager</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task:any) => (
                                <tr key={task.id_poli_tarea}>
                                    <td>{task.nombre_tarea}</td>
                                    <td>{task.herramienta}</td>
                                    <td>{task.frecuencia}</td>
                                    <td>{task.contenido}</td>
                                    <td>{task.modo}</td>
                                    <td>{task.tipo_backup}</td>
                                    <td>{task.bks_server}</td>
                                    <td>{task.proceso_estado}</td>
                                    <td>{task.proteccion}</td>
                                    <td>{task.medio}</td>
                                    <td>{task.cell_manager}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};