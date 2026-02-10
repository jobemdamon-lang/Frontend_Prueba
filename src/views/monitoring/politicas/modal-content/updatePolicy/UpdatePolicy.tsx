import { useContext, useEffect, useState } from "react"
import { ContextPolitica } from "../../ContextPolitica"
import { KTSVG } from "../../../../../helpers/components/KTSVG"
import "../../../../../assets/sass/components/monitoring-styles/conditionalShow.scss"
import { IListMetricsPolicyVersion, IListMetricsPolicyVersionFront, IMonitoringPolicyVersions, IOwner, ITipoCambio, IUpdateListaPolitica, IUpdatePolicy, ListaEquipmentsToMetrics, ModalView } from "../../Types"
import { AddNewInUpdate } from "./AddNewInUpdate"
import { Modal, Spinner } from "react-bootstrap"
import { RootState } from "../../../../../store/ConfigStore"
import { shallowEqual, useSelector } from "react-redux"
import { restructureInformation } from "./policyUtils"
import { UpdateMetric } from "./modals/UpdateMetric"
import { usePolicy } from "../../hooks/usePolicy"
import { ChangesTable } from "./ChangesTable"
import { AddOptionalMetric } from "./modals/AddOptionalMetric"
import { MetricSection } from "./MetricSection"
import { warningNotification } from "../../../../../helpers/notifications"

type Props = {
  modalInformation: IMonitoringPolicyVersions,
  closeModal: Function,
  showModalUpdatePolicyModal: boolean,
  modalViewUpdatePolicy: string,
  openModalUpdatePolicy: (view: ModalView, information?: any) => void,
  updatePolicyNewVersion: (policy: IUpdatePolicy, closeModal: any, idProject: string) => Promise<void>,
  updatePolicyLoading: boolean,
  selectedOwner: IOwner
}

