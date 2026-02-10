import { TableColumn } from "react-data-table-component";
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../../../helpers/AssetHelpers";
import { ICollaborators, ModalSize, ModalView } from "../../Types";

export const responsibleColumns = (openModal: any): TableColumn<ICollaborators>[] => [
  {
    name: 'NOMBRE',
    selector: (row: ICollaborators) => row.NOMBRE ?? "Sin registro"
  },
  {
    name: 'CARGO',
    selector: (row: ICollaborators) => row.CARGO ?? "Sin registro"
  },
  {
    name: 'ELIMINAR',
    width: "200px",
    cell: (row: ICollaborators) => (
      <button
        onClick={() => openModal(ModalView.DELETE_CONFIRMATION, ModalSize.SM, undefined,
          { confirmationMessage: `Esta seguro que desea eliminar al Colaborador ${row.NOMBRE}`, collabInfo: row })
        }
        className="border-0 bg-transparent">
        <SVG width={35} height={35} src={toAbsoluteUrl('/media/icons/duotune/general/gen027.svg')} />
      </button>
    )
  }
]