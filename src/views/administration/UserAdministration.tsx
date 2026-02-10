import { FC } from 'react'
import { ModuleProps } from '../../helpers/Types'
import { Provider } from './User/Provider'

const UserAdministration: FC<ModuleProps> = ({ rol }) => {
    return (
        <div>
            <Provider rol={rol} />
        </div>
    )
}

export { UserAdministration }
