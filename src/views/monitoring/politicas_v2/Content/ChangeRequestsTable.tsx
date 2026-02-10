import { TableSkeleton } from "../../../../components/datatable/TableSkeleton";
import { usePagination } from "../../../../hooks/usePagination";
import { Pagination } from "../../../../components/datatable/Pagination";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { useMonitoringPoliciesContext } from "../Context";
import { ChangeRequest, ModalViewForMonitoringPolicies } from "../Types";
import { ModalSize } from "../../../../hooks/Types";
import { AccessController } from "../../../../components/AccessControler";
import { AnalyticsService } from "../../../../helpers/analytics";
import { findLastImplementedVersion } from "../utils";

const styleColumn = "text-gray-800 fw-normal text-hover-primary fs-6";

export const ChangeRequestsTable = () => {

  const { modalHook, changesHook, rol, policyHook } = useMonitoringPoliciesContext()
  const filteredRequests = changesHook.changeRequests.sort((a, b) => b.ID_CAMBIO + a.ID_CAMBIO);

  const {
    currentPage,
    itemsPerPage,
    currentItems,
    totalPages,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({
    data: filteredRequests,
    initialPage: 1,
    initialItemsPerPage: 10,
  });

  const handleEdit = (change: ChangeRequest) => {
    const lastVersion = findLastImplementedVersion(policyHook.versions)
    AnalyticsService.event("view_detail_change", {
      module: "politicas_monitoreo_v2",
      metadata: { nombre_politica: lastVersion?.NOMBRE }
    })
    const request = changesHook.changeRequests.find(req => req.ID_CAMBIO === change.ID_CAMBIO)
    if (request) {
      modalHook.openModal(ModalViewForMonitoringPolicies.DETAIL_CHANGE, ModalSize.LG, true, change)
    }
  }

  const handleCancel = (change: ChangeRequest) => {
    const lastVersion = findLastImplementedVersion(policyHook.versions)
    AnalyticsService.event("cancel_change", {
      module: "politicas_monitoreo_v2",
      metadata: { nombre_politica: lastVersion?.NOMBRE }
    })
    const request = changesHook.changeRequests.find(req => req.ID_CAMBIO === change.ID_CAMBIO)
    if (request) {
      modalHook.openModal(ModalViewForMonitoringPolicies.CANCEL_CHANGE, ModalSize.LG, undefined, change)
    }
  }

  const handleImplement = (change: ChangeRequest) => {
    const lastVersion = findLastImplementedVersion(policyHook.versions)
    AnalyticsService.event("implement_change", {
      module: "politicas_monitoreo_v2",
      metadata: { nombre_politica: lastVersion?.NOMBRE }
    })
    const request = changesHook.changeRequests.find(req => req.ID_CAMBIO === change.ID_CAMBIO)
    if (request) {
      modalHook.openModal(ModalViewForMonitoringPolicies.IMPLEMENT_CHANGE, ModalSize.LG, undefined, change)
    }
  }

  return (
    <>
      {/* Table */}
      <div className="table-responsive mx-5">
        <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
          <thead>
            <tr className="fw-bold text-muted fs-6">
              <th className="w-auto">Nro° Cambio</th>
              <th className="w-auto">Estado</th>
              <th className="w-auto">Ticket de Atención</th>
              <th className="w-auto">Ticket Origen</th>
              <th className="w-auto">Motivo de cambio</th>
              <th className="w-auto">Usuario Solicitante</th>
              <th className="w-auto">Fecha Creación</th>
              <th className="w-auto text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {changesHook.changesLoading ? (
              <TableSkeleton size={10} columns={8} />
            ) : currentItems.length > 0 ? (
              currentItems.map((request) => {
                return (
                  <tr key={request.ID_CAMBIO}>
                    <td>
                      <div className="text-gray-700 fw-bold text-hover-primary fs-6">
                        # {request.ID_CAMBIO}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge badge-light-info fs-7`}
                      >
                        POR IMPLEMENTAR
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center justify-content-start">
                        <KTSVG
                          path="/media/icons/duotune/communication/com009.svg"
                          className="svg-icon-1 me-2"
                        />
                        <span className={styleColumn}>
                          {request.NRO_TICKET_IMPLEMENTACION}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center justify-content-start">
                        <KTSVG
                          path="/media/icons/duotune/communication/com009.svg"
                          className="svg-icon-1 me-2"
                        />
                        <span className={styleColumn}>
                          {request.NRO_TICKET}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center justify-content-start">
                        <KTSVG
                          path="/media/icons/duotune/communication/com003.svg"
                          className="svg-icon-1 me-2"
                        />
                        <span
                          className={`${styleColumn} mw-300px text-truncate d-inline-block`}
                          style={{ maxWidth: '350px', overflow: 'hidden', whiteSpace: 'nowrap' }}
                          title={request.MOTIVO}
                        >
                          {request.MOTIVO}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center justify-content-start">
                        <KTSVG
                          path="/media/icons/duotune/communication/com006.svg"
                          className="svg-icon-1 me-2"
                        />
                        <span className={styleColumn}>
                          {request.USUARIO_CREACION}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="d-flex align-items-center justify-content-start">
                        <KTSVG
                          path="/media/icons/duotune/general/gen014.svg"
                          className="svg-icon-2 me-2"
                        />
                        <span className={styleColumn}>
                          {request.FECHA_CREACION}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex justify-content-end">
                        {/* Botón Editar */}
                        <button
                          className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2"
                          onClick={() => handleEdit(request)}
                          title="Visualizar"
                        >
                          <KTSVG
                            path="/media/icons/duotune/general/gen021.svg"
                            className="svg-icon-1"
                          />
                        </button>
                        <AccessController allowedRoles={['ejecutor']} rol={rol}>
                          {/* Botón Cancelar */}
                          <button
                            className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-2"
                            onClick={() => handleCancel(request)}
                            title="Cancelar"
                          >
                            <KTSVG
                              path="/media/icons/duotune/general/gen034.svg"
                              className="svg-icon-1"
                            />
                          </button>

                          {/* Botón Implementar */}
                          <button
                            className="btn btn-icon btn-bg-light btn-active-color-success btn-sm"
                            onClick={() => handleImplement(request)}
                            title="Implementar"
                          >
                            <KTSVG
                              path="/media/icons/duotune/arrows/arr075.svg"
                              className="svg-icon-1"
                            />
                          </button>
                        </AccessController>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-10 fs-6 text-gray-600">
                  No se encontraron resultados
                </td>
              </tr>
            )}
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
  );
};