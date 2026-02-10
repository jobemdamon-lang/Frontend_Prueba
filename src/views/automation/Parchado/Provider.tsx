import { FC, useEffect, useState } from "react"
import { ModuleProps } from "../../../helpers/Types"
import { WindowsPatchProvider } from "./Context"
import { Content } from "./Content/Content"
import { useModal } from "../../../hooks/useModal"
import { ParchadoModal } from "./ParchadoModal"
import "../../../assets/sass/components/InventoryFilter/data-list-input-styles.scss"
import { ISocketDataEvent } from "./../Types"
import { useServer } from "../hooks/useServer"
import { useSocket } from "../../../hooks/useSocket"
import { useTypedSelector } from "../../../store/ConfigStore"
import { useGroup } from "../hooks/useGroup"
import { useTemplate } from "../hooks/useTemplate"
import { useCredential } from "../hooks/useCredential"
import { IOwnerLinuxServer, initialOwnerLinuxServer } from "../Types"
import { usePlanification } from "../hooks/usePlanification"
import { useExecution } from "../hooks/useExecution"
import { errorNotification } from "../../../helpers/notifications"

const Provider: FC<ModuleProps> = ({ rol }) => {

  const [selectedOwners, setOwners] = useState<IOwnerLinuxServer>(initialOwnerLinuxServer)
  const [clientForExecution, setSelectedClientForExecution] = useState('')
  const executionModalFunctions = useModal()
  const modalHook = useModal()
  const groupHook = useGroup()
  const serverHook = useServer()
  const templateHook = useTemplate()
  const credentialHook = useCredential()
  const planificationHook = usePlanification()
  const executionHook = useExecution()
  const { connectSocket, socketInstance, disconnectSocket } = useSocket()
  const userName = useTypedSelector(({ auth }) => auth.usuario)

  useEffect(() => {
    connectSocket()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    //Tipo 1 es para las notificaciones de busqueda de hotfix y tipo 2 es para el parchado normal
    socketInstance?.on('notificacion', (data: ISocketDataEvent) => {
      if (data.status !== "Correcto" && data.usuario === userName && data.tipo === 1) {
        errorNotification(data.mensaje)
      }
    })

    socketInstance?.on('notificacion', (data: ISocketDataEvent) => {
      console.log('llega notifiacion desde provider')
      if (data.status !== "Correcto" && data.usuario === userName && data.tipo === 2) {
        errorNotification(data.mensaje)
      }
    })
    return () => disconnectSocket()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketInstance])

  return (
    <WindowsPatchProvider
      value={{
        selectedOwners,
        setOwners,
        rol,
        modalHook,
        groupHook,
        serverHook,
        templateHook,
        credentialHook,
        planificationHook,
        executionHook,
        socketInstance,
        executionModalFunctions,
        disconnectSocket,
        clientForExecution,
        setSelectedClientForExecution
      }}
    >
      <Content />
      <ParchadoModal />
    </WindowsPatchProvider >
  )
}

export { Provider }
