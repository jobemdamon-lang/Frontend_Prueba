import { useEffect, useState } from "react"
import { Tab, Tabs } from "../../../../components/Tabs"
import { VersionsTable } from "./VersionsTable"
import { DataList } from "../../../../components/Inputs/DataListInput"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { useMonitoringPoliciesContext } from "../Context"
import { ModalViewForMonitoringPolicies, ProjectMonitored } from "../Types"
import { ModalSize } from "../../../../hooks/Types"
import { ChangeRequestsTable } from "./ChangeRequestsTable"
import { findLastImplementedVersion } from "../utils"
import { useExport } from "../hooks/useExport"
import { AccessController } from "../../../../components/AccessControler"
import { AnalyticsService } from "../../../../helpers/analytics"

export const PoliciesMain = () => {

    const {
        modalHook,
        policyHook,
        changesHook,
        catalogHook,
        setCurrentView,
        setGlobalParams,
        globalParams,
        rol
    } = useMonitoringPoliciesContext()

    const { exportVersion, loading } = useExport()
    const [projects, setProjects] = useState<ProjectMonitored[]>([])
    const [filteredProjects, setFilteredProjects] = useState<ProjectMonitored[]>([])
    const [clients, setClients] = useState<string[]>([])
    const [selectedClient, setSelectedClient] = useState("")
    const [selectedProject, setSelectedProject] = useState("")

    const onRefresh = () =>{
        catalogHook.getProjectsMonitoringOldVersion(1).then(response => {
            if (response) {
                setProjects(response)
                setFilteredProjects(response)
                const uniqueClients = [...new Set(response.map(p => p.CLIENTE))]
                setClients(uniqueClients.sort())
            }
        })
    }

    useEffect(() => {
        onRefresh()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    const onClientChange = (clientName: string) => {
        setSelectedClient(clientName)
        setSelectedProject("")

        const filtered = clientName
            ? projects.filter(p => p.CLIENTE === clientName)
            : projects

        setFilteredProjects(filtered)

        setGlobalParams(prev => ({
            ...prev,
            clientID: 0,
            projectID: 0,
        }))
    }

    const onProjectChange = (projectName: string) => {
        const project = projects.find(p => p.NOMBRE_PROYECTO === projectName && p.CLIENTE === selectedClient)
        if (!project) return

        setSelectedProject(project.NOMBRE_PROYECTO)
        setGlobalParams(prev => ({
            ...prev,
            projectID: Number(project.ID_PROYECTO),
            clientID: 0
        }))

        policyHook.getVersionsByProject(project.ID_PROYECTO)
        changesHook.getListChanges(project.ID_PROYECTO)
    }

    const onCreatePolicy = (clientName: string, projectName: string) => {
        catalogHook.getProjectsMonitoringOldVersion(1).then(response => {
            if (response) {
                setSelectedClient("");
                setSelectedProject("");
                
                setProjects(response)

                setFilteredProjects(response)
                const uniqueClients = [...new Set(response.map(p => p.CLIENTE))]
                setClients(uniqueClients.sort())

                setSelectedClient(clientName)
                const filtered = clientName
                    ? response.filter(p => p.CLIENTE === clientName)
                    : response

                setFilteredProjects(filtered)

                setGlobalParams(prev => ({
                    ...prev,
                    clientID: 0,
                    projectID: 0,
                }))
                
                const project = response.find(p => p.NOMBRE_PROYECTO === projectName && p.CLIENTE === clientName)
                
                if (!project) return

                setSelectedProject(project.NOMBRE_PROYECTO)
                setGlobalParams(prev => ({
                    ...prev,
                    projectID: Number(project.ID_PROYECTO),
                    clientID: 0
                }))
                console.log(projects);
                console.log(response);
                
                
                policyHook.getVersionsByProject(project.ID_PROYECTO)
                changesHook.getListChanges(project.ID_PROYECTO)
            }
        });

    }

    const openUpdateView = () => {
        const lastVersion = findLastImplementedVersion(policyHook.versions)
        if (!lastVersion) return
        AnalyticsService.event("update_policy", {
            module: "politicas_monitoreo_v2",
            metadata: { nombre_politica: lastVersion?.NOMBRE }
        })
        setCurrentView("update_policy")
        setGlobalParams(prev => ({
            ...prev,
            policyID: lastVersion.ID_POLITICA,
            versionID: lastVersion.ID_VERSION,
        }))
    }

    const openDeleteCI = () => {
        const lastVersion = findLastImplementedVersion(policyHook.versions)
        if (!lastVersion) return
        AnalyticsService.event("delete_ci", {
            module: "politicas_monitoreo_v2",
            metadata: { nombre_politica: lastVersion?.NOMBRE }
        })
        modalHook.openModal(ModalViewForMonitoringPolicies.DELETE_CI, ModalSize.LG, undefined, {
            idPolicy: lastVersion.ID_POLITICA,
            idVersion: lastVersion.ID_VERSION,
        })
    }

    const openHistoric = () => {

        modalHook.openModal(ModalViewForMonitoringPolicies.HISTORIC, ModalSize.XL, true, {})
    }

    const openInitializePolicy = () => {
        AnalyticsService.event("initialize_policy", { module: "politicas_monitoreo_v2" })
        modalHook.openModal(ModalViewForMonitoringPolicies.INITIALIZE_POLICY, ModalSize.SM, undefined, { onCreatePolicy:onCreatePolicy})
    }

    const downloadPolicy = () => {
        const lastVersion = findLastImplementedVersion(policyHook.versions)
        if (!lastVersion) return
        AnalyticsService.event("download_policy", {
            module: "politicas_monitoreo_v2",
            metadata: { nombre_politica: lastVersion?.NOMBRE }
        })
        exportVersion(lastVersion.ID_POLITICA, 0)
    }

    const openChargePolicy = () => {
        const lastVersion = findLastImplementedVersion(policyHook.versions)
        if (!lastVersion) return
        
        AnalyticsService.event("charge_policy", {
            module: "politicas_monitoreo_v2",
            metadata: { nombre_politica: lastVersion?.NOMBRE }
        })
        
        setGlobalParams(prev => ({
            ...prev,
            policyID: lastVersion.ID_POLITICA,
            versionID: lastVersion.ID_VERSION,
        }))
        
        modalHook.openModal(ModalViewForMonitoringPolicies.CHARGE_POLICY, ModalSize.LG, undefined, {})
    }

    const isActionDisabled = !globalParams.projectID || policyHook.versionsLoading || policyHook.versions.length === 0

    return (
        <div className="card mb-5 mb-xl-8">
            <div className="card-header border-0 pt-5 flex-column">
                <div className="d-flex justify-content-between align-items-start w-100">
                    <div>
                        <h3 className="card-title fw-bold fs-3 mb-1">Políticas de Monitoreo</h3>
                        <span className="text-muted mt-1 fw-semibold fs-7">
                            Encuentre las versiones y detalles de la política de monitoreo para cada proyecto.
                        </span>
                    </div>
                    <a
                        href="https://canvia.sharepoint.com/:b:/s/CloudDelivery/EbdOcP5aefZEjjOr9keDwiIBxVb0O9Un7rusZNoNbV95ZQ?e=bXggQ4"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-icon btn-light-primary w-auto px-5"
                        title="Ayuda / Manual de usuario"
                        onClick={() => AnalyticsService.event("go_documentation", { module: "politicas_monitoreo_v2" })}
                    >
                        Ayuda
                        <i className="bi bi-question-circle fs-2 ms-2"></i>
                    </a>
                </div>
                <div className="d-flex justify-content-between flex-wrap mt-4 gap-4">
                    <div className="d-flex gap-3">
                        <DataList
                            value={selectedClient}
                            label="Cliente"
                            loading={catalogHook.loadingProjectsOld}
                            items={clients.map(client => ({
                                id: client,
                                value: client,
                                node: <span className="text-gray-800"><i className="bi bi-person-square me-2" />{client}</span>
                            }))}
                            onChange={onClientChange}
                        />
                        <DataList
                            value={selectedProject}
                            label="Proyecto"
                            loading={catalogHook.loadingProjectsOld}
                            items={filteredProjects.map(project => ({
                                id: project.ID_PROYECTO,
                                value: project.NOMBRE_PROYECTO || '',
                                node: (
                                    <span className="text-gray-800">
                                        <i className="bi bi-kanban me-2" />
                                        {project.NOMBRE_PROYECTO}
                                    </span>
                                )
                            }))}
                            onChange={onProjectChange}
                        />
                    </div>

                    <div className="btn-group align-items-end" role="group" aria-label="Acciones de política">
                        <AccessController allowedRoles={['ejecutor', 'admin']} rol={rol}>
                            <button className="btn btn-sm btn-light-success" onClick={openInitializePolicy}>
                                <i className="bi bi-plus-square me-1" />
                                Crear
                            </button>
                            <button className="btn btn-sm btn-light-primary" onClick={openUpdateView} disabled={isActionDisabled}>
                                <i className="bi bi-pencil-square me-1" />
                                Actualizar
                            </button>
                            <button className="btn btn-sm btn-light-danger" onClick={openDeleteCI} disabled={isActionDisabled}>
                                <i className="bi bi-x-square me-1" />
                                Dar de baja CI
                            </button>
                        </AccessController>
                        <button className="btn btn-sm btn-light-info" onClick={openHistoric} disabled={isActionDisabled}>
                            <i className="bi bi-hourglass me-1" />
                            Historial
                        </button>
                        <AccessController allowedRoles={['ejecutor']} rol={rol}>
                            <button
                                className="btn btn-sm btn-light-info"
                                onClick={() => {
                                    const lastVersion = findLastImplementedVersion(policyHook.versions)
                                    if (!lastVersion) return;
                                    modalHook.openModal(ModalViewForMonitoringPolicies.HISTORIC_OLD, ModalSize.LG, true, { id_politica: lastVersion.ID_POLITICA.toString() })
                                }}
                                disabled={isActionDisabled}>
                                <i className="bi bi-hourglass me-1" />
                                Historial Old
                            </button>
                            <button 
                                className="btn btn-sm btn-light-warning"
                                onClick={openChargePolicy}
                                disabled={isActionDisabled}
                                >
                                <i className="bi bi-box-arrow-in-down me-1" />
                                Cargar Política
                            </button>
                        </AccessController>
                        <button className="btn btn-sm btn-light-info" onClick={downloadPolicy} disabled={isActionDisabled || loading}>
                            {loading ? (
                                <>
                                    Descargando
                                    <div className="spinner-border spinner-border-sm ms-2" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </>
                            ) :
                                (
                                    <>
                                        <i className="bi bi-download me-1" />
                                        Descargar
                                    </>
                                )}
                        </button>
                        <OverlayTrigger
                            placement="bottom"
                            overlay={
                                <Tooltip id="tooltip-actions" className="bg-light text-dark border">
                                    <ul className="mb-0 ps-3 text-start small">
                                        <li><strong>Crear:</strong> Nueva política para un proyecto sin política actual.</li>
                                        <li><strong>Actualizar:</strong> Añadir, modificar y eliminar métricas o añadir un CI.</li>
                                        <li><strong>Dar de baja CI:</strong> Retirar un CI del monitoreo.</li>
                                        <li><strong>Historial:</strong> Ver historial de cambios realizados.</li>
                                        <li><strong>Cargar Política:</strong> Cargar masivamente los datos de una política.</li>
                                        <li><strong>Descargar:</strong> Descargar la política actual.</li>
                                    </ul>
                                </Tooltip>
                            }
                        >
                            <button className="btn btn-sm btn-light">
                                <i className="bi bi-info-circle-fill fs-5 text-warning" />
                            </button>
                        </OverlayTrigger>
                    </div>
                </div>
            </div>

            <div className="card-body py-3">
                <Tabs>
                    <Tab title="Versiones de Política">
                        <VersionsTable />
                    </Tab>
                    <Tab title="Cambios en Proceso">
                        <ChangeRequestsTable />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}
