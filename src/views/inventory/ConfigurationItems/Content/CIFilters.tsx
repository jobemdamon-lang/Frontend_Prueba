import { FC, useEffect } from "react"
import { DataList } from "../../../../components/Inputs/DataListInput"
import { AnalyticsService } from "../../../../helpers/analytics"

import { useConfigurationItemsContext } from "../Context"
import { Input } from "../../../../components/Inputs/TextInput"

type Props = { setFilterGlobalValue: React.Dispatch<React.SetStateAction<string>> }

const CIFilters: FC<Props> = ({ setFilterGlobalValue }) => {

    const { clientHook, projectHook, setOwners, owners, handleListCIs, apiRef } = useConfigurationItemsContext()

    const handleChange = (clientSelected: string) => {
        setOwners(prev => ({ ...prev, client: clientSelected, project: "", projectID: 0, alp: "" }))
        projectHook.getProjects(clientSelected)
    }
    const handleChangeGenericFilter = (searchedValue: string) => setOwners((prev) => ({ ...prev, generic_filter: searchedValue }))

    const handleChangeProject = (project: string) => {
        const selectedProject = projectHook.projects.find(projectareal => projectareal.value === project)
        if (selectedProject) setOwners((prev) => ({ ...prev, project: selectedProject.value, projectID: selectedProject.id }))
    }

    useEffect(() => {
        if (process.env.REACT_APP_ENV === 'DEV') {
            projectHook.getProjects('')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                AnalyticsService.event("buscar_cis", { module: "equipments", metadata: { nombreCI: owners.client } });
                handleListCIs();
            }}
            className="d-flex gap-10 justify-content-center align-items-end px-10 "
        >
            <DataList
                value={owners.client}
                label="Cliente"
                loading={clientHook.loadingGetClientsWithCMDB}
                items={clientHook.clientsWithCMDB}
                onChange={handleChange}
                //required={process.env.REACT_APP_ENV === 'PROD'}
            />
            <DataList
                value={owners.project}
                label="Proyecto"
                loading={projectHook.loadingGetProjects}
                items={projectHook.projects}
                onChange={handleChangeProject}
            />
            {<Input
                value={owners.generic_filter}
                label="Información CI"
                type="string"
                placeholder="CI Name | HostName | VirtualName | IP"
                onChange={handleChangeGenericFilter}
            />}
            <div className="btn-group" role="group" aria-label="Opciones del Filtro CMDB">
                <button
                    type="submit"
                    className="btn btn-success d-flex gap-3"
                >
                    <span>Buscar CIs</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={() => {
                        apiRef.current?.api?.setGlobalFilter("")
                        setFilterGlobalValue("")
                        setOwners({ alp: "", client: "", project: "", projectID: 0, generic_filter: "" })
                    }}
                    className="btn btn-danger"
                >
                    <span>Limpiar Filtros </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg>
                </button>
            </div>
        </form>
    )
}

export { CIFilters }