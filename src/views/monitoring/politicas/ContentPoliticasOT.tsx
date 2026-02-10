import { useContext } from "react"
import { IMonitoringPolicyVersions } from "./Types"
import { PolicyTable } from "./Tables/PolicyTable/PolicyTable"
import { ContextPolitica } from "./ContextPolitica"

type Props = {
   policiesByProject: IMonitoringPolicyVersions[],
   fetchPoliciesByProjectLoading: boolean
}

const ContentPoliticasOT = () => {

   const { fetchPoliciesByProjectLoading, policiesByProject }: Props = useContext(ContextPolitica)

   return (
      <PolicyTable
         policies={policiesByProject.filter(policy => policy.ESTADO_POLITICA === "EN COLA" || policy.ESTADO_POLITICA === "POR IMPLEMENTAR")}
         fetchPoliciesByProjectLoading={fetchPoliciesByProjectLoading}
      />
   )
}

export { ContentPoliticasOT }
