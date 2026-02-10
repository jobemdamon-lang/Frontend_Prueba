import DataTable, { TableColumn } from "react-data-table-component"
import { secondCustomStyles } from "../../../../../helpers/tableStyles"
import { EmptyData } from "../../../../../components/datatable/EmptyData"
import { LoadingTable } from "../../../../../components/loading/LoadingTable"
import { useCallback, useEffect, useState } from "react"
import { IListServersCredential } from "../../../Types"
import { SearchInput } from "../../../../../components/SearchInput/SearchInput"
import { useTypedSelector } from "../../../../../store/ConfigStore"
import { warningNotification } from "../../../../../helpers/notifications"
import { SelectInput } from "../../../../../components/Inputs/SelectInput"
import { useWindowsPatchContext } from "../../Context"
import { AnalyticsService } from "../../../../../helpers/analytics"

const AssignCredential = () => {

    const { credentialHook, selectedOwners } = useWindowsPatchContext()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const [selectedRows, setSelectedRows] = useState<IListServersCredential[]>([])
    const [toggleCleared, setToggleCleared] = useState(false)
    const [filteredServers, setFilteredServers] = useState<IListServersCredential[]>([])
    const [searchedServer, setSearchedServer] = useState("")
    const [credentialToUpdate, setCredentialToUpdate] = useState('')


    /*Cada vez que los servidores o el input buscado cambie, se relista los servidores en la tabla*/
    useEffect(() => {
        setFilteredServers(
            credentialHook.serversWithoutCredentialData
                .filter(server => server.CLASE.toUpperCase() === 'WINDOWS')
                .filter(server => {
                    return server.NOMBRE_CI.toLowerCase().includes(searchedServer.toLowerCase()) ||
                        server.NRO_IP?.toLowerCase().includes(searchedServer.toLowerCase())
                })
        )
    }, [credentialHook.serversWithoutCredentialData, searchedServer])


    const handleSubmitCredential = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        AnalyticsService.event("assign_credential", { module: "parchado" });
        const credential = credentialHook.credentialsData.find(credential => credential.NOMBRE === credentialToUpdate)
        if (selectedRows.length === 0 || !credential) {
            warningNotification("Seleccione almenos un equipo y escoja una credencial")
            return
        }
        credentialHook.AssignServersToCredential({
            equipo_ids: selectedRows.map(eachRow => eachRow.ID_EQUIPO).join(","),
            id_credencial: credential.ID_CREDENCIAL,
            usuario: userName
        }).then((success) => {
            if (success) {
                setToggleCleared(prev => !prev)
                credentialHook.getServersWithoutCredential({
                    cliente: selectedOwners.cliente,
                    flag_credencial: 0,
                    id_credencial: 0,
                    id_proyecto: selectedOwners.id_proyecto
                })
            }
        })
    }

    const handleRowSelected = useCallback((state: any) => {
        setSelectedRows(state.selectedRows)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="d-flex flex-column gap-5">
            <form onSubmit={handleSubmitCredential} className="d-flex justify-content-evenly align-items-end">
                <SearchInput
                    placeholder="Ingrese nombre del CI..."
                    value={searchedServer}
                    setValue={setSearchedServer}
                />
                <SelectInput
                    required
                    onChange={setCredentialToUpdate}
                    value={credentialToUpdate}
                    label="Credencial a Asociar"
                    data={credentialHook.credentialsData.map(credential => ({ codigo: credential.ID_CREDENCIAL, nombre: credential.NOMBRE }))}
                    loading={credentialHook.getCredentialsLoading}
                />
                <button
                    className="btn btn-success"
                    type="submit"
                    disabled={credentialHook.assignServerToCredentialsLoading}
                >
                    {credentialHook.assignServerToCredentialsLoading ? "Asignando.." : "Asignar Credencial"} ({selectedRows.length})
                </button>
            </form>
            <div style={{ position: 'relative' }}>
                <DataTable
                    columns={ServerColumns}
                    pagination
                    highlightOnHover
                    persistTableHead
                    customStyles={secondCustomStyles}
                    selectableRows
                    paginationPerPage={5}
                    onSelectedRowsChange={handleRowSelected}
                    clearSelectedRows={toggleCleared}
                    noDataComponent={<EmptyData loading={credentialHook.serverWithoutCredentialLoading} />}
                    disabled={credentialHook.serverWithoutCredentialLoading}
                    data={filteredServers}
                />
                {credentialHook.serverWithoutCredentialLoading && <LoadingTable description='Cargando' />}
            </div>
        </div>
    )
}
export { AssignCredential }

export const ServerColumns: TableColumn<IListServersCredential>[] = [
    {
        name: 'Nombre de CI',
        selector: (row: IListServersCredential) => row.NOMBRE_CI ?? "Sin registro"
    },
    {
        name: 'HostName',
        selector: (row: IListServersCredential) => row.NOMBRE ?? "Sin registro"
    },
    {
        name: 'Grupo Asociado',
        selector: (row: IListServersCredential) => row.NOMBRE ?? "Sin registro"
    },
    {
        name: 'Familia',
        selector: (row: IListServersCredential) => row.FAMILIA ?? "Sin registro"
    },
    {
        name: 'Clase',
        selector: (row: IListServersCredential) => row.CLASE ?? "Sin registro"
    },
    {
        name: 'Numero IP',
        selector: (row: IListServersCredential) => row.NRO_IP ?? "Sin registro"
    },
]