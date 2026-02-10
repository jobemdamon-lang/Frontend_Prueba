import { FC, useEffect } from "react"
import { CreateGroup } from "./CreateGroup"
import { AssignServerToGroup } from "./AssignServerToGroup"
import { UpdateGroup } from "./UpdateGroup"
import { useWindowsPatchContext } from "../../Context"
import { OPERATE_SYSTEMS } from "../../../Types"

type Props = { OPERATE_SYSTEM_ENV: OPERATE_SYSTEMS }

const GroupConfiguration: FC<Props> = ({ OPERATE_SYSTEM_ENV }) => {

    const { serverHook, selectedOwners } = useWindowsPatchContext()

    useEffect(() => {
        serverHook.getListOfServersUnified(selectedOwners.cliente, 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className='accordion' id='kt_accordion_1'>
            <div className='accordion-item'>
                <h2 className='accordion-header' id='kt_accordion_1_header_cg'>
                    <button
                        className='accordion-button fs-4 fw-bold collapsed'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#kt_accordion_1_body_cg'
                        aria-expanded='false'
                        aria-controls='kt_accordion_1_body_cg'
                    >
                        <p className="fw-normal p-0 m-0 text-uppercase">Crear un nuevo Grupo</p>
                    </button>
                </h2>
                <div
                    id='kt_accordion_1_body_cg'
                    className='accordion-collapse collapse'
                    aria-labelledby='kt_accordion_1_header_cg'
                    data-bs-parent='#kt_accordion_1'
                >
                    <div className='accordion-body'>
                        <CreateGroup OPERATE_SYSTEM_ENV={OPERATE_SYSTEM_ENV} />
                    </div>
                </div>
            </div>
            <div className='accordion-item'>
                <h2 className='accordion-header' id='kt_accordion_1_header_as'>
                    <button
                        className='accordion-button fs-4 fw-bold collapsed'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#kt_accordion_1_body_as'
                        aria-expanded='false'
                        aria-controls='kt_accordion_1_body_as'
                    >
                        <p className="fw-normal p-0 m-0 text-uppercase">Asignar Servidores a un Grupo</p>
                    </button>
                </h2>
                <div
                    id='kt_accordion_1_body_as'
                    className='accordion-collapse collapse'
                    aria-labelledby='kt_accordion_1_header_as'
                    data-bs-parent='#kt_accordion_1'
                >
                    <div className='accordion-body'>
                        <AssignServerToGroup OPERATE_SYSTEM_ENV={OPERATE_SYSTEM_ENV} />
                    </div>
                </div>
            </div>
            <div className='accordion-item'>
                <h2 className='accordion-header' id='kt_accordion_1_header_ag'>
                    <button
                        className='accordion-button fs-4 fw-bold collapsed'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#kt_accordion_1_body_ag'
                        aria-expanded='false'
                        aria-controls='kt_accordion_1_body_ag'
                    >
                        <p className="fw-normal p-0 m-0 text-uppercase">Actualizar Grupo</p>
                    </button>
                </h2>
                <div
                    id='kt_accordion_1_body_ag'
                    className='accordion-collapse collapse'
                    aria-labelledby='kt_accordion_1_header_ag'
                    data-bs-parent='#kt_accordion_1'
                >
                    <div className='accordion-body'>
                        <UpdateGroup OPERATE_SYSTEM_ENV={OPERATE_SYSTEM_ENV} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export { GroupConfiguration }

