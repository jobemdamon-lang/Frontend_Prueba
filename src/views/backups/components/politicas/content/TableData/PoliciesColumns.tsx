import { TableColumn } from "react-data-table-component"
import { IDataTableRowsPolicies } from "../../Types"
import { TaskPaneButton } from "../../modal/TaskPolicies/TaskPaneButton"
import { useExport } from "../../../../hooks/useExport"
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../../../../../helpers/AssetHelpers"

const ExportButton = ({row}:{row:IDataTableRowsPolicies}) => {
  const { getExportPolicy } = useExport()
  return (
    <button
      onClick={() => getExportPolicy(row.id_politica , row.id_bkversion)}
      style={{margin: "0 auto"}}
    >
      <SVG
        width={30}
        height={30}
        src={toAbsoluteUrl("/media/icons/duotune/files/fil017.svg")}
        className="category-item"
      />
    </button>
  )
}

export const columnsBackupsPolicies: TableColumn<IDataTableRowsPolicies>[] = [
  {
    name: 'NRO. VERSION',
    width: "180px",
    cell: (row: IDataTableRowsPolicies) => <TaskPaneButton rowInformation={row} />,
    sortable: true
  },
  {
    name: 'SOLICITUD DE CAMBIO',
    selector: (row: IDataTableRowsPolicies) => row.nro_ticket ?? "Sin registro"
  },
  {
    name: 'FECHA DE CAMBIO',
    selector: (row: IDataTableRowsPolicies) => row.fecha_version ?? "Sin registro"
  },
  {
    name: 'ESTADO',
    selector: (row: IDataTableRowsPolicies) => row.estado ?? "Sin registro"
  },
  {
    name: 'MOTIVO DEL CAMBIO',
    selector: (row: IDataTableRowsPolicies) => row.motivo ?? "Sin registro"
  },
  {
    name: 'DESCARGAR POLITICA',
    width: "200px",
    cell: (row: IDataTableRowsPolicies) => <ExportButton row={row}/>
  }
]