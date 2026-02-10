import { FC, useEffect, useState } from 'react'
import { ModuleProps } from '../../../helpers/Types'
import { LinuxPatchProvider } from './Context'
import { useModal } from '../../../hooks/useModal'
import { LinuxPatchModal } from './LinuxPatchModal'
import { Tab, Tabs } from '../../../components/Tabs'
import { ServerSection } from './content/ServerSection'
import { ExecutionSection } from './content/ExecutionSection'
import { CardHeader } from '../../../components/CardHeader'
import { useGroup } from '../hooks/useGroup'
import { useServer } from '../hooks/useServer'
import { IOwnerLinuxServer, ISocketDataEvent, initialOwnerLinuxServer } from '../Types'
import { useTemplate } from '../hooks/useTemplate'
import { useCredential } from '../hooks/useCredential'
import { useExecution } from '../hooks/useExecution'
import { useClient } from '../../../hooks/useClient'
import { useSocket } from '../../../hooks/useSocket'
import { errorNotification } from '../../../helpers/notifications'
import { useTypedSelector } from '../../../store/ConfigStore'


const Provider: FC<ModuleProps> = ({ rol }) => {

    const [selectedOwners, setOwners] = useState<IOwnerLinuxServer>(initialOwnerLinuxServer)
    const modalHook = useModal()
    const groupHook = useGroup()
    const serverHook = useServer()
    const templateHook = useTemplate()
    const credentialHook = useCredential()
    const executionHook = useExecution()
    const clientHook = useClient()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const { connectSocket, socketInstance, disconnectSocket } = useSocket()

    useEffect(() => {
        clientHook.getClientsWithCMDBD()
        connectSocket()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        //Tipo 1 es para las notificaciones de busqueda de hotfix y tipo 2 es para el parchado windows y 3 parchado linux
        socketInstance?.on('notificacion', (data: ISocketDataEvent) => {
            if (data.status !== "Correcto" && data.usuario === userName && data.tipo === 3) {
                errorNotification(data.mensaje)
            }
        })
        return () => disconnectSocket()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socketInstance])

    return (
        <LinuxPatchProvider value={{
            selectedOwners,
            setOwners,
            rol,
            modalHook,
            groupHook,
            serverHook,
            templateHook,
            credentialHook,
            executionHook,
            clientHook,
            socketInstance
        }} >
            <div className='card'>
                <Tabs>
                    <Tab title="Servidores">
                        <CardHeader title='Servidores gestionados' style={{ minHeight: '50px' }} />
                        <div className='card-body'>
                            <ServerSection />
                        </div>
                    </Tab>
                    <Tab title="Ejecuciones">
                        <CardHeader title='Lista de Ejecuciones' style={{ minHeight: '50px' }} />
                        <div className='card-body'>
                            <ExecutionSection />
                        </div>
                    </Tab>
                </Tabs>
            </div>
            <LinuxPatchModal />
        </LinuxPatchProvider>
    )
}

export { Provider }

