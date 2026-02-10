import { useEffect, useState } from "react"
import { Container } from "../../../../../components/dnd/Container"
import { KTSVG } from "../../../../../helpers"
import { useLinuxPatchContext } from "../../Context"
import { IExecutionConfiguration, IGroupsWithServersLinuxFront, ModalViewForLinuxPatch, initialConfiguration } from "../../../Types"
import { GroupAvailable } from "./GroupAvailable"
import { addCheckInGroups, buildBodyToSaveConfiguration, isAnyArrayEmpty, unCheckGroup } from "./utils"
import { Loading } from "../../../../../components/Loading"
import { useTypedSelector } from "../../../../../store/ConfigStore"
import { warningNotification } from "../../../../../helpers/notifications"
import { ModalSize } from "../../../../../hooks/Types"
import { Tab, Tabs } from "../../../../../components/Tabs"
import { ExecutionForm } from "./ExecutionForm"
import { ListPatches } from "./ListPatches"

const ExecutionConfiguration = () => {

    const { modalHook, groupHook, executionHook, selectedOwners } = useLinuxPatchContext()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const [groupsWithServer, setGroupsWithServer] = useState<IGroupsWithServersLinuxFront[]>([])
    const [executionConfiguration, setExecutionConfiguration] = useState<IExecutionConfiguration>(initialConfiguration(selectedOwners.clientToExecution))

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (isAnyArrayEmpty([
            groupsWithServer.filter(group => group.CHECK),
            executionConfiguration.exclusions,
            executionConfiguration.suse_categories,
            executionConfiguration.suse_severities
        ])) {
            warningNotification('Complete todos los datos porfavor.'); return
        }
        executionHook.createConfigurationLinux(buildBodyToSaveConfiguration(
            executionConfiguration,
            userName,
            groupsWithServer
        )).then(success => {
            if (success) {
                executionHook.getListExecutionsLinux('CANVIA')
                modalHook.closeModal()
            }
        })
    }

    const handleInitSearch = () => {
        if (isAnyArrayEmpty([
            groupsWithServer.filter(group => group.CHECK)
        ])) {
            warningNotification('Seleccione almenos un grupo para realizar la búsqueda.'); return
        }
        executionHook.executeSearchLinux(buildBodyToSaveConfiguration(
            executionConfiguration,
            userName,
            groupsWithServer
        )).then(({ success, data }) => {
            if (success) {
                executionHook.getListExecutionsLinux('CANVIA')
                modalHook.closeModal()
                executionHook.listProgressLinuxExecution(data).then(result => {
                    if (result) {
                        modalHook.openModal(ModalViewForLinuxPatch.EXECUTION_PROGRESS, ModalSize.XL, undefined, result)
                    }
                })
            }
        })
    }

    useEffect(() => {
        groupHook.getGroupsServersLinux('CANVIA', 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setGroupsWithServer(addCheckInGroups(groupHook.groupsServerLinuxData))
    }, [groupHook.groupsServerLinuxData])

    return (

        <>
            <div className='modal-header py-4'>
                <h2>NUEVA CONFIGURACIÓN</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body d-flex gap-2 flex-wrap'>
                <Container
                    id={1}
                    title={'Grupos disponibles'}
                >
                    {groupHook.getListGroupsServersLinux ? <Loading loadingText="Cargando grupos.." /> :
                        <div className=" ps-5 d-flex flex-column gap-5 overflow-scroll mh-600px">
                            {groupsWithServer.map((group) => (
                                <GroupAvailable
                                    templateSteps={group.PASOS_PLANTILLA.map(pase => pase.NOMBRE_RUTINARIA)}
                                    servers={group.SERVIDORES.map(server => `${server.NOMBRE_CI} | ${server.NRO_IP} (${server.TIPO_IP})`)}
                                    checked={group.CHECK}
                                    key={group.ID_GRUPO}
                                    groupName={group.NOMBRE}
                                    onChange={(checked) => setGroupsWithServer((prev) => {
                                        return unCheckGroup(prev, group.ID_GRUPO, checked)
                                    })}
                                />
                            ))}
                        </div>
                    }
                </Container>
                <section className="flex-grow-1">
                    <Tabs>
                        <Tab title="Configuración">
                            <div className='card-body'>
                                <ExecutionForm
                                    handleSubmit={handleSubmit}
                                    handleInitSearch={handleInitSearch}
                                    executionConfiguration={executionConfiguration}
                                    setExecutionConfiguration={setExecutionConfiguration}
                                />
                            </div>
                        </Tab>
                        <Tab title="Parches">
                            <div className='card-body'>
                                <ListPatches groupsWithServer={groupsWithServer} />
                            </div>
                        </Tab>
                    </Tabs>
                </section>
            </div>
        </>
    )
}

export { ExecutionConfiguration }