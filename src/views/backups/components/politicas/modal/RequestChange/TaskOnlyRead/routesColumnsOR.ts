import { TableColumn } from "react-data-table-component"
import { IDataTableRowsRoutes } from "../../../Types"

export const routesColumnsOR: TableColumn<IDataTableRowsRoutes>[] =  [
  {
    name: 'NOMBRE CI',
    selector: (row: IDataTableRowsRoutes) => row.nombreci ?? "Sin registro",
    sortable: true
  },
  {
    name: 'UNIDAD',
    selector: (row: IDataTableRowsRoutes) => row.unidad ?? "Sin registro"
  },
  {
    name: 'DESCRIPCION',

    selector: (row: IDataTableRowsRoutes) => row.descripcion ?? "Sin registro"
  },
  {
    name: 'EXCEPCION',
    selector: (row: IDataTableRowsRoutes) => row.excepcion  ?? "Sin registro"
  },
  {
    name: 'PARAMETROS',
    selector: (row: IDataTableRowsRoutes) => row.parametro  ?? "Sin registro"

  }
]

