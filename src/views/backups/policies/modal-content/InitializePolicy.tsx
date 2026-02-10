import React, { useEffect, useMemo, useState } from "react";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { useBackupsPoliciesContext } from "../Context";
import { useClient } from '../../../../hooks/useClient'
import { useProject } from '../../../../hooks/useProjects'
import { DataList } from "../../../../components/Inputs/DataListInput";

// Lo recomendable será que solo reciba un endpoint que liste los clientes/proyectos que NO tienen grupo politica
// por ahora se está trabajando todo con la lista de clientes/proyectos que EXISTEN

export const InitializePolicy = () => {
    const { modalHook } = useBackupsPoliciesContext();
    const { clientsWithCMDB, getClientsWithCMDBD, loadingGetClientsWithCMDB } = useClient()
    const { projects, getProjects, loadingGetProjects } = useProject()

    const [selectedClient, setSelectedClient] = useState<string>("")
    const [selectedProject, setSelectedProject] = useState<string>("")
    
    useEffect(() => {
        getClientsWithCMDBD();
    }, [getClientsWithCMDBD]);

    useEffect(() => {
        setSelectedProject("");
        if(selectedClient){
            getProjects(selectedClient);
        }
    }, [selectedClient, getProjects]);

    const clientsForDataList = useMemo(() => clientsWithCMDB.map((client: any) => ({
        id: client.id,
        value: client.value,
        node: <span className="text-gray-800"><i className="bi bi-person-square me-2" />{client.value}</span>
    })), [clientsWithCMDB])

    const projectsForDataList = useMemo(() => projects.map((project: any) => ({
        id: project.id,
        value: project.value,
        node: <span className="text-gray-800"><i className="bi bi-folder me-2" />{project.value}</span>
    })), [projects])

    return (
        <>
            <div className="modal-header py-3">
                <h2 className="text-dark">Inicializar Política</h2>
                <div
                    className="btn btn-sm btn-icon btn-active-color-primary"
                    onClick={modalHook.closeModal}
                    title="Cerrar"
                >
                    <KTSVG className="svg-icon-1" path="/media/icons/duotune/arrows/arr061.svg" />
                </div>
            </div>

            <div className="modal-body">
                <div className="mb-5">
                        <div className="alert alert-info d-flex align-items-start">
                            <i className="bi bi-info-circle fs-2 me-3"></i>
                            <div>
                                Al inicializar la política se creará una <strong>versión base vacía</strong>,
                                que podrá ser posteriormente <strong>editada y actualizada</strong> con los
                                cambios que se requieran.
                            </div>
                        </div>
                    </div>
            </div>
            <div className="d-flex flex-row align-items-center justify-content-center w-100 gap-4 mb-4">
                <DataList
                    value={selectedClient}
                    label="Cliente"
                    loading={loadingGetClientsWithCMDB}
                    items={clientsForDataList}
                    onChange={setSelectedClient}
                />
                <DataList
                    value={selectedProject}
                    label="Proyecto"
                    loading={loadingGetProjects}
                    items={projectsForDataList}
                    onChange={setSelectedProject}
                    disabled={!selectedClient || projects.length === 0}
                />
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={modalHook.closeModal}>
                    Cancelar
                </button>
                <button type="button" className="btn btn-primary" disabled={!selectedClient || !selectedProject}>
                    Inicializar
                </button>
            </div>
        </>
    );
}
