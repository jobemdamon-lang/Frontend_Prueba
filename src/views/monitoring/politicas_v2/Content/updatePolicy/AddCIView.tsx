import { FC, useState } from "react"
import { useMonitoringPoliciesContext } from "../../Context"
import { ModalViewForMonitoringPolicies } from "../../Types"
import { ModalSize } from "../../../../../hooks/Types"
import { ViewProps } from "./UpdateMain"

export const AddCIView: FC<ViewProps> = ({ updates, setUpdates, setActiveView }) => {

    const { modalHook, versionHook } = useMonitoringPoliciesContext()
    const [searchParam, setSearchParam] = useState("")

    const filteredCIs = versionHook.cisInVersion.filter(
        (ci) => ci.NOMBRE_CI?.toLowerCase()?.includes(searchParam.toLowerCase()) || ci.IP?.includes(searchParam),
    )

    return (
        <div className="d-flex flex-column ps-4">

            <div className="fw-bold fs-5 mb-4">CIs No Monitoreados</div>
            {/* Filter by CI Name */}
            <div className="w-full d-flex gap-3">
                <div className="input-group input-group-sm">
                    <span className="input-group-text" id="basic-addon1">
                        <i className="bi bi-search"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por nombre o IP"
                        value={searchParam}
                        onChange={(e) => setSearchParam(e.target.value)}
                    />
                </div>
            </div>
            {versionHook.cisInVersionLoading ? (
                <div className="row mt-5 gap-3 d-flex justify-content-around">
                    {[...Array(15)].map((_, index) => (
                        <SkeletonCIItem key={index} />
                    ))}
                </div>
            ) : (
                <div className="row mt-5 gap-3 d-flex justify-content-around">
                    {filteredCIs.length > 0 ? (
                        filteredCIs.map((ci) => (
                            <div
                                key={ci.ID_EQUIPO}
                                style={{ cursor: "pointer" }}
                                className="col-12 col-md-4 col-lg-3 col-xl-2 d-flex align-items-center justify-content-between py-5 ps-5 pointer rounded border border-dashed border-primary"
                                onClick={() => modalHook.openModal(
                                    ModalViewForMonitoringPolicies.ADD_CI_METRICS,
                                    ModalSize.LG,
                                    undefined,
                                    { ci: ci, setUpdates: setUpdates, setActiveView: setActiveView }
                                )}
                            >
                                <div className="menu-content ps-0">
                                    <span className="menu-title fw-bold">{ci.NOMBRE_CI}</span>
                                    <span className="text-muted fs-7 d-block">{ci.IP}</span>
                                    <span className="badge badge-light-primary fs-8 mt-1">{ci.FAMILIA} | {ci.CLASE}</span>
                                </div>
                                <div>
                                    <i className="bi bi-plus-circle fs-2 pe-5 text-primary"></i>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-5">
                            <span className="text-muted">No se encontraron resultados</span>
                        </div>
                    )}
                </div>)}
        </div>
    )
}

const SkeletonCIItem = () => {
    return (
        <div className="placeholder-wave col-12 col-md-4 col-lg-3 col-xl-2 d-flex align-items-center justify-content-between py-5 ps-5 rounded border border-dashed border-gray-300">
            <div className="w-100">
                <div className="placeholder bg-secondary rounded mb-2" style={{ width: '80%', height: '20px' }}></div>
                <div className="placeholder bg-secondary rounded mb-2" style={{ width: '60%', height: '16px' }}></div>
                <div className="placeholder bg-secondary rounded" style={{ width: '70%', height: '16px' }}></div>
            </div>
            <div className="placeholder bg-secondary rounded" style={{ width: '24px', height: '24px' }}></div>
        </div>
    );
};