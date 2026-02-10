import { TableColumn } from "react-data-table-component"
import { IModule, ISubModule, ModalSize, ModalView } from "../../../Types"

export const ModuleColumn = (getSubModules: any, openModal:any): TableColumn<IModule>[] => [
  {
    name: 'Nombre en Aside',
    selector: (row: IModule) => row.aside_title ?? "Sin registro"
  },
  {
    name: 'Ruta Base Aside',
    selector: (row: IModule) => row.aside_to ?? "Sin registro"
  },
  {
    name: 'Logo de Aside',
    selector: (row: IModule) => row.icon ?? "Sin registro"
  },
  {
    name: 'Prioridad - Posición',
    cell: (row: IModule) => row.prioridad ?? "Sin registro"
  },
  {
    name: 'Ruta - Path',
    cell: (row: IModule) => row.Route_path ?? "Sin registro"
  },
  {
    name: 'Subruta por Defecto',
    width: "250px",
    cell: (row: IModule) => row.Route_defaultRoute ?? "Sin registro"
  },
  {
    name: 'SubModulos',
    width: "180px",
    cell: (row: IModule) => (
      <>
        <button
          className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
          onClick={() => getSubModules(row.IDOPCION)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
        </button>
        <button
          className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
          onClick={() => openModal(ModalView.NEW_SUBMODULE, ModalSize.XL, row)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
        </button>
      </>

    )
  }
]

export const SubmoduleColumn: TableColumn<ISubModule>[] = [
  {
    name: 'Nombre en Aside',
    selector: (row: ISubModule) => row.Aside_title ?? "Sin registro"
  },
  {
    name: 'Ruta Redirección en Aside',
    selector: (row: ISubModule) => row.Aside_to ?? "Sin registro"
  },
  {
    name: 'Vista a Renderizar',
    selector: (row: ISubModule) => row.Route_module ?? "Sin registro"
  },
  {
    name: 'Ruta - Path',
    cell: (row: ISubModule) => row.Route_path ?? "Sin registro"
  },
  {
    name: 'Nombre de Ruta - page',
    cell: (row: ISubModule) => row.RouteTitle ?? "Sin registro"
  },
  {
    name: 'Prioridad - Posición',
    width: "180px",
    cell: (row: ISubModule) => row.prioridad ?? "Sin registro"
  }
]