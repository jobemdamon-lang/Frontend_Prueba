import { FC } from "react"
import { IListMetricsPolicyVersion, ITipoCambio, IUpdateListaPolitica, TIPOCAMBIO } from "../../Types"
import DataTable, { TableColumn } from "react-data-table-component"
import { ConditionalTooltip } from "./ConditionalTooltip"
import { ToolTip } from "../../../../../components/tooltip/ToolTip"
import { minimalistStyles } from "../../../../../helpers/tableStyles"

type Props = {
  genericChangesFront: (IListMetricsPolicyVersion & { ID: string } & ITipoCambio)[],
  setGenericChangeFront: React.Dispatch<React.SetStateAction<(IListMetricsPolicyVersion & {
    ID: string;
  } & ITipoCambio)[]>>,
  setGenericChangesInPolicy: React.Dispatch<React.SetStateAction<IUpdateListaPolitica[]>>
}
const ChangesTable: FC<Props> = ({ genericChangesFront, setGenericChangeFront, setGenericChangesInPolicy }) => {
  return (
    <div style={{ position: 'relative' }}>
      <DataTable
        columns={changesColumns(setGenericChangeFront, setGenericChangesInPolicy)}
        persistTableHead
        highlightOnHover
        pagination
        fixedHeader
        customStyles={{
          ...minimalistStyles,
          cells: {
            style: {
              justifyContent: 'center',
              color: '#545959',
              fontSize: '13px'
            },
          }
        }}
        data={genericChangesFront}
      />
    </div>
  )
}
export { ChangesTable }

export const changesColumns = (
  setGenericChangeFront: React.Dispatch<React.SetStateAction<(IListMetricsPolicyVersion & {
    ID: string;
  } & ITipoCambio)[]>>,
  setGenericChangesInPolicy: React.Dispatch<React.SetStateAction<IUpdateListaPolitica[]>>
): TableColumn<(IListMetricsPolicyVersion & { ID: string } & ITipoCambio)>[] => [
    {
      name: 'TIPO DE CAMBIO',
      cell: (row: (IListMetricsPolicyVersion & { ID: string } & ITipoCambio)) => <div>
        {row.tipo_cambio === TIPOCAMBIO.NUEVO && <span className="badge badge-info">NUEVO</span>}
        {row.tipo_cambio === TIPOCAMBIO.EDIT && <span className="badge badge-primary">EDICIÓN</span>}
        {row.tipo_cambio === TIPOCAMBIO.DELETE && <span className="badge badge-danger">ELIMINACIÓN</span>}
      </div> ?? "Sin registro",
      sortable: true
    },
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
      cell: (row: (IListMetricsPolicyVersion & { ID: string })) => <ConditionalTooltip row={row} /> ?? "Sin registro",
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
      name: 'CONSUMO CPU',
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
              <td className="p-0 m-0 text-center">{row?.WARNING?.VALOR ?? ""}</td>
              <td className="p-0 m-0 text-center">{row.CRITICAL?.VALOR ?? ""}</td>
              <td className="p-0 m-0 text-center">{row?.FATAL?.VALOR ?? ""}</td>
            </tr>
            <tr className="fw-semibold fs-8 text-muted">
              <th className="text-center"><span className="badge badge-info">POOLEO WARNING</span></th>
              <th className="text-center"><span className="badge badge-warning">POOLEO CRITICAL</span></th>
              <th className="text-center"><span className="badge badge-danger">POOLEO FATAL</span></th>
            </tr>
            <tr>
              <td className="p-0 m-0 text-center">{row?.WARNING?.NRO_POOLEO ?? ""}</td>
              <td className="p-0 m-0 text-center">{row.CRITICAL?.NRO_POOLEO ?? ""}</td>
              <td className="p-0 m-0 text-center">{row?.FATAL?.NRO_POOLEO ?? ""}</td>
            </tr>
          </tbody>
        </table>
      ) ?? "Sin registro",
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
        <div className="">
          <ToolTip
            message='Eliminar'
            placement='top'
          >
            <button
              className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
              disabled={false}
              onClick={() => {
                setGenericChangeFront((prev: (IListMetricsPolicyVersion & { ID: string } & ITipoCambio)[]) => {
                  const newValues = [...prev]
                  return newValues.filter((metric: (IListMetricsPolicyVersion & { ID: string } & ITipoCambio)) => metric.ID !== row.ID)
                })
                setGenericChangesInPolicy((prev: IUpdateListaPolitica[]) => {
                  const newValues = [...prev]
                  return newValues.filter((metric: IUpdateListaPolitica) =>
                    ![row.WARNING?.ID_DETALLE_POLITICA, row.CRITICAL?.ID_DETALLE_POLITICA, row.FATAL?.ID_DETALLE_POLITICA].includes(metric.id_detalle_politica)
                  )
                })
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
              </svg>
            </button>
          </ToolTip>
        </div>
    }
  ]