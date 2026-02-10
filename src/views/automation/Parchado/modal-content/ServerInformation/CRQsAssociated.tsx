import { FC } from "react"
import { ICrq, IListServerAssigned, IServerInformation } from "../../../Types"
import uniqid from "uniqid"

type Props = {
  getServersInfoLoading: boolean,
  serverInformationData: IServerInformation,
  modalInformation: IListServerAssigned
}

const CRQsAssociated: FC<Props> = ({ getServersInfoLoading, serverInformationData, modalInformation }) => {
  return (
    <article className="server-information-child">
      <h3 className="mb-5 text-center">CRQ's ASOCIADOS</h3>
      <ul className="available_patches_list">
        {getServersInfoLoading ?
          <div className="d-flex justify-content-center">
            <i className="fs-5">Cargando..</i>
          </div>
          : serverInformationData.parches?.length === 0 ?
            <div className="d-flex justify-content-center">
              <i className="fs-5">No existen registros.</i>
            </div> :
            serverInformationData.crqs?.map((server: ICrq) => {
              return (
                <li key={uniqid()}>[{server.CRQ ?? "Sin Registro"}] - {server.NOMBRE}</li>
              )
            })
        }

      </ul>
    </article>
  )
}
export { CRQsAssociated }