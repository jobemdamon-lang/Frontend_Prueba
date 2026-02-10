import { FC } from "react"
import { Provider } from "./Incidencias/Provider"
import { ModuleProps } from "../../helpers/Types"

const Incidencias: FC<ModuleProps> = ({ rol }) => {
    return (
        <Provider rol={rol} />
    )
}
export { Incidencias }

