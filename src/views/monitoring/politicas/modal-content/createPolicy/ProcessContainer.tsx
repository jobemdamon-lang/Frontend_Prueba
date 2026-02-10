import { useContext, useState } from "react"
import { FirstStep } from "./FirstStep"
import { SecondStep } from "./SecondStep"
import "../../../../../assets/sass/components/monitoring-styles/conditionalShow.scss"
import { toast } from "react-toastify"
import { ListaEquipmentsToMetrics } from "../../Types"
import { ContextPolitica } from "../../ContextPolitica"
import { RootState } from "../../../../../store/ConfigStore"
import { shallowEqual, useSelector } from "react-redux"

const ProcessContainer = () => {

  const { selectedOwner, closeModal, createPolicy, modalInformation } = useContext(ContextPolitica)
  const [stateProcess, setStateProcess] = useState<number>(1)
  const [creatingPolicyLoading, setCreationPolicyLoading] = useState<boolean>(false)
  /*  const [equipmentsOfPolicy, setEquipmentsOfPolicy] = useState<IListEquipmentsOfPolicy>({ equipos_politica: [], politica: {} as IMonitoringPolicy } as IListEquipmentsOfPolicy) */
  const usuario: string = useSelector<RootState>(({ auth }) => auth.usuario, shallowEqual) as string
  const [metricsToCreate, setMetricsToCreate] = useState<(ListaEquipmentsToMetrics & { ci_name: string })[]>([])

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
        <div style={{ maxHeight: "70vh", overflowY: "auto", width: "100%" }}>
          <h3 className="stepper-title mb-5">
            {
              stateProcess === 1 ? "SELECCIÓN DE CI'S"
                : stateProcess === 2 ? "VERIFICACIÓN" : "METRICAS OPCIONALES"
            }
          </h3>
          <div className="mx-auto mb-5" >
            {/*Contenido 1*/}
            <div className={`current ${stateProcess === 1 ? 'showContent' : 'hideContent'}`} data-kt-stepper-element="content">
              <FirstStep
                listCatalog={modalInformation}
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
      <div className="d-flex justify-content-center mt-5">
        <div className="me-2">
          <button
            onClick={() => {
              if (stateProcess === 1) {
                setStateProcess(1)
              } else if (stateProcess === 2) {
                setStateProcess((prev) => prev - 1)
              } else {
                setStateProcess(3)
              }
            }}
            type="button"
            className="btn btn-primary">
            <i className="bi bi-caret-left-fill"></i>
            Atras
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              if (stateProcess === 1) {
                if (metricsToCreate.length === 0) {
                  toast.warn("Aun no ha agregado CI´s para monitorear.", {
                    position: toast.POSITION.TOP_RIGHT
                  })
                } else {
                  setStateProcess((prev) => prev + 1)
                }
              } else if (stateProcess === 2) {
                setCreationPolicyLoading(true)
                createPolicy({
                  usuario: usuario,
                  id_politica: 0,
                  id_proyecto: selectedOwner.id_proyecto,
                  lista_equipo: metricsToCreate.map((metric: (ListaEquipmentsToMetrics & { ci_name: string })) => {
                    const { ci_name, ...rest } = metric
                    return rest
                  })
                }).then((idPolicy: any) => {
                  closeModal()
                  /* if (idPolicy) {
                    getEquipmentsPolicy(idPolicy).then((equipments: IListEquipmentsOfPolicy) => setEquipmentsOfPolicy(equipments))
                    setCreationPolicyLoading(false)
                    setStateProcess((prev) => prev + 1)
                  } */
                })
              }
            }}
            type="button"
            disabled={creatingPolicyLoading}
            className="btn btn-primary">
            {stateProcess === 2 ? creatingPolicyLoading ? "Creando..." : "Crear Politica" : "Siguiente"}
            <i className="bi bi-caret-right-fill"></i>
          </button>
        </div>
      </div>
    </>

  )
}
export { ProcessContainer }