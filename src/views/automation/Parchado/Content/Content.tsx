import { Tab, Tabs } from "../../../../components/Tabs"
import { ServerScreen } from "./ServerScreen"
import { ExecutionScreen } from "./ExecutionScreen"

const Content = () => {

  return (
    <div className="card">
      <Tabs>
        <Tab title="Servidores">
          <ServerScreen />
        </Tab>
        <Tab title="Ejecuciones">
          <ExecutionScreen />
        </Tab>
      </Tabs>
    </div>

  )
}

export { Content }