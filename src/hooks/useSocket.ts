import { useState } from "react"
import { Socket, io } from "socket.io-client"

const useSocket = () => {
  const [socketInstance, setSocketInstance] = useState<Socket<any>>()

  const connectSocket = () => {
    /*const socket_instance = io('http://20.96.183.183/', {
      path: '/canviacloud/socket.io'
    })*/

    const socket_instance = io('https://mngapis.azure-api.net/', {
      path: '/canviacloud/socket.io'
    })

    socket_instance.on('connect', () => {
      console.log('Socket ha sido conectado exitosamente.');
      setSocketInstance(socket_instance);
    })
  }

  const disconnectSocket = () => {
    if (socketInstance) {
      socketInstance.disconnect(); 
      console.info("Socket se ha desconectado")
    } else {
      console.info('Se intento desconectar pero no se pudo')
    }
  }

  return { connectSocket, socketInstance, disconnectSocket }
}
export { useSocket }