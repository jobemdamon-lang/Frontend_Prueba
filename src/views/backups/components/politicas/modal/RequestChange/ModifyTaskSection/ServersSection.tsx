import { FC, useCallback, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { EmptyData } from "../../../../../../../components/datatable/EmptyData"
import { columnsServers } from "../../../content/TableData/ServersColumns"
import { ICreateServers, IDataFetchServers, IDataTableRowsServers } from "../../../Types"
import uniqid from "uniqid"
import DatalistInput from "react-datalist-input"

type Props = {
  serversData: IDataFetchServers[]
  serversCombo: { nombre: string }[]
  taskModifiedFunctions: any
}

const ServersSection: FC<Props> = ({ serversData, serversCombo, taskModifiedFunctions }) => {

  const [selectedServer, setSelectedServer] = useState<string>("")
  const [selectedRows, setSelectedRows] = useState<Array<IDataTableRowsServers>>([])
  const [toggleCleared, setToggleCleared] = useState(false);
  const [serversDataTable, setServerDataToTable] = useState<Array<IDataTableRowsServers>>([]);

  //Añadir atributos a nivel Front para su visualización, estas no seran enviadas
  useEffect(() => {
    const serverWithFormat: IDataTableRowsServers[] = taskModifiedFunctions.modifiedTask.lista_server?.map((server: ICreateServers) => {
      const idx = serversData.findIndex((serverFetch: IDataFetchServers) => serverFetch?.ID_EQUIPO === server.id_equipo)
      const newServersWithFormat:IDataTableRowsServers  = {
        ...server,
        tipo: serversData[idx]?.TIPO_EQUIPO,
        ip: serversData[idx]?.IPLAN,
        ambiente: serversData[idx]?.AMBIENTE,
        ubicacion: serversData[idx]?.UBICACION,
        estado: server.estado.toString(),
        nombreVirtual: serversData[idx]?.NOMBRE_VIRTUAL
      }
      return newServersWithFormat
    })
    const serversWithouStateCero = serverWithFormat.filter((items:IDataTableRowsServers) => items.estado !== "0")
    setServerDataToTable(serversWithouStateCero)
  }, [taskModifiedFunctions.modifiedTask.lista_server, serversData])

  //Eliminar los o el CI seleccionado de la tabla
  const handleDelete = () => {
    setToggleCleared(!toggleCleared);
    taskModifiedFunctions.updateEliminarServidor(selectedRows)
  }

  //Actualizar las filas seleccionadas
  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, [])

  //Añadir un servidor - CI a la tabla
  const addServerToTable = (selectedServer: string) => {
    let idxServer = serversData.findIndex((server: IDataFetchServers) => server?.NOMBRE_CI === selectedServer.split('||')[0])
    const serverToAdd: ICreateServers = {
      estado: 1,
      nombreci: serversData[idxServer]?.NOMBRE_CI,
      id_equipo: serversData[idxServer]?.ID_EQUIPO,
      idRow: uniqid()
    }
    taskModifiedFunctions.updateAgregarServidor(serverToAdd)
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
        columns={columnsServers}
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