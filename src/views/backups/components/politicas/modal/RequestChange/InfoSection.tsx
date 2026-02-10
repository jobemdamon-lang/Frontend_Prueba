import { FC } from "react"
import { IDataRequestChangesOR } from "../../Types"

type Props = {
  modalInformation: IDataRequestChangesOR,
}
const InfoSection: FC<Props> = ({ modalInformation }) => {
  return (
    <div className="InfoSection-data">
      <div>
        <ul title="Informacion">
          <li><strong>CLIENTE: </strong></li>
          <p>{modalInformation?.cliente}</p>
          <li><strong>PROYECTO: </strong></li>
          <p>{modalInformation?.proyecto}</p>
          <li><strong>GRUPO POLITICA: </strong></li>
          <p> {modalInformation?.politica}</p>
        </ul>
      </div>
      <div title="Informacion">
        <ul>
          <li><strong>MOTIVO: </strong></li>
          <p>{modalInformation?.motivo}</p>
          <li><strong>ETAPA: </strong></li>
          <p>{modalInformation?.etapa}</p>
          <li><strong>SOLICITANTE: </strong></li>
          <p>{modalInformation?.nombreSolicitante}</p>
        </ul>
      </div>
    </div>
  )
}
export { InfoSection }