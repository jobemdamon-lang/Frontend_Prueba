import { Context } from "../../../Context";
import { useContext, useEffect, FC } from "react";
import { GeneralData } from "./GeneralData";
import { HoursSection } from "./HoursSection";
import { RoutesSection } from "./RoutesSection";
import { ServersSection } from "./ServersSection";
import { SpecialData } from "./SpecialData";
import { useServers } from "../../../../../hooks/useServers";
import { ConfirmCorrelative } from "../../ConfirmCorrelative";
import { BackupsAdminSection } from "./BackupsAdminSection";
import { toast } from "react-toastify";
import { estadoAprovador } from "../../../Types";
import { FrecuencySection } from "./FrecuencySection";
import { Tab, Tabs } from "../../../../../../../components/Tabs";

type Props = {
  taskModifiedFunctions: any
}

const ModifyTaskContainer: FC<Props> = ({ taskModifiedFunctions }) => {

  const { ComboData, closeModal, modalInformation } = useContext(Context)
  const { fetchServers, serversData, serversCombo } = useServers()

  useEffect(() => {
    fetchServers({ cliente: modalInformation.cliente, alp: modalInformation.alp, proyecto: "" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (taskModifiedFunctions.modifiedTask.lista_server.length === 0) {
      toast.warn("Debe añadir un servidor.", {
        position: toast.POSITION.TOP_RIGHT
      })
    } else if (taskModifiedFunctions.modifiedTask.lista_hora.length === 0) {
      toast.warn("Debe añadir una hora", {
        position: toast.POSITION.TOP_RIGHT
      })
    } else if (taskModifiedFunctions.modifiedTask.lista_proteccion_frecuencia.length === 0) {
      toast.warn("Debe añadir los datos de Frecuencia y Proteción", {
        position: toast.POSITION.TOP_RIGHT
      })
    } else {
      //Se abrira el Modal para asignar usuario pero por ahora se envia
      taskModifiedFunctions.modifyTask("0", taskModifiedFunctions.modifiedTask)
    }
  }

  const handleSendWithCorrelative = () => {
    taskModifiedFunctions.modifyTask("1", taskModifiedFunctions.modifiedTask)
  }

  return (
    <>
      {/* Vista de Detalle de la tarea para Modificar*/}
      <h4>Modificar Tarea</h4>
      <form onSubmit={handleSubmit}>
        <div className="accordion mb-5">
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                <strong>Datos Generales</strong>
              </button>
            </h2>
            <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
              <GeneralData ComboData={ComboData} taskModifiedFunctions={taskModifiedFunctions} />
            </div>
          </div>
        </div>
        <Tabs>
          <Tab title="Datos Especiales">
            <SpecialData ComboData={ComboData} taskModifiedFunctions={taskModifiedFunctions} />
          </Tab>
          <Tab title="Servidores">
            <ServersSection
              taskModifiedFunctions={taskModifiedFunctions}
              serversData={serversData}
              serversCombo={serversCombo}
            />
          </Tab>
          <Tab title="Rutas">
            <RoutesSection
              serversData={serversData}
              taskModifiedFunctions={taskModifiedFunctions}
            />
          </Tab>
          <Tab title="Horas">
            <HoursSection
              taskModifiedFunctions={taskModifiedFunctions}
            />
          </Tab>
          <Tab title="Frecuencia - Protección">
            <FrecuencySection
              taskModifiedFunctions={taskModifiedFunctions}
              ComboData={ComboData}
            />
          </Tab>
          {modalInformation.estado_actual === estadoAprovador.IT &&
            <Tab title="Sección Adminitrador de Backups">
              <BackupsAdminSection ComboData={ComboData} taskModifiedFunctions={taskModifiedFunctions} />
            </Tab>
          }
        </Tabs>
        <div className="d-flex justify-content-end gap-5">
          <button type="submit" className="btn btn-primary" disabled={taskModifiedFunctions.loadingTask}>
            {taskModifiedFunctions.loadingTask ? "Modificando..." : "Modificar"}
          </button>
          <button type="button" className="btn btn-danger" onClick={() => closeModal()}>Cancelar</button>
        </div>
      </form>
      <ConfirmCorrelative
        showCorrelative={taskModifiedFunctions.showModalCorrelative}
        setShowCorrelative={taskModifiedFunctions.setShowCorrelative}
        loading={taskModifiedFunctions.loadingTask}
        funcsendTask={handleSendWithCorrelative}
      />
    </>
  )
}
export { ModifyTaskContainer }