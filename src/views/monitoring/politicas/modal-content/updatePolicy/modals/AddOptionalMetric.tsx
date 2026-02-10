import { FC, useContext, useEffect, useState } from "react"
import { KTSVG } from "../../../../../../helpers/components/KTSVG"
import { ContextPolitica } from "../../../ContextPolitica"
import { ICIOfPolicyDetail, IListMetricsPolicyVersion, IMonitoringPolicyVersions, ITipoCambio, IUpdateListaPolitica } from "../../../Types"
import DataTable, { TableColumn } from "react-data-table-component"
import { LoadingTable } from "../../../../../../components/loading/LoadingTable"
import { EmptyData } from "../../../../../../components/datatable/EmptyData"
import { usePolicy } from "../../../hooks/usePolicy"
import { SearchInput } from "../../../../../../components/SearchInput/SearchInput"
import { useCatalog } from "../../../hooks/useCatalog"
import { ComboBoxInput } from "../../createPolicy/ComboBoxInput"
import { UsoFileSystemForm } from "./MetricForms/UsoFileSystemForm"
import { GenericMetricForm } from "./MetricForms/GenericMetricForm"
import { DisponibilidadServicioForm } from "./MetricForms/DisponibilidadServicioForm"
import { PuertosForm } from "./MetricForms/PuertosForm"
import { TableSpaceForm } from "./MetricForms/TableSpaceForm"
import { TransactionLogForm } from "./MetricForms/TransactionLogForm"
import { MssqlDBForm } from "./MetricForms/MssqlDBForm"
import { MssqlJobForm } from "./MetricForms/MssqlJobForm"
import { DisponibilidadProcesoForm } from "./MetricForms/DisponibilidadProcesoForm"
import { DisponibilidadInterfaz } from "./MetricForms/DisponibilidadInterfaz"
import { EstadoInterface } from "./MetricForms/EstadoInterface"
import { MSSQLAllReplica } from "./MetricForms/MSSQLAllReplica"
import { MSSQLPrimaryReplica } from "./MetricForms/MSSQLPrimaryReplica"
import { MSSQLSomeReplica } from "./MetricForms/MSSQLSomeReplica"
import { IISApplicationPool } from "./MetricForms/IISApplicationPool"
import { AvailabilityWeb } from "./MetricForms/AvailabilityWeb"

type Props = {
  closeModalUpdatePolicy: Function,
  modalInformation: IMonitoringPolicyVersions
}

type PropsComponent = {
  setGenericChangeFront: React.Dispatch<React.SetStateAction<(IListMetricsPolicyVersion & {
    ID: string
  } & ITipoCambio)[]>>,
  setGenericChangesInPolicy: React.Dispatch<React.SetStateAction<IUpdateListaPolitica[]>>
}

