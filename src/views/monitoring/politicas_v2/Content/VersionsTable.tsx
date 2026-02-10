import { useMemo, useState } from "react"
import { TableSkeleton } from "../../../../components/datatable/TableSkeleton"
import { usePagination } from "../../../../hooks/usePagination"
import { Pagination } from "../../../../components/datatable/Pagination"
import { useMonitoringPoliciesContext } from "../Context"
import { ModalViewForMonitoringPolicies, Version } from "../Types"
import { ModalSize } from "../../../../hooks/Types"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { ToolTip } from "../../../../components/tooltip/ToolTip"
import { AnalyticsService } from "../../../../helpers/analytics"

const styleColumn = "text-gray-800 fw-normal text-hover-primary fs-6"

export const VersionsTable = () => {

    const { policyHook } = useMonitoringPoliciesContext()

    const filteredPolicies = useMemo(() => {
        return policyHook.versions.filter(request => {
            return request.ESTADO_POLITICA.toLowerCase() !== 'cancelado'
        }).sort((a, b) => b.ID_VERSION - a.ID_VERSION)
    }, [policyHook.versions])

    const {
        currentPage,
        itemsPerPage,
        currentItems,
        totalPages,
        setCurrentPage,
        setItemsPerPage,
    } = usePagination({
        data: filteredPolicies,
        initialPage: 1,
        initialItemsPerPage: 10,
    })

    const latestVersionId = filteredPolicies.length > 0 ? filteredPolicies[0].ID_VERSION : null;

    return (
        <>
            {/* Table */}
            <div className="table-responsive mx-5">
                <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                    <thead>
                        <tr className="fw-bold text-muted fs-6">
                            <th className="w-auto">Version</th>
                            <th className="w-auto">Nombre</th>
                            <th className="w-auto">Estado Versión</th>
                            <th className="w-auto">Ticket de Atención</th>
                            <th className="w-auto">Ticket Origen</th>
                            <th className="w-auto text-end">Datos Solicitud</th>
                            <th className="w-auto text-end">Datos Implementación</th>
                            <th className="w-auto text-end">Detalle</th>
                        </tr>
                    </thead>
                    <tbody className={policyHook.versionsLoading ? 'placeholder-glow' : ''}>
                        {policyHook.versionsLoading ?
                            <TableSkeleton size={10} columns={8} />
                            :
                            currentItems.length > 0 ? (
                                currentItems.map(request => (
                                    <tr key={request.ID_VERSION}>
                                        <td>
                                            <span className="badge badge-primary fs-5">
                                                {request.NRO_VERSION}
                                            </span>
                                        </td>
                                        <td>
                                            <div
                                                className="text-gray-800 fw-bold text-hover-primary fs-6"
                                            >
                                                {request.NOMBRE}
                                            </div>
                                        </td>
                                        <td>
                                            <div
                                                className={styleColumn}
                                            >
                                                <span className={`fs-7 badge badge-light-${request.ESTADO_POLITICA === "IMPLEMENTADO" ? "primary" : request.ESTADO_POLITICA === "POR IMPLEMENTAR" ? "info" : request.ESTADO_POLITICA === "CANCELADO" ? "danger" : "success"}`}>{request.ESTADO_POLITICA}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styleColumn}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <KTSVG
                                                        path="/media/icons/duotune/communication/com009.svg"
                                                        className="svg-icon-1 me-2"
                                                    />
                                                    {request.NRO_TICKET ? (() => {
                                                        const tickets = request.NRO_TICKET.split('|');
                                                        const firstTicket = tickets[0];
                                                        const extraCount = tickets.length - 1;

                                                        return (
                                                            <>
                                                                <span>{firstTicket}</span>
                                                                {extraCount > 0 && (
                                                                    <ToolTip placement="top-end" message={tickets.map(ticket => ticket).join(' » ')}>

                                                                        <span className="badge badge-light-primary fw-bold fs-7">
                                                                            +{extraCount}
                                                                        </span>
                                                                    </ToolTip>

                                                                )}
                                                            </>
                                                        );
                                                    })() : <span>Sin registro</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styleColumn}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <KTSVG
                                                        path="/media/icons/duotune/communication/com009.svg"
                                                        className="svg-icon-1 me-2"
                                                    />
                                                    {request.TICKET_ORIGEN ? (() => {
                                                        const tickets = request.TICKET_ORIGEN.split(',');
                                                        const firstTicket = tickets[0];
                                                        const extraCount = tickets.length - 1;

                                                        return (
                                                            <>
                                                                <span>{firstTicket}</span>
                                                                {extraCount > 0 && (
                                                                    <ToolTip placement="top-end" message={tickets.map(ticket => ticket).join(' » ')}>

                                                                        <span className="badge badge-light-primary fw-bold fs-7">
                                                                            +{extraCount}
                                                                        </span>
                                                                    </ToolTip>

                                                                )}
                                                            </>
                                                        );
                                                    })() : <span>Sin registro</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-end">
                                            <div
                                                className={styleColumn}
                                            >
                                                <div
                                                    className="fw-bold"
                                                >
                                                    {request.FECHA_CREACION}
                                                </div>
                                                <span className="text-muted fw-semibold">
                                                    {request.SOLICITANTE}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-end">
                                            <div
                                                className={styleColumn}
                                            >
                                                <div
                                                    className="fw-bold"
                                                >
                                                    {request.FECHA_VERSION}
                                                </div>
                                                <span className="text-muted fw-semibold">
                                                    {request.USUARIO_IMPLEMENTADOR ?? 'Sin registro.'}
                                                </span>
                                            </div>
                                        </td>
                                        <div className="d-flex gap-2 justify-content-end">
                                            <ActionButton request={request} latestVersionId={latestVersionId} />
                                        </div>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center py-10 fs-6 text-gray-600">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="text-center py-10">
                                                    <div className="mb-5">
                                                        <i className="bi bi-inbox text-gray-400 fs-5x"></i>
                                                    </div>
                                                    <h3 className="fw-bold text-gray-800 mb-2">No se encontraron resultados</h3>
                                                    <p className="text-muted fs-4 mb-5">
                                                        No hay versiones de la política registradas.
                                                        <br />
                                                        Seleccione un cliente y proyecto para mostrar sus versiones.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
            />
        </>
    )
}

const ActionButton = ({ request, latestVersionId }: { request: Version, latestVersionId: number | null }) => {

    const { modalHook, versionHook } = useMonitoringPoliciesContext()
    const [loading, setLoading] = useState(false)

    const onDetailView = (request: Version) => {
        AnalyticsService.event("view_detail_policy", {
            module: "politicas_monitoreo_v2",
            metadata: { nombre_politica: request.NOMBRE }
        })
        if (request.flag_nuevo) {
            handleViewDetail(request)
        } else {
            handleViewDetailOld(request)
        }
    }

    const handleViewDetail = async (request: Version) => {
        try {
            setLoading(true)
            const response = await versionHook.getMetricsVersion(request.ID_POLITICA, request.ID_VERSION)
            if (response) {
                modalHook.openModal(
                    ModalViewForMonitoringPolicies.DETAIL_VERSION,
                    ModalSize.LG,
                    true,
                    { metrics: response, version: request, isCurrentVersion: request.ID_VERSION === latestVersionId }
                )
            }
        } finally {
            setLoading(false)
        }
    }

    const handleViewDetailOld = (request: Version) => {
        modalHook.openModal(
            ModalViewForMonitoringPolicies.DETAIL_VERSION_OLD,
            ModalSize.LG,
            true,
            { version: request }
        )
    }

    return (
        <div className="d-flex gap-2 justify-content-end">
            <button
                className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                onClick={() => onDetailView(request)}
                disabled={loading}
            >
                {loading ? (
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                ) : (
                    <i className="bi bi-info-square fs-2"></i>
                )}
            </button>
        </div>

    )
}