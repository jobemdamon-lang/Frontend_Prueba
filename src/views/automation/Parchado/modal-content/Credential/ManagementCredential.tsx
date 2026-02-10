import DataTable, { TableColumn } from "react-data-table-component"
import { secondCustomStyles } from "../../../../../helpers/tableStyles"
import { LoadingTable } from "../../../../../components/loading/LoadingTable"
import { EmptyData } from "../../../../../components/datatable/EmptyData"
import { useState } from "react"
import { IListCredential, IUpdateFunctions } from "../../../Types"
import { convertirFecha } from "../../../../../helpers/general"
import { Spinner } from "react-bootstrap"
import { useWindowsPatchContext } from "../../Context"
import { CreateCredential } from "./CreateCredential"
import { UpdateCredential } from "./UpdateCredential"

const ManagementCredential = () => {

    const [isCreateView, setIsCreateView] = useState<boolean>(true)
    const { credentialHook } = useWindowsPatchContext()

    //Función para eliminar una credencial
    const handleDelete = (idCredential: number) => {
        credentialHook.deleteCredential(idCredential).then(success => {
            if (success) credentialHook.getListCredentials()
        })
    }

    return (
        <>
            {isCreateView ?
                <CreateCredential />
                :
                <UpdateCredential
                    setIsCreateView={setIsCreateView}
                />
            }
            <div className="position-relative">
                <DataTable
                    columns={CredentialColumns(
                        handleDelete,
                        credentialHook.deleteCredentialLoading,
                        setIsCreateView,
                        credentialHook.updateCredentialsFuncs
                    )}
                    pagination
                    highlightOnHover
                    persistTableHead
                    customStyles={secondCustomStyles}
                    noDataComponent={<EmptyData loading={credentialHook.getCredentialsLoading} />}
                    disabled={credentialHook.getCredentialsLoading}
                    data={credentialHook.credentialsData}
                />
                {credentialHook.getCredentialsLoading && <LoadingTable description='Cargando' />}
            </div>
        </>
    )
}
export { ManagementCredential }

export const CredentialColumns = (
    handleDelete: (idCredential: number) => void,
    deleteCredentialLoading: boolean,
    setIsCreateView: React.Dispatch<React.SetStateAction<boolean>>,
    updateCredentialsFuncs: IUpdateFunctions
): TableColumn<IListCredential>[] => [
        {
            name: 'Nombre',
            selector: (row: IListCredential) => row.NOMBRE ?? "Sin registro"
        },
        {
            name: 'Descripción',
            selector: (row: IListCredential) => row.DESCRIPCION ?? "Sin registro"
        },
        {
            name: 'Fecha Creación',
            selector: (row: IListCredential) => convertirFecha(row.FECHA_CREACION) ?? "Sin registro"
        },
        {
            name: 'Usuario Creación',
            selector: (row: IListCredential) => row.USUARIO_CREACION ?? "Sin registro"
        },
        {
            name: 'Usuario Credencial',
            selector: (row: IListCredential) => row.USUARIO ?? "Sin registro"
        },
        {
            name: 'Fecha Modificación',
            selector: (row: IListCredential) => row.FECHA_MODIFICACION ? convertirFecha(row.FECHA_MODIFICACION ?? "") : "Sin registro"
        },
        {
            name: 'Acciones',
            cell: (row: IListCredential) => (
                <div className="d-flex justify-content-center align-items-center gap-5">
                    <button
                        disabled={deleteCredentialLoading}
                        className='btn btn-icon btn-light btn-active-color-danger btn-sm me-1'
                        onClick={() => handleDelete(row.ID_CREDENCIAL)}
                    >
                        {deleteCredentialLoading ?
                            <Spinner animation="border" role="status">
                            </Spinner>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                            </svg>
                        }
                    </button>
                    <button
                        className='btn btn-icon btn-light btn-active-color-info btn-sm me-1'
                        onClick={() => {
                            //Se cambia la vista y se establece el estado a actualizar con los datos de la fila
                            setIsCreateView(false)
                            updateCredentialsFuncs.setCredentialToUpdate({
                                usuario: row.USUARIO ?? "",
                                descripcion: row.DESCRIPCION,
                                id_credencial: row.ID_CREDENCIAL,
                                nombre: row.NOMBRE,
                                clave: "",
                                usuario_ccs: ""
                            })
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>
                    </button>
                </div>

            )
        }
    ]