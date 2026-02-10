import { useEffect, useState } from "react";
import { MetricsTableView } from "./MetricsTableView";
import { AddMetricView } from "./AddMetricView";
import { AddCIView } from "./AddCIView";
import { ResumeView } from "./ResumeView";
import 'animate.css';
import { MetricVersionFront } from "../../Types";
import { useMonitoringPoliciesContext } from "../../Context";
import { AddCIMassiveView } from "./addCIMassiveView";

export type ViewProps = {
    updates: MetricVersionFront[];
    setUpdates: React.Dispatch<React.SetStateAction<MetricVersionFront[]>>;
    setActiveView: React.Dispatch<React.SetStateAction<"update" | "addm" | "addc" | "resume" | "addcm">>;
}

export const UpdateMain = () => {

    const { setCurrentView, versionHook, catalogHook, globalParams, changesHook } = useMonitoringPoliciesContext()
    const  {rol } = useMonitoringPoliciesContext()
    const [activeView, setActiveView] = useState<'update' | 'addm' | 'addc' | 'resume' | 'addcm'>("update");
    const [updates, setUpdates] = useState<MetricVersionFront[]>([])

    const viewContent: Record<string, JSX.Element> = {
        update: <MetricsTableView updates={updates} setUpdates={setUpdates} setActiveView={setActiveView} />,
        addm: <AddMetricView updates={updates} setUpdates={setUpdates} setActiveView={setActiveView} />,
        addc: <AddCIView updates={updates} setUpdates={setUpdates} setActiveView={setActiveView} />,
        addcm: <AddCIMassiveView updates={updates} setUpdates={setUpdates} setActiveView={setActiveView} />,
        resume: <ResumeView updates={updates} setUpdates={setUpdates} setActiveView={setActiveView} />
    }

    useEffect(() => {
        versionHook.getMetricsVersion(globalParams.policyID, globalParams.versionID)
        versionHook.getCIsInVersion(globalParams.policyID, globalParams.versionID, false)
        catalogHook.getTools()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="card mb-5 mb-xl-8 min-h-500px">
            <div className="card-header border-0 pt-5 d-flex flex-column">
                <h3 className="card-title align-items-start flex-column ">
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <button
                            type="button"
                            className="btn btn-light-primary btn-icon btn-sm"
                            onClick={() => setCurrentView('policies')}
                            disabled={changesHook.registerChangeLoading}
                        >
                            <i className="bi bi-arrow-left fs-1"></i>
                        </button>
                        <span className="card-label fw-bold fs-3">Actualización de Política</span>
                    </div>

                    <span className="text-muted mt-1 fw-semibold fs-7">
                        Gestionar la actualización, añadición o eliminación de las metricas de monitoreo.
                    </span>
                </h3>
                <div className="d-flex overflow-auto py-5">
                    <ul className="w-100 nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-7 fw-bolder">
                        <li
                            onClick={() => setActiveView("update")}
                            className="nav-item"
                            style={{ cursor: "pointer" }}
                        >
                            <span className={`nav-link text-active-primary me-6 ${activeView === 'update' ? 'active' : 'false'}`} >
                                Actualizar o eliminar metrica
                            </span>
                        </li>
                        <li
                            className="nav-item"
                            style={{ cursor: "pointer" }}
                            onClick={() => setActiveView("addm")}
                        >
                            <span className={`nav-link text-active-primary me-6 ${activeView === 'addm' ? 'active' : 'false'}`} >
                                Añadir nueva metrica
                            </span>
                        </li>
                        <li
                            className="nav-item"
                            style={{ cursor: "pointer" }}
                            onClick={() => setActiveView("addc")}
                        >
                            <span className={`nav-link text-active-primary me-6 ${activeView === 'addc' ? 'active' : 'false'}`} >
                                Añadir un nuevo CI
                            </span>
                        </li>
                        {(rol === "ejecutor")&& (
                            <li
                                className="nav-item"
                                style={{ cursor: "pointer" }}
                                onClick={() => setActiveView("addcm")}
                            >
                                <span className={`nav-link text-active-primary me-6 ${activeView === 'addcm' ? 'active' : 'false'}`} >
                                    Añadir CIs (Masivo)
                                </span>
                            </li>
                        )}
                        <li
                            className="nav-item animate__animated animate__pulse animate__infinite"
                            style={{ cursor: "pointer" }}
                            onClick={() => setActiveView("resume")}
                        >
                            <span style={{ animation: "ease-in" }} className={`nav-link text-active-primary me-6 ${activeView === 'resume' ? 'active' : 'false'}`} >
                                Resumen de cambios ({updates.length} cambios)
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="card-body py-3">
                {viewContent[activeView]}
            </div>
        </div>
    )
}