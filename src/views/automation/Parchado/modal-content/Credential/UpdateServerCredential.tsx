import DataTable, { TableColumn } from "react-data-table-component"
import { secondCustomStyles } from "../../../../../helpers/tableStyles"
import { EmptyData } from "../../../../../components/datatable/EmptyData"
import { useEffect, useState } from "react"
import { ToolTip } from "../../../../../components/tooltip/ToolTip"
import { IListServersCredential } from "../../../Types"
import { LoadingTable } from "../../../../../components/loading/LoadingTable"
import { Spinner } from "react-bootstrap"
import { useWindowsPatchContext } from "../../Context"
import { SelectInput } from "../../../../../components/Inputs/SelectInput"

const UpdateServerCredential = () => {


    const [selectedCredential, setSelectedCredential] = useState('')
    const { credentialHook, selectedOwners } = useWindowsPatchContext()

    useEffect(() => {
        const credential = credentialHook.credentialsData.find(credential => credential.NOMBRE === selectedCredential)
        if (!credential) return;
        credentialHook.getServersWithCredential({
            cliente: selectedOwners.cliente,
            flag_credencial: 1,
            id_credencial: credential.ID_CREDENCIAL,
            id_proyecto: selectedOwners.id_proyecto
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCredential])

    //Función que actua cuando se da click en el boton eliminar en la tabla de CIs
    const handleDeleteCredentialServer = (idServer: number) => {
        const credential = credentialHook.credentialsData.find(credential => credential.NOMBRE === selectedCredential)
        if (!credential) return;
        credentialHook.deleteCredentialOfServer(credential.ID_CREDENCIAL, idServer).then(success => {
            if (success) {
                credentialHook.getServersWithCredential({
                    cliente: selectedOwners.cliente,
                    flag_credencial: 1,
                    id_credencial: credential.ID_CREDENCIAL,
                    id_proyecto: selectedOwners.id_proyecto
                })
                credentialHook.getServersWithoutCredential({
                    cliente: selectedOwners.cliente,
                    flag_credencial: 0,
                    id_credencial: 0,
                    id_proyecto: selectedOwners.id_proyecto
                })
            }
        })
    }

    return (
        <div className='d-flex flex-column gap-5'>
            <SelectInput
                label="Credencial"
                required
                onChange={setSelectedCredential}
                value={selectedCredential}
                data={credentialHook.credentialsData.map(credential => ({ codigo: credential.ID_CREDENCIAL, nombre: credential.NOMBRE }))}
                loading={credentialHook.getCredentialsLoading}
            />

            <div className="position-relative">
                <DataTable
                    columns={UpdateGroupColumns(handleDeleteCredentialServer, credentialHook.deleteCredentialOfServerLoading)}
                    pagination
                    highlightOnHover
                    persistTableHead
                    customStyles={secondCustomStyles}
                    disabled={credentialHook.serverWithCredentialLoading}
                    noDataComponent={<EmptyData loading={credentialHook.serverWithCredentialLoading} />}
                    data={credentialHook.serversWithCredentialData}
                />
                {credentialHook.serverWithCredentialLoading && <LoadingTable description='Cargando' />}
            </div>
        </div>
    )
}
export { UpdateServerCredential }

const UpdateGroupColumns = (handleDeleteGroup: (idServer: number) => void, deleteServerInGroupLoading: boolean): TableColumn<IListServersCredential>[] => [
    {
        name: 'Nombre del CI',
        selector: (row: IListServersCredential) => row.NOMBRE_CI ?? "Sin registro"
    },
    {
        name: 'HostName',
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
        name: 'Nro. IP',
        selector: (row: IListServersCredential) => row.NRO_IP ?? "Sin registro"
    },
    {
        name: 'Eliminar',
        cell: (row: IListServersCredential) => (
            <ToolTip
                message='Eliminar relación de la credencial y Servidor'
                placement='top'
            >
                <button
                    className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                    disabled={deleteServerInGroupLoading}
                    onClick={() => { handleDeleteGroup(row.ID_EQUIPO) }}
                >
                    {deleteServerInGroupLoading ?
                        <Spinner animation="border" role="status">
                        </Spinner>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                        </svg>}

                </button>
            </ToolTip>
        )
    }
]