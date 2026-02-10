import React from "react";
import { useBackupsPoliciesContext } from "../Context";
import { KTSVG } from "../../../../helpers/components/KTSVG";

//Es basico, se debe modificar
interface Props {
    solicitudId?: number;
    onClose?: () => void;
}

export const CancelChangeRequest: React.FC<Props> = ({ solicitudId, onClose }) => {
    const { modalHook } = useBackupsPoliciesContext();

    const handleCancel = () => {
        console.log(`Cancelando solicitud #${solicitudId}`);
        modalHook.closeModal();
    };

    return (
        <>
            <div className='modal-header py-4 d-flex align-items-center justify-content-between'>
                <div className="d-flex align-items-center">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <span className="fw-bold fs-4">Cancelar Solicitud</span>
                </div>
                <div 
                    className='btn btn-sm btn-icon btn-active-color-primary' 
                    onClick={() => modalHook.closeModal()}
                >
                    <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                </div>
            </div>

            <div className='modal-body pt-2 px-lg-10'>
                <strong className="fs-5">¿Estás seguro de que deseas continuar?</strong>

                <div className="mb-5">
                    <p className="text-muted mb-2">Al cancelar esta solicitud:</p>
                    <ul className="text-muted">
                        <li>Los cambios pendientes no se aplicarán</li>
                        <li>La solicitud quedará marcada como cancelada</li>
                        <li>No podrás reactivar esta solicitud</li>
                    </ul>
                </div>

                <div className="alert alert-warning d-flex align-items-center mb-5" role="alert">
                    <i className="bi bi-info-circle-fill fs-2 me-3"></i>
                    <div>
                        Esta acción no se puede deshacer.
                    </div>
                </div>

                <div className="d-flex gap-3 justify-content-end mt-6">
                    <button 
                        className="btn btn-light"
                        onClick={onClose}
                    >
                        <i className="bi me-2"></i>
                        Cerrar
                    </button>
                    <button 
                        className="btn btn-danger"
                        onClick={handleCancel}
                    >
                        <i className="bi me-2"></i>
                        Cancelar
                    </button>
                </div>
            </div>
        </>
    );
};