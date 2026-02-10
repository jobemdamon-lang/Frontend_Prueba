import { useState } from "react"
import { Form } from "react-bootstrap"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useProjectSubModuleContext } from "../Context"

const NewClient = () => {

  const [clientName, setClientName] = useState("")
  const { modalHook, clientHook } = useProjectSubModuleContext()
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clientHook.addNewClient(clientName).then(success => {
      if (success) {
        modalHook.closeModal()
      }
    })
    setClientName("")
  }

  return (
    <>
      <div className='modal-header py-4'>
        <h2>Nuevo Cliente</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body pt-5 px-lg-10'>
        <form onSubmit={handleSubmit}>
          <div>
            <Form.Label>Nombre del Cliente</Form.Label>
            <Form.Control value={clientName} type="text" onChange={e => setClientName(e.target.value)} />
          </div>
          <div className="d-flex justify-content-end gap-5 mt-8">
            <button
              type="submit"
              disabled={clientHook.addingClientLoading}
              className="btn btn-success h-45px">{clientHook.addingClientLoading ? "Agregando..." : "Agregar"}</button>
            <button type="button" className="btn btn-danger h-45px" onClick={() => modalHook.closeModal()}>Cancelar</button>
          </div>
        </form>
      </div>
    </>

  )
}
export { NewClient }