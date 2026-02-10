import { FC } from "react"
import { IListServerAssigned, IPatch, IServerInformation } from "../../../Types"
import uniqid from "uniqid"

type Props = {
  getServersInfoLoading: boolean,
  serverInformationData: IServerInformation,
  modalInformation: IListServerAssigned
}

const AvailablePatches: FC<Props> = ({ getServersInfoLoading, serverInformationData, modalInformation }) => {
  return (
    <article className="server-information-child">
      <h3 className="mb-5 text-center">PARCHES DISPONIBLES</h3>
      <ul className="available_patches_list">
        {getServersInfoLoading ?
          <div className="d-flex justify-content-center">
            <i className="fs-5">Cargando..</i>
          </div>
          :
          serverInformationData.parches?.length === 0 ?
          <div className="d-flex justify-content-center">
            <i className="fs-5">No existen registros.</i>
          </div> :
          serverInformationData.parches?.map((server: IPatch) => {
            return (
              <li key={uniqid()}>[Titulo] : {server.TITULO ?? "Sin Registro"} | [KB ID]: {server.KB_ID} </li>)
          })
        }
      </ul>
    </article>
  )
}
export { AvailablePatches }