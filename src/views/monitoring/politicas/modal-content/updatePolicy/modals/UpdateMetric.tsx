import { FC, useContext, useState } from "react"
import { KTSVG } from "../../../../../../helpers/components/KTSVG"
import { ContextPolitica } from "../../../ContextPolitica"
import { IListMetricsPolicyVersion, IMonitoringPolicyVersions, ITipoCambio, IUpdateListaPolitica, TIPOCAMBIO } from "../../../Types"
import { generateRowsOfMetric } from "../policyUtils"
import { toast } from "react-toastify"

type Props = {
  closeModalUpdatePolicy: Function,
  modalInformation: IMonitoringPolicyVersions,
  modalInformationUpdatePolicy: (IListMetricsPolicyVersion & { ID: string })
}

type PropsComponent = {
  genericChangesFront: (IListMetricsPolicyVersion & {
    ID: string
  } & ITipoCambio)[],
  setGenericChangeFront: React.Dispatch<React.SetStateAction<(IListMetricsPolicyVersion & {
    ID: string
  } & ITipoCambio)[]>>,
  setGenericChangesInPolicy: React.Dispatch<React.SetStateAction<IUpdateListaPolitica[]>>
}

const UpdateMetric: FC<PropsComponent> = ({ setGenericChangeFront, setGenericChangesInPolicy, genericChangesFront }) => {

  const { closeModalUpdatePolicy, modalInformationUpdatePolicy, modalInformation }: Props = useContext(ContextPolitica)
  const [actualMetric, setActualMetric] = useState<(IListMetricsPolicyVersion & { ID: string })>(modalInformationUpdatePolicy)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const idx = genericChangesFront.findIndex((metric) => metric.ID === actualMetric.ID)
    if (idx === -1) {
      setGenericChangeFront((prev) => ([...prev, { ...actualMetric, tipo_cambio: TIPOCAMBIO.EDIT }]))
      const updatedMetrics = generateRowsOfMetric(actualMetric, modalInformationUpdatePolicy, modalInformation)
      setGenericChangesInPolicy((prev) => ([...prev, ...updatedMetrics]))
    } else {
      toast.warn("Ya existe un cambio sobre este registro.", {
        position: toast.POSITION.TOP_RIGHT
      })
    }
    closeModalUpdatePolicy()
  }

  return (
    <>
      <div className='modal-header py-4 bg-dark'>
        <h2 className="text-white">Actualizar | {modalInformationUpdatePolicy.METRICAS} </h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModalUpdatePolicy()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body px-lg-10 border border-dark border-top-0 rounded-bottom'>
        <form onSubmit={handleSubmit} className="d-flex flex-column justify-content-center align-items-center gap-10">
          {/* CAMPOS APLICABLES A TODAS LAS METRICAS */}
          <div className="d-flex justify-content-around flex-wrap gap-2">
            {modalInformationUpdatePolicy.WARNING?.ID_DETALLE_POLITICA !== undefined &&
              <div>
                <label htmlFor="CMumbralwarning">UMBRAL WARNING</label>
                <input
                  name="CMumbralwarning"
                  value={actualMetric.WARNING?.VALOR ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, WARNING: { ...prev.WARNING, VALOR: event.target.value } })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.WARNING?.ID_DETALLE_POLITICA !== undefined &&
              <div>
                <label htmlFor="CPooleowarning">POOLEO WARNING</label>
                <input
                  name="CPooleowarning"
                  value={actualMetric.WARNING?.NRO_POOLEO ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, WARNING: { ...prev.WARNING, NRO_POOLEO: event.target.value } })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.CRITICAL?.ID_DETALLE_POLITICA !== undefined &&
              <div>
                <label htmlFor="CMumbralcritical">UMBRAL CRITICAL</label>
                <input
                  name="CMumbralcritical"
                  value={actualMetric.CRITICAL?.VALOR ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, CRITICAL: { ...prev.CRITICAL, VALOR: event.target.value } })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.CRITICAL?.ID_DETALLE_POLITICA !== undefined &&
              <div>
                <label htmlFor="CMumbralcritical">POOLEO CRITICAL</label>
                <input
                  name="CMumbralcritical"
                  value={actualMetric.CRITICAL?.NRO_POOLEO ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, CRITICAL: { ...prev.CRITICAL, NRO_POOLEO: event.target.value } })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.FATAL?.ID_DETALLE_POLITICA !== undefined &&
              <div >
                <label htmlFor="CMumbralfatal">UMBRAL FATAL</label>
                <input
                  name="CMumbralfatal"
                  value={actualMetric.FATAL?.VALOR ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, FATAL: { ...prev.FATAL, VALOR: event.target.value } })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.FATAL?.ID_DETALLE_POLITICA !== undefined &&
              <div >
                <label htmlFor="CPooleofatal">POOLEO FATAL</label>
                <input
                  name="CPooleofatal"
                  value={actualMetric.FATAL?.NRO_POOLEO ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, FATAL: { ...prev.FATAL, NRO_POOLEO: event.target.value } })
                    )
                  }}
                />
              </div>
            }
            {/*<div >
              <label htmlFor="CMumbralfatal">NRO POOLEOS</label>
              <input
                name="CMumbralfatal"
                value={actualMetric.NRO_POOLEOS ?? ""}
                type="text"
                className="form-control"
                onChange={(event) => {
                  setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                    ({ ...prev, NRO_POOLEOS: event.target.value })
                  )
                }}
              />
              </div>*/}
            <div >
              <label htmlFor="Frequency">FRECUENCIA</label>
              <input
                name="Frequency"
                value={actualMetric.FRECUENCIA ?? ""}
                type="text"
                className="form-control"
                onChange={(event) => {
                  setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                    ({ ...prev, FRECUENCIA: event.target.value })
                  )
                }}
              />
            </div>
            {modalInformationUpdatePolicy.METRICAS === "Uso de filesystem" &&
              <div >
                <label htmlFor="RouteDisc">RUTA DE DISCO</label>
                <input
                  name="RouteDisc"
                  value={actualMetric.METRICA_RUTA ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, METRICA_RUTA: event.target.value })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.METRICAS === "Disponibilidad de servicio" &&
              <div >
                <label htmlFor="AssociateService">SERVICIO ASOCIADO</label>
                <input
                  name="AssociateService"
                  value={actualMetric.SERVICIO_ASOCIADO ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, SERVICIO_ASOCIADO: event.target.value })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.METRICAS === "Disponibilidad de servicio" &&
              <div >
                <label htmlFor="ProcessCommand">COMMANDO</label>
                <input
                  name="ProcessCommand"
                  value={actualMetric.COMMAND_PROCESS ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, COMMAND_PROCESS: event.target.value })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.METRICAS === "Puertos" &&
              <div >
                <label htmlFor="Protocol">PROTOCOLO</label>
                <input
                  name="Protocol"
                  value={actualMetric.PROTOCOLO ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, PROTOCOLO: event.target.value })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.METRICAS === "Puertos" &&
              <div >
                <label htmlFor="Port">PUERTO</label>
                <input
                  name="Port"
                  value={actualMetric.PUERTO ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, PUERTO: event.target.value })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.METRICAS === "Tablespace utilization" &&
              <div >
                <label htmlFor="Tablespacename">Nombre de TableSpace</label>
                <input
                  name="Tablespacename"
                  value={actualMetric.TABLESPACE_NAME ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, TABLESPACE_NAME: event.target.value })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.METRICAS === "Transaction Log" &&
              <div >
                <label htmlFor="instance_name">Nombre de Instancia</label>
                <input
                  name="instance_name"
                  value={actualMetric.NOMBRE_INSTANCIA ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, NOMBRE_INSTANCIA: event.target.value })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.METRICAS === "Transaction Log" &&
              <div >
                <label htmlFor="port_instance">Nro. Puerto de Instancia</label>
                <input
                  name="port_instance"
                  value={actualMetric.NRO_PUERTO_INSTANCIA ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, NRO_PUERTO_INSTANCIA: event.target.value })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.METRICAS === "MSSQL DB State" &&
              <div >
                <label htmlFor="name_db">Nombre DB</label>
                <input
                  name="name_db"
                  value={actualMetric.NOMBRE_DB ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, NOMBRE_DB: event.target.value })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.METRICAS === "MSSQL Job: Failed to run" &&
              <div >
                <label htmlFor="name_job">Nombre JOB</label>
                <input
                  name="name_job"
                  value={actualMetric.NOMBRE_JOB ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, NOMBRE_JOB: event.target.value })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.METRICAS === "Disponibilidad de proceso" &&
              <div >
                <label htmlFor="Disponibilidad_proceso"> PROCESO</label>
                <input
                  name="Disponibilidad_proceso"
                  value={actualMetric.DISPONIBILIDAD_PROCESO ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, DISPONIBILIDAD_PROCESO: event.target.value })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.METRICAS === "Disponibilidad de proceso" &&
              <div >
                <label htmlFor="command_path">PATH</label>
                <input
                  name="command_path"
                  value={actualMetric.COMMAND_PATH ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, COMMAND_PATH: event.target.value })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.METRICAS === "Disponibilidad de interface" &&
              <div >
                <label htmlFor="nombre_interface">INTERFACE</label>
                <input
                  name="nombre_interface"
                  value={actualMetric.NOMBRE_INTERFAZ ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, NOMBRE_INTERFAZ: event.target.value })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.METRICAS === "Estado de Interface" &&
              <div >
                <label htmlFor="estado_interface">ESTADO INTERFACE</label>
                <input
                  name="estado_interface"
                  value={actualMetric.ESTADO_INTERFACE ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, ESTADO_INTERFACE: event.target.value })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.METRICAS === "MSSQL AG - All replicas unhealthy" &&
              <div >
                <label htmlFor="all_replicas">NOMBRE DE GRUPO</label>
                <input
                  name="all_replicas"
                  value={actualMetric.ALL_REPLICAS ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, ALL_REPLICAS: event.target.value })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.METRICAS === "MSSQL AG - Primary replica recovery health in progress" &&
              <div >
                <label htmlFor="primary_replicas">NOMBRE DE GRUPO</label>
                <input
                  name="primary_replicas"
                  value={actualMetric.PRIMARY_REPLICAS ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, PRIMARY_REPLICAS: event.target.value })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.METRICAS === "MSSQL AG - Some replicas unhealthy" &&
              <div >
                <label htmlFor="some_replicas">NOMBRE DE GRUPO</label>
                <input
                  name="some_replicas"
                  value={actualMetric.SOME_REPLICAS ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, SOME_REPLICAS: event.target.value })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.METRICAS === "IIS: Application Pool" &&
              <div >
                <label htmlFor="app_pool">APPLICATION POOL</label>
                <input
                  name="app_pool"
                  value={actualMetric.APP_POOL ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, APP_POOL: event.target.value })
                    )
                  }}
                />
              </div>
            }
            {modalInformationUpdatePolicy.METRICAS === "Last error message of scenario Availability Web" &&
              <div >
                <label htmlFor="name_web">NOMBRE DE WEB</label>
                <input
                  name="name_web"
                  value={actualMetric.NAME_WEB ?? ""}
                  type="text"
                  className="form-control"
                  onChange={(event) => {
                    setActualMetric((prev: (IListMetricsPolicyVersion & { ID: string })) =>
                      ({ ...prev, NAME_WEB: event.target.value })
                    )
                  }}
                />
              </div>
            }
          </div>
          <div className="d-flex justify-content-center gap-5">
            <button type="submit" className="btn btn-success" disabled={false}>{false ? "Añadiendo" : "Añadir Cambios"}</button>
            <button type="button" className="btn btn-danger" onClick={() => closeModalUpdatePolicy()}>Cancelar</button>
          </div>
        </form>
      </div>
    </>
  )
}
export { UpdateMetric }