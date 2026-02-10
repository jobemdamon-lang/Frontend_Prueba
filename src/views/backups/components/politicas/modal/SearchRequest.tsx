import { useContext, useState } from "react"
import { KTSVG } from "../../../../../helpers/components/KTSVG"
import { useRequestTasks } from "../../../hooks/useRequestTasks"
import { Context } from "../Context"
import { IDataRequestChangesOR, ModalSize, ModalView } from "../Types"
import { toast } from "react-toastify"

const SearchRequest = () => {

  const { openModal, closeModal } = useContext(Context)
  const [ idRequest, setIDRequest] = useState("")
  const { fetchRequestAndTask } = useRequestTasks()
  
  return (
    <>
      <div className='modal-header py-4'>
        <h2>Buscar Solicitud</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <form
        className='modal-body pt-2 px-lg-10'
        onSubmit={(event) => {
          event.preventDefault()
          closeModal()
          setTimeout(() => {
            fetchRequestAndTask(idRequest).then((data:IDataRequestChangesOR)=>{
              if(data.tareas.length === 0){
                toast.warn("No se encontro la solicitud - "+ idRequest, {
                  position: toast.POSITION.TOP_RIGHT
                })
              }else{
                openModal(ModalView.REQUEST_CHANGE_DETAIL_OR, ModalSize.XL, data)
              }
            })
          }, 500)
        }}>
        <input
          className="form-control"
          type="number"
          placeholder="Numero de Solicitud"
          required
          onChange={(event)=>{
            setIDRequest(event.target.value)
          }}
        />
        <div className="d-flex align-items-center justify-content-around mt-5">
          <button
            className="btn btn-primary"
            type="submit"
          >
            Buscar</button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => closeModal()}
          >
            Cancelar
          </button>
        </div>

      </form>
    </>
  )
}
export { SearchRequest }