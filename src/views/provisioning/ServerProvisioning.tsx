import { FC } from 'react'
import { ModuleProps } from '../../helpers/Types'
import { Provider } from './ServerProvisioning/Provider'

const ProvisioningServer: FC<ModuleProps> = ({ rol }) => {
    return (
        <div>
            <Provider rol={rol} />
        </div>
    )
}

export { ProvisioningServer }
