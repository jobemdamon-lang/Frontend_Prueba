import { Context } from "../../../Context";
import { useContext, useEffect, FC } from "react";
import { GeneralData } from "./GeneralData";
import { HoursSection } from "./HoursSection";
import { RoutesSection } from "./RoutesSection";
import { ServersSection } from "./ServersSection";
import { SpecialData } from "./SpecialData";
import { useServers } from "../../../../../hooks/useServers";
import { ConfirmCorrelative } from "../../ConfirmCorrelative";
import { toast } from "react-toastify";
import { FrecuencySection } from "./FrecuencySection";
import { Tab, Tabs } from "../../../../../../../components/Tabs";

type Props = {
  taskFunctions: any,
  setIsVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  isDetailVisibility: boolean
}

const CreateTaskContainer: FC<Props> = ({ setIsVisibility, isDetailVisibility, taskFunctions }) => {

  const { ComboData, closeModal, modalInformation } = useContext(Context)
  const { fetchServers, serversData, serversCombo } = useServers()

  useEffect(() => {
    //Fetch de los CI perteneciente al cliente que administra la solicitud de cambio
    fetchServers({ cliente: modalInformation.cliente, alp: modalInformation.alp, proyecto: "" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    //Se valida que la lista de lista de servidores y horas tenga por lo menos un elemento
    if (taskFunctions.newTask.lista_server.length === 0) {
      toast.warn("Debe añadir un servidor.", {
        position: toast.POSITION.TOP_RIGHT
      })
    } else if (taskFunctions.newTask.lista_hora.length === 0) {
      toast.warn("Debe añadir una hora", {
        position: toast.POSITION.TOP_RIGHT
      })
    } else if (taskFunctions.newTask.lista_proteccion_frecuencia.length === 0) {
      toast.warn("Debe añadir los datos de Frecuencia y Proteción", {
        position: toast.POSITION.TOP_RIGHT
      })
    } else {
      //Se abrira el Modal para asignar usuario pero por ahora se envia
      taskFunctions.createTask("0", taskFunctions.newTask)
    }
  }

  const handleSendWithCorrelative = () => {
    taskFunctions.createTask("1", taskFunctions.newTask)
  }

  return (
    <>
      {/* Vista de Detalle para Crear una nueva Tarea*/}
      <h4>Tarea</h4>
      <form onSubmit={handleSubmit}>
        <div className="accordion mb-5">
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                <strong>Datos Generales</strong>
              </button>
            </h2>
            <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
              <GeneralData ComboData={ComboData} taskFunctions={taskFunctions} />
            </div>
          </div>
        </div>
        <Tabs>
          <Tab title="Datos Especiales">
            <SpecialData ComboData={ComboData} taskFunctions={taskFunctions} />
          </Tab>
          <Tab title="Servidores">
            <ServersSection
              serversData={serversData}
              serversCombo={serversCombo}
              taskFunctions={taskFunctions}
              isDetailVisibility={isDetailVisibility}
            />
          </Tab>
          <Tab title="Rutas">
            <RoutesSection
              serversData={serversData}
              taskFunctions={taskFunctions}
              isDetailVisibility={isDetailVisibility}
            />
          </Tab>
          <Tab title="Horas">
            <HoursSection
              taskFunctions={taskFunctions}
              isDetailVisibility={isDetailVisibility}
            />
          </Tab>
          <Tab title="Frecuencia - Protección">
            <FrecuencySection
              ComboData={ComboData}
              taskFunctions={taskFunctions}
              isDetailVisibility={isDetailVisibility}
            />
          </Tab>
        </Tabs>
        <div className="d-flex justify-content-end gap-5">
          <button type="submit" className="btn btn-primary" disabled={taskFunctions.loadingTask}>
            {taskFunctions.loadingTask ? "Creando..." : "Crear"}
          </button>
          <button type="button" className="btn btn-danger" onClick={() => closeModal()}>Cancelar</button>
        </div>
      </form>
      <ConfirmCorrelative
        showCorrelative={taskFunctions.showModalCorrelative}
        setShowCorrelative={taskFunctions.setShowCorrelative}
        loading={taskFunctions.loadingTask}
        funcsendTask={handleSendWithCorrelative}
      />
    </>
  )
}
export { CreateTaskContainer }