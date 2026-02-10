import { FC } from "react"
import { ICrq, IServerInformation } from "../../../Types"
import uniqid from "uniqid"

type Props = {
    getServersInfoLoading: boolean,
    serverInformationData: IServerInformation,
}

const CRQsAssociated: FC<Props> = ({ getServersInfoLoading, serverInformationData }) => {
    return (
        <article className=" d-flex flex-column gap-5 flex-grow-1 shadow-sm p-10 bg-body rounded">
            <h3 className="mb-5 text-center">TICKETS ASOCIADOS</h3>
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