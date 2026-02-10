import { FC } from "react"
import { IGroupsWithServersLinuxFront, IServerInGroupLinux } from "../../../Types"
import { downloadTXTFile } from "../../../../../helpers/general"
import { useServer } from "../../../hooks/useServer"
import { ToolTip } from "../../../../../components/tooltip/ToolTip"
import { Loader } from "../../../../../components/Loading"

type Props = { groupsWithServer: IGroupsWithServersLinuxFront[] }

const ListPatches: FC<Props> = ({ groupsWithServer }) => {

    return (
        <section>
            <ul className="list-group">
                {groupsWithServer.filter(group => group.CHECK).flatMap(group => group.SERVIDORES).map(server => {
                    return (
                        <LinkDownloadFile
                            key={server.ID_EQUIPO}
                            server={server}
                        />
                    )
                })}
            </ul>
            {groupsWithServer.filter(group => group.CHECK).length === 0 &&
                <div className="d-flex justify-content-center align-item-center text-muted pt-15">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20" height="20"
                        fill="currentColor"
                        className="bi bi-info-square"
                        viewBox="0 0 16 16"
                    >
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                    </svg>
                    &nbsp;
                    <h4 className="fs-5 fw-normal text-muted"> Seleccione un grupo para ver los parches disponibles en sus servidores.</h4>
                </div>
            }
        </section>

    )
}

export { ListPatches }

const LinkDownloadFile: FC<{ server: IServerInGroupLinux }> = ({ server }) => {

    const { getResultSearchLinux, getResultSearchLinuxLoading } = useServer()

    const handleLoadResultsSearch = (server: IServerInGroupLinux) => {
        getResultSearchLinux({
            id_ejecucion_detalle: 0,
            id_servidor: server.ID_EQUIPO
        }).then(result => {
            if (result) {
                downloadTXTFile({
                    filename: `${server.NOMBRE_CI + " | " + server.NRO_IP}.txt`,
                    content: result[0]?.RESULTADO_BUSQUEDA ?? 'No se han encontrado resultados.'
                })
            }
        })
    }

    return (
        <li
            key={server.ID_EQUIPO}
            className="list-group-item"
        >
            <div className="d-flex justify-content-between align-item-center">
                <span className="fs-5 pt-2" style={{ color: '#4a4e69' }}>
                    {server.NOMBRE_CI + " ➤ " + server.NRO_IP + " ➤ " + server.TIPO_IP}
                </span>
                <ToolTip
                    message='Descargar File de resultados de la última busqueda de parches.'
                    placement='top'
                >
                    <button
                        disabled={getResultSearchLinuxLoading}
                        onClick={() => handleLoadResultsSearch(server)}
                        className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                    >
                        {getResultSearchLinuxLoading ?
                            <Loader />
                            :
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="25"
                                fill="currentColor"
                                className="bi bi-file-earmark-arrow-down"
                                viewBox="0 0 16 16"
                            >
                                <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                            </svg>
                        }
                    </button>
                </ToolTip>
            </div>
        </li>
    )
}
