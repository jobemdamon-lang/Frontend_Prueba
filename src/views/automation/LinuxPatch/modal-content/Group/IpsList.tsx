import { FC } from "react"
import { SelectInput } from "../../../../../components/Inputs/SelectInput"
import { IListServerUnifiedWithPickedIP } from "../../../Types"
import { cloneDeep } from "lodash"

type Props = {
    rowInformation: IListServerUnifiedWithPickedIP,
    setFilteredServers: React.Dispatch<React.SetStateAction<IListServerUnifiedWithPickedIP[]>>
}

const IpsList: FC<Props> = (props) => {

    const handleChangeIP = (newvalue: string) => {
        props.setFilteredServers((prev: IListServerUnifiedWithPickedIP[]) => {
            const newStateServer = cloneDeep(prev)
            return newStateServer.map((server: IListServerUnifiedWithPickedIP) => {
                if (server.ID_EQUIPO === props.rowInformation.ID_EQUIPO) {
                    const actualServer = newStateServer.find((server: IListServerUnifiedWithPickedIP) => server.ID_EQUIPO === props.rowInformation.ID_EQUIPO)
                    const actualIP = actualServer?.IP.find(ip => ip.NRO_IP === newvalue)
                    if (actualIP) server.PICKED_IP = actualIP
                }
                return server
            })
        })
    }

    return (
        <div className="d-flex align-items-center">
            <SelectInput
                data={props.rowInformation.IP.map(ip => ({ codigo: ip.ID_EQUIPO_IP, nombre: ip.NRO_IP }))}
                label=""
                onChange={handleChangeIP}
                value={props.rowInformation.PICKED_IP.NRO_IP}
            />
        </div>

    )
}

export { IpsList }