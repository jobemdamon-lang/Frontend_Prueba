import { FC, useEffect, useState } from "react"
import { Form } from "react-bootstrap"
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../../../helpers/AssetHelpers"
import { ToolTip } from "../../../../components/tooltip/ToolTip"
import { useProjectSubModuleContext } from "../Context"
import { IProject, IUpdateProject, ModalSize, ModalView } from "../../Types"
import { SelectInput } from "../../../../components/Inputs/SelectInput"
import { DataList } from "../../../../components/Inputs/DataListInput"

const changeFormat = (date: string) => date?.includes("/") ? date?.split("/").reverse().join("-") : date
type Props = { InfoProjectData: IProject }

const DetailProject: FC<Props> = ({ InfoProjectData }) => {

  const [wantModify, setWantModify] = useState(false)
  const { projectHook, modalHook, administrateHook, clientHook } = useProjectSubModuleContext()
  const [infoProject, setInfoProject] = useState<IProject>(InfoProjectData)
  const updateProjectState = (value: string) => setInfoProject((prev) => ({ ...prev, proyecto_estado: value }))
  const updateProjectType = (value: string) => setInfoProject((prev) => ({ ...prev, proyecto_tipo: value }))

  const updateUsuario = () => {
    let dataToSend: IUpdateProject = {
      usuario: "",
      alp: infoProject.alp,
      cliente: infoProject.cliente,
      id_proyecto: infoProject.id_proyecto,
      nombre: infoProject.nombre,
      proyecto_estado: infoProject.proyecto_estado,
      proyecto_tipo: infoProject.proyecto_tipo,
      fecha_fin: changeFormat(infoProject.fecha_fin),
      fecha_Inicio: changeFormat(infoProject.fecha_inicio)
    }
    projectHook.updateProject(dataToSend).then(success => {
      if (success) {
        modalHook.closeModal()
      }
    })
  }

  //Si la informacion del listado cambia, actualizar la data en la vista
  useEffect(() => {
    setInfoProject(InfoProjectData)
  }, [InfoProjectData])

  return (
    <div className="p-5">
      {/* {START Actions Buttons} */}
      <div className="d-flex gap-8 justify-content-end mb-5">
        <ToolTip message="Editar Proyecto" placement="top">
          <button onClick={() => setWantModify(true)} className="border-0 bg-white">
            <SVG width={30} height={30} src={toAbsoluteUrl('/media/icons/duotune/art/art005.svg')} />
          </button>
        </ToolTip>
        <ToolTip message="Guardar" placement="top">
          <button
            disabled={!wantModify}
            onClick={() => modalHook.openModal(ModalView.CONFIRMATION, ModalSize.SM, undefined,
              { confirmationMessage: "¿Esta seguro que desea actualizar este Proyecto?", actionFunc: updateUsuario }
            )}
            className="border-0 bg-white">
            <SVG width={30} height={30} src={toAbsoluteUrl('/media/icons/duotune/files/fil008.svg')} />
          </button>
        </ToolTip>
      </div>
      {/* {END Actions Buttons} */}
      <hr className="hr" />
      <div>
        <div className="d-flex justify-content-around p-5 flex-wrap gap-10">
          <div>
            <Form.Label>ALP</Form.Label>
            <Form.Control value={infoProject?.alp ?? ""} type="number" onChange={e => setInfoProject((prev) => ({ ...prev, alp: e.target.value }))} disabled={!wantModify} />
          </div>
          <div>
            <Form.Label>Nombre del Proyecto</Form.Label>
            <Form.Control value={infoProject?.nombre ?? ""} type="text" onChange={e => setInfoProject((prev) => ({ ...prev, nombre: e.target.value }))} disabled={!wantModify} />
          </div>
          <SelectInput
            label="Estado"
            onChange={updateProjectState}
            data={administrateHook.stateProjectData}
            loading={administrateHook.loadingStateProjects}
            value={infoProject?.proyecto_estado ?? ""}
            disabled={!wantModify}
            required={true}
          />
          <SelectInput
            label="Tipo de Proyecto"
            onChange={updateProjectType}
            data={administrateHook.typeProjectData}
            loading={administrateHook.loadingTypeProjectData}
            value={infoProject?.proyecto_tipo ?? ""}
            disabled={!wantModify}
            required={true}
          />
        </div>
        <div className="d-flex justify-content-around p-5 flex-wrap gap-10">
          <div className="d-flex">
            <DataList
              disabled={!wantModify}
              value={infoProject?.cliente ?? ""}
              onChange={(client) => {
                setInfoProject((prev) => ({ ...prev, cliente: client }))
              }}
              items={clientHook.clients}
              label="Cliente"
            />
            <ToolTip message="Agregar Cliente" placement="top">
              <button
                disabled={!wantModify}
                onClick={() => modalHook.openModal(ModalView.NEW_CLIENT, ModalSize.SM, undefined, { project: "hola" })}
                className="border-0 bg-white">
                <SVG width={40} height={40} src={toAbsoluteUrl('/media/icons/duotune/communication/com005.svg')} />
              </button>
            </ToolTip>
          </div>

          <div>
            <Form.Label>Fecha Inicio</Form.Label>
            <Form.Control value={changeFormat(infoProject?.fecha_inicio ?? "")} type="date" onChange={e => setInfoProject((prev) => ({ ...prev, fecha_inicio: e.target.value }))} disabled={!wantModify} />
          </div>
          <div>
            <Form.Label>Fecha Fin</Form.Label>
            <Form.Control value={changeFormat(infoProject?.fecha_fin ?? "")} type="date" onChange={e => setInfoProject((prev) => ({ ...prev, fecha_fin: e.target.value }))} disabled={!wantModify} />
          </div>
        </div>
      </div>
    </div>
  )
}
export { DetailProject }