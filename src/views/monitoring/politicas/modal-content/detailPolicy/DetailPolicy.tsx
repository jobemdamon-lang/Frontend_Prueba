import { useContext, useEffect, useState } from "react"
import { ContextPolitica } from "../../ContextPolitica"
import { KTSVG } from "../../../../../helpers/components/KTSVG"
import { IListMetricsPolicyVersionFront, IMonitoringPolicyVersions, IOwner, ModalView } from "../../Types"
import "../../../../../assets/sass/components/tabs-custom.scss"
import { usePolicy } from "../../hooks/usePolicy"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../../../../../store/ConfigStore"
import { Modal, Spinner } from "react-bootstrap"
import { DetailOfParams } from "./DetailOfParams"
import { restructureInformation } from "../updatePolicy/policyUtils"
import { ByFamilyTable } from "./ByFamilyTable"
import { ByCITable } from "./ByCITable"
import { CancelationConfirm } from "./CancelationConfirm"
import { ChangesToImplemnet } from "./ChangesToImplement"
import { ChangeTool } from "./ChangeTool"
import { accessControllerFunction } from "../../../../../components/AccessControler"
import { Role } from "../../../../../hooks/Types"

type Props = {
  modalInformation: IMonitoringPolicyVersions,
  rol: Role,
  closeModal: any,
  getDetailPolicy: any,
  updateStateOfPolicy: any,
  updateStateOfPolicyLoading: boolean,
  openModalParams: any,
  showModalParams: boolean,
  modalViewParams: any
  selectedOwner: IOwner,
  policiesByProject: IMonitoringPolicyVersions[],
  cancelUpdatingPolicy: Function,
  cancelupdatePolicyLoading: boolean
}


