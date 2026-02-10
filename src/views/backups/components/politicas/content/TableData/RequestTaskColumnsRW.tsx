import { TableColumn } from "react-data-table-component"
import { ITask } from "../../Types"

export const columnsRequestTaskRW = (setIsVisibility:React.Dispatch<React.SetStateAction<boolean>>): TableColumn<ITask>[] =>{ 
  return [
  {
    name: 'ESTADO DE FLUJO',
    width: "140px",
    selector: (row: ITask) => row.proceso_estado ?? "Sin registro"
  },
  {
    name: 'APROBADOR',
    width: "150px",
    selector: (row: ITask) => row.aprobador ?? "Sin registro"
  },
  {
    name: 'AREA',
    width: "150px",
    selector: (row: ITask) => row.area  ?? "Sin registro"
  },
  {
    name: 'CAMBIO',
    width: "120px",
    selector: (row: ITask) => row.accion  ?? "Sin registro"
  },
  {
    name: 'NOMBRE DE TAREA',
    width: "270px",
    selector: (row: ITask) => row.nombre_tarea  ?? "Sin registro"
  },
  {
    name: 'SERVIDOR',
    width: "150px",
    selector: (row: ITask) => row.bks_server  ?? "Sin registro"
  },
  {
    name: 'TIPO',
    width: "180px",
    selector: (row: ITask) => row.tipo_backup  ?? "Sin registro"
  },
  {
    name: 'FRECUENCIA',
    selector: (row: ITask) => row.frecuencia  ?? "Sin registro"
  }
]
}