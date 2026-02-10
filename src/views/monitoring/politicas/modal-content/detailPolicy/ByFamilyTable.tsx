import { FC, useEffect, useState } from "react"
import { IListMetricsPolicyVersion } from "../../Types"
import DataTable, { TableColumn } from "react-data-table-component"
import { ConditionalTooltip } from "../updatePolicy/ConditionalTooltip"
import { useCatalog } from "../../hooks/useCatalog"
import { DataList } from "../../../../../components/Inputs/DataListInput"
import { Input } from "../../../../../components/Inputs/TextInput"
import { metricas_campos } from "../updatePolicy/policyUtils"
import { minimalistStyles } from "../../../../../helpers/tableStyles"
import { InfomonButton } from "../../../../../components/buttons/InfomonButton"

type Props = {
  metricsData: (IListMetricsPolicyVersion & { ID: string })[],
  family: string
}

const ByFamilyTable: FC<Props> = ({ metricsData, family }) => {

  const { getListMetricsByFamily, listOfMetricsByFamily, loadingGetOptionalMetrics } = useCatalog()
  const [metrics, setMetrics] = useState(metricsData)
  const [filters, setFilters] = useState({ general: "", nameMetric: "", valueMetric: "" })

  useEffect(() => {
    getListMetricsByFamily(family)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const filterdata = metricsData.filter(
      (metric: (IListMetricsPolicyVersion & { ID: string })) => {
        const columnsMetric = metricas_campos[metric.METRICAS as keyof typeof metricas_campos] ?? []
        let hascoincidances = columnsMetric.some(column => {
          const columnvalue = metric[column as keyof typeof metric] ?? ''

          return columnvalue.toString().toLocaleLowerCase().includes(filters.valueMetric.toLocaleLowerCase())
        })

        if (metric.RECURSOS?.toUpperCase() === "DEFAULT" || !metric.RECURSOS) {
          hascoincidances = true
        }

        const isvalid = (metric.NOMBRE_CI?.toLocaleLowerCase().includes(filters.general?.toLocaleLowerCase()) ||
          metric.NOMBRE?.toLocaleLowerCase().includes(filters.general?.toLocaleLowerCase()) ||
          metric.IP?.toLocaleLowerCase().includes(filters.general?.toLocaleLowerCase())
        ) && hascoincidances &&
          metric.METRICAS.includes(filters.nameMetric)
        return isvalid
      }
    )

    setMetrics(filterdata)
  }, [filters, metricsData])

  return (
    <>
      <div className="d-flex justify-content-end gap-5 align-items-end mb-4">
        <InfomonButton>
          
        </InfomonButton>
        <Input
          label=""
          placeholder="BUSCAR IP | HOSTNAME "
          value={filters.general}
          onChange={(value: string) => setFilters(prev => ({ ...prev, general: value }))} />
        <DataList
          value={filters.nameMetric}
          loading={loadingGetOptionalMetrics}
          label=""
          onChange={(value) => setFilters(prev => ({ ...prev, nameMetric: value }))}
          items={listOfMetricsByFamily.map(item => ({ id: item.codigo, value: item.nombre }))}
        />
        <Input
          label=""
          onChange={(value) => setFilters(prev => ({ ...prev, valueMetric: value }))}
          placeholder="Filtrar por dato de metrica"
          value={filters.valueMetric}
        />
        <button
          type="button"
          onClick={() => setFilters({ general: "", nameMetric: "", valueMetric: "" })}
          className="btn btn-danger btn-sm"
        >
          <span>Limpiar Filtros </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
          </svg>
        </button>
      </div>
      <DataTable
        columns={generalMetricsColumns()}
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
        paginationPerPage={4}
        paginationRowsPerPageOptions={[2, 4, 8, 10]}
        data={metrics}
      />
    </>

  )
}
export { ByFamilyTable }

const generalMetricsColumns = (): TableColumn<(IListMetricsPolicyVersion & { ID: string })>[] => [
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
  }
]