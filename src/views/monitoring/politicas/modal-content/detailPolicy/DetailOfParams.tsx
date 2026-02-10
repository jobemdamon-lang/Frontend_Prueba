import { useContext, useEffect } from "react"
import { ContextPolitica } from "../../ContextPolitica"
import { KTSVG } from "../../../../../helpers/components/KTSVG"
import { ICIOfPolicyDetail, IListMetricsByCi, IMonitoringPolicyVersions } from "../../Types"
import { Check } from "./Check"
import { usePolicy } from "../../hooks/usePolicy"
import { Spinner } from "react-bootstrap"

type Props = {
  modalInformationParams: ICIOfPolicyDetail,
  closeModalParams: any,
  modalInformation: IMonitoringPolicyVersions
}

const DetailOfParams = () => {

  const { closeModalParams, modalInformationParams, modalInformation } = useContext<Props>(ContextPolitica)
  const { listNameMetricsByCI, listNameMetricByCILoading, getListNameMetricsByCI } = usePolicy()

  useEffect(() => {
    getListNameMetricsByCI(modalInformation.ID_POLITICA.toString(),
      modalInformation.NRO_VERSION.toString(), modalInformationParams.ID_EQUIPO.toString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className='modal-header py-4 bg-dark'>
        <h2 className="text-white">METRICAS | {modalInformationParams.NOMBRE}</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModalParams()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body px-lg-10 border border-dark border-top-0 rounded-bottom d-flex justify-content-center flex-column gap-5'>
        <div>
          <h3>NRO DE METRICAS MONITOREADAS: {listNameMetricsByCI.length}</h3>
        </div>
        {listNameMetricByCILoading ?
          <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status">
            </Spinner>
          </div>
          :
          <div className="d-flex justify-content-around flex-wrap gap-5">
            {listNameMetricsByCI.map((ci: IListMetricsByCi) => {
              return (
                <div className="d-flex" key={ci.METRICAS}>
                  <label htmlFor=""> {ci.METRICAS} &nbsp;</label>
                  <Check isChecked={true} />
                </div>

              )
            })}
          </div>
        }
      </div>
    </>
  )
}
export { DetailOfParams }