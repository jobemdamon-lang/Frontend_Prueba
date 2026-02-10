import React from "react";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { useBackupsPoliciesContext } from "../Context";

export const SendRequestApproval = () => {
    const { modalHook } = useBackupsPoliciesContext();

    return (
        <>
            <div className="modal-header py-3">
                <h2 className="text-dark">Enviar Solicitud de Aprobación</h2>
                <div
                    className="btn btn-sm btn-icon btn-active-color-primary"
                    onClick={modalHook.closeModal}
                    title="Cerrar"
                >
                    <KTSVG className="svg-icon-1" path="/media/icons/duotune/arrows/arr061.svg" />
                </div>
            </div>

            <div className="modal-body">
                {/* Aquí puedes agregar contenido para la solicitud de aprobación */}
            </div>

            <div className="modal-footer">
                <button type="button" className="btn btn-light" onClick={modalHook.closeModal}>
                    Cancelar
                </button>
            </div>
        </>
    );
}