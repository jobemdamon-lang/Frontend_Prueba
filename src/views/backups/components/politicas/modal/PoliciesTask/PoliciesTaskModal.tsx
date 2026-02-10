import { FC, useCallback, useEffect, useState } from "react"
import { KTSVG, toAbsoluteUrl } from "../../../../../../helpers"
import { Modal } from "react-bootstrap"
import { IDataRequestChangesOR, ISearchTaskOfPolicy, ISearchTasksWithFormat } from "../../Types"
import { ByServer } from "./ByServer"
import { ByTasks } from "./ByTasks"
import { hasaChange } from "./TableUtilities"
import SVG from "react-inlinesvg"
import { toast } from "react-toastify"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../../../../../../store/ConfigStore"
import { ConfirmCorrelative } from "../ConfirmCorrelative"
import { IAuthState } from "../../../../../../store/auth/Types"

type Props = {
  setShowPolicies: React.Dispatch<React.SetStateAction<boolean>>,
  showPTaskModal: boolean,
  modalInformation: IDataRequestChangesOR,
  searchTaskOfPoliciesData: ISearchTaskOfPolicy[],
  loadingSearchTaskOfPolicies?: boolean,
  sendTaskOfPolicyToRequest: any,
  setShowCorrelative: any,
  showCorrelative : boolean, 
  loadingAddTaskToRequest : boolean
}

