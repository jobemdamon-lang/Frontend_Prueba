import { FC, useEffect, useState } from "react"
import { useTypedSelector } from "../../../../../../store/ConfigStore"
import { useWindowsPatchContext } from "../../../Context"
import { ISocketDataEvent, ListaServidores } from "../../../../Types"
import { ServerContainer } from "./ServerContainer"
import { useExecution } from "../../../../hooks/useExecution"
import { KTSVG } from "../../../../../../helpers/components/KTSVG"


//Vista dentro del Modal de Ejecuciones para la visualizacion del Proceso del Parchado (Live) 
const ExecutionProcessMain: FC = () => {

  const [tabActive, setActiveActive] = useState(0)
  const userName = useTypedSelector(({ auth }) => auth.usuario)
  const { modalHook, socketInstance } = useWindowsPatchContext()
  const modalInformation: { id_ejecucion: number } = modalHook.modalInformation
  const { listProgressExecution, progressExecutionData, progressExecutionLoading } = useExecution()


  const llamarApiDeactualizar = async () => {
    listProgressExecution(modalInformation.id_ejecucion, 'llamarApiDeactualizar')
  }

  const handleSocketNotification = (data: ISocketDataEvent) => {
    if ((data.status === "Correcto" || data.status !== "Correcto") && data.usuario === userName && data.tipo === 2) {
      llamarApiDeactualizar();
    }
  };

  useEffect(() => {
    llamarApiDeactualizar()
    socketInstance?.on('notificacion', handleSocketNotification)

    return ()=> {
      console.log('ejecutando desmontaje')
      socketInstance?.off('notificacion', () => console.log('cerrando eventos'))
      modalHook.updateInformatioModal('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalInformation.id_ejecucion])

  useEffect(() => {
  }, [modalInformation.id_ejecucion])

  useEffect(() => setActiveActive(progressExecutionData?.lista_programacion?.[0]?.id_grupo || 0), [progressExecutionData])

  return (
    <>

      <div className='modal-header py-4'>
        <h2>EJECUCION EN PROGRESO {modalInformation.id_ejecucion}</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body px-lg-10 d-flex flex-column gap-2'>
        {progressExecutionLoading && <i className="text-center">Actualizando Informacion...</i>}
        <ul className="nav nav-tabs nav-line-tabs fs-6">
          {progressExecutionData?.lista_programacion?.map(group => (
            <li className="nav-item" key={group.id_grupo}>
              <a
                className={`nav-link ${tabActive === group.id_grupo ? "active" : ""}`}
                data-bs-toggle="tab" href={`#kt_tab_pane_${group.id_grupo}`}
                onClick={() => setActiveActive(group.id_grupo)}>
                {`${group.nombre_grupo}`}
              </a>
            </li>
          ))}
        </ul>
        <div className="tab-content d-block" id="myTabContent2">
          {progressExecutionData?.lista_programacion?.map(group => (
            <div
              className={`tab-pane fade ${tabActive === group.id_grupo ? "show active" : ""}`}
              id={`kt_tab_pane_${group.id_grupo}`} role="tabpanel"
              key={group.id_grupo}
            >
              {group.lista_servidores.map((server: ListaServidores) => (
                <ServerContainer
                  server={server}
                  key={server.id_equipo}
                  idExecution={modalInformation.id_ejecucion}
                  listProgressExecution={listProgressExecution}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-end">
          <button
            onClick={() => modalHook.closeModal()}
            className="btn btn-danger"
          >
            Cerrar
          </button>
        </div>
      </div>
    </>
  )
}
export { ExecutionProcessMain }
