import React, { useEffect, useState } from "react";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { useMonitoringPoliciesContext } from "../Context";
import { useTypedSelector } from "../../../../store/ConfigStore";
import { DataList } from "../../../../components/Inputs/DataListInput";
import { Loader } from "../../../../components/Loading";
import { ProjectMonitored } from "../Types";

type OnCreatePolicy = (clientName: string, projectName: string) => void;

interface onCreatePolicyProps {
  onCreatePolicy?: OnCreatePolicy;
}

export const InitializePolicy = () => {

    const { modalHook, policyHook, catalogHook } = useMonitoringPoliciesContext()
    const { onCreatePolicy } = modalHook.modalInformation as onCreatePolicyProps;
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    
    const [projects, setProjects] = useState<ProjectMonitored[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<ProjectMonitored[]>([]);
    const [clients, setClients] = useState<string[]>([]);
    const [selectedClient, setSelectedClient] = useState("");
    const [selectedProject, setSelectedProject] = useState("");

    const handleInitialize = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const selected = projects.find(p => p.NOMBRE_PROYECTO === selectedProject)
        if (!selected) return;
        
        const success = await policyHook.initializePolicy({
            id_politica: 0,
            nro_version: 0,
            usuario: userName,
            id_proyecto: selected.ID_PROYECTO,
            lista_equipo: [],
        })

        if (success) {
            if (onCreatePolicy) {
                onCreatePolicy(selected.CLIENTE, selected.NOMBRE_PROYECTO);
            }
            modalHook.closeModal()
        }
    }
    
    const onClientChange = (clientName: string) => {
        setSelectedClient(clientName);
        setSelectedProject("");

        const filtered = clientName
            ? projects.filter(p => p.CLIENTE === clientName)
            : projects;

        setFilteredProjects(filtered);
    };
    
    const handleRefresh = () => {
        catalogHook.getProjectsMonitoringNewVersion().then(response => {
            if (response) {
                setProjects(response);
                setFilteredProjects(response);

                // Extraer clientes únicos de los proyectos
                const uniqueClients = [...new Set(response.map(p => p.CLIENTE))];
                setClients(uniqueClients.sort());
            }
        });
    }

    useEffect(() => {
        handleRefresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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

            <form onSubmit={handleInitialize}>
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

                    <div className="row">
                        <div className="col-12 mb-5">
                            <DataList
                                label="Cliente"
                                value={selectedClient}
                                loading={catalogHook.loadingProjectsNew}
                                items={clients.map(client => ({
                                    id: client,
                                    value: client,
                                    node: (
                                        <span className="text-gray-800">
                                            <i className="bi bi-person-square me-2" />
                                            {client}
                                        </span>
                                    ),
                                }))}
                                onChange={onClientChange}
                            />
                        </div>
                        <div className="col-12">
                            <DataList
                                label="Proyecto"
                                value={selectedProject}
                                loading={catalogHook.loadingProjectsNew}
                                items={filteredProjects.map(p => ({
                                    id: p.ID_PROYECTO,
                                    value: p.NOMBRE_PROYECTO,
                                    node: (
                                        <span className="text-gray-800">
                                            <i className="bi bi-building me-2"></i>
                                            {p.NOMBRE_PROYECTO}
                                        </span>
                                    ),
                                }))}
                                onChange={setSelectedProject}
                            />
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={policyHook.initializeLoading || !selectedProject}
                    >
                        {policyHook.initializeLoading ? (
                            <>
                                <Loader className="spinner-border-sm me-2" />
                                Procesando
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check2-circle me-2"></i>
                                Confirmar
                            </>
                        )}
                    </button>

                    <button type="button" className="btn btn-light" onClick={modalHook.closeModal}>
                        Cancelar
                    </button>
                </div>
            </form>
        </>
    )
}
