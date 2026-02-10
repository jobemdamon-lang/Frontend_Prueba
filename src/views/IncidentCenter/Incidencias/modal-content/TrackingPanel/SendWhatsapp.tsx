//import { useState } from "react"
import { KTSVG } from "../../../../../helpers/components/KTSVG"
import "../../../../../assets/sass/components/incidentCenter-styles/messages.scss"
import { useIncidentContext } from "../../Context"
import { ITrackedTicketWithActions } from "../../../Types"
import "../../../../../assets/sass/components/InventoryFilter/data-list-input-styles.scss"
//import { TextInput } from "../../../../../components/Inputs/TextInput"
import { base64imgtoPng } from "../../../../../helpers/base64imgToPng"
import { canviaLogoBase64 } from './canviaLogoB64'
import { useState } from "react"
import { successNotification } from "../../../../../helpers/notifications"
//const html2canvas = require('html2canvas')
import html2canvas from 'html2canvas-pro';

const SendWhatsapp = () => {

    const { secondModalHook, useIncidentHook } = useIncidentContext()
    const modalInformation: ITrackedTicketWithActions = secondModalHook.modalInformation
    //const [number, setNumer] = useState('')
    //const [message, setMessage] = useState('')
    const [loadingSending, setLoadingSending] = useState(false)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoadingSending(true)
        const componentToCapture = document.getElementById('reporte-ejecutivo') as HTMLElement; // Reemplaza con el ID de tu componente
        html2canvas(componentToCapture).then((canvas: any) => {
            const imgData = canvas.toDataURL('image/png');
            let clipboardItems = base64imgtoPng(imgData)
            navigator.clipboard.write(clipboardItems)
                .then((res) => {
                    setLoadingSending(false)
                    successNotification("Imagen fue copiada al portapapeles")
                    /*let messageEncoded = encodeURIComponent(message)
                    setTimeout(() => {
                        window.open(`https://web.whatsapp.com/send?phone=51${number}&app_absent=1&send=1&text=${messageEncoded}`, '_blank')
                    }, 2500);*/
                })
                .catch((error) => {
                    setLoadingSending(false)
                    successNotification("Ocurrió un error al copiar la imagen al portapapeles. " + error)
                })
        });
    }

    return (
        <>
            <div className='modal-header py-4 bg-dark'>
                <h2 className="text-white">NOTIFICACIÓN - {modalInformation.NRO_TICKET}</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => secondModalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-lg-10 border rounded-bottom border-top-0 border-dark'>
                <div className="d-flex justify-content-center mb-5 gap-10">
                    <form className="d-flex justify-content-center gap-10 align-items-end" onSubmit={handleSubmit}>
                        {/*<TextInput label='Numero Destino' required={true} type="number" min={100000000} max={999999999} value={number} setNewValue={setNumer} />
                        <TextInput label='Mensaje' type="text" value={message} setNewValue={setMessage} />*/}
                        <button className="btn btn-success" type="submit" disabled={loadingSending}>{loadingSending ? "Copiando..." : "Copiar imagen al portapeles"}</button>
                    </form>
                    {/*<p className="text-center m-5"><i className="text-info fs-4">🛈 La imagen será copiada al portapeles</i></p>*/}
                    <button
                        className="btn btn-success"
                        type="button"
                        disabled={useIncidentHook.sendingWhatsAppLoading}
                        onClick={() => useIncidentHook.sendGroupWhatsApp(modalInformation.NRO_TICKET)}
                    >
                        {useIncidentHook.sendingWhatsAppLoading ? "Enviando..." : "Enviar a WhatsApp"}
                    </button>
                </div>
                <div className="d-flex justify-content-center" style={{ overflowY: "auto", maxHeight: '500px' }}>
                    {/*Se tenia planeado ocultar el componente table para mostrar la imagen, no es posible (aun), refact estilos en linea */}
                    <table id="reporte-ejecutivo">
                        <tr>
                            <th style={{ textAlign: 'center', border: '1px solid black' }}><img width={260} height={80} src={canviaLogoBase64} alt="Logo de Cambia" /></th>
                            <th style={{ textAlign: 'center', border: '1px solid black', padding: '0 15px' }}><h6>ACTIVIDADES REALIZADAS DEL INCIDENTE P1 EN CURSO</h6></th>
                        </tr>
                        <tr style={{ backgroundColor: 'rgb(227, 104, 27)', color: 'white' }}>
                            <th style={{ padding: '7px', border: '1px solid black' }}>Información del Cliente</th>
                            <th style={{ padding: '7px', border: '1px solid black' }}>Aprobación del Proyecto</th>
                        </tr>
                        <tr style={{ color: 'red' }}>
                            <th style={{ padding: '7px', border: '1px solid black' }}>Cliente</th>
                            <th style={{ padding: '7px', border: '1px solid black' }}>JP / JP</th>
                        </tr>
                        <tr>
                            <td style={{ padding: '7px', border: '1px solid black' }}>{modalInformation.CLIENTE}</td>
                            <td style={{ padding: '7px', border: '1px solid black' }}>{modalInformation.JP_GP}</td>
                        </tr>
                        <tr style={{ backgroundColor: 'rgb(227, 104, 27)', color: 'white' }}>
                            <th style={{ padding: '7px', border: '1px solid black' }}>Otros Clientes Afectado</th>
                            <th style={{ padding: '7px', border: '1px solid black' }}>Crisis Manager</th>
                        </tr>
                        <tr>
                            <td style={{ padding: '7px', border: '1px solid black' }}>{modalInformation.OTROS_CLIENTES_AFECTADOS}</td>
                            <td style={{ padding: '7px', border: '1px solid black' }}>{modalInformation.INCIDENT}</td>
                        </tr>
                        <tr style={{ backgroundColor: 'rgb(227, 104, 27)', color: 'white' }}>
                            <th style={{ padding: '7px', border: '1px solid black' }}>Impacto en el Cliente</th>
                            <th style={{ padding: '7px', border: '1px solid black' }}>Incidente</th>
                        </tr>
                        <tr style={{ color: 'red' }}>
                            <th style={{ padding: '7px', border: '1px solid black' }}>Servicio / Aplicativo Impactado</th>
                            <th style={{ padding: '7px', border: '1px solid black' }}>Nro. Ticket</th>
                        </tr>
                        <tr>
                            <td style={{ padding: '7px', border: '1px solid black' }}>{modalInformation.SERVIDOR}</td>
                            <td rowSpan={3} style={{ padding: '7px', border: '1px solid black' }}>{modalInformation.NRO_TICKET}</td>
                        </tr>
                        <tr style={{ color: 'red' }}>
                            <th style={{ padding: '7px', border: '1px solid black' }}>Parcial / Total</th>
                        </tr>
                        <tr >
                            <td style={{ padding: '7px', border: '1px solid black' }}>{modalInformation.PARCIAL_TOTAL}</td>
                        </tr>
                        <tr style={{ backgroundColor: 'rgb(227, 104, 27)', color: 'white' }}>
                            <th style={{ padding: '7px', border: '1px solid black' }}>Descripción</th>
                            <th style={{ padding: '7px', border: '1px solid black' }}>Estado</th>
                        </tr>
                        <tr >
                            <td style={{ padding: '7px', border: '1px solid black' }}>{modalInformation.DESCRIPCION}</td>
                            <td style={{ padding: '7px', border: '1px solid black' }}>{modalInformation.ESTADO_INCIDENTE}</td>
                        </tr>
                        <tr style={{ backgroundColor: 'rgb(227, 104, 27)', color: 'white' }}>
                            <th style={{ padding: '7px', border: '1px solid black' }}>Impacto en el Negocio y Posibles Consecuencias</th>
                            <th style={{ padding: '7px', border: '1px solid black' }}>Inicio de Indisponibilidad</th>
                        </tr>
                        <tr >
                            <td style={{ padding: '7px', border: '1px solid black' }}>{modalInformation.IMPACTO_NEGOCIO_POSIBLES_CONSECUENCIAS}</td>
                            <td style={{ padding: '7px', border: '1px solid black' }}>{modalInformation.INICIO_INDISPONIBILIDAD.toString()}</td>
                        </tr>
                        <tr style={{ backgroundColor: 'rgb(227, 104, 27)', color: 'white' }}>
                            <th style={{ padding: '7px', border: '1px solid black' }}>Perdida de SLA  y/o Penalidades</th>
                            <th style={{ padding: '7px', border: '1px solid black' }}>Inicio de Indisponibilidad</th>
                        </tr>
                        <tr >
                            <td style={{ padding: '7px', border: '1px solid black' }}>{modalInformation.PERDIDA_SLA_PENALIDADES}</td>
                            <td style={{ padding: '7px', border: '1px solid black' }}>{modalInformation.FIN_INDISPONIBILIDAD}</td>
                        </tr>
                        <tr style={{ backgroundColor: 'rgb(227, 104, 27)', color: 'white' }}>
                            <th colSpan={2} style={{ padding: '7px', border: '1px solid black' }}>Acciones Tomadas</th>
                        </tr>
                        <tr >
                            <td colSpan={2} style={{ padding: '7px', border: '1px solid black' }}><ul>
                            </ul>
                                {modalInformation?.lista_acciones
                                    .slice(-20)
                                    .map((accion, index) => (
                                        <li key={index} style={{ paddingLeft: '7px' }}>
                                            {accion.FECHA_REGISTRO} - {accion.USUARIO} - {accion.CONTENIDO}
                                        </li>
                                    ))}
                            </td>
                        </tr>
                        <tr style={{ backgroundColor: 'rgb(227, 104, 27)', color: 'white' }}>
                            <th colSpan={2} style={{ padding: '7px', border: '1px solid black' }}>Información Adicional</th>
                        </tr>
                        <tr >
                            <td colSpan={2} style={{ padding: '7px', border: '1px solid black' }}>{modalInformation.RESUMEN}</td>
                        </tr>
                        <tr style={{ backgroundColor: 'rgb(227, 104, 27)', color: 'white' }}>
                            <th style={{ padding: '7px', border: '1px solid black' }}>¿Alerta?</th>
                            <th style={{ padding: '7px', border: '1px solid black' }}>¿Por qué no?</th>
                        </tr>
                        <tr >
                            <td style={{ padding: '7px', border: '1px solid black' }}>{modalInformation.ALERTA}</td>
                            <td style={{ padding: '7px', border: '1px solid black' }}>{modalInformation.PORQUE_NO_SALIO_ALERTA}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </>
    )
}

export { SendWhatsapp }

