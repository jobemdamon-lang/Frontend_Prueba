import { useContext, useState } from "react"
import { KTSVG, toAbsoluteUrl } from "../../../../../../helpers"
import { Context } from "../../Context"
import SVG from "react-inlinesvg"
import { IDataRequestChangesOR } from "../../Types"
import { RequestChangeContentRW } from "./RequestChangeContentRW"
import { RequestChangeHeaderRW } from "./RequestChangeHeaderRW"
import { ApprovalModal } from "../Approval/ApprovalModal"
import { PoliciesTaskModal } from "../PoliciesTask/PoliciesTaskModal"
import { ConfirmSendRequestForm } from "../ConfirmSendRequest"
import { useRequestTasks } from "../../../../hooks/useRequestTasks"
import { usePolitics } from "../../../../hooks/usePolitics"
import { ConfirmCancelation } from "../ConfirmCancelation"

const RequestChangeDetailRW = () => {

  const { closeModal, modalInformation, showDetail }: { closeModal: any, modalInformation: IDataRequestChangesOR, showDetail: boolean } = useContext(Context)
  //Estado para mostrar la sección de detalle de una tarea la cual puede contener la vista de creación o modificación
  const [isDetailVisibility, setIsVisibility] = useState(showDetail)
  //Estado para mostrar modal interno de asignamiento de responsables
  const [showApprovalModal, setShowApproval] = useState(false)
  //Estado para mostrar modal interno de tareas de una politica
  const [showPTaskModal, setShowPolicies] = useState(false)
  //Estado para mostrar la vista de crear Tarea en la sección detalle de una tarea
  const [canCreate, setCanCreate] = useState(true)
  //Estado para mostrar la vista de clonar Tarea en la sección detalle de una tarea
  const [wantClone, setWantClone] = useState(false)
  //Estado para mostrar la vista de confirmacion para el envio de la solicitud
  const [showConfirmation, setShowConfirmation] = useState(false)
  //Estado para mostrar la vista de confirmacion de eliminacion de una de la solicitud
  const [showEliminationConfirmation, setShowEliminationConfirmation] = useState(false)
  //Metodos para listar las tareas por aprobar
  const { fetchlistTaskToApprove, listTaskToApprove, loadingTaskToApprove } = useRequestTasks()
  //Estado para almacenar las tareas de una politica
  const { searchTaskOfpolicy, searchTaskOfPoliciesData, loadingSearchTaskOfPolicies, sendTaskOfPolicyToRequest, setShowCorrelative,
    showCorrelative, loadingAddTaskToRequest } = usePolitics()

  return (
    <>
      <div className='modal-header py-4'>
        <h2>Solicitud de Actualización de Politica de Backup N° {modalInformation?.nro_ticket}</h2>
        <RequestChangeHeaderRW
          isDetailVisibility={isDetailVisibility}
          setIsVisibility={setIsVisibility}
          setShowApproval={setShowApproval}
          setCanCreate={setCanCreate}
          setShowPolicies={setShowPolicies}
          setShowConfirmation={setShowConfirmation}
          setShowEliminationConfirmation={setShowEliminationConfirmation}
          modalInformation={modalInformation}
          fetchlistTaskToApprove={fetchlistTaskToApprove}
          searchTaskOfpolicy={searchTaskOfpolicy}
        />
        <div className="d-flex">
          <button
            className="btn-access-modal"
            style={{
              opacity: isDetailVisibility ? "1" : "0",
              backgroundColor: "transparent"
            }}
            onClick={() => setIsVisibility(false)}
          >
            <SVG src={toAbsoluteUrl("/media/icons/duotune/arrows/arr074.svg")} className="category-item" />
            <strong>Regresar</strong>
          </button>
          <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModal()}>
            <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
          </div>
        </div>
      </div>
      <div className='modal-body pt-2 px-lg-10'>
        {/* Contiene la información de la solicitud, timeline, tabla de tareas y vista compartida - escondida de detalle de una tarea*/}
        <RequestChangeContentRW
          modalInformation={modalInformation}
          isDetailVisibility={isDetailVisibility}
          setIsVisibility={setIsVisibility}
          canCreate={canCreate}
          setCanCreate={setCanCreate}
          wantClone={wantClone}
          setWantClone={setWantClone}
        />
      </div>
      {/* Modal de asignamiento de responsables */}
      <ApprovalModal
        setShowApproval={setShowApproval}
        showApprovalModal={showApprovalModal}
        modalInformation={modalInformation}
        listTaskToApprove={listTaskToApprove}
        loadingTaskToApprove={loadingTaskToApprove}
        fetchlistTaskToApprove={fetchlistTaskToApprove}
      />
      {/* Modal de seleccion de tareas de una Politica */}
      <PoliciesTaskModal
        showPTaskModal={showPTaskModal}
        setShowPolicies={setShowPolicies}
        modalInformation={modalInformation}
        searchTaskOfPoliciesData={searchTaskOfPoliciesData}
        loadingSearchTaskOfPolicies = {loadingSearchTaskOfPolicies}
        sendTaskOfPolicyToRequest={sendTaskOfPolicyToRequest}
        setShowCorrelative={setShowCorrelative}
        showCorrelative={showCorrelative}
        loadingAddTaskToRequest={loadingAddTaskToRequest}
      />
      {/* Modal de Confirmación de envio de solicitud */}
      <ConfirmSendRequestForm showConfirmation={showConfirmation} setShowConfirmation={setShowConfirmation} modalInformation={modalInformation} />
      <ConfirmCancelation showEliminationConfirmation={showEliminationConfirmation} setShowEliminationConfirmation={setShowEliminationConfirmation} />
    </>
  )
}
export { RequestChangeDetailRW }