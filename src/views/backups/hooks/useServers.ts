import { useCallback, useState } from "react"
import { InventoryService } from "../../../services/Inventory.service"
import { IDataFetchServers, IClientProject, IClaseFamilia } from "../components/politicas/Types"

//Custom Hook que devuelve un metodo para hacer la llamada a la API, la data de los Equipos(Solo Servidores) y el estado de carga
const useServers = (): any => {

  const [serversData, setServerData] = useState<Array<IDataFetchServers>>([])
  const [serversCombo, setServersCombo] = useState<Array<{nombre:string}>>([])
  const [loading, setLoading] = useState(false)

  const fetchServers = useCallback(async function (ownerServer: IClientProject, typeServer: IClaseFamilia) {
    setLoading(true)
    //Se remueve el ALP concatenado al inicio del proyecto API listarProyecto para su correacto funcionamiento en el listarEquipos API
    let indexofFinishALP = ownerServer.proyecto?.indexOf("-")
    let projectWhitoutALP = ownerServer.proyecto?.slice(indexofFinishALP+1,ownerServer.proyecto.length)
    try {
      const response = await InventoryService.listConfigurationItems({
        cliente: ownerServer.cliente,
        alp: ownerServer.alp ?? "",
        proyecto: projectWhitoutALP,
        buscar_palabra: ""
      })
      //Extraemos unicamente los atributos necesarios para Backups
      const necessaryData: IDataFetchServers[] = response.data.lista.map((server:IDataFetchServers ) => {
        return {
          NOMBRE_CI: server.NOMBRE_CI,
          ALP: server.ALP,
          AMBIENTE: server.AMBIENTE,
          CLASE: server.CLASE,
          FAMILIA: server.FAMILIA,
          IPLAN: server.IPLAN,
          CLIENTE: server.CLIENTE,
          ID_EQUIPO: server.ID_EQUIPO,
          PROYECTO: server.PROYECTO,
          TIPO_EQUIPO: server.TIPO_EQUIPO,
          UBICACION: server.UBICACION,
          NOMBRE_VIRTUAL: server.NOMBRE_VIRTUAL
        }
      })
      //Extraemos unicamente los atributos necesarios para el Input Combo Servidores
      const necessaryDataToCombo: {nombre:string}[] = response.data.lista.map((server: IDataFetchServers) => {
        return {
          nombre: server?.NOMBRE_CI+'||'+server?.NOMBRE_VIRTUAL
        }
      })
      setServerData(necessaryData)
      setServersCombo(necessaryDataToCombo)
      setLoading(false)
    } catch (error) {
      setServerData([])
      setServersCombo([])
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {serversData, fetchServers, loading, serversCombo}
}

export { useServers }