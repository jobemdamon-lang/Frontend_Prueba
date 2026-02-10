import { FC, useCallback, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { EmptyData } from "../../../../../../../components/datatable/EmptyData"
import { columnsRoutesModify } from "../../../content/TableData/routesColumnsModify"
import { ICreateRoutes, ICreateServers, IDataFetchServers, IDataTableRowsRoutes } from "../../../Types"
import { ComboBoxInput } from "./ComboBoxInput"
import uniqid from "uniqid"

type Props = {
  taskModifiedFunctions: any,
  serversData: IDataFetchServers[]
}

const RoutesSection: FC<Props> = ({ taskModifiedFunctions, serversData }) => {

  const [serversCombo, setServersCombo] = useState<Array<{ nombre: string | null }>>([])
  const [selectedServer, setSelectedServer] = useState<string>("")
  const [routesDataTable, setRoutesDataToTable] = useState<Array<IDataTableRowsRoutes>>([]);
  const [selectedRows, setSelectedRows] = useState<Array<IDataTableRowsRoutes>>([])
  const [toggleCleared, setToggleCleared] = useState(false);

  //Añadir atributos a nivel Front para su visualización, estas no seran enviadas
  useEffect(() => {
    const routesWithFormat: IDataTableRowsRoutes[] = taskModifiedFunctions.modifiedTask.lista_ruta?.map((route: ICreateRoutes) => {
      const idx = serversData.findIndex((serverFetch: IDataFetchServers) => serverFetch?.ID_EQUIPO === route.id_equipo)
      const routesWithFormat:IDataTableRowsRoutes = {
        ...route,
        nombreci: serversData[idx]?.NOMBRE_CI
      }
      return routesWithFormat
    })
    const routesWithoutStateCero = routesWithFormat.filter((routes=> routes.estado !== 0))
    setRoutesDataToTable(routesWithoutStateCero)
  }, [taskModifiedFunctions.modifiedTask.lista_ruta, serversData])

  //Eliminar los o el CI seleccionado de la tabla
  const handleDelete = () => {
    setToggleCleared(!toggleCleared);
    taskModifiedFunctions.updateEliminarRuta(selectedRows)
  }

  //Actualizar las filas seleccionadas
  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, [])

  //Añadir un servidor - CI a la tabla
  const addRouteToTable = (selectedServer: string) => {
    let idxServer = serversData.findIndex((server: IDataFetchServers) => server?.NOMBRE_CI === selectedServer)
    const newRoute: ICreateRoutes = {
      idRow: uniqid(),
      descripcion: "",
      excepcion: "",
      parametro: "",
      unidad: "",
      estado: 1,
      id_soli_ruta: 0,
      id_equipo: serversData[idxServer]?.ID_EQUIPO
    }
    taskModifiedFunctions.updateAgregarRuta(newRoute)
  }

  //Funcion para actualizar una fila de la tabla
  const handleUpdateItem = (id: string, propertyToModify: any) => {
    taskModifiedFunctions.updateModificarRuta(id, propertyToModify)
  }

  useEffect(() => {
    let serversSelected = taskModifiedFunctions.modifiedTask.lista_server?.map((server: ICreateServers) => {
      return { nombre: server.nombreci }
    })
    setServersCombo(serversSelected)
  }, [taskModifiedFunctions.modifiedTask.lista_server])

  return (
    <div className="d-flex flex-column p-8 gap-5">
      <div className="d-flex justify-content-around align-items-end">
        <ComboBoxInput label="Servidor" data={serversCombo} setNewValue={setSelectedServer} />
        <div className="d-flex gap-5">
          <button type="button" onClick={() => addRouteToTable(selectedServer)} className="btn btn-primary h-43px">Agregar</button>
          <button type="button" onClick={handleDelete} className="btn btn-danger h-43px">Eliminar</button>
        </div>
      </div>
      <DataTable
        columns={columnsRoutesModify(handleUpdateItem)}
        persistTableHead
        selectableRows
        highlightOnHover
        pagination
        fixedHeader
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleCleared}
        noDataComponent={<EmptyData loading={false} />}
        disabled={false}
        data={routesDataTable}
      />
    </div>
  )
}
export { RoutesSection }