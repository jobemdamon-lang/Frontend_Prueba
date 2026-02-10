import { FC } from "react"
import { KTSVG } from "../../../../../helpers"
import { EventSourceInput } from "@fullcalendar/core"
import { usePlanification } from "../../../hooks/usePlanification"

type Props = { planificationModalFunctions: any }
const DeletePlanificationConfirm: FC<Props> = ({ planificationModalFunctions }) => {

  const modalInformation: {
    idPlanification: string,
    setCalendarEvents: React.Dispatch<React.SetStateAction<EventSourceInput | undefined>>,
    handleList: Function
  } = planificationModalFunctions.modalInformation
  const { deletePlanification, deletePlanificationLoading } = usePlanification()

  return (
    <>
      <div className='modal-header py-4 bg-dark'>
        <h2 className="text-white">CONFIRMAR ELIMINACIÓN</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => planificationModalFunctions.closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body px-lg-10 border rounded-bottom border-top-0 border-dark'>
        <p className="text-center fs-3">¿Esta seguro que desea eliminar esta fecha planificada?</p>
        <div className="d-flex justify-content-around my-5 gap-5">
          <button
            type="button"
            className="btn btn-success"
            disabled={deletePlanificationLoading}
            onClick={() => {
              const idPlanificationIsNotANumber = isNaN(Number(modalInformation.idPlanification))
              if (idPlanificationIsNotANumber) {
                modalInformation.setCalendarEvents((prev: any) => {
                  return [...prev].filter(event => event.id !== modalInformation.idPlanification)
                })
                planificationModalFunctions.closeModal()
              } else {
                deletePlanification(modalInformation.idPlanification).then(success => {
                  if (success) {
                    modalInformation.handleList()
                    planificationModalFunctions.closeModal()
                  }
                })
              }

            }}
          >
            {deletePlanificationLoading ? "Eliminando..." : "Eliminar"}
          </button>
          <button
            type="button"
            onClick={() => planificationModalFunctions.closeModal()}
            className="btn btn-danger"
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  )
}

export { DeletePlanificationConfirm }