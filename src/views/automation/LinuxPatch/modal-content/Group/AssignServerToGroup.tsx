import DataTable, { TableColumn } from "react-data-table-component"
import { FC, useCallback, useEffect, useState } from "react"
import { secondCustomStyles } from "../../../../../helpers/tableStyles"
import { EmptyData } from "../../../../../components/datatable/EmptyData"
import { IListServerUnified, IListServerUnifiedWithPickedIP, OPERATE_SYSTEMS } from "../../../Types"
import { SearchInput } from "../../../../../components/SearchInput/SearchInput"
import { LoadingTable } from "../../../../../components/loading/LoadingTable"
import { ToolTip } from "../../../../../components/tooltip/ToolTip"
import { useTypedSelector } from "../../../../../store/ConfigStore"
import { useLinuxPatchContext } from "../../Context"
import { SelectInput } from "../../../../../components/Inputs/SelectInput"
import { AccessController } from "../../../../../components/AccessControler"
import { IpsList } from "./IpsList"
import { warningNotification } from "../../../../../helpers/notifications"

type Props = { OPERATE_SYSTEM_ENV: OPERATE_SYSTEMS }
const AssignServerToGroup: FC<Props> = ({ OPERATE_SYSTEM_ENV }) => {

    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const { serverHook, groupHook, selectedOwners, rol } = useLinuxPatchContext()
    const [toggleCleared, setToggleCleared] = useState(false)
    const [selectedRows, setSelectedRows] = useState<Array<IListServerUnifiedWithPickedIP>>([])
    const [searchedServer, setSearchedServer] = useState("")
    //Estado para la reasignacion de un servidor a un nuevo grupo
    const [groupToUpdate, setGroupToUpdate] = useState('')
    const [filteredServers, setFilteredServers] = useState<Array<IListServerUnifiedWithPickedIP>>([])

    /*Cada vez que los servidores o el input buscado cambie, se relista los servidores en la tabla. Adicional siempre filtra solo servidores sin grupo*/
    useEffect(() => {
        setFilteredServers(
            serverHook.serversUnifiedData.filter((server: IListServerUnified) => {
                let isWindows = server.CLASE?.toUpperCase() === OPERATE_SYSTEM_ENV
                let isUnssignedServer = server.ID_GRUPO == null
                let hasSimilitudes = server.NOMBRE_CI.toLowerCase().includes(searchedServer.toLowerCase()) ||
                    server.IP.some(IP => IP.NRO_IP.includes(searchedServer)) ||
                    server.NOMBRE.toLowerCase().includes(searchedServer.toLowerCase())
                return isUnssignedServer && hasSimilitudes && isWindows
            }).map((server: IListServerUnified) => ({ ...server, PICKED_IP: server.IP.find(IP => IP.TIPO_IP === "LAN") ?? server.IP[0] }))
        )
    }, [serverHook.serversUnifiedData, searchedServer, OPERATE_SYSTEM_ENV])

    const handleChangeGroup = (event: React.FormEvent<HTMLFormElement>) => {
        const group = groupHook.groupsData.find(group => group.NOMBRE === groupToUpdate)
        event.preventDefault()
        if (selectedRows.length === 0 || !group) {
            warningNotification("Seleccione almenos un servidor para asignarlo y seleccionar un grupo.")
        } else {
            const onlyIds = selectedRows.map(server => server.ID_EQUIPO)
            groupHook.assignServerToGroup({
                usuario: userName,
                id_grupo: group.ID_GRUPO,
                lista_equipo: filteredServers.filter(server => onlyIds.includes(server.ID_EQUIPO)).map(server => {
                    const { PICKED_IP, ...rest } = server
                    return ({
                        id_equipo: rest.ID_EQUIPO,
                        id_equipo_ip: PICKED_IP.ID_EQUIPO_IP
                    })
                })
            }).then(success => {
                if (success) {
                    serverHook.getListOfServersUnified(selectedOwners.cliente, 0)
                    serverHook.getServersAssigned(selectedOwners.cliente, 0)
                    setToggleCleared(!toggleCleared);
                    setSelectedRows([])
                }
            })
        }
    }

    const handleRowSelected = useCallback((state: any) => {
        setSelectedRows(state.selectedRows)
    }, []);

    return (
        <div className='d-flex flex-column gap-5'>
            <form onSubmit={handleChangeGroup} className="d-flex justify-content-evenly align-items-end">
                <SearchInput placeholder="Nombre CI | IP | HostName" value={searchedServer} setValue={setSearchedServer} />
                <SelectInput
                    value={groupToUpdate}
                    label="Grupo a Asociar"
                    data={groupHook.groupsData.map(group => ({ codigo: group.ID_GRUPO, nombre: group.NOMBRE }))}
                    onChange={setGroupToUpdate}
                    loading={groupHook.getListGroupsLoading}
                    required
                />
                <AccessController rol={rol}>
                    <button
                        className="btn btn-success"
                        type="submit"
                        disabled={groupHook.assignServerLoading}
                    >
                        {groupHook.assignServerLoading ? "Asignando.." : "Asignar Grupo"} ({selectedRows.length})
                    </button>
                </AccessController>
            </form>
            <div className="position-relative">
                <DataTable
                    columns={HistoricalPatchesColumns(setFilteredServers)}
                    pagination
                    highlightOnHover
                    persistTableHead
                    customStyles={secondCustomStyles}
                    selectableRows
                    paginationPerPage={5}
                    onSelectedRowsChange={handleRowSelected}
                    clearSelectedRows={toggleCleared}
                    noDataComponent={<EmptyData loading={serverHook.getServersUnifiedLoading} />}
                    disabled={serverHook.getServersUnifiedLoading}
                    data={filteredServers}
                />
                {serverHook.getServersUnifiedLoading && <LoadingTable description='Cargando' />}
            </div>
        </div>
    )
}
export { AssignServerToGroup }


export const HistoricalPatchesColumns = (
    setFilteredServers: React.Dispatch<React.SetStateAction<IListServerUnifiedWithPickedIP[]>>
): TableColumn<IListServerUnifiedWithPickedIP>[] => [
        {
            name: 'Nombre de CI',
            selector: (row: IListServerUnifiedWithPickedIP) => row.NOMBRE_CI ?? "Sin registro"
        },
        {
            name: 'HostName',
            selector: (row: IListServerUnifiedWithPickedIP) => row.NOMBRE ?? "Sin registro"
        },
        {
            name: 'Grupo Asociado',
            cell: (row: IListServerUnifiedWithPickedIP) => <ToolTip message={row.GRUPOS ? row.GRUPOS : "No posee asiganción de un Grupo."} placement="top-end">
                <i style={{ cursor: "help", color: row.GRUPOS ? "green" : "red" }}>{row.GRUPOS ? "Posee Grupo" : "Sin Grupo"}</i>
            </ToolTip>
        },
        {
            name: 'Clase',
            selector: (row: IListServerUnifiedWithPickedIP) => row.CLASE ?? "Sin registro"
        },
        {
            name: 'Numero IP',
            cell: (row: IListServerUnifiedWithPickedIP) => <IpsList rowInformation={row} setFilteredServers={setFilteredServers}/>
        },
    ]