import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useIncidentContext } from "../Context"
import { IncidentItem } from "../../Types"
import { AccessController } from "../../../../components/AccessControler"

const StartTrackingConfirmation = () => {

  const { modalHook, useTicketHook, useIncidentHook, rol } = useIncidentContext()
  const modalInformation: IncidentItem = modalHook.modalInformation

  return (
    <>
      <div className='modal-header py-4'>
        <h2>CONFIRMACIÓN</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body px-lg-10'>
        <p className="text-center fs-3">¿Esta seguro que desea iniciar el seguimiento de la incidencia {modalInformation.TicketIdentifier}?</p>
        <div className="d-flex justify-content-around my-5">
          <AccessController
            rol={rol}
          >
            <button
              className="btn btn-success"
              disabled={useIncidentHook.startTrackingLoading}
              onClick={() => {
                //Si la inicializacion es exitosa se actualiza el listado y cierra el modal
                useIncidentHook.startTracking(modalInformation.TicketIdentifier).then(success => {
                  if (success) {
                    useTicketHook.getActiveTickets()
                    modalHook.closeModal()
                  }
                })
              }}
            >
              {useIncidentHook.startTrackingLoading ? "Iniciando..." : "Iniciar"}
            </button>
          </AccessController>
          <button
            onClick={() => modalHook.closeModal()}
            className="btn btn-danger"
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  )
}
export { StartTrackingConfirmation }