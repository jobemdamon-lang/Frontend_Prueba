import { FC, useCallback, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { EmptyData } from "../../../../../../../components/datatable/EmptyData"
import { columnsRoutesRW } from "../../../content/TableData/routesColumnsRW"
import { ICreateRoutes, ICreateServers, IDataFetchServers, IDataTableRowsRoutes } from "../../../Types"
import { ComboBoxInput } from "./ComboBoxInput"
import uniqid from 'uniqid';

type Props = {
  taskFunctions: any,
  serversData: IDataFetchServers[],
  isDetailVisibility: boolean
}

const RoutesSection: FC<Props> = ({ taskFunctions, serversData, isDetailVisibility }) => {

  const [serversCombo, setServersCombo] = useState<Array<{ nombre: string | null }>>([])
  const [selectedRoute, setSelectedRoute] = useState<string>("")
  const [routesDataTable, setRoutesDataToTable] = useState<Array<IDataTableRowsRoutes>>([]);
  const [selectedRows, setSelectedRows] = useState<Array<IDataTableRowsRoutes>>([])
  const [toggleCleared, setToggleCleared] = useState(false);

   //Cada vez que la vista se cambia se reincian los valores al estado inicial
   useEffect(()=>{
    setSelectedRows([])
    setSelectedRoute("")
  },[isDetailVisibility])

  //Añadir atributos a nivel Front para su visualización, estas no seran enviadas
  useEffect(() => {
    const routesWithFormat: IDataTableRowsRoutes[] = taskFunctions.newTask.lista_ruta?.map((route: ICreateRoutes) => {
      const idx = serversData.findIndex((serverFetch: IDataFetchServers) => serverFetch.ID_EQUIPO === route.id_equipo)
      return {
        ...route,
        nombreci: serversData[idx].NOMBRE_CI
      }
    })
    setRoutesDataToTable(routesWithFormat)
  }, [taskFunctions.newTask.lista_ruta, serversData])

  //Efecto para actualizar los datos del combo servidores actualizados en la seccion de servers
  useEffect(() => {
    let serversSelected = taskFunctions.newTask.lista_server?.map((server: ICreateServers) => {
      return { nombre: server.nombreci }
    })
    setServersCombo(serversSelected)
  }, [taskFunctions.newTask.lista_server])

  //Eliminar los o el CI seleccionado de la tabla
  const handleDelete = () => {
    setToggleCleared(!toggleCleared);
    taskFunctions.updateEliminarRuta(selectedRows)
  }

  //Actualizar las filas seleccionadas
  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, [])

  //Añadir un servidor - CI a la tabla
  const addServerToTable = (selectedServer: string) => {
    const idx = serversData.findIndex((server: IDataFetchServers) => server.NOMBRE_CI === selectedServer)
    const newRoute: ICreateRoutes = {
      idRow: uniqid(),
      descripcion: "",
      excepcion: "",
      parametro: "",
      unidad: "",
      estado: 1,
      id_soli_ruta: 0,
      id_equipo: serversData[idx].ID_EQUIPO
    }
    taskFunctions.updateAgregarRuta(newRoute)
  }

  //Funcion para actualizar una fila de la tabla
  const handleUpdateItem = (id_row: string, propertyToModify: any) => {
    taskFunctions.updateModificarRuta(id_row, propertyToModify)
  }

  return (
    <div className="d-flex flex-column p-8 gap-5">
      <div className="d-flex justify-content-around align-items-end">
        <ComboBoxInput label="Servidor" data={serversCombo} setNewValue={setSelectedRoute} />
        <div className="d-flex gap-5">
          <button type="button" onClick={() => addServerToTable(selectedRoute)} className="btn btn-primary h-43px">Agregar</button>
          <button type="button" onClick={handleDelete} className="btn btn-danger h-43px">Eliminar</button>
        </div>
      </div>
      <DataTable
        columns={columnsRoutesRW(handleUpdateItem)}
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