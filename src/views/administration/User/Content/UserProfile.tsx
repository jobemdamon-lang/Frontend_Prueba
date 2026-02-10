import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useUserAdministrationContext } from "../Context";
import { TableSkeleton } from "../../../../components/datatable/TableSkeleton";
import { ModalViewForUserAdministration } from "../Types";
import { ModalSize } from "../../../../hooks/Types";
import { AnalyticsService } from "../../../../helpers/analytics";

function useQuery() {
    return new URLSearchParams(useLocation().search)
}

export const UserProfile = () => {
    const {
        modalHook,
        userHook: {
            getPermissionsPerUser,
            getUserPermissionsLoading,
            usersPermissions,
            //deleteUserPermission
        },
        selectedUser
    } = useUserAdministrationContext()
    const navigate = useNavigate()

    const query = useQuery()
    const id = query.get("id")

    useEffect(() => {
        const idUser = Number(id)
        if (id && idUser) getPermissionsPerUser(idUser)
    }, [getPermissionsPerUser, id])

    // Función para combinar permisos
    const getCombinedPermissions = () => {
        if (!usersPermissions) return []

        const areaPerms = usersPermissions.byArea || []
        const personalPerms = usersPermissions.personal || []

        // Crear un mapa para combinar los permisos por ATRIBUTO
        const permissionsMap = new Map()

        // Primero agregamos los permisos de área
        areaPerms.forEach(perm => {
            permissionsMap.set(perm.ATRIBUTO, {
                ...perm,
                isPersonal: false,
                finalRole: perm.ROL // Inicialmente el rol final es el de área
            })
        })

        // Luego sobrescribimos con permisos personales si existen
        personalPerms.forEach(perm => {
            permissionsMap.set(perm.ATRIBUTO, {
                ...perm,
                isPersonal: true,
                finalRole: perm.ROL // El rol final será el personal
            })
        })

        // Convertimos el mapa a array y ordenamos por atributo
        return Array.from(permissionsMap.values()).sort((a, b) =>
            a.ATRIBUTO.localeCompare(b.ATRIBUTO)
        )
    }

    const handleEditUser = () => {
        modalHook.openModal(ModalViewForUserAdministration.EDIT_USER, ModalSize.LG, undefined, selectedUser)
        AnalyticsService.event("update_user_profile", {
            module: "colaborador",
            metadata: {
                updatedUser: selectedUser?.usuario
            }
        })
    }

    const handleDeletePermission = async (permissionId: number) => {
        if (!id) return;
        console.log(permissionId)
        //await deleteUserPermission(Number(id), permissionId);
        //getPermissionsPerUser(Number(id));
    }

    const combinedPermissions = getCombinedPermissions();

    return (
        <div className="card">
            <div className="card-header border-0 py-6">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <button
                            type="button"
                            className="btn btn-light-primary btn-icon btn-sm"
                            onClick={() => navigate('/administration/colaborador')}
                            disabled={getUserPermissionsLoading}
                        >
                            <i className="bi bi-arrow-left fs-1"></i>
                        </button>
                        <span className="card-label fw-bold fs-3">Perfil del Usuario</span>
                    </div>
                </div>
            </div>

            <div className="card-body pt-0">
                <div className="d-flex flex-column mb-3">
                    {/* Sección de información del usuario (igual que antes) */}
                    <div className="d-flex mb-5">
                        <div className="me-7">
                            <div className="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
                                <div className="symbol-label bg-light-primary">
                                    <span className="fs-5x text-primary">
                                        {selectedUser?.nombre?.charAt(0) || selectedUser?.usuario?.charAt(0) || 'U'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="d-flex flex-column">
                                    <div className="d-flex align-items-center mb-2">
                                        <span className="text-gray-800 fs-2 fw-bolder me-1">
                                            {selectedUser?.nombre || 'Nombre no disponible'}
                                        </span>
                                        <span className={`badge badge-light-${selectedUser?.estado ? 'success' : 'danger'} fw-bold fs-7 ms-2`}>
                                            {selectedUser?.estado ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>

                                    <div className="d-flex flex-wrap fw-semibold fs-6 mb-4 pe-2">
                                        <span className="d-flex align-items-center text-gray-500 me-5 mb-2">
                                            <KTSVG
                                                path="/media/icons/duotune/electronics/elc003.svg"
                                                className="svg-icon-1 me-1"
                                            />
                                            {selectedUser?.telefono || 'No especificado'}
                                        </span>
                                        <span className="d-flex align-items-center text-gray-500 me-5 mb-2">
                                            <KTSVG
                                                path="/media/icons/duotune/communication/com011.svg"
                                                className="svg-icon-1 me-1"
                                            />
                                            {selectedUser?.correo || 'No especificado'}
                                        </span>
                                        <span className="d-flex align-items-center text-gray-500 mb-2">
                                            <KTSVG
                                                path="/media/icons/duotune/general/gen049.svg"
                                                className="svg-icon-1 me-1"
                                            />
                                            {selectedUser?.dni || 'No especificado'}
                                        </span>
                                    </div>
                                </div>

                                <div className="d-flex my-4">
                                    <button
                                        className="btn btn-sm btn-light me-2"
                                        onClick={handleEditUser}
                                    >
                                        Editar Perfil
                                    </button>
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => {
                                            modalHook.openModal(ModalViewForUserAdministration.ASSIGN_PROFILE_USER, ModalSize.LG, undefined, selectedUser)
                                        }}
                                    >
                                        Asignar Permisos
                                    </button>
                                </div>
                            </div>

                            <div className="d-flex flex-wrap flex-stack">
                                <div className="d-flex flex-column flex-grow-1 pe-8">
                                    <div className="d-flex flex-wrap">
                                        <div className="border border-gray-300 border-dashed rounded py-3 px-4 me-6 mb-3">
                                            <div className="d-flex align-items-center">
                                                <KTSVG
                                                    path="/media/icons/duotune/communication/com005.svg"
                                                    className="svg-icon-3 me-2"
                                                />
                                                <div className="fs-6 fw-bolder text-gray-700">
                                                    {selectedUser?.area || 'Área no asignada'}
                                                </div>
                                            </div>
                                            <div className="fw-semibold text-gray-500">Área</div>
                                        </div>

                                        <div className="border border-gray-300 border-dashed rounded py-3 px-4 me-6 mb-3">
                                            <div className="d-flex align-items-center">
                                                <KTSVG
                                                    path="/media/icons/duotune/general/gen051.svg"
                                                    className="svg-icon-3 me-2"
                                                />
                                                <div className="fs-6 fw-bolder text-gray-700">
                                                    {selectedUser?.cargo || 'Cargo no asignado'}
                                                </div>
                                            </div>
                                            <div className="fw-semibold text-gray-500">Cargo</div>
                                        </div>

                                        <div className="border border-gray-300 border-dashed rounded py-3 px-4 me-6 mb-3">
                                            <div className="d-flex align-items-center">
                                                <KTSVG
                                                    path="/media/icons/duotune/general/gen048.svg"
                                                    className="svg-icon-3 me-2"
                                                />
                                                <div className="fs-6 fw-bolder text-gray-700">
                                                    {selectedUser?.usuario || 'Usuario no disponible'}
                                                </div>
                                            </div>
                                            <div className="fw-semibold text-gray-500">Usuario</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabla unificada de permisos */}
                    <div className="card card-xl-stretch mb-xl-8">
                        <div className="card-header border-0 pt-5">
                            <h3 className="card-title align-items-start flex-column">
                                <span className="card-label fw-bolder fs-3 mb-1">Permisos del Usuario</span>
                                <span className="text-muted mt-1 fw-semibold fs-7">
                                    Permisos combinados (heredados del área y personales)
                                </span>
                            </h3>
                        </div>
                        <div className="card-body py-3">
                            <div className="table-responsive">
                                <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                                    <thead>
                                        <tr className="fw-bolder text-muted">
                                            <th>Atributo</th>
                                            <th>Permiso del Área</th>
                                            <th>Permiso Personal</th>
                                            <th>Permiso Final</th>
                                            <th>Descripción</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getUserPermissionsLoading ? (
                                            <TableSkeleton size={5} columns={6} />
                                        ) : combinedPermissions.length > 0 ? (
                                            combinedPermissions.map(permiso => {
                                                // Buscamos el permiso de área correspondiente (si existe)
                                                const areaPerm = usersPermissions.byArea?.find(p => p.ATRIBUTO === permiso.ATRIBUTO);
                                                // Buscamos el permiso personal correspondiente (si existe)
                                                const personalPerm = usersPermissions.personal?.find(p => p.ATRIBUTO === permiso.ATRIBUTO);

                                                return (
                                                    <tr key={permiso.ATRIBUTO}>
                                                        <td>
                                                            <span className="text-gray-800 fw-bold">
                                                                {permiso.ATRIBUTO}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {areaPerm ? (
                                                                <span className={`badge badge-light-primary fw-bold fs-7`}>
                                                                    {areaPerm.ROL}
                                                                </span>
                                                            ) : (
                                                                <span className="text-muted fw-semibold">N/A</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {personalPerm ? (
                                                                <span className={`badge badge-light-success fw-bold fs-7`}>
                                                                    {personalPerm.ROL}
                                                                </span>
                                                            ) : (
                                                                <span className="text-muted fw-semibold">N/A</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <span className={`badge badge-light-info fw-bold fs-7`}>
                                                                {permiso.finalRole}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="text-gray-600">
                                                                {permiso.VALOR}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {permiso.isPersonal ? (
                                                                <button
                                                                    className="btn btn-sm btn-light-danger"
                                                                    onClick={() => handleDeletePermission(permiso.ID_PERFIL_USUARIO)}
                                                                    disabled={getUserPermissionsLoading}
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            ) : (
                                                                <span className="text-muted">No aplica</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="text-center py-10">
                                                    <div className="d-flex flex-column align-items-center">
                                                        <KTSVG
                                                            path="/media/icons/duotune/files/fil024.svg"
                                                            className="svg-icon-4x opacity-25 mb-5"
                                                        />
                                                        <span className="text-muted fw-semibold fs-5">
                                                            No hay permisos asignados
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}