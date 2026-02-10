import uniqid from "uniqid"
import { ListaRutinaria } from "../../../../Types"
import { IndeterminateProgressBar } from "../../../../../../components/IndeterminateProgressBar"
import { useExecution } from "../../../../hooks/useExecution"
import DOMPurify from 'dompurify';
import { useCallback, useEffect, useState } from "react"
import { PrePostDifferences } from "./PrePostDifferences";
import { CheckList } from "./CheckList";
import debounce from "just-debounce-it";
import useVisibility from "../../../../../../hooks/useVisibility";

const RoutineAwxStep = ({ step, parentID, idExecution }: { step: ListaRutinaria, parentID: number, idExecution: number }) => {

  const { getLogsJobAwx, logsAwxData, getLogsAwxLoading } = useExecution()
  const { isVisible, elementRef } = useVisibility()
  const [purifiedHtml, setPurifiedHtml] = useState("")
  let uniqidToUse = uniqid()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDebounceFetchLogs = useCallback(
    debounce(() => {
      getLogsJobAwx(step.id_job_awx)
    }, 1500)
    , [])


  useEffect(() => {
    if (step.id_job_awx && routinesToViewFullLog.some(routine => routine === step.rutinaria) && isVisible) {
      handleDebounceFetchLogs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible])

  useEffect(() => {
    const customStyles = `
    body pre {color: white}
    .ansi_fore { color: #000000; }
    .ansi_back { background-color: #F5F5F5; }
    .ansi_fore.ansi_dark { color: #AAAAAA; }
    .ansi_back.ansi_dark { background-color: #000000; }
    .ansi1 { font-weight: bold; }
    .ansi3 { font-weight: italic; }
    .ansi4 { text-decoration: underline; }
    .ansi9 { text-decoration: line-through; }
    .ansi30 { color: #d1dded; }
    .ansi31 { color: #d9534f; }
    .ansi32 { color: #5cb85c; }
    .ansi33 { color: #f0ad4e; }
    .ansi34 { color: #337ab7; }
    .ansi35 { color: #e1539e; }
    .ansi36 { color: #2dbaba; }
    .ansi37 { color: #ffffff; }
    .ansi40 { background-color: #161b1f; }
    .ansi41 { background-color: #d9534f; }
    .ansi42 { background-color: #5cb85c; }
    .ansi43 { background-color: #f0ad4e; }
    .ansi44 { background-color: #337ab7; }
    .ansi45 { background-color: #e1539e; }
    .ansi46 { background-color: #2dbaba; }
    .ansi47 { background-color: #ffffff; }
    body.ansi_back pre {
      font-family: Monaco, Menlo, Consolas, "Courier New", monospace;
      font-size: 12px;
    }
    div.ansi_back.ansi_dark {
      padding: 0 8px;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      border-radius: 3px;
    }
  `;
    let purifiedDomHtml = DOMPurify.sanitize(logsAwxData)
    let htmlWithStyles = `<style>${customStyles}</style>${purifiedDomHtml.trim()}`;
    setPurifiedHtml(htmlWithStyles)
  }, [logsAwxData])

  return (

    <div
      className="accordion-item">
      <h2
        className="accordion-header"
        id={`kt_accordion_1_header_${uniqidToUse}`}>
        <button
          className="accordion-button fs-4 fw-semibold m-0 p-0 px-3 text-dark"
          //Si la operación STEP fue exitosa se muestra el borde izquierdo de verde, si fue fallido se muestra rojo y o si azul de pendiente
          style={{ borderLeft: `10px solid ${step?.es_error === 1 ? 'red' : step?.is_executed === 1 ? 'green' : 'blue'}` }}
          type="button"
          //Si no existe un log de información no permite desplegar
          data-bs-toggle={step?.is_executed === 1 ? "collapse" : ""}
          data-bs-target={`#kt_accordion_1_body_${uniqidToUse}`}
          aria-expanded="true"
          aria-controls={`kt_accordion_1_body_${uniqidToUse}`}
        >
          <div className="p-3 m-0 w-100 d-flex align-items justify-content-between">
            <div >
              {step.rutinaria}
            </div>
            <div className="pt-3 w-200px" style={{ opacity: '0.5' }}>
              {(step?.is_executed === 1 && !step?.fecha_fin) && <IndeterminateProgressBar color="blue" />}
            </div>
            <div>
              {step?.fecha_inicio !== null && <span style={{ color: '#B4B4B3' }}>{step?.fecha_inicio?.toString()} - {step?.fecha_fin?.toString() ?? "Pending"}</span>}
            </div>
          </div>
        </button>
      </h2>
      <div
        id={`kt_accordion_1_body_${uniqidToUse}`}
        className="accordion-collapse collapse"
        aria-labelledby={`kt_accordion_1_header_${uniqidToUse}`}
        data-bs-parent={`#kt_accordion_${parentID}`}>
        <div className="accordion-body">
          <div className="d-flex justify-content-end mb-2 flex-row">
            {getLogsAwxLoading && "Solicitando información | "}
            <a
              className="text-right"
              href={(process.env.REACT_APP_AWX_URL + step.id_job_awx) ?? `https://10.100.18.6/#/jobs/playbook/${step.id_job_awx}`}
              target="_blank"
              rel="noopener noreferrer">
              Ver detalle en AWX
            </a>
          </div>
          <div>
            {routinesToViewFullLog.some(routine => routine === step.rutinaria)
              ?
              <div
                ref={elementRef}
                dangerouslySetInnerHTML={{ __html: purifiedHtml }}
                style={{ whiteSpace: 'pre-wrap', margin: 0, padding: '20px', backgroundColor: 'black', color: 'whote' }} // Esto permite que los saltos de línea se respeten
              />
              :
              step.resultado
            }
            {(step.rutinaria === "Foto Post" && step.fecha_fin) && <PrePostDifferences parentID={parentID} idExecution={idExecution} />}
            {(step.rutinaria === "Checklist" && step.fecha_fin) && <CheckList parentID={parentID} idExecution={idExecution} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export { RoutineAwxStep }

const routinesToViewFullLog = ['Búsqueda de parches', 'Instalación de parches', 'Guardar servicio SQL', 'Detener servicio SQL', 'Iniciar servicio SQL', 'Guardar servicio POS', 'Checklist']
