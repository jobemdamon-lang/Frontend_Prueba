import { FC, useContext } from "react"
import { ICIOfPolicyDetail, IListMetricsPolicyVersion, IMonitoringPolicyVersions, ITipoCambio, IUpdateListaPolitica } from "../../../../Types"
import { ContextPolitica } from "../../../../ContextPolitica"
import uniqid from "uniqid"
import { initialFrontMetricToCreate } from "../utilsGenerateOPMetric"

type Props = {
  setGenericChangesInPolicy: React.Dispatch<React.SetStateAction<IUpdateListaPolitica[]>>,
  selectedRow: ICIOfPolicyDetail,
  setView: React.Dispatch<React.SetStateAction<number>>,
  setGenericChangeFront: React.Dispatch<React.SetStateAction<(IListMetricsPolicyVersion & {
    ID: string
  } & ITipoCambio)[]>>,
  selectedMetric: string
}

type PropsContext = {
  modalInformation: IMonitoringPolicyVersions
}
const GenericMetricForm: FC<Props> = ({ setGenericChangesInPolicy, selectedRow, setView, setGenericChangeFront, selectedMetric }) => {

  const { modalInformation }: PropsContext = useContext(ContextPolitica)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    let newID = uniqid()
    const initialGenericCreate = initialMetricToCreate(selectedRow, modalInformation, selectedMetric)
    setGenericChangesInPolicy((prev: IUpdateListaPolitica[]) => ([...prev, { ...initialGenericCreate, id_detalle_politica: newID }]))
    setGenericChangeFront((prev: (IListMetricsPolicyVersion & { ID: string } & ITipoCambio)[]) => ([...prev, initialFrontMetricToCreate(selectedRow, initialGenericCreate, newID)]))
    setView(1)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="d-flex flex-wrap gap-5 m-5 justify-content-center">
        La metrica de "{selectedMetric}" no require el ingreso de datos.
      </div>
      <div className="d-flex justify-content-end">
        <button className="btn btn-success">Añadir Metrica</button>
      </div>
    </form>
  )
}
export { GenericMetricForm }

const initialMetricToCreate = (row: ICIOfPolicyDetail, modalInfo: IMonitoringPolicyVersions, nameMetric: string): IUpdateListaPolitica => ({
  id_detalle_politica: 0,
  id_politica: modalInfo.ID_POLITICA,
  nro_version: modalInfo.NRO_VERSION,
  id_equipo: row.ID_EQUIPO,
  estado: 1,
  metricas: nameMetric,
  tipo_equipo: "",
  herramienta_monitoreo: "",
  umbral: "",
  nro_pooleos: "",
  frecuencia: "",
  metrica_ruta: "",
  servicio_asociado: "",
  command_process: "",
  protocolo: "",
  puerto: "",
  observacion: "",
  tipo_monitoreo: "",
  monitoreado_desde: "",
  tablespace_name: "",
  nombre_instancia: "",
  nro_puerto_instancia: "",
  nombre_db: "",
  nombre_job: "",
  disponibilidad_proceso: "",
  command_path: "",
  nombre_interfaz: "",
  estado_interface: "",
  all_replicas: "",
  primary_replicas: "",
  some_replicas: "",
  app_pool: "",
  name_web: ""
})
