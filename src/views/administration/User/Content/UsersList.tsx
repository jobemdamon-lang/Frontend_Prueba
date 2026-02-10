import { useMemo, useState } from "react"
import { useUserAdministrationContext } from "../Context"
import { Pagination } from "../../../../components/datatable/Pagination"
import { usePagination } from "../../../../hooks/usePagination"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { TableSkeleton } from "../../../../components/datatable/TableSkeleton"
import { useNavigate } from "react-router-dom"

const styleColumn = "text-gray-600 fw-semibold fs-6"

export const UsersList = () => {

    const { userHook: { users, getUsersLoading }, setSelectedUser } = useUserAdministrationContext()
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedArea, setSelectedArea] = useState('')

    const areas = [...new Set(users.map(user => user.area).filter(area => area !== null))]

    const filteredData = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.dni?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.telefono?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.correo?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesArea = selectedArea ? user.area === selectedArea : true;

            return matchesSearch && matchesArea;
        }).reverse();
    }, [users, searchTerm, selectedArea])

    const {
        currentPage,
        itemsPerPage,
        currentItems,
        totalPages,
        totalItems,
        setCurrentPage,
        setItemsPerPage,
    } = usePagination({
        data: filteredData,
        initialPage: 1,
        initialItemsPerPage: 10,
    })

    return (
        <div className="card">
            <div className="card-header border-0 py-6">
                <div>
                    <h3 className="card-title fw-bold fs-3 mb-1">Administración de usuarios</h3>
                    <span className="text-muted mt-1 fw-semibold fs-7">
                        Gestione la configuración, información y permisos de cada usuario
                    </span>
                </div>

                <div className="card-toolbar">
                    <div className="d-flex align-items-center position-relative me-4">
                        <KTSVG
                            path="/media/icons/duotune/general/gen021.svg"
                            className="svg-icon-1 position-absolute ms-6"
                        />
                        <input
                            type="text"
                            className="form-control form-control-solid w-500px ps-15"
                            placeholder="Buscar usuario, nombre, DNI..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    <div className="d-flex align-items-center me-4">
                        <select
                            className="form-select form-select-sm"
                            value={selectedArea}
                            onChange={(e) => {
                                setSelectedArea(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">Todas las áreas</option>
                            {areas.map(area => (
                                <option key={area} value={area || ''}>{area}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="card-body pt-0">
                {/* Table */}
                <div className="table-responsive">
                    <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                        <thead>
                            <tr className="fw-bold text-muted fs-6">
                                <th className="w-auto">Usuario</th>
                                <th className="w-100px">Estado</th>
                                <th className="w-auto">Nombre Completo</th>
                                <th className="w-auto">Área</th>
                                <th className="w-300px">Cargo</th>
                                <th className="w-auto">Correo</th>
                                <th className="w-auto text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className={getUsersLoading ? 'placeholder-glow' : ''}>
                            {getUsersLoading ? (
                                <TableSkeleton size={10} columns={7} />
                            ) : currentItems.length > 0 ? (
                                currentItems.map(user => (
                                    <tr key={user.idusuario}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="symbol symbol-50px me-3">
                                                    <span className="symbol-label bg-light-primary">
                                                        <span className="fs-2 text-primary">
                                                            {user.usuario.charAt(0).toUpperCase()}
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="d-flex flex-column fs-6">
                                                    <span className="text-gray-800 fw-bold text-hover-primary mb-1">
                                                        {user.usuario}
                                                    </span>
                                                    <span className="text-muted fs-7">ID: {user.idusuario}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge badge-light-${user.estado ? 'success' : 'danger'} fw-bold fs-7`}>
                                                {user.estado ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <KTSVG
                                                    path="/media/icons/duotune/communication/com006.svg"
                                                    className="svg-icon-1 me-2"
                                                />
                                                <span className={styleColumn}>
                                                    {user.nombre || 'Sin registro'}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <KTSVG
                                                    path="/media/icons/duotune/abstract/abs027.svg"
                                                    className="svg-icon-1 me-2"
                                                />
                                                <span className={styleColumn}>
                                                    {user.area || 'No definido'}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={styleColumn}>
                                                {user.cargo || 'Sin registro'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <KTSVG
                                                    path="/media/icons/duotune/communication/com011.svg"
                                                    className="svg-icon-1 me-2"
                                                />
                                                <a href={`mailto:${user.correo}`} className="fs-6 text-gray-600 text-hover-primary fw-semibold">
                                                    {user.correo || 'Sin registro'}
                                                </a>
                                            </div>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button
                                                    className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                                                    onClick={() => {
                                                        setSelectedUser(user)
                                                        navigate(`/administration/colaborador?id=${user.idusuario}`)
                                                    }}
                                                >
                                                    <KTSVG path="/media/icons/duotune/general/gen019.svg" className="svg-icon-1" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="text-center py-10">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="text-center py-10">
                                                    <div className="mb-5">
                                                        <KTSVG
                                                            path="/media/icons/duotune/files/fil024.svg"
                                                            className="svg-icon-4x opacity-50"
                                                        />
                                                    </div>
                                                    <h3 className="fw-bold text-gray-800 mb-2">No se encontraron usuarios</h3>
                                                    <p className="text-muted fs-4 mb-5">
                                                        No hay usuarios que coincidan con tu búsqueda.
                                                        <br />
                                                        Intenta con otros términos o crea un nuevo usuario.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredData.length > 0 && (
                    <Pagination
                        totalItems={totalItems}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                )}
            </div>
        </div>
    )
}
