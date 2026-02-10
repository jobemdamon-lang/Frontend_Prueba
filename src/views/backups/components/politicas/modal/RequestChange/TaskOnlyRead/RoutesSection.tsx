import { FC, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { EmptyData } from "../../../../../../../components/datatable/EmptyData"
import { IDataTableRowsRoutes, IListRoutes, ITask } from "../../../Types"
import uniqid from "uniqid"
import { routesColumnsOR } from "./routesColumnsOR"

type Props = {
  taskInfo: ITask
}

const RoutesSection: FC<Props> = ({ taskInfo }) => {

  const [routesDataWF, setRoutes] = useState<Array<IDataTableRowsRoutes>>([])

  useEffect(() => {
    const formatterData: IDataTableRowsRoutes[] = taskInfo.lista_ruta?.map((route: IListRoutes) => {
      return {
        descripcion: route.descripcion,
        estado: parseInt(route.estado, 10),
        excepcion: route.excepcion,
        id_equipo: route.id_equipo,
        id_soli_ruta: route.id_soli_ruta,
        idRow: uniqid(),
        nombreci: route.nombreEquipo ?? "",
        parametro: route.parametro,
        unidad: route.unidad
      }
    })
    setRoutes(formatterData)
  }, [taskInfo.lista_ruta])

  const isLoading = false
  return (
    <div>
      <DataTable
        columns={routesColumnsOR}
        persistTableHead
        highlightOnHover
        pagination
        fixedHeader
        noDataComponent={<EmptyData loading={isLoading} />}
        disabled={isLoading}
        data={routesDataWF}
      />
    </div>
  )
}
export { RoutesSection }