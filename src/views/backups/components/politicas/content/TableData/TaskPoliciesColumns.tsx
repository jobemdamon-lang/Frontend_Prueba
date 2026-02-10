import { TableColumn } from "react-data-table-component"
import { IFrecuencias, ITaksOfPolicies } from "../../Types"
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from "../../../../../../helpers";

const WeekCircle = ({frecuencia}:{frecuencia:string} ) => {
  let f_frecuencia = frecuencia.toLocaleUpperCase().replace(/ /g,'')
  let colors: IFrecuencias = {
    DIARIO: "green",
    SEMANAL: "blue",
    MENSUAL: "violet",
    FECHAFIJA: "red",
    ADEMANDA: "yellow",
    ANUAL: "black"
  }
  return (
    <div className="rounded-circle w-15px h-15px m-auto" style={{ backgroundColor: `${colors[f_frecuencia as keyof IFrecuencias]}`}}></div>
  )
}

export const columnsTaskPolicies = (showTaskDetail: React.Dispatch<React.SetStateAction<boolean>>, setSelectedTask:any): TableColumn<ITaksOfPolicies>[] => {

  return [
    {
      name: 'NOMBRE DE TAREA',
      width: "220px",
      selector: (row: ITaksOfPolicies) => row.nombre_tarea ?? "Sin registro",
      cell(row: ITaksOfPolicies) {
        return (
          <button
            onClick={() => { 
              showTaskDetail(true) 
              setSelectedTask(row)
            }}
            style={{ backgroundColor: "transparent" , color: "blue"}}
          >
            {row.nombre_tarea}
            <SVG
              width={20}
              height={20}
              src={toAbsoluteUrl("/media/icons/duotune/arrows/arr094.svg")}
              className="category-item"
            />
          </button>
        )
      },
    },
    {
      name: 'SERVER',
      selector: (row: ITaksOfPolicies) => row.bks_server ?? "Sin registro"
    },
    {
      name: 'TIPO',
      selector: (row: ITaksOfPolicies) => row.tipo_backup ?? "Sin registro"
    },
    {
      name: 'FRECUENCIA',
      selector: (row: ITaksOfPolicies) => row.frecuencia ?? "Sin registro"
    },
    {
      name: 'MODO',
      selector: (row: ITaksOfPolicies) => row.modo ?? "Sin registro"
    },
    {
      name: 'VENTANA INICIO',
      width: "130px",
      selector: (row: ITaksOfPolicies) => row.hora_vinicio ?? "Sin registro"
    },
    {
      name: 'VENTANA FIN',
      width: "120px",
      selector: (row: ITaksOfPolicies) => row.hora_vfin ?? "Sin registro"
    },
    {
      name: 'LUNES',
      cell: (row: ITaksOfPolicies) => row.bks_lun === 1 ? <WeekCircle frecuencia={row.frecuencia}/> : ""
    },
    {
      name: 'MARTES',
      cell: (row: ITaksOfPolicies) => row.bks_mar === 1 ? <WeekCircle frecuencia={row.frecuencia}/> : ""
    },
    {
      name: 'MIERCOLES',
      cell: (row: ITaksOfPolicies) => row.bks_mie === 1 ? <WeekCircle frecuencia={row.frecuencia}/> : ""
    },
    {
      name: 'JUEVES',
      cell: (row: ITaksOfPolicies) => row.bks_juev === 1 ? <WeekCircle frecuencia={row.frecuencia}/> : ""
    },
    {
      name: 'VIERNES',
      cell: (row: ITaksOfPolicies) => row.bks_vie === 1 ? <WeekCircle frecuencia={row.frecuencia}/> : ""
    },
    {
      name: 'SABADO',
      cell: (row: ITaksOfPolicies) => row.bks_sab === 1 ? <WeekCircle frecuencia={row.frecuencia}/> : ""
    },
    {
      name: 'DOMINGO',
      cell: (row: ITaksOfPolicies) => row.bks_dom === 1 ? <WeekCircle frecuencia={row.frecuencia}/> : ""
    },
    {
      name: 'PROTECCIÓN',
      selector: (row: ITaksOfPolicies) => row.proteccion ?? "Sin registro"
    },
    {
      name: 'HERRAMIENTA BACKUP',
      selector: (row: ITaksOfPolicies) => row.herramienta ?? "Sin registro"
    }
  ]
}
