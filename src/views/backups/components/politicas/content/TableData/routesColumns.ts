import { TableColumn } from "react-data-table-component"
import { IListRoutesPolicy } from "../../Types"


export const columnsRoutes: TableColumn<IListRoutesPolicy>[] =  [
  {
    name: 'NOMBRE CI',
    selector: (row: IListRoutesPolicy) => row.nombreEquipo ?? "Sin registro",
    sortable: true
  },
  {
    name: 'UNIDAD',
    selector: (row: IListRoutesPolicy) => row.unidad ?? "Sin registro"
  },
  {
    name: 'DESCRIPCION',

    selector: (row: IListRoutesPolicy) => row.descripcion ?? "Sin registro"
  },
  {
    name: 'EXCEPCION',
    selector: (row: IListRoutesPolicy) => row.excepcion  ?? "Sin registro"
  },
  {
    name: 'PARAMETROS',
    selector: (row: IListRoutesPolicy) => row.parametro  ?? "Sin registro"

  }
]


