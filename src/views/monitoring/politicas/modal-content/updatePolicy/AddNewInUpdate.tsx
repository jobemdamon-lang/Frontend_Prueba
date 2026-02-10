import { FC, useContext, useEffect, useState } from "react"
import { IListCatalog, ListaEquipmentsToMetrics } from "../../Types"
import { ContextPolitica } from "../../ContextPolitica"
import { FirstStep } from "../createPolicy/FirstStep"
import { SecondStep } from "../createPolicy/SecondStep"
import { useCatalog } from "../../hooks/useCatalog"
import { warningNotification } from "../../../../../helpers/notifications"

type Props = {
  setNewEquipmentsInPolicy: React.Dispatch<React.SetStateAction<ListaEquipmentsToMetrics[]>>,
  setCanCreate: React.Dispatch<React.SetStateAction<boolean>>
}

const AddNewInUpdate: FC<Props> = ({ setNewEquipmentsInPolicy, setCanCreate }) => {

  const { selectedOwner } = useContext(ContextPolitica)
  const [stateProcess, setStateProcess] = useState<number>(1)
  const { fetchListCatalog } = useCatalog()
  /* const [equipmentsOfPolicy, setEquipmentsOfPolicy] = useState<IListEquipmentsOfPolicy>({ equipos_politica: [], politica: {} as IMonitoringPolicy } as IListEquipmentsOfPolicy) */
  const [metricsToCreate, setMetricsToCreate] = useState<(ListaEquipmentsToMetrics & { ci_name: string })[]>([])
  const [catalog, setCatalog] = useState<IListCatalog[]>([])

  useEffect(() => {
    fetchListCatalog(selectedOwner.id_proyecto.toString()).then((listCatalog: IListCatalog[]) => {
      setCatalog(listCatalog)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setNewEquipmentsInPolicy(metricsToCreate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metricsToCreate])

  return (
    <>
      <div className="stepper stepper-pills stepper-column d-flex flex-column flex-lg-row" id="kt_stepper_example_vertical">
        <div className="d-flex flex-row-auto w-100 w-lg-100px">
          <div className="stepper-nav flex-center">
            {/*Primer Paso Titulo*/}
            <div className={`stepper-item me-5 ${stateProcess === 1 && 'current'}`} data-kt-stepper-element="nav">
              <div className="stepper-icon w-40px h-40px">
                <i className="stepper-check fas fa-check"></i>
                <span className="stepper-number">1</span>
              </div>
              <div className="stepper-line h-60px"></div>
            </div>
            {/*Segundo Paso Titulo*/}
            <div className={`stepper-item me-5 ${stateProcess === 2 && 'current'}`} data-kt-stepper-element="nav">
              <div className="stepper-icon w-40px h-40px">
                <i className="stepper-check fas fa-check"></i>
                <span className="stepper-number">2</span>
              </div>
              <div className="stepper-line h-60px"></div>
            </div>
          </div>
        </div>
        {/*Contenido de cada Paso*/}
        <div style={{ width: "100%" }}>
          <h3 className="stepper-title ">
            {stateProcess === 1 ? "SELECCIÓN DE CI'S" : "VERIFICACIÓN"}
          </h3>
          <div className="mx-auto" >
            {/*Contenido 1*/}
            <div className={`current ${stateProcess === 1 ? 'showContent' : 'hideContent'}`} data-kt-stepper-element="content">
              <FirstStep
                listCatalog={catalog}
                metricsToCreate={metricsToCreate}
                setMetricsToCreate={setMetricsToCreate}
              />
            </div>
            {/*Contenido 2*/}
            <div className={`current ${stateProcess === 2 ? 'showContent' : 'hideContent'}`} data-kt-stepper-element="content">
              <SecondStep
                metricsToCreate={metricsToCreate}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <div className="me-2">
          <button
            onClick={() => {
              if (stateProcess === 1) {
                setStateProcess(1)
              } else {
                setStateProcess((prev) => prev - 1)
              }
            }}
            type="button"
            className="btn btn-primary">
            <i className="bi bi-caret-left-fill"></i>
            Atras
          </button>
        </div>
        <button
          onClick={() => {
            if (stateProcess === 1) {
              if (metricsToCreate.length === 0) {
                warningNotification('Aun no ha agregado CI´s para monitorear')
              } else {
                setStateProcess((prev) => prev + 1)
              }
            } else {
              setCanCreate(false)
            }
          }}
          type="button"
          className="btn btn-primary">
          {stateProcess === 2 ? "Añadir a cambios" : "Siguiente"}
          <i className="bi bi-caret-right-fill"></i>
        </button>
      </div>
    </>

  )
}
export { AddNewInUpdate }

