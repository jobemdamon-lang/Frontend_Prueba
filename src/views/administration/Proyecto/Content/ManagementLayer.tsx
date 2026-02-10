import { FC, useEffect, useState } from "react"
import { Form } from "react-bootstrap"
import DatalistInput from "react-datalist-input"
import { ToolTip } from "../../../../components/tooltip/ToolTip"
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../../../helpers/AssetHelpers"
import { ICollaborators, IListaUsuarios, IProject, IUpdateOwners, ModalSize, ModalView } from "../../Types"
import { useProjectSubModuleContext } from "../Context"
import { RootState } from "../../../../store/ConfigStore"
import { shallowEqual, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { IAuthState } from "../../../../store/auth/Types"
import { formatToDataList } from "../../../../helpers/general"

type Props = { InfoProjectData: IProject }
type typeCollab = { id: number, value: string }

const gerenteInfo = (collabs: ICollaborators[]) => collabs?.filter((user: ICollaborators) => (user.CARGO === "GERENTE DE PROYECTO" && user.FLAG === 1))[0] ?? {} as ICollaborators
const jefeInfo = (collabs: ICollaborators[]) => collabs?.filter((user: ICollaborators) => (user.CARGO === "JEFE DE PROYECTO" && user.FLAG === 1))[0] ?? {} as ICollaborators

const ManagementLayer: FC<Props> = ({ InfoProjectData }) => {

  const { administrateHook, modalHook } = useProjectSubModuleContext()
  const user: IAuthState = useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState
  const [wantModify, setWantModify] = useState(false)
  const [originalGerente, setOriginalGerente] = useState<ICollaborators>(gerenteInfo(InfoProjectData.lista_usuarios))
  const [originalJefe, setOriginalJefe] = useState<ICollaborators>(jefeInfo(InfoProjectData.lista_usuarios))
  const [gerente, setGerente] = useState<typeCollab>({
    id: parseInt(gerenteInfo(InfoProjectData.lista_usuarios)?.ID_USUARIO ?? 0),
    value: gerenteInfo(InfoProjectData.lista_usuarios)?.NOMBRE ?? ""
  })
  const [jefe, setJefe] = useState<typeCollab>({
    id: parseInt(jefeInfo(InfoProjectData.lista_usuarios)?.ID_USUARIO ?? 0),
    value: jefeInfo(InfoProjectData.lista_usuarios)?.NOMBRE ?? ""
  })

  useEffect(() => {
    setGerente({
      id: parseInt(gerenteInfo(InfoProjectData.lista_usuarios)?.ID_USUARIO ?? 0),
      value: gerenteInfo(InfoProjectData.lista_usuarios)?.NOMBRE ?? ""
    })
    setJefe({
      id: parseInt(jefeInfo(InfoProjectData.lista_usuarios)?.ID_USUARIO ?? 0),
      value: jefeInfo(InfoProjectData.lista_usuarios)?.NOMBRE ?? ""
    })
    setOriginalGerente(gerenteInfo(InfoProjectData.lista_usuarios))
    setOriginalJefe(jefeInfo(InfoProjectData.lista_usuarios))
  }, [InfoProjectData])

  //NO deberia hacer esto pero estoy contra el tiempo **MEJORAR** lo de arriba tambien
  const handleUpdate = () => {
    let ger: IListaUsuarios = {} as IListaUsuarios
    let jef: IListaUsuarios = {} as IListaUsuarios
    if (originalGerente.ID_USUARIO === undefined) {
      ger = {
        id_usuario: gerente.id,
        nombre: gerente.value,
        cargo: "GERENTE DE PROYECTO",
        estado: 1,
        id_proy_colab: 0,
        id_proyecto: InfoProjectData.id_proyecto
      }
    } else if (gerente.id !== parseInt(originalGerente.ID_USUARIO)) {
      ger = {
        id_usuario: gerente.id,
        nombre: gerente.value,
        cargo: "GERENTE DE PROYECTO",
        estado: 1,
        id_proy_colab: originalGerente.ID_PROY_COLAB,
        id_proyecto: InfoProjectData.id_proyecto
      }
    } else {
      ger = {
        id_usuario: parseInt(originalGerente.ID_USUARIO),
        nombre: originalGerente.NOMBRE,
        cargo: "GERENTE DE PROYECTO",
        estado: 1,
        id_proy_colab: originalGerente.ID_PROY_COLAB,
        id_proyecto: InfoProjectData.id_proyecto
      }
    }
    if (originalJefe.ID_USUARIO === undefined) {
      jef = {
        id_usuario: jefe.id,
        nombre: jefe.value,
        cargo: "JEFE DE PROYECTO",
        estado: 1,
        id_proy_colab: 0,
        id_proyecto: InfoProjectData.id_proyecto
      }
    } else if (jefe.id !== parseInt(originalJefe.ID_USUARIO)) {
      jef = {
        id_usuario: jefe.id,
        nombre: jefe.value,
        cargo: "JEFE DE PROYECTO",
        estado: 1,
        id_proy_colab: originalJefe.ID_PROY_COLAB,
        id_proyecto: InfoProjectData.id_proyecto
      }
    } else {
      jef = {
        id_usuario: parseInt(originalJefe.ID_USUARIO),
        nombre: originalJefe.NOMBRE,
        cargo: "JEFE DE PROYECTO",
        estado: 1,
        id_proy_colab: originalJefe.ID_PROY_COLAB,
        id_proyecto: InfoProjectData.id_proyecto
      }
    }
    let datatoSend: IUpdateOwners = {} as IUpdateOwners
    if ((jef.id_usuario === 0 || ger.id_usuario === 0)) {
      toast.warn(`Debe seleccionar Gerente y Jefe`, {
        position: toast.POSITION.TOP_RIGHT
      })
    } else {
      datatoSend = {
        lista_usuarios: [
          { ...ger }, { ...jef }
        ]
      }
      administrateHook.updateOwners(user.usuario, datatoSend)
    }
  }

  return (
    <div className="p-8">
      <div className="d-flex gap-8 justify-content-end mb-5">
        <ToolTip message="Editar Proyecto" placement="top">
          <button onClick={() => setWantModify(true)} className="border-0 bg-white">
            <SVG width={30} height={30} src={toAbsoluteUrl('/media/icons/duotune/art/art005.svg')} />
          </button>
        </ToolTip>
        <ToolTip message="Guardar" placement="top">
          <button
            disabled={!wantModify}
            onClick={() => modalHook.openModal(ModalView.UDPATE_OWNERS, ModalSize.SM, undefined,
              { confirmationMessage: "¿Esta seguro que desea actualizar a los responsables?", actionFunc: handleUpdate }
            )}
            className="border-0 bg-white">
            <SVG width={30} height={30} src={toAbsoluteUrl('/media/icons/duotune/files/fil008.svg')} />
          </button>
        </ToolTip>
      </div>
      <hr className="hr" />
      <div className="d-flex justify-content-around p-5 flex-wrap gap-10">
        <div>
          <Form.Label>Gerente de Proyecto</Form.Label>
          <DatalistInput
            className="administration-dt w-400px"
            inputProps={{
              disabled: !wantModify
            }}
            value={gerente?.value}
            placeholder=""
            label=""
            onSelect={(searchby) => {
              setGerente(searchby)
            }}
            items={formatToDataList(administrateHook.collabData)}
          />
        </div>
        <div>
          <Form.Label>Jefe de Proyecto</Form.Label>
          <DatalistInput
            className="administration-dt w-400px"
            inputProps={{
              disabled: !wantModify
            }}
            value={jefe?.value}
            placeholder=""
            label=""
            onSelect={(searchby) => {
              setJefe(searchby)
            }}
            items={formatToDataList(administrateHook.collabData)}
          />
        </div>
      </div>

    </div>
  )
}
export { ManagementLayer }