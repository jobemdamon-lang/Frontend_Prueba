import { DataList } from "../../../../components/Inputs/DataListInput"
import { ModalViewForLinuxPatch, initialOwnerLinuxServer } from "../../Types"
import { useProject } from "../../../../hooks/useProjects"
import { ServerTable } from "./ServerTable"
import { useLinuxPatchContext } from "../Context"
import { ModalSize } from "../../../../hooks/Types"
import { ToolTip } from "../../../../components/tooltip/ToolTip"

const ServerSection = () => {

    const { modalHook, serverHook, selectedOwners, setOwners, clientHook } = useLinuxPatchContext()
    const projectHook = useProject()

    const handleChangeClient = (client: string) => {
        setOwners((prev) => ({ ...prev, cliente: client }))
        projectHook.getProjects(client)
    }

    const handleChangeProject = (selected_project: string) => {
        const selectedProject = projectHook.projects.find(project => project.value === selected_project)
        if (!selectedProject) return
        setOwners((prev) => ({ ...prev, proyecto: selected_project, id_proyecto: selectedProject.id }))
    }

    return (
        <section className="card d-flex justify-content-center flex-column gap-5">
            <article className="d-flex gap-10 align-items-end justify-content-center">
                <div className="d-flex flex-row gap-5 align-items-end">
                    <DataList
                        label="Nombre del Cliente"
                        value={selectedOwners.cliente}
                        items={clientHook.clientsWithCMDB}
                        onChange={handleChangeClient}
                        loading={clientHook.loadingGetClientsWithCMDB}
                    />
                    <DataList
                        label="Nombre del Proyecto"
                        value={selectedOwners.proyecto}
                        items={projectHook.projects}
                        onChange={handleChangeProject}
                        loading={projectHook.loadingGetProjects}
                    />
                    <ToolTip
                        message="Iniciar Busqueda"
                        placement='top'>
                        <button
                            onClick={() => serverHook.getServersAssignedLinux(
                                selectedOwners.cliente,
                                selectedOwners.id_proyecto
                            )}
                            className="btn btn-success btn-sm"
                            disabled={selectedOwners.cliente === ""}
                            type="submit">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="currentColor"
                                className="bi bi-search"
                                viewBox="0 0 16 16"
                            >
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                            </svg>
                        </button>
                    </ToolTip>
                    <ToolTip
                        message="Limpiar Filtros de Selección"
                        placement='top'>
                        <button
                            className="btn btn-info btn-sm"
                            type="button"
                            onClick={() => setOwners(initialOwnerLinuxServer)}
                        >
                            Limpiar
                        </button>
                    </ToolTip>
                </div>
                <div className="btn-group" role="group" aria-label="Opciones de Configuración">
                    <button
                        className="btn btn-success d-flex gap-3"
                        disabled={selectedOwners.cliente === ''}
                        onClick={() => modalHook.openModal(ModalViewForLinuxPatch.GROUPS_AND_TEMPLATES, ModalSize.XL, undefined, {})}
                    >
                        <span>Grupos y Plantillas</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25" height="25"
                            fill="currentColor"
                            className="bi bi-people-fill"
                            viewBox="0 0 16 16"
                        >
                            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                        </svg>
                    </button>
                    <button
                        disabled={selectedOwners.cliente === ''}
                        onClick={() => modalHook.openModal(ModalViewForLinuxPatch.CREDENTIALS, ModalSize.XL, undefined, {})}
                        className="btn btn-success"
                    >
                        <span>Credenciales </span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            fill="currentColor"
                            className="bi bi-key-fill"
                            viewBox="0 0 16 16"
                        >
                            <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2M2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                        </svg>
                    </button>
                </div>
            </article >
            <article>
                <ServerTable />
            </article>
        </section >
    )
}

export { ServerSection }

