import { TableColumn } from "react-data-table-component"
import { RequestChangeDetailButton } from "../../../modal/RequestChange/RequestChangeDetailButton"
import { IDataRowRequestChanges } from "./TypesRequest"

export const columnsRequestChanges: TableColumn<IDataRowRequestChanges>[] = [
  {
    name: 'NRO. SOLICITUD',
    width: "200px",
    cell: (row: IDataRowRequestChanges) => <RequestChangeDetailButton rowInformation={row} />,
    sortable: true
  },
  {
    name: 'FECHA DE REGISTRO',
    selector: (row: IDataRowRequestChanges) => row.fecha_registro ?? "Sin registro"
  },
  {
    name: 'SOLICITANTE',
    selector: (row: IDataRowRequestChanges) => row.solicitante ?? "Sin registro"
  },
  {
    name: 'TIPO DE SOLICITUD',
    selector: (row: IDataRowRequestChanges) => row.tipo_sol ?? "Sin registro"
  },
  {
    name: 'ACTOR ACTUAL',
    selector: (row: IDataRowRequestChanges) => row.actor_actual ?? "Sin registro"
  },
  {
    name: 'ETAPA',
    selector: (row: IDataRowRequestChanges) => row.etapa ?? "Sin registro"
  },
  {
    name: 'MOTIVO',
    selector: (row: IDataRowRequestChanges) => row.motivo ?? "Sin registro"
  },
  {
    name: 'SIGUIENTE ESTADO',
    selector: (row: IDataRowRequestChanges) => row.actor_siguiente ?? "Sin registro"
  }
]