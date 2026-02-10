import { TableColumn } from "react-data-table-component";
import {  IListCollaborators, ModalSize, ModalView } from "../../Types";
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../../../helpers/AssetHelpers";

export const CollaboratorColumns = ({openModal}:{openModal:any}): TableColumn<IListCollaborators>[] => [
  {
    name: 'NOMBRE',
    selector: (row: IListCollaborators) => row.nombre ?? "Sin registro"
  },
  {
    name: 'USUARIO',
    selector: (row: IListCollaborators) => row.usuario ?? "Sin registro"
  },
  {
    name: 'CARGO',
    selector: (row: IListCollaborators) => row.cargo ?? "Sin registro"
  },
  {
    name: 'AREA',
    cell: (row: IListCollaborators) => row.area ?? "Sin registro"
  },
  {
    name: 'DNI',
    cell: (row: IListCollaborators) => row.dni ?? "Sin registro"
  },
  {
    name: 'TELEFONO',
    width: "180px",
    cell: (row: IListCollaborators) => row.telefono ?? "Sin registro"
  },
  {
    name: 'EDITAR',
    width: "120px",
    cell: (row: IListCollaborators) => (
      <button
        onClick={() => openModal(ModalView.EDIT_COLAB, ModalSize.XL, row)}
        className="border-0 bg-transparent">
        <SVG width={30} height={30} src={toAbsoluteUrl('/media/icons/duotune/general/gen055.svg')} />
      </button>
    )
  }
]