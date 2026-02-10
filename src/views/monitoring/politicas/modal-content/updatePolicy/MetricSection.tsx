import { FC } from "react"
import { IListMetricsPolicyVersion, IListMetricsPolicyVersionFront, ITipoCambio, IUpdateListaPolitica, ModalView } from "../../Types"
import { GeneralMetricTable } from "./GeneralMetricTable"

type Props = {
  originalMetricsOfPolicy: IListMetricsPolicyVersionFront[],
  setActiveActive: React.Dispatch<React.SetStateAction<string>>,
  tabActive: string,
  openModalUpdatePolicy: (view: ModalView, information?: any) => void,
  genericChangesFront: (IListMetricsPolicyVersion & { ID: string; } & ITipoCambio)[],
  setGenericChangeFront: React.Dispatch<React.SetStateAction<(IListMetricsPolicyVersion & { ID: string; } & ITipoCambio)[]>>,
  setGenericChangesInPolicy: React.Dispatch<React.SetStateAction<IUpdateListaPolitica[]>>
}

const MetricSection: FC<Props> = (
  { originalMetricsOfPolicy,
    setActiveActive,
    tabActive,
    openModalUpdatePolicy,
    genericChangesFront,
    setGenericChangeFront,
    setGenericChangesInPolicy
  }) => {
  return (
    <>
      <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6">
        {originalMetricsOfPolicy.map((family: IListMetricsPolicyVersionFront) => (
          <li className="nav-item" key={family.ID}>
            <a
              className={`nav-link ${tabActive === family.ID ? "active" : ""}`}
              data-bs-toggle="tab" href={`#kt_tab_pane_${family.ID}`}
              onClick={() => setActiveActive(family.ID)}>
              {`${family.FAMILIA} (${family.METRICS.length})`}
            </a>
          </li>
        ))}
      </ul>
      <div className="tab-content" id="myTabContent">
        {originalMetricsOfPolicy.map((family: IListMetricsPolicyVersionFront) => (
          <div
            className={`tab-pane fade ${tabActive === family.ID ? "show active" : ""}`}
            id={`kt_tab_pane_${family.ID}`} role="tabpanel"
            key={family.ID}
          >
            <GeneralMetricTable
              family={family.FAMILIA}
              metricsData={family.METRICS}
              openModalUpdatePolicy={openModalUpdatePolicy}
              genericChangesFront={genericChangesFront}
              setGenericChangeFront={setGenericChangeFront}
              setGenericChangesInPolicy={setGenericChangesInPolicy}
            />
          </div>
        ))}
      </div>
    </>
  )
}
export { MetricSection }