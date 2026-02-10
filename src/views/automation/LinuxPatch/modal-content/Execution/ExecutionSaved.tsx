import { useEffect, useState } from "react"
import { Container } from "../../../../../components/dnd/Container"
import { KTSVG } from "../../../../../helpers"
import { useLinuxPatchContext } from "../../Context"
import { IExecutionConfiguration, IGroupsWithServersLinuxFront, ILinuxConfigurationSaved, ITemplatedConfiguratedLinux, ModalViewForLinuxPatch } from "../../../Types"
import { GroupAvailable } from "./GroupAvailable"
import { addCheckInGroupsAndValue, buildBodyToExecuteTemplate, buildBodyToSaveConfiguration, initConfigurationSaved, isAnyArrayEmpty, unCheckGroup } from "./utils"
import { Loading } from "../../../../../components/Loading"
import { useTypedSelector } from "../../../../../store/ConfigStore"
import { warningNotification } from "../../../../../helpers/notifications"
import { ModalSize } from "../../../../../hooks/Types"
import { Tab, Tabs } from "../../../../../components/Tabs"
import { ExecutionFormSaved } from "./ExecutionFormSaved"
import { ListPatches } from "./ListPatches"

const ExecutionSaved = () => {

    const { modalHook, groupHook, executionHook } = useLinuxPatchContext()
    const modalInformation: ILinuxConfigurationSaved = modalHook.modalInformation
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    //const [templatedConfigurated, setTemplatedConfigurated] = useState<ITemplatedConfiguratedLinux[]>([])
    const [groupsWithServer, setGroupsWithServer] = useState<IGroupsWithServersLinuxFront[]>([])
    const [executionConfiguration, setExecutionConfiguration] = useState<IExecutionConfiguration>(initConfigurationSaved(modalInformation))

    const handleSubmit = () => {
        if (isAnyArrayEmpty([
            groupsWithServer.filter(group => group.CHECK),
            executionConfiguration.exclusions,
            executionConfiguration.suse_categories,
            executionConfiguration.suse_severities
        ])) {
            warningNotification('Complete todos los datos porfavor.'); return
        }
        executionHook.updateConfigurationLinux(modalInformation.ID_EJECUCION, buildBodyToSaveConfiguration(
            executionConfiguration,
            userName,
            groupsWithServer
        )).then(success => {
            if (success) modalHook.closeModal()
        })
    }

    const handleExecute = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        executionHook.startExecutionLinux(buildBodyToExecuteTemplate(
            executionConfiguration,
            userName,
            groupsWithServer
        ), modalInformation.ID_EJECUCION).then(result => {
            if (result.success) {
                executionHook.listProgressLinuxExecution(result.data).then(result => {
                    if (result) {
                        modalHook.closeModal()
                        modalHook.openModal(ModalViewForLinuxPatch.EXECUTION_PROGRESS, ModalSize.XL, undefined, result)
                    }
                })
            }
        })
    }

    useEffect(() => {
        groupHook.getGroupsServersLinux('CANVIA', 0)
        /*templateHook.getTemplateOfExecution(modalInformation.ID_EJECUCION).then(result => {
            if (result) setTemplatedConfigurated(result)
        })*/
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setGroupsWithServer(addCheckInGroupsAndValue(groupHook.groupsServerLinuxData, modalInformation))
    }, [groupHook.groupsServerLinuxData, modalInformation])

    return (

        <>
            <div className='modal-header py-4'>
                <h2>CONFIGURACIÓN {modalInformation.NOMBRE}</h2>
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
                        <div className="p-1 d-flex flex-column gap-5 overflow-scroll mh-600px">
                            {groupsWithServer.map((group) => (
                                <GroupAvailable
                                    templateSteps={group.PASOS_PLANTILLA.map(pase => pase.NOMBRE_RUTINARIA)}
                                    servers={group.SERVIDORES.map(server => server.NOMBRE_CI)}
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
                                <ExecutionFormSaved
                                    handleSubmit={handleSubmit}
                                    handleExecute={handleExecute}
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

export { ExecutionSaved }

export const TemplateConfigurated = ({ templatedConfigurated }: { templatedConfigurated: ITemplatedConfiguratedLinux[] }) => {
    return (
        <div>
            {templatedConfigurated.map(group => (
                <p>{group.nombre_grupo} : {group.lista_rutinarias.map(routine => routine.nombre_rutinaria).join(' >> ')}</p>
            ))}
        </div>
    )
}
