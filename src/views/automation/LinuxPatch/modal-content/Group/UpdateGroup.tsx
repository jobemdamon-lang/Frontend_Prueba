import DataTable, { TableColumn } from "react-data-table-component"
import { secondCustomStyles } from "../../../../../helpers/tableStyles"
import { EmptyData } from "../../../../../components/datatable/EmptyData"
import { FC, useEffect, useState } from "react"
import { ToolTip } from "../../../../../components/tooltip/ToolTip"
import { IListServerUnified, OPERATE_SYSTEMS } from "../../../Types"
import { LoadingTable } from "../../../../../components/loading/LoadingTable"
import { Spinner } from "react-bootstrap"
import { useLinuxPatchContext } from "../../Context"
import { useTypedSelector } from "../../../../../store/ConfigStore"
import { UpdateIPBtn } from "./UpdateIPBtn"
import { SelectInput } from "../../../../../components/Inputs/SelectInput"
import { Input } from "../../../../../components/Inputs/TextInput"
import { warningNotification } from "../../../../../helpers/notifications"

type Props = { OPERATE_SYSTEM_ENV: OPERATE_SYSTEMS }
const UpdateGroup: FC<Props> = ({ OPERATE_SYSTEM_ENV }) => {

    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const { groupHook, templateHook, serverHook, selectedOwners, modalHook } = useLinuxPatchContext()
    const [serversInSelectedGroup, setServersInSelectedGroup] = useState<IListServerUnified[]>([])
    const [selectedGroup, setSelectedGroup] = useState('')
    const [selectedTemplate, setSelectedTemplate] = useState('')
    const [groupName, setGroupName] = useState("")

    //Cada vez que la plantilla asociada a un grupo se actualice, el nombre del select se actualizara
    useEffect(() => setSelectedTemplate(groupHook.templateAsociatedToGroup[0]?.NOMBRE), [groupHook.templateAsociatedToGroup])

    useEffect(() => {
        const group = groupHook.groupsData.find(group => group.NOMBRE === groupName)
        if (!group) return;
        //Se filtran los servidores con grupo para su listado y se construye la data de grupos unicos para el select
        setServersInSelectedGroup(serverHook.serversUnifiedData.filter(server => server.ID_GRUPO === group.ID_GRUPO))

    }, [groupHook.groupsData, selectedGroup, serverHook.serversUnifiedData, groupName])

    //Función que actua cuando se cambia el grupo seleccionado en el Select Input
    const setServerOfGroupInView = (groupName: string) => {
        setSelectedGroup(groupName)
        const group = groupHook.groupsData.find(group => group.NOMBRE === groupName)
        if (!group) return;
        setSelectedTemplate('')
        groupHook.getTemplateOfGroup(group.ID_GRUPO)
        setGroupName(groupName)
    }

    //Función que actua cuando se da click en el boton eliminar en la tabla de CIs
    const handleDeleteGroup = (idServer: number) => {
        const group = groupHook.groupsData.find(group => group.NOMBRE === groupName)
        if (!group) return;
        groupHook.deleteServerInGroupLinux(group.ID_GRUPO, idServer).then(success => {
            if (success) {
                serverHook.getListOfServersUnified(selectedOwners.cliente, 0)
                serverHook.getServersAssigned(selectedOwners.cliente, 0)
            }
        })
    }

    //Función que actua cuando se da click en el boton actualizar nombre del Grupo
    const handleChangeNameGroup = () => {
        const group = groupHook.groupsData.find(group => group.NOMBRE === selectedGroup)
        if (groupName === "" || !group) {
            warningNotification("Ingrese un nombre de Grupo válido")
            return
        }
        groupHook.changeGroupName(group.ID_GRUPO, {
            nombre: groupName
        }).then(success => {
            if (success) groupHook.getListGroups(OPERATE_SYSTEM_ENV)
        })
    }

    return (
        <div className='d-flex flex-column gap-5'>
            <div className="d-flex gap-5 justify-content-center align-items-center flex-wrap flex-lg-nowrap">
                <SelectInput
                    label="Grupos"
                    value={selectedGroup}
                    onChange={(value) => setServerOfGroupInView(value)}
                    data={groupHook.groupsData.map(group => ({ codigo: group.ID_GRUPO, nombre: group.NOMBRE }))}
                    loading={groupHook.getListGroupsLoading}
                />
                <div className="d-flex gap-5 align-items-end">
                    <Input
                        label="Nombre del Grupo"
                        onChange={setGroupName}
                        value={groupName}
                    />
                    <button
                        className="btn-sm btn btn-success"
                        disabled={groupHook.changeGroupNameLoading}
                        onClick={() => handleChangeNameGroup()}
                    >
                        {groupHook.changeGroupNameLoading ? 'Actualizando' : 'Actualizar'}
                    </button>
                </div>
                <div className="d-flex gap-5 align-items-end">
                    <SelectInput
                        label="Plantilla Asociada"
                        onChange={setSelectedTemplate}
                        value={selectedTemplate}
                        data={templateHook.templatesData.map(template => ({ codigo: template.ID_PLANTILLA, nombre: template.NOMBRE }))}
                        loading={groupHook.getTemplateOfGroupLoading}
                    />
                    <button
                        className="btn-sm btn btn-success"
                        disabled={groupHook.reassignTemplateOfGroupLoading}
                        onClick={() => {
                            const group = groupHook.groupsData.find(group => group.NOMBRE === selectedGroup)
                            const template = templateHook.templatesData.find(template => template.NOMBRE === selectedTemplate)
                            if (!group || !template) {
                                warningNotification("Debe seleccionar un Grupo y Plantilla.")
                                return;
                            }
                            groupHook.reassignTemplate({
                                id_grupo: group?.ID_GRUPO,
                                id_plantilla: template?.ID_PLANTILLA,
                                usuario: userName
                            }).then(success => {
                                if (success) groupHook.getTemplateOfGroup(group.ID_GRUPO)
                            })
                        }}
                    >
                        {groupHook.reassignTemplateOfGroupLoading ? "Reasignando" : "Reasignar"}
                    </button>
                    <button
                        className="btn btn-sm btn-danger"
                        disabled={groupHook.dehabilitateGroupLoading}
                        onClick={() => {
                            const group = groupHook.groupsData.find(group => group.NOMBRE === selectedGroup)
                            if (!group) {
                                warningNotification('Seleccione un grupo válido')
                                return
                            }
                            groupHook.dehabilitateGroup(group.ID_GRUPO).then(success => {
                                if (success) modalHook.closeModal()
                            })
                        }}
                    >
                        {groupHook.dehabilitateGroupLoading ? 'Eliminando' : 'Eliminar'}
                    </button>
                </div>
            </div>
            <div className="position-relative">
                <DataTable
                    columns={UpdateGroupColumns(handleDeleteGroup, groupHook.deleteServerInGroupLinuxLoading)}
                    pagination
                    highlightOnHover
                    persistTableHead
                    customStyles={secondCustomStyles}
                    disabled={serverHook.getServersUnifiedLoading}
                    noDataComponent={<EmptyData loading={serverHook.getServersUnifiedLoading} />}
                    data={serversInSelectedGroup}
                />
                {serverHook.getServersUnifiedLoading && <LoadingTable description='Cargando' />}
            </div>
        </div>
    )
}
export { UpdateGroup }

const UpdateGroupColumns = (handleDeleteGroup: (idServer: number) => void, deleteServerInGroupLinuxLoading: boolean): TableColumn<IListServerUnified>[] => [
    {
        name: 'Nombre del CI',
        selector: (row: IListServerUnified) => row.NOMBRE_CI ?? "Sin registro"
    },
    {
        name: 'HostName',
        selector: (row: IListServerUnified) => row.NOMBRE ?? "Sin registro"
    },
    {
        name: 'Familia',
        selector: (row: IListServerUnified) => row.FAMILIA ?? "Sin registro"
    },
    {
        name: 'Clase',
        selector: (row: IListServerUnified) => row.CLASE ?? "Sin registro"
    },
    {
        name: 'Nro. IP',
        cell: (row: IListServerUnified) => <UpdateIPBtn rowInformation={row} />
    },
    {
        name: 'Eliminar',
        cell: (row: IListServerUnified) => (
            <ToolTip
                message='Eliminar servidor del Grupo'
                placement='top'
            >
                <button
                    className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                    disabled={deleteServerInGroupLinuxLoading}
                    onClick={() => { handleDeleteGroup(row.ID_EQUIPO) }}
                >
                    {deleteServerInGroupLinuxLoading ?
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