const PoliciesTaskModal: FC<Props> = ({ setShowPolicies, showPTaskModal, modalInformation, searchTaskOfPoliciesData, loadingSearchTaskOfPolicies, sendTaskOfPolicyToRequest, setShowCorrelative , showCorrelative, loadingAddTaskToRequest }) => {

  const [toggleState, setToggleState] = useState(1)
  const toggleTab = (index: number) => setToggleState(index)
  const [selectedRows, setSelectedRows] = useState<Array<ISearchTasksWithFormat>>([])
  const [tasksOfPoliciesWithFormat, setTasksOfPoliciesWithFormat] = useState<Array<ISearchTasksWithFormat>>([])
  const [toggleCleared, setToggleCleared] = useState(false)
  const user: IAuthState = useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState

  //POR MEJORAR - Metodo para enviar la solicitud de agregacion de tareas de una politica a la solicitud
  const handleSend = (flag_correlative:string="0") => {
    const dataModifiedToSend = tasksOfPoliciesWithFormat.filter((task: ISearchTasksWithFormat) => (task.has_a_change.isChangeInFront && task.has_a_change.isModifiedTask))
    const dataDownToSend = tasksOfPoliciesWithFormat.filter((task: ISearchTasksWithFormat) => (task.has_a_change.isChangeInFront && task.has_a_change.isDownTask))
    if (dataModifiedToSend.length > 0) {
      const ids: string = dataModifiedToSend.map((task: ISearchTasksWithFormat) => task.id_poli_tarea).join(",")
      sendTaskOfPolicyToRequest(flag_correlative, {
        id_poli_tareas: ids,
        opcion: "1",
        id_solicitud: modalInformation.id_solicitud,
        usuario: user.usuario
      }, modalInformation.id_solicitud?.toString())
    } 
    if (dataDownToSend.length > 0) {
      const ids: string = dataDownToSend.map((task: ISearchTasksWithFormat) => task.id_poli_tarea).join(",")
      sendTaskOfPolicyToRequest(flag_correlative, {
        id_poli_tareas: ids,
        opcion: "0",
        id_solicitud: modalInformation.id_solicitud,
        usuario: user.usuario
      },modalInformation.id_solicitud?.toString())
    } 
    if(dataModifiedToSend.length === 0 && dataDownToSend.length === 0) {
      toast.warn(`No hay cambios para enviar.`, {
        position: toast.POSITION.TOP_RIGHT
      })
    }
  }

  //POR MEJORAR - Si el nombre de tarea existe se envia el correlativo
  const handleSendWithCorrelative = ()=> {
    handleSend("1")
  }

  //A las filas seleccionadas se le agrega el att. changeInFront y true a modificar
  const onEditAction = () => {
    selectedRows.forEach((eachRow: ISearchTasksWithFormat) => {
      const idx = tasksOfPoliciesWithFormat.findIndex((task: ISearchTasksWithFormat) => task.nombre_tarea === eachRow.nombre_tarea)
      const copyState: ISearchTasksWithFormat[] = [...tasksOfPoliciesWithFormat]
      if (idx !== -1) {
        copyState[idx].has_a_change.isChangeInFront = true
        copyState[idx].has_a_change.isDownTask = false
        copyState[idx].has_a_change.isModifiedTask = true
      }
      setTasksOfPoliciesWithFormat(copyState)
    })
    setToggleCleared(!toggleCleared)
    setSelectedRows([])
  }

  //A las filas seleccionadas se le agrega el att. changeInFront y true a baja
  const onDeleteAction = () => {
    selectedRows.forEach((eachRow: ISearchTasksWithFormat) => {
      const idx = tasksOfPoliciesWithFormat.findIndex((task: ISearchTasksWithFormat) => task.nombre_tarea === eachRow.nombre_tarea)
      const copyState: ISearchTasksWithFormat[] = [...tasksOfPoliciesWithFormat]
      if (idx !== -1) {
        copyState[idx].has_a_change.isChangeInFront = true
        copyState[idx].has_a_change.isDownTask = true
        copyState[idx].has_a_change.isModifiedTask = false
      }
      setTasksOfPoliciesWithFormat(copyState)
    })
    setToggleCleared(!toggleCleared)
    setSelectedRows([])
  }

  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows)
  }, [])

  //Se convierte los datos con un atributo adicional para saber si una tarea se encuentra en la solicitu de Cambio
  useEffect(() => {
    const dataWithFrontParameter: ISearchTasksWithFormat[] = searchTaskOfPoliciesData.map((task: ISearchTaskOfPolicy) => ({ ...task, has_a_change: hasaChange(task.nombre_tarea, modalInformation.tareas) }))
    setTasksOfPoliciesWithFormat(dataWithFrontParameter)
  }, [searchTaskOfPoliciesData, modalInformation.tareas])

  return (
    <Modal
      id='kt_modal_create_app'
      fullscreen={true}
      tabIndex={-1}
      aria-hidden='true'
      dialogClassName='modal-dialog modal-dialog-centered'
      show={showPTaskModal}
    >
      <div className='modal-header py-4 bg-dark'>
        <h1 className="text-light">Buscar Tareas</h1>
        <div className='btn btn-sm btn-icon btn-active-color-primary'
          onClick={() => {
            setSelectedRows([])
            setShowPolicies(false)
          }}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body pt-2 px-lg-10 gap-5 d-flex flex-column'>
        <section className="d-flex justify-content-between">
          <div className="m-5">
            <h4 className="text-uppercase">Tareas Seleccionadas: {selectedRows.length}</h4>
          </div>
          <div className="d-flex gap-5 align-items-center m-5">
            <div className="w-30px h-30px bg-primary text-white rounded"></div>
            <h5 className="m-0 text-uppercase">Tareas con Accion Baja</h5>
            <div className="w-30px h-30px bg-danger text-white rounded"></div>
            <h5 className="m-0 text-uppercase">Tareas con Accion Modificar</h5>
          </div>
        </section>
        <section>
          <div className="d-flex gap-10 justify-content-end">
            <div>
              <button style={{ backgroundColor: "transparent" }} disabled={!(selectedRows.length > 0)} onClick={onEditAction}>
                <SVG
                  width={40}
                  height={40}
                  src={toAbsoluteUrl('/media/icons/duotune/general/gen055.svg')}
                />
                Acción Editar
              </button>
            </div>
            <div>
              <button style={{ backgroundColor: "transparent" }} disabled={!(selectedRows.length > 0)} onClick={onDeleteAction} >
                <SVG
                  width={40}
                  height={40}
                  src={toAbsoluteUrl('/media/icons/duotune/general/gen027.svg')}
                />
                Acción Eliminar</button>
            </div>
          </div>
        </section>
        <div className="accordion-body">
          <div className="container">
            <div className="bloc-tabs">
              <button type="button" className={toggleState === 1 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(1)} >
                Por Servidor
              </button>
              <button type="button" className={toggleState === 2 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(2)} >
                Por Tareas
              </button>
            </div>
            <div className="content-tabs">
              <div className={toggleState === 1 ? "tab-content  active-content" : "tab-content"}>
                <ByServer
                  tasksOfPoliciesWithFormat={tasksOfPoliciesWithFormat}
                  loadingSearchTaskOfPolicies={loadingSearchTaskOfPolicies}
                  handleRowSelected={handleRowSelected}
                  toggleCleared={toggleCleared}
                />
              </div>
              <div className={toggleState === 2 ? "tab-content  active-content" : "tab-content"}>
                <ByTasks
                  tasksOfPoliciesWithFormat={tasksOfPoliciesWithFormat}
                  loadingSearchTaskOfPolicies={loadingSearchTaskOfPolicies}
                  handleRowSelected={handleRowSelected}
                  toggleCleared={toggleCleared}
                />
              </div>
            </div>
          </div>
        </div>
        <section className="d-flex justify-content-end gap-5">
          <button 
            className="btn btn-primary" 
            onClick={() => handleSend("0")}
            disabled={loadingAddTaskToRequest}
            >
              {loadingAddTaskToRequest ? "Agregando" :  "Agregar Tareas"}
            </button>
          <button className="btn btn-danger"
            onClick={() => {
              setSelectedRows([])
              setShowPolicies(false)
            }}>Cancelar</button>
        </section>
        <ConfirmCorrelative
          showCorrelative={showCorrelative}
          setShowCorrelative={setShowCorrelative}
          loading={loadingAddTaskToRequest}
          funcsendTask={handleSendWithCorrelative}
        />
      </div>
    </Modal>
  )
}
export { PoliciesTaskModal }