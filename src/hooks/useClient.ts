import { useCallback, useState } from "react"
import { IuseClient } from "./Types"
import { AdministrationService } from "../services/Administration.service"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../helpers/handleAxiosError"
import { InventoryService } from "../services/Inventory.service"
import { formatClientsDataList } from "../helpers/general"
import { errorNotification, successNotification } from "../helpers/notifications"
import { IDataListFormat } from "../helpers/Types"

const useClient = (): IuseClient => {

  //Estado para la request solicitar todos los clientes
  const [clients, setClients] = useState<Array<IDataListFormat>>([])
  const [loadingGetClients, setLoadingGetClients] = useState(false)
  //Estado para la request solicitar los clientes con su CMDB cargada
  const [clientsWithCMDB, setClientsWithCMDB] = useState<Array<IDataListFormat>>([])
  const [loadingGetClientsWithCMDB, setLoadingGetClientsWithCMDB] = useState(false)
  //Estado para la request crear un nuevo Cliente
  const [addingClientLoading, setAddingClientLoading] = useState<boolean>(false)

  const getClients = useCallback(async function () {
    setLoadingGetClients(true)
    try {
      const response = await InventoryService.getDataFromMonitorOptions({
        tabla: "cliente",
        filtro: "",
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setClients(formatClientsDataList(response.data.lista))
      }
    } catch (e) {
      handleAxiosError(e)
      setClients([])
    } finally {
      setLoadingGetClients(false)
    }
  }, [])

  const getClientsWithCMDBD = useCallback(async function () {
    setLoadingGetClientsWithCMDB(true)
    try {
      const response = await InventoryService.getDataFromMonitorOptions({
        tabla: "cliente_data",
        filtro: "",
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setClientsWithCMDB(formatClientsDataList(response.data.lista))
      }
    } catch (e) {
      handleAxiosError(e)
      setClientsWithCMDB([])
    } finally {
      setLoadingGetClientsWithCMDB(false)
    }
  }, [])

  const addNewClient = useCallback(async function (nameClient: string) {
    setAddingClientLoading(true)
    try {
      const response = await AdministrationService.createClient({
        nombre: nameClient
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        successNotification("Se creó el cliente correctamente."); return true
      } else {
        errorNotification(response.data.mensaje)
      }
    } catch (e) {
      handleAxiosError(e)
    } finally {
      setAddingClientLoading(false)
    }
  }, [])

  return {
    getClients, loadingGetClients, clients,
    getClientsWithCMDBD, loadingGetClientsWithCMDB, clientsWithCMDB,
    addNewClient, addingClientLoading
  }
}

export { useClient }