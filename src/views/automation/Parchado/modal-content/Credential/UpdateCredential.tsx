import { FC, useState } from "react"
import { Input } from "../../../../../components/Inputs/TextInput"
import { initialCredentialUpdate } from "../../../Types"
import { encryptData } from "../../../../../helpers/encrypt"
import { ToolTip } from "../../../../../components/tooltip/ToolTip"
import 'animate.css';
import { useWindowsPatchContext } from "../../Context"
import { useTypedSelector } from "../../../../../store/ConfigStore"

type Props = { setIsCreateView: React.Dispatch<React.SetStateAction<boolean>> }

const UpdateCredential: FC<Props> = ({ setIsCreateView }) => {

    const { credentialHook } = useWindowsPatchContext()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const [lockPasword, setLockPassword] = useState({ islock: true, isdisable: true, mmsg: "BLOQUEADO" })
    const [passwordType, setPasswordType] = useState('password')

    const handleLock = () => {
        credentialHook.updateCredentialsFuncs.updatedPassword("")
        setLockPassword(prev => ({ mmsg: prev.mmsg === "BLOQUEADO" ? "" : "BLOQUEADO", islock: !prev.islock, isdisable: !prev.isdisable }))
    }

    //Función para actualizar una credencial
    const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        credentialHook.updateCredential({
            id_credencial: credentialHook.credentialToUpdate.id_credencial,
            nombre: credentialHook.credentialToUpdate.nombre,
            clave: encryptData(credentialHook.credentialToUpdate.clave === "BLOQUEADO" ? "0" : credentialHook.credentialToUpdate.clave),
            descripcion: credentialHook.credentialToUpdate.descripcion,
            usuario: encryptData(credentialHook.credentialToUpdate.usuario),
            usuario_ccs: userName
        }).then(success => {
            if (success) {
                credentialHook.getListCredentials()
                credentialHook.updateCredentialsFuncs.setCredentialToUpdate(initialCredentialUpdate)
            }
        })
    }

    return (
        <>
            <form onSubmit={handleUpdate} className="d-flex gap-3 align-items-end justify-content-around mb-5 animate__bounceIn">
                <Input
                    required
                    label="Nombre de la Credencial"
                    onChange={credentialHook.updateCredentialsFuncs.updatedNameCredential}
                    value={credentialHook.credentialToUpdate.nombre}
                />
                <Input
                    required
                    label="Descripción"
                    onChange={credentialHook.updateCredentialsFuncs.updatedDescription}
                    value={credentialHook.credentialToUpdate.descripcion}
                />
                <Input
                    required
                    label="Usuario"
                    onChange={credentialHook.updateCredentialsFuncs.updatedUserName}
                    value={credentialHook.credentialToUpdate.usuario}
                />
                <div className="d-flex justify-content-center align-items-center">
                    <div style={{ position: "relative" }}>
                        <div style={{ position: "absolute", top: 40, left: 20 }}><i>{lockPasword.mmsg}</i></div>
                        <Input
                            label="Clave"
                            disabled={lockPasword.isdisable}
                            type={passwordType}
                            onChange={credentialHook.updateCredentialsFuncs.updatedPassword}
                            value={credentialHook.credentialToUpdate.clave}
                        />
                    </div>
                    <button
                        type="button"
                        className="btn btn-icon btn-light btn-active-color-primary align-self-end m-0"
                        onMouseDown={() => setPasswordType('text')}
                        onMouseUp={() => setPasswordType('password')}
                        onMouseLeave={() => setPasswordType('password')}
                    >
                        {passwordType === 'password' ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486z" />
                                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708" />
                            </svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                            </svg>
                        }
                    </button>
                    <button
                        type="button"
                        className="btn btn-icon btn-light btn-active-color-primary align-self-end m-0"
                        onClick={handleLock}
                    >
                        {lockPasword.islock ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-lock" viewBox="0 0 16 16">
                                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                            </svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-unlock" viewBox="0 0 16 16">
                                <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2M3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z" />
                            </svg>
                        }
                    </button>
                </div>
                <button
                    className="btn btn-info"
                    type="submit"
                    disabled={credentialHook.updateCredentialLoading}
                >
                    {credentialHook.updateCredentialLoading ? "Actualizando.." : "Actualizar"}
                </button>
                <ToolTip
                    message="Regresar a formulario de Creación"
                    placement="top-start"
                >
                    <button
                        type="button"
                        className="btn btn-success mx-0 px-2 text-dark"
                        onClick={() => setIsCreateView(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-arrow-bar-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5" />
                        </svg>
                    </button>
                </ToolTip>
            </form>
        </>
    )
}
export { UpdateCredential }