const UpdatePolicy = () => {

  const user: string = useSelector<RootState>(({ auth }) => auth.usuario, shallowEqual) as string
  const [metricsLoading, setMetricsLoading] = useState(false)
  const { getListOfMetricsOfPolicy } = usePolicy()
  const { closeModal, modalInformation, showModalUpdatePolicyModal, modalViewUpdatePolicy, openModalUpdatePolicy, updatePolicyNewVersion, updatePolicyLoading, selectedOwner } = useContext<Props>(ContextPolitica)
  //Estado para saber que vista se desea, actualizar o nuevo
  const [canCreateNew, setCanCreate] = useState(false)
  //Estado para almancenar los cambios a nivel front
  const [genericChangesFront, setGenericChangeFront] = useState<(IListMetricsPolicyVersion & { ID: string } & ITipoCambio)[]>([])
  //Estado donde se guardaran los cambios con la estructura para el envio de actualizar politica - existentes - nuevos
  const [genericChangesInPolicy, setGenericChangesInPolicy] = useState<Array<IUpdateListaPolitica>>([])
  const [newEquipmentsInPolicy, setNewEquipmentsInPolicy] = useState<Array<ListaEquipmentsToMetrics>>([])
  //Estado para almancenar la informacion de las metricas de una politica - version que serán mostradas
  const [originalMetricsOfPolicy, setOriginalMetrics] = useState<IListMetricsPolicyVersionFront[]>([])
  const [ticket, setTicket] = useState("")
  const [motivo, setMotivo] = useState("")
  const [tabActive, setActiveActive] = useState("")

  useEffect(() => {
    setMetricsLoading(true)
    //CORREGIR el modalInfo se crea como array pero al encontrar match en FilterSection se pasa a OBJ, si es arr es porque no matcheo nada
    if (Array.isArray(modalInformation)) {
      setMetricsLoading(false)
      return;
    }
    getListOfMetricsOfPolicy(modalInformation.ID_POLITICA.toString(), modalInformation.NRO_VERSION.toString()).then(response => {
      const originalMetrics = restructureInformation(response)
      setOriginalMetrics(originalMetrics)
      setActiveActive(originalMetrics[0]?.ID)
      setMetricsLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (event: any) => {
    event.preventDefault()
    const ticketWithoutSpace = ticket.replace(/\s+/g, "");
    if (genericChangesInPolicy.length === 0 && newEquipmentsInPolicy.length === 0) {
      warningNotification("Registre cambios para poder generar una actualización.")
    } else if (ticketWithoutSpace.length === 0) {
      warningNotification("Porfavor ingrese un ticket de origen a este cambio")
    } else {
      updatePolicyNewVersion({
        id_politica: modalInformation.ID_POLITICA,
        nro_version: modalInformation.NRO_VERSION,
        usuario: user,
        nro_ticket: ticket,
        motivo: motivo,
        lista_politica: genericChangesInPolicy.map(metric => {
          //Debido a que utilizo el id en front debo limpiar los que use y dejarlos en 0 para su creación en back
          if (typeof (metric.id_detalle_politica) === "string") {
            return { ...metric, id_detalle_politica: 0 }
          } else {
            return metric
          }
        }),
        lista_politica_new: newEquipmentsInPolicy.map((equipment: any) => {
          const { ci_name, ...rest } = equipment
          return rest
        })
      }, closeModal, selectedOwner.id_proyecto.toString())
    }

  }

  return (
    <>
      <div className='modal-header py-4 bg-dark'>
        <h2 className="text-white">Actualizar la politica | {modalInformation.NOMBRE}</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body px-lg-10'>
        {!metricsLoading ?
          <div className={`request-change-container ${!canCreateNew ? "showContent" : "hideContent"}`}>
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="mb-10">DATOS DE LA POLITICA - VERSIÓN {modalInformation.NRO_VERSION}</h1>
              <div className="d-flex gap-3">
                <button onClick={() => setCanCreate(true)} className="btn btn-primary">Agregar Nuevo CI</button>
                <button onClick={() => openModalUpdatePolicy(ModalView.ADD_OPTIONAL_METRIC)} className="btn btn-primary">Agregar Metricas Opcionales</button>
              </div>
            </div>
            {/* Seccion de Listado de Metricas */}
            <MetricSection
              setActiveActive={setActiveActive}
              tabActive={tabActive}
              originalMetricsOfPolicy={originalMetricsOfPolicy}
              openModalUpdatePolicy={openModalUpdatePolicy}
              genericChangesFront={genericChangesFront}
              setGenericChangeFront={setGenericChangeFront}
              setGenericChangesInPolicy={setGenericChangesInPolicy}
            />
            {/* Seccion de Listado de cambios a realizar */}
            <div className="mb-5">
              <h1 className="text-center fw-normal mb-5">CAMBIOS A REALIZAR ({genericChangesFront.length})</h1>
              <ChangesTable
                genericChangesFront={genericChangesFront}
                setGenericChangeFront={setGenericChangeFront}
                setGenericChangesInPolicy={setGenericChangesInPolicy}
              />
            </div>
            <form onSubmit={handleSubmit} className="d-flex justify-content-end gap-5">
              <input
                name="ticket"
                placeholder="Numero de Ticket"
                value={ticket}
                type="text"
                required
                className="form-control w-200px"
                onChange={(event) => { setTicket(event.target.value) }}
              />
              <input
                name="motivo"
                placeholder="Motivo de Cambio"
                value={motivo}
                required
                type="text"
                className="form-control w-200px"
                onChange={(event) => { setMotivo(event.target.value) }}
              />
              <button
                className="btn btn-success"
                disabled={updatePolicyLoading}
              >
                {updatePolicyLoading ? "Generando Cambio.." : "Generar Cambio"}
              </button>
            </form>

          </div> :
          <div className="d-flex justify-content-center my-10">
            <Spinner animation="border" role="status">
            </Spinner>
            <h2>&nbsp; Cargando metricas</h2>
          </div>
        }
        <div className={`h-100 ${canCreateNew ? "showContent" : "hideContent"}`}>
          <h1 className="fw-bold mb-5">AÑADIR CIS A LA VERSION </h1>
          <AddNewInUpdate
            setNewEquipmentsInPolicy={setNewEquipmentsInPolicy}
            setCanCreate={setCanCreate}
          />
        </div>
        <Modal
          id='kt_modal_create_app'
          size={"lg"}
          tabIndex={-1}
          aria-hidden='true'
          dialogClassName='modal-dialog modal-dialog-centered'
          show={showModalUpdatePolicyModal}
        >
          {modalViewUpdatePolicy === ModalView.UPDATE_METRIC && <UpdateMetric
            genericChangesFront={genericChangesFront}
            setGenericChangesInPolicy={setGenericChangesInPolicy}
            setGenericChangeFront={setGenericChangeFront}
          />}
          {modalViewUpdatePolicy === ModalView.ADD_OPTIONAL_METRIC && <AddOptionalMetric
            setGenericChangesInPolicy={setGenericChangesInPolicy}
            setGenericChangeFront={setGenericChangeFront}
          />}
        </Modal>
      </div>
    </>
  )
}
export { UpdatePolicy }

