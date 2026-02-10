import { useEffect } from "react"
import { useLinuxPatchContext } from "../../Context"
import { AssignCredential } from "./AssignCredential"
import { UpdateServerCredential } from "./UpdateServerCredential"

const AssignCredentialMain = () => {

    const { selectedOwners, credentialHook } = useLinuxPatchContext()

    useEffect(() => {
        credentialHook.getServersWithoutCredential({
            cliente: selectedOwners.cliente,
            flag_credencial: 0,
            id_credencial: 0,
            id_proyecto: selectedOwners.id_proyecto
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className='accordion' id='kt_accordion_1'>
            <div className='accordion-item'>
                <h2 className='accordion-header' id='kt_accordion_1_header_anc'>
                    <button
                        className='accordion-button fs-4 fw-bold collapsed'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#kt_accordion_1_body_anc'
                        aria-expanded='false'
                        aria-controls='kt_accordion_1_body_anc'
                    >
                        <p className="fw-normal p-0 m-0 text-uppercase">Asignar Servidores a una Credencial</p>
                    </button>
                </h2>
                <div
                    id='kt_accordion_1_body_anc'
                    className='accordion-collapse collapse'
                    aria-labelledby='kt_accordion_1_header_anc'
                    data-bs-parent='#kt_accordion_1'
                >
                    <div className='accordion-body'>
                        <AssignCredential />
                    </div>
                </div>
            </div>
            <div className='accordion-item'>
                <h2 className='accordion-header' id='kt_accordion_1_header_usc'>
                    <button
                        className='accordion-button fs-4 fw-bold collapsed'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#kt_accordion_1_body_usc'
                        aria-expanded='false'
                        aria-controls='kt_accordion_1_body_usc'
                    >
                        <p className="fw-normal p-0 m-0 text-uppercase">Actualizar Asignación de Credenciales</p>
                    </button>
                </h2>
                <div
                    id='kt_accordion_1_body_usc'
                    className='accordion-collapse collapse'
                    aria-labelledby='kt_accordion_1_header_usc'
                    data-bs-parent='#kt_accordion_1'
                >
                    <div className='accordion-body'>
                        <UpdateServerCredential />
                    </div>
                </div>
            </div>
        </div>
    )
}

export { AssignCredentialMain }