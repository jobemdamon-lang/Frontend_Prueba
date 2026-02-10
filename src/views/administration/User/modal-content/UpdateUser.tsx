import { KTSVG } from "../../../../helpers/components/KTSVG";
import { useUserAdministrationContext } from "../Context";
import { UserInformation } from "../Types";
import { Loader } from "../../../../components/Loading";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UpdateUser = () => {

    const { modalHook, userHook: { updateUser, updateUserLoading, getUsers }, paramsHook } = useUserAdministrationContext()
    const user: UserInformation = modalHook.modalInformation
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        telefono: "",
        usuario: "",
        area: '',
        estado: 1
    })

    useEffect(() => {
        if (user) {
            setFormData({
                telefono: user.telefono || "",
                usuario: user.usuario || "",
                area: user.area?.toUpperCase() || '',
                estado: user.estado ?? 1
            })
        }
    }, [user])

    useEffect(() => {
        paramsHook.getAreas()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'estado' ? parseInt(value) : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const findedArea = paramsHook.areas.find(a => a.nombre.toUpperCase() === formData.area)
        if (!findedArea) return

        updateUser({
            estado: formData.estado,
            telefono: formData.telefono,
            id_area: findedArea.codigo,
            usuario: formData.usuario
        }).then(success => {
            if (success) {
                getUsers()
                modalHook.closeModal()
                navigate('/administration/colaborador')
            }
        })
    }

    return (
        <>
            <div className='modal-header py-3'>
                <h2 className='text-dark'>ACTUALIZAR INFORMACIÓN DE {user?.usuario?.toUpperCase()}</h2>
                <div
                    className='btn btn-sm btn-icon btn-active-color-primary'
                    onClick={() => !updateUserLoading && modalHook.closeModal()}
                >
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="form">
                <div className="modal-body px-9 py-6">

                    <div className="row g-6 mb-6">
                        {/* Teléfono */}
                        <div className="col-md-6">
                            <label className="form-label">Teléfono</label>
                            <input
                                type="tel"
                                className="form-control form-control"
                                placeholder="Número de teléfono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label required">Área</label>
                            <select
                                className="form-select form-select"
                                name="area"
                                value={formData.area}
                                disabled={paramsHook.loadingAreas}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione un área</option>
                                {paramsHook.areas.map(area => (
                                    <option key={area.codigo} value={area.nombre.toUpperCase()}>
                                        {area.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Estado */}
                    <div className="mb-6 text-center">
                        <label className="form-label required mb-5">Estado</label>
                        <div className="d-flex justify-content-center">
                            <div className="form-check form-check-custom form-check-solid me-6">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="estado"
                                    id="active"
                                    value="1"
                                    checked={formData.estado === 1}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor="active">
                                    Activo
                                </label>
                            </div>
                            <div className="form-check form-check-custom form-check-solid">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="estado"
                                    id="inactive"
                                    value="0"
                                    checked={formData.estado === 0}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor="inactive">
                                    Inactivo
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer flex-nowrap pt-4 pb-6 px-9">
                    <button
                        type="button"
                        className="btn btn-light btn-active-light-primary me-3"
                        onClick={() => modalHook.closeModal()}
                        disabled={updateUserLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={updateUserLoading}
                    >
                        {updateUserLoading ? (
                            <>
                                <Loader className="spinner-border-sm me-2" />
                                Procesando
                            </>
                        ) : (
                            "Actualizar Usuario"
                        )}
                    </button>
                </div>
            </form>
        </>
    )
}

export { UpdateUser }