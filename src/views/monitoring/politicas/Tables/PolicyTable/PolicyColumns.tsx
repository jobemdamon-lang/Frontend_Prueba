import { TableColumn } from "react-data-table-component";
import { IMonitoringPolicyVersions } from "../../Types";
import { ListOptions } from "./ListOptions";
import { ToolTip } from "../../../../../components/tooltip/ToolTip";
import { truncateText } from "../../../../../helpers/general";

export const PolicyColumns: TableColumn<IMonitoringPolicyVersions>[] = [
  {
    name: 'NOMBRE POLITICA',
    width: "180px",
    cell: (row: IMonitoringPolicyVersions) => row.NOMBRE ?? "Sin registro",
    sortable: true
  },
  {
    name: 'NRO VERSION',
    width: "130px",
    selector: (row: IMonitoringPolicyVersions) => row.NRO_VERSION ?? "Sin registro"
  },
  {
    name: 'ESTADO',
    width: "180px",
    cell: (row: IMonitoringPolicyVersions) => (
      <span className={`badge badge-${row.ESTADO_POLITICA === "IMPLEMENTADO" ? "primary" : row.ESTADO_POLITICA === "POR IMPLEMENTAR" ? "info" : row.ESTADO_POLITICA === "CANCELADO" ? "danger" : "success"}`}>{row.ESTADO_POLITICA}</span>)
  },
  {
    name: 'USUARIO CREACION',
    selector: (row: IMonitoringPolicyVersions) => row.USUARIO_CREACION ?? "Sin registro"
  },
  {
    name: 'TICKETS SERVICEAIDE',
    cell: (row: IMonitoringPolicyVersions) => (
      <ToolTip message={row.NRO_TICKET ?? ''} placement='top'>
        <span>{truncateText(row.NRO_TICKET ?? '', 40)}</span>
      </ToolTip>
    )
  },
  {
    name: 'TICKETS ORIGEN',
    cell: (row: IMonitoringPolicyVersions) => (
      <ToolTip message={row.TICKET_ORIGEN ?? 'Sin registro'} placement='top'>
        <span>{truncateText(row.TICKET_ORIGEN ?? 'Sin registro', 40)}</span>
      </ToolTip>
    )
  },
  {
    name: 'FECHA CREACCION',
    selector: (row: IMonitoringPolicyVersions) => row.FECHA_CREACION.toString() ?? "Sin registro"
  },
  {
    name: 'FECHA MODIFICACION',
    selector: (row: IMonitoringPolicyVersions) => row.FECHA_MODIFICACION ?? "Sin registro"
  },
  {
    name: 'ACCIONES',
    width: "230px",
    cell: (row: IMonitoringPolicyVersions) => <ListOptions rowInformation={row} />
  }
]