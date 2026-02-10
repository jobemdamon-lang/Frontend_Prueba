import { FC } from "react"
import "../../../../../../assets/sass/components/backups-styles/_policies-timeline.scss"
import { IDataRequestChangesOR, estadoAprovador } from "../../Types"

type Props = {
  modalInformation: IDataRequestChangesOR,
}

const TimeLine: FC<Props> = ({ modalInformation }) => {

  return (
    <div className="InfoSection-timeline">
      <section className=" pt-3 m-auto">
        <ul className="timeline-with-icons">
          {modalInformation.estado_actual === "Cancelado" ?
            <li className="timeline-item mb-10" data-owner="Todos">
              <span className={`timeline-icon fa-beat canceled`}>
                <i className="fas fa-1 text-white"></i>
              </span>
              <h5 className="fw-bold pt-3 text-danger">Cancelado</h5>
            </li>
            :
            <>
              <li className="timeline-item mb-10" data-owner="Solicitante">
                <span className={`timeline-icon ${modalInformation?.estado_actual === estadoAprovador.ES ? "fa-beat bg-dark" : ""}`}>
                  <i className="fas fa-1 text-primary"></i>
                </span>
                <h5 className="fw-bold pt-3">Elaborar Solicitud</h5>
              </li>
              <li className="timeline-item mb-10" data-owner="Especialista">
                <span className={`timeline-icon ${modalInformation?.estado_actual === estadoAprovador.DT ? "fa-beat bg-dark" : ""}`}>
                  <i className="fas fa-2 text-primary"></i>
                </span>
                <h5 className="fw-bold pt-3">Definir Tareas de Backup</h5>
              </li>
              <li className="timeline-item mb-10" data-owner="Aprobador">
                <span className={`timeline-icon ${modalInformation?.estado_actual === estadoAprovador.AT ? "fa-beat bg-dark" : ""}`}>
                  <i className="fas fa-3 text-primary"></i>
                </span>
                <h5 className="fw-bold pt-3">Aprobar Tareas de Backup</h5>
              </li>
              <li className="timeline-item mb-10" data-owner="Adm. Backup">
                <span className={`timeline-icon ${modalInformation?.estado_actual === estadoAprovador.IT ? "fa-beat bg-dark" : ""}`}>
                  <i className="fas fa-4 text-primary"></i>
                </span>
                <h5 className="fw-bold pt-3">Implementar Tareas de Backup</h5>
              </li>
              <li className="timeline-item mb-10" data-owner="Sin Actor">
                <span className={`timeline-icon ${modalInformation?.estado_actual === estadoAprovador.T ? "fa-beat bg-dark" : ""}`}>
                  <i className="fas fa-5 text-primary"></i>
                </span>
                <h5 className="fw-bold pt-3">Terminado</h5>
              </li>
            </>
          }

        </ul>
      </section>
    </div>
  )
}
export { TimeLine }