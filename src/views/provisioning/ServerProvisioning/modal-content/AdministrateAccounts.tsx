import { useServerProvisioningContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useEffect, useState } from "react"
import { useParams } from "../../hooks/useParams"
import { useAdministrate } from "../../hooks/useAdministrate"
import { DataList } from "../../../../components/Inputs/DataListInput"
import { warningNotification } from "../../../../helpers/notifications"
import { TowerOwner } from "../../Types"

export const AdministrateAccounts = () => {
    const { modalHook } = useServerProvisioningContext()
    const {
        addTowerOwner,
        deleteTowerOwner,
        getTowerOwners,
        loadingAddOwner,
        loadingGetOwners,
        owners
    } = useAdministrate()

    const { getTowers, getCollaborators, loadingTowers, loadingCollabs, towers, collaborators } = useParams()
    const [selectedArea, setSelectedArea] = useState('')
    const [selectedUser, setSelectedUser] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredOwners, setFilteredOwners] = useState<TowerOwner[]>([])
    const [deletingId, setDeletingId] = useState<number | null>(null)

    useEffect(() => {
        getTowers()
        getCollaborators()
        getTowerOwners()
    }, [getTowers, getCollaborators, getTowerOwners])

    const handleAddOwner = async () => {
        if (!selectedArea || !selectedUser) {
            warningNotification('Por favor selecciona un área y un usuario')
            return
        }

        const userID = collaborators.find(collab => collab.nombre === selectedUser)
        if (!userID) return;

        await addTowerOwner({
            id_admin_torre: parseInt(selectedArea),
            id_usuario: userID.idusuario
        })

        setSelectedArea('')
        setSelectedUser('')
        getTowerOwners() // Actualizar la lista después de agregar
    }

    const handleDeleteOwner = async (id: number) => {
        setDeletingId(id) // Establecer el ID que se está eliminando
        try {
            await deleteTowerOwner(id)
            await getTowerOwners() // Actualizar la lista después de eliminar
        } finally {
            setDeletingId(null) // Restablecer el ID de eliminación
        }
    }

    useEffect(() => {
        const filtered = owners.filter(owner =>
            owner.NOMBRE_ADMIN_TORRE?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            owner.NOMBRE?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            owner.USUARIO?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredOwners(filtered)
    }, [owners, searchTerm])


    return (
        <>
            <div className='modal-header py-4'>
                <h2 className="text-dark">
                    ADMINISTRAR CUENTAS
                </h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-10 d-flex flex-column gap-5'>
                {/* Formulario para agregar nueva relación */}
                <div className="card card-flush shadow-sm">
                    <div className="card-header">
                        <h3 className="card-title">Agregar Nuevo Owner</h3>
                    </div>
                    <div className="card-body px-10 py-1">
                        <div className="row">
                            <div className="col-md-6">
                                <label className="form-label">Área/Torre</label>
                                <select
                                    className="form-select"
                                    value={selectedArea}
                                    onChange={(e) => setSelectedArea(e.target.value)}
                                    disabled={loadingTowers}
                                >
                                    <option value="">Seleccionar área</option>
                                    {towers.map(area => (
                                        <option key={area.codigo} value={area.codigo}>
                                            {area.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6">
                                <DataList
                                    label="Usuario"
                                    loading={loadingCollabs}
                                    items={collaborators.map(item => ({ id: item.idusuario, value: item.nombre }))}
                                    value={selectedUser}
                                    onChange={(value) => setSelectedUser(value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="card-footer d-flex justify-content-end">
                        <button
                            className="btn btn-primary"
                            onClick={handleAddOwner}
                            disabled={loadingAddOwner || !selectedArea || !selectedUser}
                        >
                            {loadingAddOwner ? (
                                <span>
                                    Guardando... <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                </span>
                            ) : 'Guardar Relación'}
                        </button>
                    </div>
                </div>

                {/* Listado de relaciones existentes */}
                <div className="card card-flush shadow-sm">
                    <div className="card-header">
                        <h3 className="card-title">Relaciones Existentes</h3>
                        <div className="card-toolbar">
                            <div className="d-flex align-items-center position-relative">
                                <KTSVG
                                    path="/media/icons/duotune/general/gen021.svg"
                                    className="svg-icon-3 position-absolute ms-3"
                                />
                                <input
                                    type="text"
                                    className="form-control form-control-solid w-250px ps-10"
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        {loadingGetOwners ? (
                            <div className="d-flex justify-content-center p-10">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table align-middle table-row-dashed fs-7 gy-5">
                                    <thead>
                                        <tr className="text-center text-gray-400 fw-bold fs-6 text-uppercase gs-0">
                                            <th className="min-w-100px">Área/Torre</th>
                                            <th className="min-w-100px">Nombre</th>
                                            <th className="min-w-100px">Usuario</th>
                                            <th className="min-w-100px">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="fw-semibold text-gray-600">
                                        {filteredOwners.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="text-center py-10">
                                                    No se encontraron relaciones
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredOwners.map(owner => (
                                                <tr className="text-center" key={owner.ID_GESTION_CUENTA}>
                                                    <td>{owner.NOMBRE_ADMIN_TORRE}</td>
                                                    <td style={{ width: "180px" }}>{owner.NOMBRE}</td>
                                                    <td>{owner.USUARIO}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-icon btn-light-danger"
                                                            onClick={() => handleDeleteOwner(owner.ID_GESTION_CUENTA)}
                                                            disabled={deletingId === owner.ID_GESTION_CUENTA}
                                                        >
                                                            {deletingId === owner.ID_GESTION_CUENTA ? (
                                                                <span className="spinner-border spinner-border-sm"></span>
                                                            ) : (
                                                                <KTSVG
                                                                    path="/media/icons/duotune/general/gen027.svg"
                                                                    className="svg-icon-3"
                                                                />
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="modal-footer d-flex justify-content-between">
                <button
                    type="button"
                    className="btn btn-sm btn-light"
                    onClick={() => modalHook.closeModal()}
                >
                    <i className="bi bi-x-circle fs-3 me-2"></i>
                    Cancelar
                </button>
            </div>
        </>
    )
}