const AddOptionalMetric: FC<PropsComponent> = ({ setGenericChangeFront, setGenericChangesInPolicy }) => {

  const { closeModalUpdatePolicy, modalInformation }: Props = useContext(ContextPolitica)
  const { getCisOfPolicyVersion, listCIsOfPolicyVersion, listCiLoading } = usePolicy()
  const { getListMetricsOfFamily, listOfMetricsOfFamily, loadingGetOptionalMetrics } = useCatalog()
  const [cis, setCis] = useState(listCIsOfPolicyVersion)
  const [nombreCI, setNombreCI] = useState("")
  //view 1 = Lista de Equipos | vista 3 = Formulario de metricas opcionales del ci seleccionado
  const [view, setView] = useState(1)
  //Estado para guardar la metrica opcional seleccionada en el Combo
  const [selectedMetric, setSelectedMetric] = useState("")
  //Estado para almacenar la fila (CI) selecccionado para agregar metricas opcionales
  const [selectedRow, setSelectedRow] = useState<ICIOfPolicyDetail>(initialRow)

  const handleAddOptionalMetric = (row: ICIOfPolicyDetail) => {
    setSelectedRow(row)
    getListMetricsOfFamily(row.FAMILIA, row.CLASE, row.TIPO_EQUIPO ?? "OPCIONAL").then((sucess: boolean) => {
      if (sucess) setView(3)
    })
  }

  useEffect(() => {
    getCisOfPolicyVersion(modalInformation.ID_POLITICA.toString(), modalInformation.NRO_VERSION.toString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setCis(listCIsOfPolicyVersion.filter(
      (metric: ICIOfPolicyDetail) =>
        metric.NOMBRE_CI.toLocaleLowerCase().includes(nombreCI.toLocaleLowerCase())
    ))
  }, [nombreCI, listCIsOfPolicyVersion])


  const SelectedMetricForm = metricForms[selectedMetric as keyof typeof metricForms] || GenericMetricForm;

  return (
    <>
      <div className='modal-header py-4 bg-dark'>
        <h2 className="text-white">AGREGAR METRICAS OPCIONALES</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModalUpdatePolicy()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body px-lg-10 border border-dark border-top-0 rounded-bottom'>
        {view === 1 ?
          <div style={{ position: 'relative' }}>
            <SearchInput value={nombreCI} setValue={setNombreCI} />
            <DataTable
              columns={equiposRestantesColumns(handleAddOptionalMetric, loadingGetOptionalMetrics)}
              persistTableHead
              highlightOnHover
              pagination
              fixedHeader
              paginationPerPage={6}
              paginationRowsPerPageOptions={[2, 4, 8, 10]}
              noDataComponent={<EmptyData loading={listCiLoading} />}
              disabled={listCiLoading}
              data={cis.filter((ci: ICIOfPolicyDetail) => ci.BAJA_EQUIPO === "NO")}
            />
            {listCiLoading && <LoadingTable description='Cargando' />}
          </div>
          :
          <div>
            <div className="d-flex justify-content-around align-items-end">
              <ComboBoxInput data={listOfMetricsOfFamily.length === 0 ? [{ codigo: 0, nombre: 'No existen metricas opcinales.' }] : listOfMetricsOfFamily} setNewValue={setSelectedMetric} value={selectedMetric} />
              <button className="btn btn-primary align-center" onClick={() => setView(1)}>Regresar</button>
            </div>
            {
              selectedMetric === "" ?
                <div className="d-flex justify-content-center align-items-center m-10">
                  <p>Debe seleccionar una metrica.</p>
                </div>
                :
                <SelectedMetricForm
                  setGenericChangeFront={setGenericChangeFront}
                  selectedRow={selectedRow}
                  setGenericChangesInPolicy={setGenericChangesInPolicy}
                  setView={setView}
                  selectedMetric={selectedMetric}
                />
            }
          </div>
        }
      </div>
    </>
  )
}
export { AddOptionalMetric }

const metricForms = {
  "Uso de filesystem": UsoFileSystemForm,
  "Disponibilidad de servicio": DisponibilidadServicioForm,
  "Puertos": PuertosForm,
  "Tablespace utilization": TableSpaceForm,
  "Transaction Log": TransactionLogForm,
  "MSSQL DB State": MssqlDBForm,
  "MSSQL Job: Failed to run": MssqlJobForm,
  "Disponibilidad de proceso": DisponibilidadProcesoForm,
  "Disponibilidad de interface": DisponibilidadInterfaz,
  "Estado de Interface": EstadoInterface,
  "MSSQL AG - All replicas unhealthy": MSSQLAllReplica,
  "MSSQL AG - Primary replica recovery health in progress": MSSQLPrimaryReplica,
  "MSSQL AG - Some replicas unhealthy": MSSQLSomeReplica,
  "IIS: Application Pool": IISApplicationPool,
  "Last error message of scenario Availability Web": AvailabilityWeb,
  "Cert: SSL certificate is invalid": AvailabilityWeb,
  "Cert: SSL certificate expires soon": AvailabilityWeb
};


export const equiposRestantesColumns = (
  handleAddOptionalMetric: (row: ICIOfPolicyDetail) => void,
  loadingGetOptionalMetrics: boolean
): TableColumn<ICIOfPolicyDetail>[] => [
    {
      name: 'NOMBRE CI',
      cell: (row: (ICIOfPolicyDetail)) => row.NOMBRE_CI ?? "Sin registro",
      sortable: true
    },
    {
      name: 'HOSTNAME',
      cell: (row: (ICIOfPolicyDetail)) => row.NOMBRE ?? "Sin registro",
      sortable: true
    },
    {
      name: 'FAMILIA',
      cell: (row: (ICIOfPolicyDetail)) => row.FAMILIA ?? "Sin registro",
      sortable: true
    },
    {
      name: 'CLASE',
      cell: (row: (ICIOfPolicyDetail)) => row.CLASE ?? "Sin registro",
      sortable: true
    },
    {
      name: 'TIPO EQUIPO',
      cell: (row: (ICIOfPolicyDetail)) => row.TIPO_EQUIPO ?? "Sin registro",
      sortable: true
    },
    {
      name: 'AGREGAR METRICA',
      width: "150px",
      cell: (row: (ICIOfPolicyDetail)) =>
        <div className="d-flex gap-2">
          <button
            className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
            disabled={loadingGetOptionalMetrics}
            onClick={() => {
              handleAddOptionalMetric(row)
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-square-fill" viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z" />
            </svg>
          </button>
        </div >
    }
  ]

const initialRow: ICIOfPolicyDetail = {
  BAJA_EQUIPO: "",
  CLASE: "",
  DESCRIPCION: "",
  EQUIPO_ESTADO: "",
  FAMILIA: "",
  ID_EQUIPO: 0,
  IP: "",
  NOMBRE: "",
  NOMBRE_CI: "",
  NOMBRE_VIRTUAL: "",
  HEERAMIENTA_MONITOREO: "",
  TIPO_EQUIPO: ""
}