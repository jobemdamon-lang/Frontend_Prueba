import { useCallback, useEffect, useState } from "react"
import { KTSVG } from "../../../../../helpers"
import { useLinuxPatchContext } from "../../Context"
import { TabContainer, TabItem } from "../../../../../components/SimpleTab"
import { ServerContainer } from "./ServerContainer"
import { IListProgressLinux, ISocketDataEvent } from "../../../Types"
import debounce from "just-debounce-it"
import { useTypedSelector } from "../../../../../store/ConfigStore"

const ExecutionProgress = () => {

    const { modalHook, executionHook, socketInstance, selectedOwners } = useLinuxPatchContext()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const progressExecutionModal = modalHook.modalInformation as IListProgressLinux
    const [progressExecution, setProgressExecution] = useState<IListProgressLinux>(progressExecutionModal)
    const [tabActive, setActiveActive] = useState<string | number>(progressExecutionModal.lista_programacion[0].id_grupo || 0)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleDebounceFetchData = useCallback(
        debounce(() => {
            executionHook.listProgressLinuxExecution(parseInt(progressExecutionModal.id_ejecucion)).then(result => {
                if (result) {
                    setProgressExecution(result)
                }
            })
        }, 1500), [])

    useEffect(() => {
        socketInstance?.on('notificacion', (data: ISocketDataEvent) => {
            if ((
                data.status === "Correcto" ||
                data.status !== "Correcto"
            ) &&
                data.usuario === userName &&
                data.tipo === 3
            ) { handleDebounceFetchData() }
        })
        return () => {
            executionHook.getListExecutionsLinux(selectedOwners.clientToExecution)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className='modal-header py-4'>
                <h2>DETALLE DE EJECUCIÓN {progressExecutionModal.nombre_ejecucion}</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body d-flex flex-column gap-2 px-lg-10 py-5'>
                <TabContainer
                    activeTab={tabActive}
                    setActiveTab={setActiveActive}
                >
                    {progressExecution.lista_programacion.map(group => {
                        return (
                            <TabItem
                                titleTab={group.nombre_grupo}
                                idTab={group.id_grupo}
                                key={group.id_grupo}
                            >
                                <div>
                                    {group.lista_servidores.map(server => {
                                        return (
                                            <ServerContainer
                                                handleDebounceFetchData={handleDebounceFetchData}
                                                nroTicket={progressExecution.crq}
                                                server={server}
                                                key={server.id_equipo}
                                                executionID={parseInt(progressExecutionModal.id_ejecucion)}
                                            />
                                        )
                                    })}
                                </div>
                            </TabItem>
                        )
                    })}
                </TabContainer>
            </div>
        </>
    )
}

export { ExecutionProgress }
