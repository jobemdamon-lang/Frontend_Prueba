import { FC } from "react"
import { Provider } from "./AdministrateCMDB/Provider"
import { ModuleProps } from "../../helpers/Types"

const AdministrateCMDB: FC<ModuleProps> = ({ rol }) => {
    return (
        <Provider rol={rol} />
    )
}
export { AdministrateCMDB }