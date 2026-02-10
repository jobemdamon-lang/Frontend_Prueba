import { useEffect, useState } from "react";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { useUserAdministrationContext } from "../Context";
import { Loader } from "../../../../components/Loading";
import { UserInformation } from "../Types";
import { warningNotification } from "../../../../helpers/notifications";
import { useNavigate } from "react-router-dom";

const AssignProfileToUser = () => {

    const {
        modalHook,
        paramsHook: {
            getAccessRoles,
            roles,
            getProfiles,
            profiles
        },
        userHook: {
            assignProfileUser,
            assignProfileUserLoading,
            getUsers
        }
    } = useUserAdministrationContext()
    const navigate = useNavigate()
    const user: UserInformation = modalHook.modalInformation

    const [formData, setFormData] = useState({
        id_usuario: user.idusuario,
        rol: "",
        id_perfil: 0,
        estado: 1
    })

    useEffect(() => {
        getAccessRoles()
        getProfiles()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!formData.rol || !formData.id_perfil) {
            warningNotification('Debe seleccionar un Perfil y Rol')
            return;
        }
        assignProfileUser(formData).then(success => {
            if (success) {
                getUsers()
                modalHook.closeModal()
                navigate('/administration/colaborador')
            }
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'id_perfil' ? parseInt(value) : value
        }));
    };

    const getProfileName = (id: number): string => {
        const profile = profiles.find(p => p.IDOPCION === id);
        return profile ? profile.ATRIBUTO : "";
    };

    return (
        <>
            <div className='modal-header'>
                <h2 className='text-dark'>
                    Asignar Perfil a {modalHook.modalInformation.nombre?.toUpperCase()}
                </h2>
                <div
                    className='btn btn-sm btn-icon btn-active-color-primary'
                    onClick={() => !assignProfileUserLoading && modalHook.closeModal()}
                >
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="form">
                <div className="modal-body px-9 py-6">
                    <div className="row">
                        {/* Selector de Rol */}
                        <div className="col-12 mb-6">
                            <label className="form-label required">Rol</label>
                            <select
                                className="form-select form-select"
                                name="rol"
                                value={formData.rol}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione un rol</option>
                                {roles.map((role) => (
                                    <option key={role.codigo} value={role.nombre}>
                                        {role.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Selector de Perfil */}
                        <div className="col-12">
                            <label className="form-label required">Perfil</label>
                            <select
                                className="form-select form-select"
                                name="id_perfil"
                                value={formData.id_perfil}
                                onChange={handleChange}
                                required
                            >
                                <option value="0">Seleccione un perfil</option>
                                {profiles.map((profile) => (
                                    <option key={profile.IDOPCION} value={profile.IDOPCION}>
                                        {profile.ATRIBUTO} - {profile.SUBMODULO}
                                    </option>
                                ))}
                            </select>
                            {formData.id_perfil > 0 && (
                                <div className="text-muted mt-2">
                                    <small>{getProfileName(formData.id_perfil)}</small>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="modal-footer flex-nowrap pt-4 pb-6 px-9">
                    <button
                        type="button"
                        className="btn btn-light btn-active-light-primary me-3"
                        onClick={() => modalHook.closeModal()}
                        disabled={assignProfileUserLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={assignProfileUserLoading}
                    >
                        {assignProfileUserLoading ? (
                            <>
                                <Loader className="spinner-border-sm me-2" />
                                Procesando
                            </>
                        ) : (
                            "Asignar Perfil"
                        )}
                    </button>
                </div>
            </form>
        </>
    );
};

export { AssignProfileToUser };