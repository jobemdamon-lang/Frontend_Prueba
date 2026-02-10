import { useContext } from "react"
import { IMonitoringPolicyVersions } from "./Types"
import { PolicyTable } from "./Tables/PolicyTable/PolicyTable"
import { ContextPolitica } from "./ContextPolitica"

type Props = {
   policiesByProject: IMonitoringPolicyVersions[],
   fetchPoliciesByProjectLoading: boolean
}

const ContentPoliticasIM = () => {

   const { fetchPoliciesByProjectLoading, policiesByProject }: Props = useContext(ContextPolitica)

   return (
      <PolicyTable
         policies={policiesByProject.filter(policy => policy.ESTADO_POLITICA === "IMPLEMENTADO").reverse()}
         fetchPoliciesByProjectLoading={fetchPoliciesByProjectLoading}
      />
   )
}

export { ContentPoliticasIM }
