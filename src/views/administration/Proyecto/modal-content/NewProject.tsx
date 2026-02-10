import { useState } from "react"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useProjectSubModuleContext } from "../Context"
import { Form } from "react-bootstrap"
import { ComboBoxInput } from "../components/ComboBoxInput"
import DatalistInput from "react-datalist-input"
import { ToolTip } from "../../../../components/tooltip/ToolTip"
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../../../helpers/AssetHelpers"
import "../../../../assets/sass/components/administrattion-styles/conditional-content.scss"
import "../../../../assets/sass/components/administrattion-styles/filters-section.scss"
import "../../../../assets/sass/components/InventoryFilter/data-list-input-styles.scss"
import { NewClientToProject } from "./NewClientToProject"
import { RootState } from "../../../../store/ConfigStore"
import { shallowEqual, useSelector } from "react-redux"
import { IAuthState } from "../../../../store/auth/Types"
import { formatToDataList } from "../../../../helpers/general"

const restOfPart = { id_proy_colab: 0, id_proyecto: 0, id_usuario: 0, estado: 0 }
const NewProject = () => {

  const [alp, setAlp] = useState("")
  const [nameProject, setName] = useState("")
  const [stateProject, setState] = useState("")
  const [typeProject, setType] = useState("")
  const [client, setClient] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [gerente, setGerente] = useState("")
  const [jefe, setJefe] = useState("")
  const user: IAuthState = useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState
  const { modalHook, administrateHook, clientHook, projectHook, setIsVisibility, isCreateClientVisible } = useProjectSubModuleContext()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    projectHook.createProject({
      alp: alp,
      cliente: client,
      fecha_fin: endDate,
      fecha_Inicio: startDate,
      nombre: nameProject,
      proyecto_estado: stateProject,
      proyecto_tipo: typeProject,
      usuario: user.usuario,
      id_proyecto: 0,
      lista_usuarios: [
        { ...restOfPart, nombre: jefe, cargo: "JEFE DE PROYECTO" },
        { ...restOfPart, nombre: gerente, cargo: "GERENTE DE PROYECTO" }
      ]
    })
  }

  return (
    <>
      {/* {START HEADER} */}
      <div className='modal-header py-4'>
        <h2>Agregar Nuevo Proyecto</h2>
        <div>
          <button
            className="btn-access-modal"
            style={{
              opacity: isCreateClientVisible ? "1" : "0",
              backgroundColor: "transparent"
            }}
            onClick={() => setIsVisibility(false)}
          >
            <SVG src={toAbsoluteUrl("/media/icons/duotune/arrows/arr074.svg")} className="category-item" />
            <strong>Regresar</strong>
          </button>
          <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
            <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
          </div>
        </div>
      </div>
      {/* {END HEADER} */}
      <div className='modal-body pt-2 px-lg-10'>
        {/* {START NEW PROJECT CONTENT} */}
        <form className={`p-5 ${isCreateClientVisible ? "hideContent" : "showContent"}`} onSubmit={handleSubmit}>
          <div className="d-flex justify-content-around flex-wrap gap-5 mb-8">
            <div>
              <Form.Label>ALP</Form.Label>
              <Form.Control value={alp} type="number" onChange={e => setAlp(e.target.value)} />
            </div>
            <div>
              <Form.Label>Nombre del Proyecto</Form.Label>
              <Form.Control value={nameProject} type="text" onChange={e => setName(e.target.value)} />
            </div>
            <ComboBoxInput value={stateProject} label="Estado" data={administrateHook.stateProjectData} required={true} setNewValue={setState} />
            <ComboBoxInput value={typeProject} label="Tipo de Proyecto" data={administrateHook.typeProjectData} required={true} setNewValue={setType} />
            <div>
              <Form.Label>Cliente</Form.Label>
              <div className="d-flex">
                <DatalistInput
                  className="administration-dt w-400px"
                  value={client}
                  placeholder=""
                  label=""
                  onSelect={(searchby) => {
                    setClient(searchby.value)
                  }}
                  items={clientHook.clients}
                />
                <ToolTip message="Nuevo Cliente" placement="top">
                  <button
                    type="button"
                    onClick={() => setIsVisibility(true)}
                    className="border-0 bg-white">
                    <SVG width={40} height={40} src={toAbsoluteUrl('/media/icons/duotune/communication/com005.svg')} />
                  </button>
                </ToolTip>
              </div>
            </div>
            <div>
              <Form.Label>Fecha Inicio</Form.Label>
              <Form.Control value={startDate} type="date" onChange={e => setStartDate(e.target.value)} />
            </div>
            <div>
              <Form.Label>Fecha Fin</Form.Label>
              <Form.Control value={endDate} type="date" onChange={e => setEndDate(e.target.value)} />
            </div>
            <div>
              <Form.Label>Gerente de Proyecto</Form.Label>
              <DatalistInput
                className="administration-dt w-400px"
                value={gerente}
                placeholder=""
                label=""
                onSelect={(searchby) => {
                  setGerente(searchby.value)
                }}
                items={formatToDataList(administrateHook.collabData)}
              />
            </div>
            <div>
              <Form.Label>Jefe de Proyecto</Form.Label>
              <DatalistInput
                className="administration-dt w-400px"
                value={jefe}
                placeholder=""
                label=""
                onSelect={(searchby) => {
                  setJefe(searchby.value)
                }}
                items={formatToDataList(administrateHook.collabData)}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end gap-5 mx-5">
            <button
              type="submit"
              disabled={projectHook.loadingCreateProject}
              className="btn btn-success h-50px">{projectHook.loadingCreateProject ? "Creando..." : "Crear"}</button>
            <button type="button" className="btn btn-danger h-50px" onClick={() => modalHook.closeModal()}>Cancelar</button>
          </div>
        </form>
        {/* {END NEW PROJECT CONTENT} */}
        {/* {START NEW CLIENT CONTENT} */}
        <div className={`p-5 ${isCreateClientVisible ? "showContent" : "hideContent"}`}>
          <NewClientToProject />
        </div>
        {/* {END NEW PROJECT CONTENT} */}
      </div>
    </>
  )
}
export { NewProject }