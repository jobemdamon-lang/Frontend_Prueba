import { FC } from "react"
import { IGroupsWithServersWithPatchesFront, IPatchesInServerFront, IRoutinesTemplateInGroup, IServerInGroupFront } from "../../../../Types"
import uniqid from "uniqid"

type Props = {
  group: IGroupsWithServersWithPatchesFront,
  handleCheckPatche: (nextCheckedState: boolean, groupIndex: number, serverIndex: number, patcheIndex: number) => void,
  groupIndex: number
}

const GroupServerPatche: FC<Props> = ({ group, handleCheckPatche, groupIndex }) => {
  return (
    <li
      key={group.ID_GRUPO}
      className="mb-5"
      style={{ listStyle: "none" }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-down-right-square" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5.854 3.146a.5.5 0 1 0-.708.708L9.243 9.95H6.475a.5.5 0 1 0 0 1h3.975a.5.5 0 0 0 .5-.5V6.475a.5.5 0 1 0-1 0v2.768z" />
      </svg>
      <span className="fs-5 fw-bold"> {" " + group.NOMBRE}  | Plantilla: {group.NOMBRE_PLANTILLA}</span>
      <div className='accordion pt-5' id='kt_accordion_1' style={{ pointerEvents: !group.CHECK ? "none" : "auto", opacity: !group.CHECK ? 0.5 : 1 }}>
        <div
          key={uniqid()}
          className='accordion-item w-100'>
          <h2 className='accordion-header' id={`kt_accordion_1_header_plantilla_${group?.ID_PLANTILLA}`}>
            <button
              className='accordion-button fs-4 fw-bold collapsed px-5 py-3'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target={`#kt_accordion_1_body_plantilla_${group?.ID_PLANTILLA}`}
              aria-expanded='false'
              aria-controls={`kt_accordion_1_body_plantilla_${group?.ID_PLANTILLA}`}
            >
              <span className="fs-5 text-info"> Informativo: {group?.NOMBRE_PLANTILLA}</span>
            </button>
          </h2>
          <div
            id={`kt_accordion_1_body_plantilla_${group?.ID_PLANTILLA}`}
            className='accordion-collapse collapse'
            aria-labelledby={`#kt_accordion_1_header_plantilla_${group?.ID_PLANTILLA}`}
            data-bs-parent='#kt_accordion_1'
          >
            <div className='accordion-body'>
              <ul className="m-3">
                {group?.PASOS_PLANTILLA?.map((step: IRoutinesTemplateInGroup) => (
                  <li key={step?.ID_RUTINARIA}>
                    {step?.NOMBRE_RUTINARIA}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {group.SERVIDORES.map((server: IServerInGroupFront, serverIndex: number) => (
          <div
            key={server.ID_EQUIPO}
            className='accordion-item w-100'>
            <h2 className='accordion-header' id={`kt_accordion_1_header_${server.ID_EQUIPO}`}>
              <button
                className='accordion-button fs-4 fw-bold collapsed px-5 py-3'
                type='button'
                data-bs-toggle='collapse'
                data-bs-target={`#kt_accordion_1_body_${server.ID_EQUIPO}`}
                aria-expanded='false'
                aria-controls={`kt_accordion_1_body_${server.ID_EQUIPO}`}
              >
                <span className="fs-5"> {" " + server.NOMBRE_CI}</span>
              </button>
            </h2>
            <div
              id={`kt_accordion_1_body_${server.ID_EQUIPO}`}
              className='accordion-collapse collapse'
              aria-labelledby={`#kt_accordion_1_header_${server.ID_EQUIPO}`}
              data-bs-parent='#kt_accordion_1'
            >
              <div className='accordion-body'>
                <ul className="m-3">
                  {server.PARCHES.map((patche: IPatchesInServerFront, patcheIndex: number) => (
                    <li
                      style={{ listStyle: "none" }}
                      key={patche.ID_PARCHE}
                    >
                      <label className="form-label cursor-pointer">
                        <input
                          type="checkbox"
                          checked={patche.CHECK}
                          className="form-check-input"
                          onChange={(event) => {
                            handleCheckPatche(event.target.checked, groupIndex, serverIndex, patcheIndex)
                          }}
                        />
                        {" " + patche.TITULO}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </li>
  )
}
export { GroupServerPatche }
