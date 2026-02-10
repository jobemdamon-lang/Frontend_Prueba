import { FC } from "react"
import { Modal } from "react-bootstrap"
import { KTSVG } from "../../../../../helpers"

type Props = {
  showCorrelative: boolean,
  setShowCorrelative: React.Dispatch<React.SetStateAction<boolean>>,
  loading: boolean
  funcsendTask: any
}
const ConfirmCorrelative: FC<Props> = ({ showCorrelative, setShowCorrelative, loading, funcsendTask }) => {
  return (
    <Modal
      id='kt_modal_create_app'
      size="sm"
      tabIndex={-1}
      aria-hidden='true'
      dialogClassName='modal-dialog modal-dialog-centered'
      show={showCorrelative}
    >
      <div className='modal-header py-4 bg-dark text-white'>
        <h2 className="text-danger">Error Al Crear</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => setShowCorrelative(false)}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body pt-8 px-lg-10 gap-5 d-flex flex-column bg-dark text-center'>
        <h5 className="text-secondary">Ya existen tareas con ese Nombre en la Politica.</h5>
        <h4 className="text-white">¿ Desea Generar un Correlativo ?</h4>
        <div className="d-flex justify-content-end gap-5">
          <button
            type="button"
            className="btn btn-primary"
            disabled={loading}
            onClick={() => {
              funcsendTask()
            }}
          >
            {loading ? "Creando..." : "Crear"}
          </button>
          <button type="button" className="btn btn-danger" onClick={() => setShowCorrelative(false)}>Cancelar</button>
        </div>
      </div>
    </Modal>
  )
}
export { ConfirmCorrelative }