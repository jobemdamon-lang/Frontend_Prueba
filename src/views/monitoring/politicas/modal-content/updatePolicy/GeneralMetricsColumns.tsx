import { TableColumn } from "react-data-table-component"
import { IListMetricsPolicyVersion, ModalView } from "../../Types"
import { ToolTip } from "../../../../../components/tooltip/ToolTip"
import { ConditionalTooltip } from "./ConditionalTooltip"

export const generalMetricsColumns = (
  openModalUpdatePolicy: Function,
  handleDelete: Function
): TableColumn<(IListMetricsPolicyVersion & { ID: string })>[] => [
    {
      name: 'NOMBRE DE CI',
      cell: (row: (IListMetricsPolicyVersion & { ID: string })) => row.NOMBRE_CI ?? "Sin registro",
      sortable: true
    },
    {
      name: 'HOSTNAME',
      cell: (row: (IListMetricsPolicyVersion & { ID: string })) => row.NOMBRE ?? "Sin registro",
      sortable: true
    },
    {
      name: 'NRO. IP',
      cell: (row: (IListMetricsPolicyVersion & { ID: string })) => row.IP ?? "Sin registro",
      sortable: true
    },
    {
      name: 'CLASE',
      cell: (row: (IListMetricsPolicyVersion & { ID: string })) => row.CLASE ?? "Sin registro",
      sortable: true
    },
    {
      name: 'TIPO DE METRICA',
      cell: (row: (IListMetricsPolicyVersion & { ID: string })) => <ConditionalTooltip row={row} />,
      sortable: true
    },
    {
      name: 'ESTADO EQUIPO',
      cell: (row: (IListMetricsPolicyVersion & { ID: string })) => row.EQUIPO_ESTADO ?? "Sin registro",
      sortable: true
    },
    {
      name: 'HERRAMIENTA MONITOREO',
      cell: (row: (IListMetricsPolicyVersion & { ID: string })) => row.HERRAMIENTA_MONITOREO ?? "Sin registro",
      sortable: true
    },
    {
      name: 'TIPO DE EQUIPO',
      cell: (row: (IListMetricsPolicyVersion & { ID: string })) => row.TIPO_EQUIPO ?? "Sin registro",
      sortable: true
    },
    {
      name: 'UNIDADES',
      cell: (row: (IListMetricsPolicyVersion & { ID: string })) => row.UNIDADES ?? "Sin registro",
      sortable: true
    },
    {
      name: 'UMBRALES',
      width: "500px",
      cell: (row: (IListMetricsPolicyVersion & { ID: string })) => (
        <table id="kt_datatable_zero_configuration" className="table table-row-bordered w-100">
          <thead>
            <tr className="fw-semibold fs-8 text-muted">
              <th className="text-center"><span className="badge badge-info">UMBRAL WARNING</span></th>
              <th className="text-center"><span className="badge badge-warning">UMBRAL CRITICAL</span></th>
              <th className="text-center"><span className="badge badge-danger">UMBRAL FATAL</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-0 m-0 text-center">{row.WARNING.ID_DETALLE_POLITICA ? row?.WARNING?.VALOR : "-"}</td>
              <td className="p-0 m-0 text-center">{row.CRITICAL.ID_DETALLE_POLITICA ? row.CRITICAL?.VALOR : "-"}</td>
              <td className="p-0 m-0 text-center">{row.FATAL.ID_DETALLE_POLITICA ? row?.FATAL?.VALOR : "-"}</td>
            </tr>
            <tr>
              <td className="p-0 m-0 text-center">{row.WARNING.ID_DETALLE_POLITICA ? "NRO POOLEOS: " + row?.WARNING?.NRO_POOLEO : "-"}</td>
              <td className="p-0 m-0 text-center">{row.CRITICAL.ID_DETALLE_POLITICA ? "NRO POOLEOS: " + row.CRITICAL?.NRO_POOLEO : "-"}</td>
              <td className="p-0 m-0 text-center">{row.FATAL.ID_DETALLE_POLITICA ? "NRO POOLEOS: " + row?.FATAL?.NRO_POOLEO : "-"}</td>
            </tr>
          </tbody>
        </table>
      ),
      sortable: true
    },
    {
      name: 'INTERVALO',
      cell: (row: (IListMetricsPolicyVersion & { ID: string })) => row.FRECUENCIA ?? "Sin registro",
      sortable: true
    },
    {
      name: 'ACCIONES',
      width: "150px",
      cell: (row: (IListMetricsPolicyVersion & { ID: string })) =>
        <div className="d-flex gap-2">
          <ToolTip
            message='Editar'
            placement='top'
          >
            <button
              className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
              onClick={() => {
                openModalUpdatePolicy(ModalView.UPDATE_METRIC, row)
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
              </svg>
            </button>
          </ToolTip>
          {row.RECURSOS === "OPCIONAL" &&
            <ToolTip
              message='Eliminar'
              placement='top'
            >
              <button
                className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                disabled={false}
                onClick={() => {
                  handleDelete(row)
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                </svg>
              </button>
            </ToolTip>
          }
        </div>
    }
  ]
