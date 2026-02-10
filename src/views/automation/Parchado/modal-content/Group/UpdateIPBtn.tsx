import { FC, useEffect, useState } from "react"
import { SelectInput } from "../../../../../components/Inputs/SelectInput"
import { IListServerUnified } from "../../../Types"
import { Spinner } from "react-bootstrap"
import { useTypedSelector } from "../../../../../store/ConfigStore"
import { useWindowsPatchContext } from "../../Context"
import { useServer } from "../../../hooks/useServer"

type Props = { rowInformation: IListServerUnified }

const UpdateIPBtn: FC<Props> = ({ rowInformation }) => {

    const { modalHook } = useWindowsPatchContext()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const [updatedIP, setUpdateIP] = useState(rowInformation.NRO_IP ?? "")
    const { updateIPOfServer, updateIPLoading } = useServer()

    const handleChangeIP = () => {
        if (rowInformation.ID_GRUPO) {
            updateIPOfServer({
                id_equipo: rowInformation.ID_EQUIPO,
                id_equipo_ip: rowInformation.IP.find(IP => IP.NRO_IP === updatedIP)?.ID_EQUIPO_IP ?? 0,
                id_grupo: rowInformation.ID_GRUPO,
                usuario: userName
            }).then(success => {
                if (success) modalHook.closeModal()
            })
        }
    }

    useEffect(() => { setUpdateIP(rowInformation.NRO_IP ?? "") }, [rowInformation.NRO_IP])

    return (
        <div className="d-flex justify-content-center align-items-end">
            <SelectInput
                data={rowInformation.IP.map(ip => ({ codigo: ip.ID_EQUIPO_IP, nombre: ip.NRO_IP }))}
                label=""
                onChange={setUpdateIP}
                value={updatedIP}
            />
            <button
                className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                onClick={() => handleChangeIP()}
            >
                {updateIPLoading ?
                    <Spinner animation="border" role="status">
                    </Spinner>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                    </svg>
                }
            </button>
        </div>
    )
}

export { UpdateIPBtn }