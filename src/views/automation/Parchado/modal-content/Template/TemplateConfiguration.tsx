import { FC } from "react"
import { OPERATE_SYSTEMS } from "../../../Types"
import { CreateTemplate } from "./CreateTemplate"
import { UpdateTemplate } from "./UpdateTemplate"

type Props = { OPERATE_SYSTEM_ENV: OPERATE_SYSTEMS }
const TemplateConfiguration: FC<Props> = ({ OPERATE_SYSTEM_ENV }) => {

    return (
        <div className='accordion' id='kt_accordion_1'>
            <div className='accordion-item'>
                <h2 className='accordion-header' id='kt_accordion_1_header_ct'>
                    <button
                        className='accordion-button fs-4 fw-bold collapsed'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#kt_accordion_1_body_ct'
                        aria-expanded='false'
                        aria-controls='kt_accordion_1_body_ct'
                    >
                        <p className="fw-normal p-0 m-0 text-uppercase"> Crear Plantilla de Ejecución</p>
                    </button>
                </h2>
                <div
                    id='kt_accordion_1_body_ct'
                    className='accordion-collapse collapse'
                    aria-labelledby='kt_accordion_1_header_ct'
                    data-bs-parent='#kt_accordion_1'
                >
                    <div className='accordion-body'>
                        <CreateTemplate OPERATE_SYSTEM_ENV={OPERATE_SYSTEM_ENV} />
                    </div>
                </div>
            </div>
            <div className='accordion-item'>
                <h2 className='accordion-header' id='kt_accordion_1_header_ut'>
                    <button
                        className='accordion-button fs-4 fw-bold collapsed'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#kt_accordion_1_body_ut'
                        aria-expanded='false'
                        aria-controls='kt_accordion_1_body_ut'
                    >
                        <p className="fw-normal p-0 m-0 text-uppercase">Modificar Plantilla de Ejecución</p>

                    </button>
                </h2>
                <div
                    id='kt_accordion_1_body_ut'
                    className='accordion-collapse collapse'
                    aria-labelledby='kt_accordion_1_header_ut'
                    data-bs-parent='#kt_accordion_1'
                >
                    <div className='accordion-body'>
                        <UpdateTemplate />
                    </div>
                </div>
            </div>
        </div>
    )
}
export { TemplateConfiguration }
