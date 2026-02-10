import { TableColumn } from "react-data-table-component"
import { ITask } from "../../../Types"
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from "../../../../../../../helpers/AssetHelpers";

export const columnsRequestTask = (setIsVisibility:React.Dispatch<React.SetStateAction<boolean>>, setTaskInfo:React.Dispatch<React.SetStateAction<any>>): TableColumn<ITask>[] =>{ 
  return [
  {
    name: 'DETALLES',
    width: "120px",
    cell:(row:ITask) => {
        return (
          <button
            onClick={() => {
              //Cambio la visibilidad para mostrar la sección del detalle de tareas y setteo la informacion de la tarea
              setIsVisibility(true) 
              setTaskInfo(row)
            }}
            style={{ backgroundColor: "transparent" , color: "blue"}}
          >
            Detalles
            <SVG
              width={20}
              height={20}
              src={toAbsoluteUrl("/media/icons/duotune/arrows/arr094.svg")}
              className="category-item"
            />
          </button>
        )
    }
  },
  {
    name: 'ESTADO DE FLUJO',
    selector: (row: ITask) => row.proceso_estado ?? "Sin registro"
  },
  {
    name: 'APROBADOR',
    selector: (row: ITask) => row.aprobador ?? "Sin registro"
  },
  {
    name: 'AREA',
    selector: (row: ITask) => row.area ?? "Sin registro"
  },
  {
    name: 'CAMBIO',
    selector: (row: ITask) => row.accion  ?? "Sin registro"
  },
  {
    name: 'NOMBRE DE TAREA',
    width: "200px",
    selector: (row: ITask) => row.nombre_tarea  ?? "Sin registro"
  },
  {
    name: 'SERVIDOR',
    width: "200px",
    selector: (row: ITask) => row.bks_server  ?? "Sin registro"
  },
  {
    name: 'TIPO',
    width: "150px",
    selector: (row: ITask) => row.tipo_backup  ?? "Sin registro"
  },
  {
    name: 'FRECUENCIA',
    selector: (row: ITask) => row.frecuencia  ?? "Sin registro"
  }
]
}