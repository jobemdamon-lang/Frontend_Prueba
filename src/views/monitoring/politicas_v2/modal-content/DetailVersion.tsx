import { useState, useEffect } from "react";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { useMonitoringPoliciesContext } from "../Context";
import { MetricVersion, Version } from "../Types";
import { MetricTable } from "./DVMetricTable"
import { ServerList } from "./DVServerList"
import { ChangesTable } from "./DVChangesTable";

type DetailVersionModalProps = {
    metrics: MetricVersion[];
    version: Version
}

export const DetailVersion = () => {

    const { modalHook, changesHook } = useMonitoringPoliciesContext()
    const { metrics, version }: DetailVersionModalProps = modalHook.modalInformation
    const [activeTab, setActiveTab] = useState<'metric_list' | 'inventory' | 'history'>('metric_list')

    useEffect(() => {
        changesHook.getChangeByVersion(version.ID_VERSION)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [version.ID_VERSION])

    return (
        <>
            <div className='modal-header py-4 bg-dark'>
                <h2 className="text-light fs-2">DETALLE DE LA VERSION</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className="modal-body">
                <ul className="nav nav-tabs nav-line-tabs mb-5 fs-2">
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === 'metric_list' ? 'active text-primary' : ''}`}
                            onClick={() => setActiveTab('metric_list')}
                            data-bs-toggle="tab"
                            href="#metric_list"
                        >
                            <span className="nav-icon">
                                <KTSVG path="/media/icons/duotune/general/gen021.svg" className="svg-icon-1" />
                            </span>
                            <span className="nav-text"> Detalle de Versión</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === 'inventory' ? 'active text-primary' : ''}`}
                            onClick={() => setActiveTab('inventory')}
                            data-bs-toggle="tab"
                            href="#inventory"
                        >
                            <span className="nav-icon">
                                <KTSVG path="/media/icons/duotune/general/gen017.svg" className="svg-icon-1" />
                            </span>
                            <span className="nav-text"> Inventario</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === 'history' ? 'active text-primary' : ''}`}
                            onClick={() => setActiveTab('history')}
                            data-bs-toggle="tab"
                            href="#history"
                        >
                            <span className="nav-icon">
                                <KTSVG path="/media/icons/duotune/general/gen023.svg" className="svg-icon-1" />
                            </span>
                            <span className="nav-text"> Cambios Realizados</span>
                        </a>
                    </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade active show" id="metric_list" role="tabpanel">
                        <MetricTable 
                            metricsInformation={metrics}
                            idPolicy={version.ID_POLITICA}
                            isCurrentVersion = {modalHook.modalInformation.isCurrentVersion}
                        />
                    </div>
                    <div className="tab-pane fade" id="inventory" role="tabpanel">
                        <ServerList metricsInformation={metrics} />
                    </div>
                    <div className="tab-pane fade" id="history" role="tabpanel">
                        <ChangesTable metrics={changesHook.changesOfVersion} loading={changesHook.changeOfVersionLoading} />
                    </div>
                </div>
            </div>
        </>
    );
}
