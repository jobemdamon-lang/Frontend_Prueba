import { TableColumn } from "react-data-table-component"
import { ILogs } from "../../Types"

export const columnsLogs: TableColumn<ILogs>[] = [
  {
    name: 'TAREA',
    selector: (row: ILogs) => row.NOMBRE_TAREA ?? "Sin registro"
  },
  {
    name: 'ACCION DE TAREA',
    selector: (row: ILogs) => row.ACCION ?? "Sin registro"
  },
  {
    name: 'APROBADOR',
    selector: (row: ILogs) => row.APROBADOR ?? "Sin registro"
  },
  {
    name: 'ROL',
    selector: (row: ILogs) => row.ROL_APROB ?? "Sin registro"
  },
  {
    name: 'AREA',
    selector: (row: ILogs) => row.area ?? "Sin registro"
  },
  {
    name: 'ESTADO SOLICITUD',
    selector: (row: ILogs) => row.ESTADO_APROB ?? "Sin registro"
  }
  ,
  {
    name: 'ESTADO DE SOLICITUD',
    selector: (row: ILogs) => row.ESTADO_SOLICITUD ?? "Sin registro"
  }
]