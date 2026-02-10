import { useProject } from "../../../../hooks/useProjects"
import { useClient } from "../../../../hooks/useClient"
import { FC, useEffect, useState } from "react"
import { IListServerAssigned, ModalView } from "../../Types"
import { ModalSize } from "../../../../hooks/Types"
import { ToolTip } from "../../../../components/tooltip/ToolTip"
import { SearchInput } from "../../../../components/SearchInput/SearchInput"
import { useWindowsPatchContext } from "../Context"
import { initialOwnerLinuxServer } from "../../Types"
import { DataList } from "../../../../components/Inputs/DataListInput"
import { AccessController } from "../../../../components/AccessControler"

type Props = { setFilterdData: React.Dispatch<React.SetStateAction<IListServerAssigned[]>> }

const ServerScreenFilters: FC<Props> = ({ setFilterdData }) => {

  const { getProjects, projects, loadingGetProjects } = useProject()
  const { getClientsWithCMDBD, clientsWithCMDB, loadingGetClientsWithCMDB } = useClient()
  const [searchedValue, setSearchedValue] = useState("")
  const { rol, serverHook, selectedOwners, setOwners, modalHook } = useWindowsPatchContext()


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    serverHook.getServersAssigned(selectedOwners.cliente, 0)
  }

  useEffect(() => {
    setFilterdData(serverHook.serverAssignedData.filter((server: IListServerAssigned) => {
      let hasCoincidences = server.NOMBRE_CI.toLowerCase().includes(searchedValue.toLowerCase()) ||
        server.NRO_IP.toLowerCase().includes(searchedValue.toLowerCase()) ||
        server.NOMBRE.toLowerCase().includes(searchedValue.toLowerCase()) ||
        server.GRUPO.toLowerCase().includes(searchedValue.toLowerCase())
      return hasCoincidences
    }))
    setSearchedValue(searchedValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverHook.serverAssignedData, searchedValue])


  useEffect(() => {
    getProjects()
    getClientsWithCMDBD()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="d-flex justify-content-center flex-wrap gap-5 align-items-centers px-10 pb-5">
      <form
        className="d-flex gap-3 align-items-end justify-content-center"
        onSubmit={handleSubmit}>
        <DataList
          items={clientsWithCMDB}
          label="Nombre del Cliente"
          value={selectedOwners.cliente}
          required
          loading={loadingGetClientsWithCMDB}
          onChange={(client) => {
            setOwners((prev) => ({ ...prev, cliente: client }))
            getProjects(client)
          }}
        />
        <DataList
          label="Nombre del Proyecto"
          value={selectedOwners.proyecto}
          items={projects}
          loading={loadingGetProjects}
          onChange={(_project) => {
            const projectFinded = projects.find(project => project.value === _project)
            if (!projectFinded) return;
            setOwners((prev) => ({ ...prev, proyecto: projectFinded.value, id_proyecto: projectFinded.id }))
          }}
        />
        <div>
          <ToolTip message="Iniciar Busqueda" placement='top'>
            <button
              className="btn btn-success btn-sm"
              disabled={selectedOwners.cliente === ""}
              type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </button>
          </ToolTip>
        </div>
        <div>
          <ToolTip message="Limpiar Filtros de Selección" placement='top'>
            <button
              className="btn btn-danger btn-sm"
              type="button"
              onClick={() => setOwners(initialOwnerLinuxServer)}
            >
              Limpiar
            </button>
          </ToolTip>
        </div>
      </form>
      <div className="d-flex gap-3 justify-content-center align-items-end">
        <div>
          <SearchInput placeholder="Nombre CI | Nro. IP | HostName" setValue={setSearchedValue} value={searchedValue} />
        </div>
        <AccessController rol={rol}>
          <div className="d-flex flex-column gap-1">
            {selectedOwners.cliente === "" && <i className="text-center">Seleccione un Cliente</i>}
            <button
              disabled={selectedOwners.cliente === ""}
              className="btn btn-primary"
              onClick={() => {
                modalHook.openModal(ModalView.PLANIFICATION, ModalSize.XL, true, {})
              }}>
              Planificación
            </button>
          </div>
          <div className="d-flex flex-column gap-1">
            {selectedOwners.cliente === "" && <i className="text-center">Seleccione un Cliente</i>}
            <button
              disabled={selectedOwners.cliente === ""}
              className="btn btn-primary"
              onClick={() => {
                modalHook.openModal(ModalView.CREDENTIALS, ModalSize.XL, undefined, {})
              }}>
              Credenciales
            </button>
          </div>
        </AccessController>
        <AccessController allowedRoles={['ejecutor', 'admin']} rol={rol}>
          <div className="d-flex flex-column gap-1">
            {selectedOwners.cliente === "" && <i className="text-center">Seleccione un Cliente</i>}
            <button
              disabled={selectedOwners.cliente === ""}
              className="btn btn-primary"
              onClick={() => {
                modalHook.openModal(ModalView.GROUP_AND_TEMPLATE, ModalSize.XL, undefined, {})
              }}>
              Grupos y Plantillas
            </button>
          </div>
        </AccessController>
      </div>
    </div>
  )
}
export { ServerScreenFilters }