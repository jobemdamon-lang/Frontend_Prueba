import { FC, useContext, useEffect, useState } from "react"
import { IListMetricsPolicyVersion, ITipoCambio, IUpdateListaPolitica, TIPOCAMBIO } from "../../Types"
import DataTable from "react-data-table-component"
import { generalMetricsColumns } from "./GeneralMetricsColumns"
import { toast } from "react-toastify"
import { generateRowsOfMetricTodelete, metricas_campos } from "./policyUtils"
import { ContextPolitica } from "../../ContextPolitica"
import { DataList } from "../../../../../components/Inputs/DataListInput"
import { useCatalog } from "../../hooks/useCatalog"
import { Input } from "../../../../../components/Inputs/TextInput"
import { minimalistStyles } from "../../../../../helpers/tableStyles"
import { InfomonButton } from "../../../../../components/buttons/InfomonButton"

type Props = {
  family: string,
  metricsData: (IListMetricsPolicyVersion & { ID: string })[],
  openModalUpdatePolicy: Function,
  genericChangesFront: (IListMetricsPolicyVersion & {
    ID: string;
  } & ITipoCambio)[]
  setGenericChangeFront: React.Dispatch<React.SetStateAction<(IListMetricsPolicyVersion & {
    ID: string;
  } & ITipoCambio)[]>>,
  setGenericChangesInPolicy: React.Dispatch<React.SetStateAction<IUpdateListaPolitica[]>>
}
const GeneralMetricTable: FC<Props> = ({ metricsData, family, openModalUpdatePolicy, genericChangesFront, setGenericChangeFront, setGenericChangesInPolicy }) => {

  const { getListMetricsByFamily, listOfMetricsByFamily, loadingGetOptionalMetrics } = useCatalog()
  const [metrics, setMetrics] = useState(metricsData)
  const { modalInformation } = useContext(ContextPolitica)
  const [filters, setFilters] = useState({ general: "", nameMetric: "", valueMetric: "" })

  const handleDelete = (row: (IListMetricsPolicyVersion & { ID: string })) => {
    const idx = genericChangesFront.findIndex((metric) => metric.ID === row.ID)
    if (idx === -1) {
      setGenericChangeFront((prev) => ([...prev, { ...row, tipo_cambio: TIPOCAMBIO.DELETE }]))
      const deletedMetrics = generateRowsOfMetricTodelete(row, modalInformation)
      setGenericChangesInPolicy((prev) => ([...prev, ...deletedMetrics]))
    } else {
      toast.warn("Ya existe un cambio sobre este registro.", {
        position: toast.POSITION.TOP_RIGHT
      })
    }
  }

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
        columns={generalMetricsColumns(openModalUpdatePolicy, handleDelete)}
        persistTableHead
        highlightOnHover
        pagination
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
        fixedHeader
        paginationPerPage={4}
        paginationRowsPerPageOptions={[2, 4, 8, 10]}
        data={metrics}
      />
    </>

  )
}
export { GeneralMetricTable }