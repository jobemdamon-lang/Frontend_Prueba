import { FC } from 'react';
import { useBackupsPoliciesContext } from '../Context';
import { KTSVG } from "../../../../helpers";
import { useExport } from '../hooks/useExport';

export const ExportPolicy: FC = () => {
    const {modalHook} = useBackupsPoliciesContext();
    const { getExportPolicy, loadingExport } = useExport();

    const policy = modalHook.modalInformation?.policy;

    const handleDownload = () => {
        if (policy) {
            getExportPolicy(policy.id_politica, policy.nro_version);
        }
    };

    return (
        <>
            <div className='modal-header py-3'>
                <h2 className="text-dark">Exportar Política</h2>
                <div 
                    className='btn btn-sm btn-icon btn-active-color-primary'
                    onClick={() => modalHook.closeModal()}
                >
                    <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                </div>
            </div>
            <div className="modal-body">
                <div className="alert alert-info d-flex align-items-start">
                    <i className="bi bi-info-circle fs-2 me-3"></i>
                    <div>
                        Se descargará la <strong>última versión aprobada</strong> de la política de backup seleccionada.<br />
                    </div>
                </div>
            </div>
            <div className='modal-footer border-0'>
                <button
                    type="button"
                    className="btn btn-danger me-3"
                    onClick={() => modalHook.closeModal()}
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleDownload}
                    disabled={loadingExport}
                >
                    {loadingExport ? "Descargando..." : "Descargar"}
                </button>
            </div>
        </>
    );
};