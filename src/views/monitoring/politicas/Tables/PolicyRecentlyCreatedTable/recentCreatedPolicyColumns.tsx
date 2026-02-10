import { TableColumn } from "react-data-table-component";
import { IListEquipments, ModalView } from "../../Types";
import { ToolTip } from "../../../../../components/tooltip/ToolTip"

export const recentCreatedPolicyColumns = (openModalParams: any, id_politica: string): TableColumn<IListEquipments>[] => [
  {
    name: 'NOMBRE DE CI',
    width: "150px",
    cell: (row: IListEquipments) => row.NOMBRE_CI ?? "Sin registro",
    sortable: true
  },
  {
    name: 'NOMBRE',
    width: "150px",
    selector: (row: IListEquipments) => row.NOMBRE ?? "Sin registro",
    sortable: true
  },
  {
    name: 'DESCRIPCION',
    width: "150px",
    selector: (row: IListEquipments) => row.DESCRIPCION ?? "Sin registro",
    sortable: true
  },
  {
    name: 'EQUIPO ESTADO',
    width: "100px",
    selector: (row: IListEquipments) => row.EQUIPO_ESTADO ?? "Sin registro",
    sortable: true
  },
  {
    name: 'IP',
    width: "100px",
    selector: (row: IListEquipments) => row.IP ?? "Sin registro",
    sortable: true
  },
  {
    name: 'METRICAS OPCIONALES',
    width: "450px",
    cell: (row: IListEquipments) => <div className="d-flex gap-2">
      <ToolTip
        message='Agregar Metrica de Puertos'
        placement='top'
      >
        <button
          style={{ backgroundColor: "transparent", width: "auto" }}
          className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
          onClick={() => { openModalParams(ModalView.ADD_PORT_METRIC, { row: row, idPolitica: id_politica, idEquipo: row.ID_EQUIPO }) }}
        >
          <p className="px-3">PUERTO</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
        </button>
      </ToolTip>
      <ToolTip
        message='Agregar Metrica de Disponibilidad de Servicio'
        placement='top'
      >
        <button
          style={{ backgroundColor: "transparent", width: "auto" }}
          className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
          onClick={() => { openModalParams(ModalView.ADD_DISPONIBILITY_METRIC, { row: row, idPolitica: id_politica, idEquipo: row.ID_EQUIPO }) }}
        >
          <p className="px-3">DISPONIBILIDAD</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
        </button>
      </ToolTip>
      <ToolTip
        message='Agregar Metrica de Uso de Filesystem'
        placement='top'
      >
        <button
          style={{ backgroundColor: "transparent", width: "auto" }}
          className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
          onClick={() => { openModalParams(ModalView.ADD_FILESYSTEM_METRIC, { row: row, idPolitica: id_politica, idEquipo: row.ID_EQUIPO }) }}
        >
          <p className="px-3">USO DE FILESYSTEM</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
        </button>
      </ToolTip>
    </div>
  }
]