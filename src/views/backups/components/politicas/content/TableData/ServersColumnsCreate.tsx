import { TableColumn } from "react-data-table-component"
import { IDataTableRowsServers } from "../../Types"

export const columnsServersCreate: TableColumn<IDataTableRowsServers>[] = [
  {
    name: 'NOMBRE CI',
    selector: (row: IDataTableRowsServers) => row.nombreci ?? "Sin registro",
    sortable: true
  },
  {
    name: 'NOMBRE VIRTUAL',
    selector: (row: IDataTableRowsServers) => row.nombreVirtual ?? "Sin registro",
    sortable: true
  },
  {
    name: 'TIPO',
    selector: (row: IDataTableRowsServers) => row.tipo ?? "Sin registro"
  },
  {
    name: 'IP LAN',
    selector: (row: IDataTableRowsServers) => row.ip ?? "Sin registro"
  },
  {
    name: 'AMBIENTE',
    selector: (row: IDataTableRowsServers) => row.ambiente  ?? "Sin registro"
  },
  {
    name: 'UBICACION',
    selector: (row: IDataTableRowsServers) => row.ubicacion  ?? "Sin registro"

  }
]