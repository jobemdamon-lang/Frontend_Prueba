import { FC, useEffect, useState, useMemo } from 'react'
import { useSelector, shallowEqual } from "react-redux";
import { RootState } from "../../../../store/ConfigStore";
import { IAuthState } from "../../../../store/auth/Types";
import { useBackupsPoliciesContext } from '../Context'
import { useClient } from '../../../../hooks/useClient'
import { useProject } from '../hooks/useProject'
import { DataList } from '../../../../components/Inputs/DataListInput'
import { Tab, Tabs } from "../../../../components/Tabs"
import { VersionsTable } from './VersionsTable'
import { RequestsTable} from './RequestsTable'
import { ModalViewForBackupsPolicies } from '../Types'
import { ModalSize } from "../../../../hooks/Types"
import { useLocation } from 'react-router-dom';
import { RequestInfo } from './RequestInfo';
import { OverlayTrigger, Tooltip } from "react-bootstrap"

const transformClients = (clients: any[]) => clients.map((client: any) => ({
    id: client.id,
    value: client.value,
    node: <span className="text-gray-800"><i className="bi bi-person-square me-2" />{client.value}</span>
}));

export const PoliciesMain: FC = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const id = query.get("id");

    const { 
        modalHook, 
        globalParams, 
        setGlobalParams, 
        getPolicies, 
        getRequests, 
        groupPolicies, 
        groupPoliciesLoading, 
        getGroupPolicies,
        policies,
    } = useBackupsPoliciesContext();
    const { clientsWithCMDB, getClientsWithCMDBD, loadingGetClientsWithCMDB } = useClient()
    const { projects, getProjects, loadingGetProjects } = useProject()
    
    const user: IAuthState = useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState;
    const getALP = (projectName: string): string => projectName?.split("-")[0] ?? ""

    const [selectedClient, setSelectedClient] = useState<string>(globalParams.clientName || '')
    const [selectedProject, setSelectedProject] = useState<string>('')
    const [selectedGroup, setSelectedGroup] = useState<string>('')

    const hasClient = !!selectedClient && !!globalParams.clientName
    const hasProject = hasClient && !!selectedProject && !!globalParams.projectID
    const hasGroup = hasProject && !!selectedGroup && !!globalParams.groupPolicyID

    const canCreateGroup = hasProject && groupPolicies.length === 0 && !groupPoliciesLoading;
    const canRequestChange = hasGroup
    const canExport = hasGroup
    const canDeleteCI = hasGroup
    const canCreate = true

    const clientsForDataList = useMemo(() => transformClients(clientsWithCMDB), [clientsWithCMDB])
    const projectsForDataList = useMemo(() => projects.map((project: any) => ({
        id: project.id,
        value: project.value,
        node: <span className="text-gray-800"><i className="bi bi-folder me-2" />{project.value}</span>
    })), [projects])
    const groupsForDataList = useMemo(() => groupPolicies.map((group: any) => ({
        id: group.id,
        value: group.value,
        node: <span className="text-gray-800"><i className="bi bi-collection me-2" />{group.value}</span>
    })), [groupPolicies])

    useEffect(() => {
        getClientsWithCMDBD()
    }, [getClientsWithCMDBD])

    useEffect(() => {
        setSelectedClient(globalParams.clientName || '')
    }, [globalParams.clientName])

    useEffect(() => {
        const selectedProject = projects.find((p: any) => p.id === globalParams.projectID)
        setSelectedProject(selectedProject?.value || '')
    }, [globalParams.projectID, projects])

    useEffect(() => {
        const selectedGroup = groupPolicies.find((g: any) => g.id === globalParams.groupPolicyID)
        setSelectedGroup(selectedGroup?.value || '')
    }, [globalParams.groupPolicyID, groupPolicies])

    const onClientChange = (clientName: string) => {
        setSelectedClient(clientName)
        setSelectedProject('')
        setSelectedGroup('')
        
        setGlobalParams({
            ...globalParams,
            clientName: clientName,
            projectID: 0,
            groupPolicyID: 0
        })
        
        if (clientName) {
            getProjects(clientName)
        }
    }

    const onProjectChange = (projectName: string) => {
        const project = projects.find((p: any) => p.value === projectName)
        if (!project) return

        setSelectedProject(project.value)
        setSelectedGroup('')
        
        setGlobalParams({
            ...globalParams,
            projectID: project.id,
            projectName: project.value,
            groupPolicyID: 0,
            alp: getALP(project.value),
            usuario: user.usuario
        })

        getGroupPolicies(project.id)
    }

    const onGroupChange = (groupName: string) => {
        const group = groupPolicies.find((g: any) => g.value === groupName)
        if (!group) return

        setSelectedGroup(group.value)
        
        setGlobalParams({
            ...globalParams,
            groupPolicyID: group.id
        })

        getPolicies(group.id);
        getRequests(group.id);
    }

    const lastApprovedPolicy = useMemo(() => {
        if (!policies || policies.length === 0) return undefined;
        return [...policies].sort((a: any, b: any) => b.nro_version - a.nro_version)[0];
    }, [policies]);

    if (id) {
        return <RequestInfo />;
    }

    return (
        <div className="card mb-5 mb-xl-8">
            <div className="card-header border-0 pt-5 flex-column">
                <div className="d-flex justify-content-between align-items-start w-100">
                    <div>
                        <h3 className="card-title fw-bold fs-3 mb-1">Políticas de Backup</h3>
                        <span className="text-muted mt-1 fw-semibold fs-7">
                            Encuentre las versiones y detalles de la política de backup para cada proyecto.
                        </span>
                    </div>
                    <a
                        href="https://canvia.sharepoint.com/:b:/s/CloudDelivery/EbdOcP5aefZEjjOr9keDwiIBxVb0O9Un7rusZNoNbV95ZQ?e=bXggQ4"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-icon btn-light-primary w-auto px-5"
                        title="Ayuda / Manual de usuario"
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
                            loading={loadingGetClientsWithCMDB}
                            items={clientsForDataList}
                            onChange={onClientChange}
                        />
                        
                        <DataList
                            value={selectedProject}
                            label="Proyecto"
                            loading={loadingGetProjects}
                            items={projectsForDataList}
                            onChange={onProjectChange}
                            disabled={!selectedClient || projects.length === 0}
                        />
                        <div style={{ minWidth: 250 }}>
                            <DataList
                                value={selectedGroup}
                                label="Grupo de Política"
                                loading={groupPoliciesLoading}
                                items={groupsForDataList}
                                onChange={onGroupChange}
                                disabled={!selectedProject || groupPolicies.length === 0}
                            />
                            {!groupPoliciesLoading && selectedProject && groupPolicies.length === 0 && (
                                <div className="text-danger small mt-1">
                                    No hay grupo de política
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="btn-group align-items-end" role="group" aria-label="Acciones de política">
                        <button 
                            type="button" 
                            className="btn btn-sm btn-light-success"
                            disabled={!canCreate}
                            title={!canCreate ? 'Seleccione un cliente' : 'Crear nueva política'}
                            onClick={() => modalHook.openModal(ModalViewForBackupsPolicies.INITIALIZE_POLICY, ModalSize.LG, undefined, {} )}
                        >
                            <i className="bi bi-plus-square me-1" />
                            Inicializar Política
                        </button>
                        
                        <button 
                            type="button" 
                            className="btn btn-sm btn-light-danger"
                            disabled={!canDeleteCI}
                            title={!canDeleteCI ? 'Seleccione cliente, proyecto y grupo' : 'Dar de baja CI'}
                            onClick={() => modalHook.openModal(ModalViewForBackupsPolicies.DELETE_CI, ModalSize.LG, undefined, {})}
                        >
                            <i className="bi bi-trash me-1" />
                            Dar de baja CI
                        </button>
                        
                        <button 
                            type="button" 
                            className="btn btn-sm btn-light-info"
                            disabled={!canExport}
                            title={!canExport ? 'Seleccione cliente, proyecto y grupo' : 'Exportar política'}
                            onClick={() => modalHook.openModal(ModalViewForBackupsPolicies.EXPORT_POLICY,ModalSize.SM,undefined, {policy: lastApprovedPolicy})}
                        >
                            <i className="bi bi-download me-1" />
                            Exportar
                        </button>
                        
                        <button 
                            type="button" 
                            className="btn btn-sm btn-light-warning"
                            disabled={!canRequestChange}
                            title={!canRequestChange ? 'Seleccione cliente, proyecto y grupo' : 'Solicitar cambio'}
                            onClick={() => modalHook.openModal(ModalViewForBackupsPolicies.CREATE_CHANGE_REQUEST, ModalSize.LG, undefined, {})}
                        >
                            <i className="bi bi-arrow-repeat me-1" />
                            Solicitar Cambio
                        </button>
                        
                        <button 
                            type="button" 
                            className="btn btn-sm btn-light-success"
                            disabled={!canCreateGroup}
                            title={!canCreateGroup ? 'Seleccione cliente y proyecto (sin grupo)' : 'Crear nuevo grupo'}
                            onClick={() => modalHook.openModal(ModalViewForBackupsPolicies.CREATE_GROUP_POLICY, ModalSize.SM, undefined, {})}
                        >
                            <i className="bi bi-folder-plus me-1" />
                            Crear Grupo
                        </button>
                        <OverlayTrigger
                            placement="bottom"
                            overlay={
                                <Tooltip id="tooltip-actions" className="bg-light text-dark border">
                                    <ul className='mb-0 ps-3 text-start'>
                                        <li><strong>Inicializar Política:</strong> Crea una nueva política para un proyecto sin política actual.</li>
                                        <li><strong>Dar de baja CI:</strong> Retira un CI del backup.</li>
                                        <li><strong>Exportar:</strong> Descarga la política actual.</li>
                                        <li><strong>Solicitar cambio:</strong> Solicita una modificación sobre la política seleccionada.</li>
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
                        {!id && <RequestsTable />}
                        {id && <RequestInfo />}
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}