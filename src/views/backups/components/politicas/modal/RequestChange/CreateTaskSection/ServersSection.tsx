import { FC, useCallback, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { EmptyData } from "../../../../../../../components/datatable/EmptyData"
import { columnsServersCreate } from "../../../content/TableData/ServersColumnsCreate"
import { ICreateServers, IDataFetchServers, IDataTableRowsServers } from "../../../Types"
import uniqid from "uniqid"
import DatalistInput from "react-datalist-input"

type Props = {
  serversData: IDataFetchServers[]
  serversCombo: { nombre: string }[]
  taskFunctions: any,
  isDetailVisibility: boolean,
}

const ServersSection: FC<Props> = ({ serversData, serversCombo, taskFunctions ,isDetailVisibility}) => {

  const [selectedServer, setSelectedServer] = useState<string>("")
  const [selectedRows, setSelectedRows] = useState<Array<IDataTableRowsServers>>([])
  const [toggleCleared, setToggleCleared] = useState(false);
  const [serversDataTable, setServerDataToTable] = useState<Array<IDataTableRowsServers>>([]);

  //Cada vez que la vista se cambia se reincian los valores al estado inicial
  useEffect(()=>{
    setSelectedRows([])
    setSelectedServer("")
  },[isDetailVisibility])

  //Añadir atributos a nivel Front para su visualización, estas no seran enviadas
  useEffect(() => {
    const serverWithFormat: IDataTableRowsServers[] = taskFunctions.newTask.lista_server?.map((server: ICreateServers) => {
      const idx = serversData.findIndex((serverFetch: IDataFetchServers) => serverFetch.ID_EQUIPO === server.id_equipo)
      return {
        ...server,
        tipo: serversData[idx].TIPO_EQUIPO,
        ip: serversData[idx].IPLAN,
        ambiente: serversData[idx].AMBIENTE,
        ubicacion: serversData[idx].UBICACION,
        nombreVirtual: serversData[idx].NOMBRE_VIRTUAL,
      }
    })
    setServerDataToTable(serverWithFormat)
  }, [taskFunctions.newTask.lista_server, serversData])

  //Actualizar las filas seleccionadas
  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, [])

  //Eliminar los o el CI seleccionado de la tabla
  const handleDelete = () => {
    setToggleCleared(!toggleCleared);
    taskFunctions.updateEliminarServidor(selectedRows)
  }

  //Añadir un servidor - CI a la tabla
  const addServerToTable = (selectedServer: string) => {
    //Del nombre del combo se extrae el nombreCI ya que su valor es un concatenado de nombreci-nombrevirtual
    let serverIdx = serversData.findIndex((server) => server.NOMBRE_CI === selectedServer.split('||')[0])
    if(serverIdx !== -1){
      const serverToAdd: ICreateServers = {
        id_equipo: serversData[serverIdx].ID_EQUIPO,
        estado: 1,
        idRow: uniqid(),
        nombreci: serversData[serverIdx].NOMBRE_CI
      }
      taskFunctions.updateAgregarServidor(serverToAdd)
    }
  }

  return (
    <div className="d-flex flex-column p-8 gap-5">
      <div className="d-flex justify-content-around align-items-end">
        <DatalistInput
          value={selectedServer}
          placeholder=""
          label=""
          onSelect={(event) => setSelectedServer(event.value)}
          items={serversCombo.map(server => ({ id: uniqid(), value: server.nombre }))}
        />
        <div className="d-flex gap-5">
          <button type="button" onClick={() => addServerToTable(selectedServer)} className="btn btn-primary h-43px">Agregar</button>
          <button type="button" onClick={handleDelete} className="btn btn-danger h-43px">Eliminar</button>
        </div>
      </div>
      <DataTable
        columns={columnsServersCreate}
        persistTableHead
        selectableRows
        highlightOnHover
        pagination
        fixedHeader
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleCleared}
        noDataComponent={<EmptyData loading={false} />}
        disabled={false}
        data={serversDataTable}
      />
    </div>
  )
}
export { ServersSection }