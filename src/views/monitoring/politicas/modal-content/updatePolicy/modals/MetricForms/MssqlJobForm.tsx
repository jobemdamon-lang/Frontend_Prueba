import { FC, useContext, useState } from "react"
import { ICIOfPolicyDetail, IListMetricsPolicyVersion, IMonitoringPolicyVersions, ITipoCambio, IUpdateListaPolitica } from "../../../../Types"
import { ContextPolitica } from "../../../../ContextPolitica"
import uniqid from "uniqid"
import { initialFrontMetricToCreate, initialGenericMetricToCreate } from "../utilsGenerateOPMetric"

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
const MssqlJobForm: FC<Props> = ({ setGenericChangesInPolicy, selectedRow, setView, setGenericChangeFront, selectedMetric }) => {

  const { modalInformation }: PropsContext = useContext(ContextPolitica)
  const [metricOptionalToCreate, setOptionalMetricToCrate] = useState<IUpdateListaPolitica>(initialGenericMetricToCreate(selectedRow, modalInformation, selectedMetric))

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    let newID = uniqid()
    setGenericChangesInPolicy((prev: IUpdateListaPolitica[]) => ([...prev, { ...metricOptionalToCreate, id_detalle_politica: newID }]))
    setGenericChangeFront((prev: (IListMetricsPolicyVersion & { ID: string } & ITipoCambio)[]) => ([...prev, initialFrontMetricToCreate(selectedRow, metricOptionalToCreate, newID)]))
    setView(1)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="d-flex flex-wrap gap-5 m-5 justify-content-center">
        <div className="w-25">
          <label htmlFor="nombre_job">Nombre de Job</label>
          <input
            name="nombre_job"
            value={metricOptionalToCreate.nombre_job}
            type="text"
            required
            className="form-control"
            onChange={(event) => {
              setOptionalMetricToCrate((prev: IUpdateListaPolitica) => ({
                ...prev, nombre_job: event.target.value
              }))
            }}
          />
        </div>
      </div>
      <div className="d-flex justify-content-end">
        <button className="btn btn-success">Añadir Metrica</button>
      </div>
    </form>
  )
}
export { MssqlJobForm }