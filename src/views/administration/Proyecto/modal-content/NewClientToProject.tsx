import { useState } from "react"
import { Form } from "react-bootstrap"
import { useProjectSubModuleContext } from "../Context"

const NewClientToProject = () => {

  const [clientName, setClientName] = useState("")
  const { clientHook, setIsVisibility } = useProjectSubModuleContext()
  const changeView = () => setIsVisibility(false)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clientHook.addNewClient(clientName).then(success => {
      if (success) {
        changeView()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Form.Label>Nombre del Cliente</Form.Label>
        <Form.Control value={clientName} type="text" onChange={e => setClientName(e.target.value)} />
      </div>
      <div className="d-flex justify-content-end gap-5 mt-8">
        <button
          type="submit"
          disabled={clientHook.addingClientLoading}
          className="btn btn-success h-50px">{clientHook.addingClientLoading ? "Creando..." : "Crear"}</button>
        <button type="button" className="btn btn-danger h-50px" onClick={() => changeView()}>Cancelar</button>
      </div>
    </form>
  )
}
export { NewClientToProject }