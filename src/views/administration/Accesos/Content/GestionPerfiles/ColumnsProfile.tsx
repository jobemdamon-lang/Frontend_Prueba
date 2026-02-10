import { TableColumn } from "react-data-table-component"
import { IProfile, IProfileByArea } from "../../../Types"

export const ProfileColumn: TableColumn<IProfile>[] = [
  {
    name: 'Nombre del Perfil',
    selector: (row: IProfile) => row.ATRIBUTO ?? "Sin registro"
  },
  {
    name: 'Ruta de Acceso',
    selector: (row: IProfile) => row.SUBMODULO ?? "Sin registro"
  },
  {
    name: 'Descripción',
    selector: (row: IProfile) => row.VALOR ?? "Sin registro"
  }
]

export const ProfileByAreaColumn = (
  deleteProfileOfArea: (id_profile_area: string, idArea: string) => Promise<void>,
  deleteProfileOfAreaLoading: boolean,
  selectedAreaID: number
): TableColumn<IProfileByArea>[] => [
    {
      name: 'NOMBRE DEL PERFIL',
      selector: (row: IProfileByArea) => row.ATRIBUTO ?? "Sin registro"
    },
    {
      name: 'ROL DE ACCESO',
      selector: (row: IProfileByArea) => row.ROL ?? "Sin registro"
    },
    {
      name: 'DESCRIPCIÓN',
      selector: (row: IProfileByArea) => row.VALOR ?? "Sin registro"
    },
    {
      name: 'ELIMINAR',
      cell: (row: IProfileByArea) => (
        <button
          className="btn btn-danger m-2"
          disabled={deleteProfileOfAreaLoading}
          onClick={() => deleteProfileOfArea(row.ID_PERFIL_AREA.toString(), selectedAreaID.toString())}
        >
          Eliminar
        </button>
      )
    }
  ]