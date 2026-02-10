import { FC, useEffect } from "react"
import { useExecution } from "../../../../hooks/useExecution"
import { LogDifference } from "../../../../../../components/LogDifference"

type Props = { parentID: number, idExecution: number }

const PrePostDifferences: FC<Props> = ({ parentID, idExecution }) => {

  const { getDifferencesPrePost, prePostDifferences, loadingDifferences } = useExecution()

  useEffect(() => {
    getDifferencesPrePost(idExecution, parentID)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <LogDifference
      loading={loadingDifferences}
      items={prePostDifferences}
      equalLabel="Añadido"
      diffLabel="Retirado"
    />
  )
}
export { PrePostDifferences }