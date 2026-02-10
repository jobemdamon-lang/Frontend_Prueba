import { FC } from 'react'
import { ModuleProps } from '../../helpers/Types'
import { Provider } from './LinuxPatch/Provider'

const LinuxPatch: FC<ModuleProps> = ({ rol }) => {
    return (
        <div>
            <Provider rol={rol} />
        </div>
    )
}

export { LinuxPatch }