const DetailPolicy = () => {

  const username: string = useSelector<RootState>(({ auth }) => auth.usuario, shallowEqual) as string
  const { closeModal, modalInformation, updateStateOfPolicy, updateStateOfPolicyLoading, rol,
    showModalParams, modalViewParams, selectedOwner, policiesByProject, openModalParams, cancelUpdatingPolicy, cancelupdatePolicyLoading } = useContext<Props>(ContextPolitica)
  const [toggleState, setToggleState] = useState(1)
  const [tabActive, setActiveActive] = useState("")
  const toggleTab = (index: number) => setToggleState(index)
  const { getListOfMetricsOfPolicy, getCisOfPolicyVersion, listCIsOfPolicyVersion, listCiLoading, metricsOfPolicyLoading } = usePolicy()
  const [originalMetricsOfPolicy, setOriginalMetrics] = useState<IListMetricsPolicyVersionFront[]>([])

  useEffect(() => {
    getCisOfPolicyVersion(modalInformation.ID_POLITICA.toString(), modalInformation.NRO_VERSION.toString())
    getListOfMetricsOfPolicy(modalInformation.ID_POLITICA.toString(), modalInformation.NRO_VERSION.toString()).then(response => {
      const originalMetrics = restructureInformation(response)
      setOriginalMetrics(originalMetrics)
      setActiveActive(originalMetrics[0]?.ID)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  
  return (
    <>
      <div className='modal-header py-4 bg-dark'>
        <h2 className="text-white">Detalle de la politica | {modalInformation.NOMBRE}</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body px-lg-10'>
        <div className='card-body px-6 container '>
          <div className="d-flex justify-content-between mb-5">
          <h1 className="mb-10">DATOS DE LA POLITICA - VERSIÓN {modalInformation.NRO_VERSION}</h1>
            <div className="d-flex gap-5">
              {modalInformation.ESTADO_POLITICA === "POR IMPLEMENTAR" && accessControllerFunction(rol, ['admin', 'ejecutor']) &&
                <button onClick={() => { openModalParams(ModalView.CHANGE_TOOL) }} className="btn btn-primary">Confirmar uso Herramienta</button>
              }
              {
                modalInformation.ESTADO_POLITICA === "EN COLA" &&
                !policiesByProject.some((version: IMonitoringPolicyVersions) => version.ESTADO_POLITICA === 'POR IMPLEMENTAR') &&
                accessControllerFunction(rol, ['admin', 'ejecutor']) &&
                <button
                  disabled={updateStateOfPolicyLoading}
                  className="btn btn-success"
                  onClick={() => {
                    updateStateOfPolicy(modalInformation.ID_POLITICA.toString(), modalInformation.NRO_VERSION.toString(), username, selectedOwner.id_proyecto)
                    .then(() => closeModal());
                  }}>
                  {updateStateOfPolicyLoading ? "Enviando..." : "Enviar para empezar Implementación"}
                </button>
              }
              {(modalInformation.ESTADO_POLITICA === "POR IMPLEMENTAR" && accessControllerFunction(rol, ['ejecutor'])) &&
                <button
                  disabled={updateStateOfPolicyLoading}
                  className="btn btn-success"
                  onClick={() => {
                    updateStateOfPolicy(modalInformation.ID_POLITICA.toString(), modalInformation.NRO_VERSION.toString(), username, selectedOwner.id_proyecto)
                    .then(() => closeModal());
                  }}>
                  {updateStateOfPolicyLoading ? "Finalizando.." : "Finalizar Implementación"}
                </button>
              }
              {(
                (modalInformation.ESTADO_POLITICA === "POR IMPLEMENTAR" && accessControllerFunction(rol, ['ejecutor'])) ||
                (modalInformation.ESTADO_POLITICA === "EN COLA" && accessControllerFunction(rol, ['admin', 'ejecutor']))
              ) &&
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    openModalParams(ModalView.CONFIRMATION_CANCELATION)
                  }}>
                  Cancelar Versión
                </button>
              }
            </div>
          </div>
          <div className="container">
            <div className="bloc-tabs my-2">
              <button className={toggleState === 1 ? "tabs active-tab" : "tabs"} onClick={() => toggleTab(1)} >
                <span >DETALLE POR FAMILIA</span>
              </button>
              <button className={toggleState === 2 ? "tabs active-tab" : "tabs"} onClick={() => toggleTab(2)} >
                <span >DETALLE POR CI'S</span>
              </button>
            </div>
            <div className="content-tabs my-2">
              <div className={toggleState === 1 ? "tab-content  active-content" : "tab-content"}>
                {metricsOfPolicyLoading ?
                  <div className="d-flex justify-content-center my-10">
                    <Spinner animation="border" role="status">
                    </Spinner>
                    <h2>&nbsp; Cargando metricas</h2>
                  </div> :
                  <div>
                    <ul className="nav nav-tabs nav-line-tabs fs-6">
                      {originalMetricsOfPolicy.map((family: IListMetricsPolicyVersionFront) => (
                        <li className="nav-item" key={family.ID}>
                          <a
                            className={`nav-link ${tabActive === family.ID ? "active" : ""}`}
                            data-bs-toggle="tab" href={`#kt_tab_pane_${family.ID}`}
                            onClick={() => setActiveActive(family.ID)}>
                            {`${family.FAMILIA} (${family.METRICS.length})`}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <div className="tab-content d-block" id="myTabContent2">
                      {originalMetricsOfPolicy.map((family: IListMetricsPolicyVersionFront) => (
                        <div
                          className={`tab-pane fade ${tabActive === family.ID ? "show active" : ""}`}
                          id={`kt_tab_pane_${family.ID}`} role="tabpanel"
                          key={family.ID}
                        >
                          <ByFamilyTable metricsData={family.METRICS} family={family.FAMILIA} />
                        </div>
                      ))}

                    </div>
                  </div>
                }
                <div>
                  {modalInformation.ESTADO_POLITICA === "POR IMPLEMENTAR" &&
                    <>
                      <h2 className="text-center fw-normal mb-5">CAMBIOS A REALIZAR</h2>
                      <ChangesToImplemnet />
                    </>
                  }
                </div>
              </div>
              <div className={toggleState === 2 ? "tab-content  active-content" : "tab-content"}>
                <ByCITable
                  listCIsOfPolicyVersion={listCIsOfPolicyVersion}
                  listCiLoading={listCiLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        id='kt_modal_create_app'
        size={"lg"}
        tabIndex={-1}
        aria-hidden='true'
        dialogClassName='modal-dialog modal-dialog-centered'
        show={showModalParams}
      >
        {modalViewParams === ModalView.DETAIL_POLICY_OF_CI && <DetailOfParams />}
        {modalViewParams === ModalView.CONFIRMATION_CANCELATION && <CancelationConfirm cancelUpdatingPolicy={cancelUpdatingPolicy} cancelupdatePolicyLoading={cancelupdatePolicyLoading} />}
        {modalViewParams === ModalView.CHANGE_TOOL && <ChangeTool />}
      </Modal>
    </>
  )
}
export { DetailPolicy }
