import { TableColumn } from "react-data-table-component";
import { ISearchTasksWithFormat, ITask } from "../../Types";

//Se le pasa el nombre de la tarea de la politica y la busca dentro de las tareas de la solicitud
export const hasaChange = (nombreTarea: string, listOfTaskInRequestChange: ITask[]) => {
  const idx = listOfTaskInRequestChange.findIndex((task) => task.nombre_tarea === nombreTarea)
  //Si no hay tarea de la solicitud dentro de la politica
  if(idx === -1){
    return {
      isInRequest: false,
      isDownTask: false,
      isModifiedTask: false,
      isChangeInFront:false
    }
  }else{
    //Si hay alguna tarea de la solicitud dentro de la politica
    return {
      isInRequest: true,
      isDownTask: listOfTaskInRequestChange[idx].accion === "Baja" ? true : false,
      isModifiedTask: listOfTaskInRequestChange[idx].accion === "Modificacion" ? true : false,
      isChangeInFront:false
    }
  }
}

export const customStyles = {
  header: {
    style: {
      backgroundColor: '#7fcdff',
      justifyContent: 'center',
    }
  },
  headCells: {
    style: {
      fontSize: '15px',
      fontWeight: 'bold',
      paddingLeft: '0 8px',
      justifyContent: 'center',
      backgroundColor: "#CCCCFF"
    }
  },
  cells: {
    style: {
      justifyContent: 'center',
    },
  }
};

export const conditionalRowStyles = [
  {
    when: (row:ISearchTasksWithFormat) => ((row.has_a_change.isInRequest || row.has_a_change.isChangeInFront) && row.has_a_change.isDownTask) === true,
    style: {
      backgroundColor: "RGB(241, 65, 108)"
    }
  },
  {
    when: (row:ISearchTasksWithFormat) => ((row.has_a_change.isInRequest || row.has_a_change.isChangeInFront) && row.has_a_change.isModifiedTask) === true,
    style: {
      backgroundColor: "RGB(0, 158, 247)"
    }
  }
]

export const columnsServersCreate: TableColumn<ISearchTasksWithFormat>[] = [
  {
    name: 'NOMBRE TAREA',
    width: "370px",
    selector: (row: ISearchTasksWithFormat) => row.nombre_tarea,
    sortable: true
  },
  /*{
    name: 'SERVIDOR',
    selector: (row: ISearchTasksWithFormat) => row.bks_server ?? "Sin registro",
  },*/
  {
    name: 'TIPO',
    selector: (row: ISearchTasksWithFormat) => row.tipo_backup ?? "Sin registro",
  },
  {
    name: 'FRECUENCIA',
    selector: (row: ISearchTasksWithFormat) => row.frecuencia ?? "Sin registro",
  },
  {
    name: 'MODO',
    selector: (row: ISearchTasksWithFormat) => row.modo ?? "Sin registro",
  },
  {
    name: 'LUNES',
    selector: (row: ISearchTasksWithFormat) => row.bks_lun ? "SI" : "NO",
  },
  {
    name: 'MARTES',
    selector: (row: ISearchTasksWithFormat) => row.bks_mar ? "SI" : "NO",
  },
  {
    name: 'MIERCOLES',
    selector: (row: ISearchTasksWithFormat) => row.bks_mie ? "SI" : "NO",
  },
  {
    name: 'JUEVES',
    selector: (row: ISearchTasksWithFormat) => row.bks_juev ? "SI" : "NO",
  },
  {
    name: 'VIERNES',
    selector: (row: ISearchTasksWithFormat) => row.bks_vie ? "SI" : "NO",
  },
  {
    name: 'SABADO',
    selector: (row: ISearchTasksWithFormat) => row.bks_sab ? "SI" : "NO",
  },
  {
    name: 'DOMINGO',
    selector: (row: ISearchTasksWithFormat) => row.bks_dom ? "SI" : "NO",
   /*  conditionalCellStyles: [
      {
        when: row => row.has_a_change.isDownTask === true,
        style: {
          backgroundColor: "#FF6969"
        }
      },
      {
        when: row => row.has_a_change.isModifiedTask === true,
        style: {
          backgroundColor: "#FF6969"
        }
      }
    ] */
  }
]
