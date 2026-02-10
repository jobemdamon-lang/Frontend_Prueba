import { FC, useEffect, useState } from "react"
import { KTSVG } from "../../../../../helpers/components/KTSVG"
import "../../../../../assets/sass/components/incidentCenter-styles/messages.scss"
import { useIncidentContext } from "../../Context"
import { ITrackedTicket, IListCollabsToNotify } from "../../../Types"
import DataTable, { TableColumn } from "react-data-table-component"
import { IListCollaborators } from "../../../../administration/Types"
import { LoadingTable } from "../../../../../components/loading/LoadingTable"
import { customStyles } from "../../../../../helpers/tableStyles"
import { EmptyData } from "../../../../../components/datatable/EmptyData"
import { IAuthState } from "../../../../../store/auth/Types"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../../../../../store/ConfigStore"
import { toast } from "react-toastify"
import { Spinner } from "react-bootstrap"
import { DataList } from "../../../../../components/Inputs/DataListInput"
import "../../../../../assets/sass/components/InventoryFilter/data-list-input-styles.scss"

type Props = { collabsData: IListCollaborators[] }

const NotificationAction: FC<Props> = ({ collabsData }) => {

    const { secondModalHook, useIncidentHook } = useIncidentContext()
    const user: IAuthState = useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState
    const modalInformation: ITrackedTicket = secondModalHook.modalInformation
    const [searchedValue, setSearchedValue] = useState("")

    useEffect(() => {
        useIncidentHook.getListCollabsToNotify(modalInformation.NRO_TICKET)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleAdd = (nameCollabWithUsername: string) => {
        let nameCollab = nameCollabWithUsername.split("||")[0]
        setSearchedValue(nameCollab)
        const selectedCollab = collabsData.find(collab => collab.nombre === nameCollab)
        const alreadyExist = useIncidentHook.collabsToNotify.find(collab => collab.NOMBRE === nameCollab)
        if (selectedCollab && !alreadyExist) {
            useIncidentHook.addCollabToNotifyTable(modalInformation.NRO_TICKET, user.usuario, selectedCollab.correo).then(success => {
                if (success) {
                    useIncidentHook.getListCollabsToNotify(modalInformation.NRO_TICKET)
                    setSearchedValue("")
                }
            })
        }
    }

    const handleDelete = (idNotification: number) => {
        useIncidentHook.deleteCollabToNotifyTable(idNotification.toString(), modalInformation.NRO_TICKET).then(success => {
            if (success) useIncidentHook.getListCollabsToNotify(modalInformation.NRO_TICKET)
        })
    }

    const handleSubmit = () => {
        if (useIncidentHook.collabsToNotify.length > 0) {
            useIncidentHook.notifyIncident(modalInformation.NRO_TICKET,
                {
                    id_usuario: useIncidentHook.collabsToNotify
                        .map(collabTM => {
                            //Se busca el id del colabador para enviarlo al metodo de notificar
                            const collabToSend = collabsData.find(collab => collab.usuario === collabTM.USUARIO)
                            return collabToSend?.idusuario ?? 0
                        })
                    //Si la notificacion fue exitosa se cierra el modal
                }).then(success => {
                    if (success) { secondModalHook.closeModal() }
                })
        } else {
            toast.warn(`Debe incluir colaboradores a lista para poder enviar la notificación`, {
                position: toast.POSITION.TOP_RIGHT
            })
        }

    }

    return (
        <>
            <div className='modal-header py-4 bg-dark'>
                <h2 className="text-white">NOTIFICACIÓN - {modalInformation.NRO_TICKET}</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => secondModalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-lg-10 border rounded-bottom border-top-0 border-dark'>
                <p className="fs-4 text-primary text-center">Las personas que se encuentren en la lista serán notificadas con un correo.</p>
                <p className="fs-4 fw-bold text-end">SELECCIONES: {useIncidentHook.collabsToNotify.length}</p>
                <div className="d-flex justify-content-center flex-column my-5 gap-5">
                    <div className="d-flex align-items-end justify-content-center">
                        <DataList
                            label="Ingrese un nombre"
                            disabled={useIncidentHook.addCollabToNotifyTableLoading}
                            className="w-400px"
                            value={searchedValue}
                            onChange={handleAdd}
                            items={collabsData
                                .filter(collab => collab.correo !== "" && collab.correo !== null)
                                .map(collab => ({ id: collab.idusuario, value: collab.nombre + "||" + collab.usuario }))
                            }
                        />
                        <div className="d-flex align-items-end justify-content-center">
                            {useIncidentHook.addCollabToNotifyTableLoading && <Spinner animation="border" role="status" className="m-5"></Spinner>}
                        </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <DataTable
                            columns={CollaboratorColumns(handleDelete, useIncidentHook.deleteCollabToNotifyTableLoading)}
                            persistTableHead
                            highlightOnHover
                            pagination
                            fixedHeader
                            paginationPerPage={5}
                            customStyles={customStyles}
                            noDataComponent={<EmptyData loading={useIncidentHook.listCollabsToNotifyLoading} />}
                            disabled={useIncidentHook.listCollabsToNotifyLoading}
                            data={useIncidentHook.collabsToNotify}
                        />
                        {useIncidentHook.listCollabsToNotifyLoading && <LoadingTable description='Cargando' />}
                    </div>
                    <div className="d-flex justify-content-end gap-5">
                        <button
                            disabled={useIncidentHook.notifyIncidentLoading}
                            type="button"
                            //Se emplea un onClick en vez de un form para no entrar en conflicto con el form superior (form dentro de un form)
                            onClick={handleSubmit}
                            className="btn btn-success"
                        >
                            {useIncidentHook.notifyIncidentLoading ? "Notificando..." : "Enviar Notificación"}
                        </button>
                        <button
                            type="button"
                            onClick={() => secondModalHook.closeModal()}
                            className="btn btn-danger"
                        >
                            Cancelar
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}
export { NotificationAction }

export const CollaboratorColumns = (handleDelete: Function, deleteCollabToNotifyTableLoading: boolean): TableColumn<IListCollabsToNotify>[] => [
    {
        name: 'NOMBRE',
        cell: (row: IListCollabsToNotify) => row.NOMBRE ?? "Sin registro"
    },
    {
        name: 'USUARIO',
        selector: (row: IListCollabsToNotify) => row.USUARIO ?? "Sin registro"
    },
    {
        name: 'CORREO',
        cell: (row: IListCollabsToNotify) => row.CORREO ?? "Sin registro"
    },
    {
        name: 'ELIMINAR',
        cell: (row: IListCollabsToNotify) => <button
            onClick={() => {
                handleDelete(row.ID_NOTIFICACION)
            }}
            type="button"
            disabled={deleteCollabToNotifyTableLoading}
            className="btn btn-outline-danger">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"></path>
            </svg>
            Eliminar
        </button>
    }
]