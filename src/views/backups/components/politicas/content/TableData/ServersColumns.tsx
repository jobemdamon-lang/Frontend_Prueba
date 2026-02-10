import { TableColumn } from "react-data-table-component"

export const columnsServers: TableColumn<any>[] = [
  {
    name: 'NOMBRE CI',
    selector: (row: any) => row.nombreci ?? "Sin registro",
    sortable: true
  },
  {
    name: 'NOMBRE VIRTUAL',
    selector: (row: any) => row.nombreVirtual ?? "Sin registro",
    sortable: true
  },
  {
    name: 'TIPO',
    selector: (row: any) => row.tipo ?? "Sin registro"
  },
  {
    name: 'IP LAN',
    selector: (row: any) => row.ip ?? "Sin registro"
  },
  {
    name: 'AMBIENTE',
    selector: (row: any) => row.ambiente  ?? "Sin registro"
  },
  {
    name: 'UBICACION',
    selector: (row: any) => row.ubicacion  ?? "Sin registro"
  }
]