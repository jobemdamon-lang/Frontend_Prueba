import { Context } from "../../../Context";
import { useContext, useEffect, FC } from "react";
import { GeneralData } from "./GeneralData";
import { HoursSection } from "./HoursSection";
import { RoutesSection } from "./RoutesSection";
import { ServersSection } from "./ServersSection";
import { SpecialData } from "./SpecialData";
import { useServers } from "../../../../../hooks/useServers";
import { ConfirmCorrelative } from "../../ConfirmCorrelative";
import { FrecuencySection } from "./FrecuencySection";
import { Tab, Tabs } from "../../../../../../../components/Tabs";

type Props = {
  taskCloneFunctions: any
}

const CloneTaskContainer: FC<Props> = ({ taskCloneFunctions }) => {

  const { ComboData, closeModal, modalInformation } = useContext(Context)
  const { fetchServers, serversData, serversCombo } = useServers()

  useEffect(() => {
    fetchServers({ cliente: modalInformation.cliente, alp: modalInformation.alp, proyecto: "" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    //Se abrira el Modal para asignar usuario pero por ahora se envia
    taskCloneFunctions.CloneTask("0", taskCloneFunctions.clonedTask)
  }
  const handleSendWithCorrelative = () => {
    taskCloneFunctions.CloneTask("1", taskCloneFunctions.clonedTask)
  }

  return (
    <>
      {/* Vista de Detalle de la tarea para Modificar*/}
      <h4>Clonar Tarea</h4>
      <form onSubmit={handleSubmit}>
        <div className="accordion mb-5">
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                <strong>Datos Generales</strong>
              </button>
            </h2>
            <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
              <GeneralData ComboData={ComboData} taskCloneFunctions={taskCloneFunctions} />
            </div>
          </div>
        </div>
        <Tabs>
          <Tab title="Datos Especiales">
            <SpecialData ComboData={ComboData} taskCloneFunctions={taskCloneFunctions} />
          </Tab>
          <Tab title="Servidores">
            <ServersSection
              taskCloneFunctions={taskCloneFunctions}
              serversData={serversData}
              serversCombo={serversCombo}
            />
          </Tab>
          <Tab title="Rutas">
            <RoutesSection
              serversData={serversData}
              taskCloneFunctions={taskCloneFunctions}
            />
          </Tab>
          <Tab title="Horas">
            <HoursSection
              taskCloneFunctions={taskCloneFunctions}
            />
          </Tab>
          <Tab title="Frecuencia - Protección">
            <FrecuencySection
              ComboData={ComboData}
              taskCloneFunctions={taskCloneFunctions}
            />
          </Tab>
        </Tabs>
        <div className="d-flex justify-content-end gap-5">
          <button type="submit" className="btn btn-primary" disabled={taskCloneFunctions.loadingTask}>
            {taskCloneFunctions.loadingTask ? "Clonando..." : "Clonar"}
          </button>
          <button type="button" className="btn btn-danger" onClick={() => closeModal()}>Cancelar</button>
        </div>
      </form>
      <ConfirmCorrelative
        showCorrelative={taskCloneFunctions.showModalCorrelative}
        setShowCorrelative={taskCloneFunctions.setShowCorrelative}
        loading={taskCloneFunctions.loadingTask}
        funcsendTask={handleSendWithCorrelative}
      />
    </>
  )
}
export { CloneTaskContainer }