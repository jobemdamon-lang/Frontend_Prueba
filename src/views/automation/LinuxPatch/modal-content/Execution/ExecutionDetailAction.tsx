import { FC } from "react"
import { IDetailOfExecutionLinux } from "../../../Types"
import { useServer } from "../../../hooks/useServer"
import { Loader } from "../../../../../components/Loading"
import { ToolTip } from "../../../../../components/tooltip/ToolTip"
import { downloadTXTFile } from "../../../../../helpers/general"

type Props = { row: IDetailOfExecutionLinux }

const ExecutionDetailAction: FC<Props> = ({ row }) => {

    const { getLogsPrePostLinuxLoading, getPhotoPrePostByServerLinux, getResultSearchLinux, getResultSearchLinuxLoading } = useServer()

    const handleLoadResultsSearch = (row: IDetailOfExecutionLinux) => {
        getResultSearchLinux({
            id_ejecucion_detalle: row.ID_EJECUCION_DETALLE,
            id_servidor: 0
        }).then(result => {
            if (result) {
                downloadTXTFile({
                    filename: `ResultadoBusqueda_${row.NOMBRE_EQUIPO}.txt`,
                    content: result[0]?.RESULTADO_BUSQUEDA ?? 'No se han encontrado resultados.'
                })
            }
        })
    }
    const handlePrePost = (nroTicket: string | null, idServer: number, isPre: boolean) => {
        getPhotoPrePostByServerLinux(nroTicket ?? '', idServer).then(result => {
            if (result) {
                const content = isPre ? result.photo_pre : result.photo_pos
                downloadTXTFile({
                    filename: `FilePhoto.txt`,
                    content: content ?? 'No se han encontrado resultados.'
                })
            }
        })
    }

    const handleDownload = (row: IDetailOfExecutionLinux) => {
        if (row.NOMBRE_RUTINARIA === 'CSS-LINUX-PHOTO-PRE') {
            handlePrePost(row.CRQ, row.ID_EQUIPO, true)
        } else if (row.NOMBRE_RUTINARIA === 'CSS-LINUX-PHOTO-POS') {
            handlePrePost(row.CRQ, row.ID_EQUIPO, false)
        } else {
            handleLoadResultsSearch(row)
        }
    }

    return (
        <div className="d-flex justify-content-center">
            {routinesKeysOptions[row.NOMBRE_RUTINARIA as keyof typeof routinesKeysOptions] ?
                <ToolTip
                    message={routinesKeysOptions[row.NOMBRE_RUTINARIA as keyof typeof routinesKeysOptions]}
                    placement='top'
                >
                    <button
                        onClick={() => handleDownload(row)}
                        className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                    >
                        {getLogsPrePostLinuxLoading || getResultSearchLinuxLoading ?
                            <Loader />
                            :
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="25"
                                fill="currentColor"
                                className="bi bi-filetype-txt"
                                viewBox="0 0 16 16"
                            >
                                <path fillRule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-2v-1h2a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM1.928 15.849v-3.337h1.136v-.662H0v.662h1.134v3.337zm4.689-3.999h-.894L4.9 13.289h-.035l-.832-1.439h-.932l1.228 1.983-1.24 2.016h.862l.853-1.415h.035l.85 1.415h.907l-1.253-1.992zm1.93.662v3.337h-.794v-3.337H6.619v-.662h3.064v.662H8.546Z" />
                            </svg>
                        }
                    </button>
                </ToolTip>
                : 'No aplica'
            }
        </div>
    )
}
export { ExecutionDetailAction }

const routinesKeysOptions = {
    'CSS-LINUX-PHOTO-PRE': 'Descargar Photo PRE',
    'CSS-LINUX-PHOTO-POS': 'Descargar Photo POST',
    'CSS-LINUX-SEARCH': 'Descargar Parches Encontrados'
}



