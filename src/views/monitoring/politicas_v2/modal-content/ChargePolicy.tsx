import { KTSVG } from "../../../../helpers/components/KTSVG";
import { useMonitoringPoliciesContext } from "../Context";
import { useState } from "react";
import { useChange } from "../hooks/useChange";
import { useTypedSelector } from "../../../../store/ConfigStore";

const ChargePolicy = () => {
    const { modalHook, globalParams, policyHook, changesHook } = useMonitoringPoliciesContext()
    const { importPolicy, importPolicyLoading } = useChange();
    const userName = useTypedSelector(({ auth }) => auth.usuario)

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [reason, setReason] = useState<string>('');
    const [ticket, setTicket] = useState<string>('');

    const validateTicketFormat = (ticket: string) => {
        const ticketPattern = /^\d{3}-\d+$/;
        return ticketPattern.test(ticket);
    }

    const isValid = selectedFile && reason.trim() && ticket.trim() && validateTicketFormat(ticket);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleSubmit = async () => {
        if (!isValid || !selectedFile) {
            alert('Por favor complete todos los campos');
            return;
        }

        const formData = new FormData();
        formData.append('xls_file', selectedFile);
        formData.append('motivo', reason);
        formData.append('nro_ticket', ticket);
        

        console.log('FormData para cargar política:', {
            file: selectedFile.name,
            ticket: ticket.trim(),
            reason: reason.trim()
        });

        const success = await importPolicy(globalParams.policyID.toString(), userName, formData);
        
        if (success) {
            policyHook.getVersionsByProject(globalParams.projectID);
            changesHook.getListChanges(globalParams.projectID);
            setTimeout(() => {
                modalHook.closeModal();
            }, 500);
        }
    }

    return (
        <>
            <div className='modal-header py-3'>
                <h2 className="text-dark fw-bold">
                    <i className="bi bi-cloud-upload text-primary me-3"></i>
                    Cargar Política
                </h2>
                <div
                    className='btn btn-sm btn-icon btn-active-color-primary'
                    onClick={() => modalHook.closeModal()}
                >
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>

            <div className="modal-body py-8 px-9">
                <div className="text-center mb-8">
                    <div className="symbol symbol-circle symbol-100px bg-light-primary mb-4 mx-auto">
                        <i className="bi bi-file-earmark-spreadsheet text-primary fs-2x"></i>
                    </div>
                    <h5 className="fw-bold text-dark mb-2">Importar archivo de políticas</h5>
                    <p className="text-muted">
                        Seleccione un archivo Excel o CSV con las políticas que desea importar
                    </p>
                </div>

                <div className="mb-6">
                    <input 
                        id="policy-file"
                        type="file" 
                        className="form-control form-control-lg form-control-solid" 
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileChange}
                        required={true}
                    />
                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <span className="text-muted fs-7">
                            <i className="bi bi-info-circle me-1"></i>
                            XLSX, XLS, CSV
                        </span>
                        <span className="text-muted fs-7">Máx. 10MB</span>
                    </div>
                </div>

                <div>
                    <div className="row mb-5">
                        <div className="col-md-7">
                            <label htmlFor="reason" className="form-label fw-bold">Motivo del Cambio</label>
                            <div className="input-group input-group-sm">
                                <span className="input-group-text">
                                    <i className="bi bi-chat-square-text"></i>
                                </span>
                                <input
                                    type="text"
                                    id="reason"
                                    className="form-control"
                                    placeholder="Ingrese el motivo"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    required={true}
                                />
                            </div>
                        </div>
                        <div className="col-md-5">
                            <label htmlFor="ticket_reason" className="form-label fw-bold">Ticket</label>
                            <div className="input-group input-group-sm">
                                <span className="input-group-text">
                                    <i className="bi bi-ticket"></i>
                                </span>
                                <input
                                    type="text"
                                    id="ticket_reason"
                                    className="form-control"
                                    placeholder="Nro de ticket"
                                    value={ticket}
                                    onChange={(e) => setTicket(e.target.value)}
                                    required={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="notice d-flex bg-light-warning rounded border-warning border border-dashed p-4">
                    <i className="bi bi-exclamation-triangle text-warning fs-2 me-4"></i>
                    <div className="d-flex flex-column">
                        <h6 className="mb-1 text-dark">Importante</h6>
                        <span className="text-muted fs-7">
                            Asegúrese de que el archivo subido sea el correcto, tenga el formato adecuado y que no exceda las 2500 filas.
                            Recuerde que el ticket debe ser uno válido.
                        </span>
                    </div>
                </div>
            </div>

            <div className="modal-footer pt-0">
                <button
                    type="button"
                    className="btn btn-primary btn-lg me-3"
                    onClick={handleSubmit}
                    disabled={!isValid || importPolicyLoading}
                >
                    {importPolicyLoading ? (
                        <>
                            <div className="spinner-border spinner-border-sm me-2" role="status" />
                            Cargando...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-upload me-2"></i>
                            Cargar Archivo
                        </>
                    )}
                </button>
                <button
                    type="button"
                    className="btn btn-danger btn-lg"
                    onClick={() => modalHook.closeModal()}
                >
                    Cancelar
                </button>
            </div>
        </>
    );
}

export { ChargePolicy }