import uniqid from "uniqid"
import DOMPurify from 'dompurify';
import { FC, useCallback, useEffect, useState } from "react"
import debounce from "just-debounce-it";
import { IListLogsPrePostLinux, ListaRutinariaLinux } from "../../../Types";
import { useExecution } from "../../../hooks/useExecution";
import { IndeterminateProgressBar } from "../../../../../components/IndeterminateProgressBar";
import { customStylesToAWXLogs } from "./utils";
import ReactDiffViewer from 'react-diff-viewer-continued';
import { useServer } from "../../../hooks/useServer";
import { downloadTXTFile } from "../../../../../helpers/general";

type Props = {
  routine: ListaRutinariaLinux,
  serverID: number,
  executionID: number,
  nroTicket: string | null
}

const RoutineAWX: FC<Props> = ({ routine, executionID, serverID, nroTicket }) => {

  const { getLogsJobAwxV2, logsAwxV2Data, getLogsAwxV2Loading } = useExecution()
  const { getLogsPrePostLinuxLoading, getPhotoPrePostByServerLinux, getResultSearchLinux, getResultSearchLinuxLoading } = useServer()
  const [logs, setLogs] = useState<IListLogsPrePostLinux>({ photo_pos: '', photo_pre: '' })
  const [purifiedHtml, setPurifiedHtml] = useState("")
  const uniqidToUse = uniqid()

  const handlePrePostDiff = () => {
    getPhotoPrePostByServerLinux(nroTicket ?? '', serverID).then(result => {
      if (result) setLogs(result)
    })
  }

  const handleLoadResultsSearch = () => {
    getResultSearchLinux({
      id_ejecucion_detalle: routine.id_ejecucion_detalle,
      id_servidor: 0
    }).then(result => {
      if (result) {
        downloadTXTFile({
          filename: `${routine.rutinaria}.txt`,
          content: result[0]?.RESULTADO_BUSQUEDA ?? 'No se han encontrado resultados.'
        })
      }
    })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDebounceFetchLogs = useCallback(
    debounce(() => {
      if (routine.id_job_awx) {
        getLogsJobAwxV2(routine.id_job_awx)
      }
    }, 1500), [])

  useEffect(() => {
    if (
      routine.id_job_awx &&
      routinesToViewFullLog.includes(routine.rutinaria)
    ) {
      handleDebounceFetchLogs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let purifiedDomHtml = DOMPurify.sanitize(logsAwxV2Data)
    let htmlWithStyles = `<style>${customStylesToAWXLogs}</style>${purifiedDomHtml.trim()}`;
    setPurifiedHtml(htmlWithStyles)
  }, [logsAwxV2Data])

  return (
    <div className="accordion-item">
      <h2
        className="accordion-header"
        id={`kt_accordion_1_header_${uniqidToUse}`}
      >
        <button
          className="accordion-button fs-4 fw-semibold m-0 p-0 px-3 text-dark"
          //Si la operación routine fue exitosa se muestra el borde izquierdo de verde, si fue fallido se muestra rojo y o si azul de pendiente
          style={{ borderLeft: `10px solid ${routine.es_error === 1 ? 'red' : routine.is_executed === 1 ? 'green' : 'blue'}` }}
          type="button"
          //Si no existe un log de información no permite desplegar
          data-bs-toggle={routine.is_executed === 1 ? "collapse" : ""}
          data-bs-target={`#kt_accordion_1_body_${uniqidToUse}`}
          aria-expanded="true"
          aria-controls={`kt_accordion_1_body_${uniqidToUse}`}
        >
          <div className="p-3 m-0 w-100 d-flex align-items justify-content-between">
            <div className="fs-6 fw-normal" style={{ color: '#B4B4B8' }}>
              {routine.rutinaria.toUpperCase()}
            </div>
            <div className="pt-3 w-200px" style={{ opacity: '0.5' }}>
              {(routine.is_executed === 1 && !routine.fecha_fin) && <IndeterminateProgressBar color="blue" />}
            </div>
            <div>
              {routine.fecha_inicio !== null &&
                <span
                  style={{ color: '#B4B4B3' }}
                >
                  {routine.fecha_inicio.toString()} - {routine.fecha_fin?.toString() ?? "Pending"}
                </span>
              }
            </div>
          </div>
        </button>
      </h2>
      <div
        id={`kt_accordion_1_body_${uniqidToUse}`}
        className="accordion-collapse collapse"
        aria-labelledby={`kt_accordion_1_header_${uniqidToUse}`}
        data-bs-parent={`#kt_accordion_${serverID}`}
      >
        <div className="accordion-body">
          <div className="d-flex justify-content-end mb-2 flex-row gap-5">
            <AnchorOption
              label="Ver detalle en AWX"
              target="_blank"
              href={(process.env.REACT_APP_AWX_URL_NEW + (routine.id_job_awx ?? '')) ?? `http://awx.cloud.canvia.com/#/jobs/playbook/${routine.id_job_awx ?? ''}`}
              loading={false}
              onClick={() => { }}
            />
            {(routine.rutinaria === "CSS-LINUX-PHOTO-POS" && routine.fecha_fin) &&
              <AnchorOption
                label="Calcular diferencia PRE-POST"
                href="#prepost"
                loading={getLogsPrePostLinuxLoading}
                onClick={handlePrePostDiff}
              />
            }
            {(routine.rutinaria === "CSS-LINUX-SEARCH" && routine.fecha_fin) &&
              <AnchorOption
                label="Descargar File de Busqueda"
                href="#resultSearch"
                loading={getResultSearchLinuxLoading}
                onClick={handleLoadResultsSearch}
              />
            }
          </div>
          <div>
            {routinesToViewFullLog.includes(routine.rutinaria)
              ?
              <div
                dangerouslySetInnerHTML={{ __html: purifiedHtml }}
                style={{
                  whiteSpace: 'pre-wrap',
                  margin: 0,
                  padding: '20px',
                  backgroundColor: 'black',
                  color: 'whote'
                }}
              />
              :
              routine.resultado
            }
            <p className="text-center text-dark">{getLogsAwxV2Loading && "Solicitando información..."}</p>
            {(routine.rutinaria === "CSS-LINUX-PHOTO-POS" && routine.fecha_fin) &&
              <ReactDiffViewer
                leftTitle='PHOTO PRE'
                rightTitle='PHOTO POST'
                oldValue={logs.photo_pre ?? ''}
                newValue={logs.photo_pos ?? ''}
                splitView={true}
              />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export { RoutineAWX }

const routinesToViewFullLog = ['CSS-LINUX-PATCH', 'CSS-LINUX-SEARCH']

type PropsAnchor = { loading: boolean, onClick: Function, label: string, href?: string, target?: string }
const AnchorOption: FC<PropsAnchor> = ({ loading, label, onClick, href, target = '' }) => {
  return (
    <a
      onClick={() => onClick()}
      href={href}
      target={target}
      rel="noreferrer"
      className="text-right"
      style={{ pointerEvents: loading ? 'none' : 'auto' }}
    >
      {loading ? 'Procesando...' : label}
    </a>
  )
}
