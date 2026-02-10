import { FC } from 'react'
import { ModuleProps } from '../../helpers/Types'
import { Provider } from './administration/Provider'

const Administration: FC<ModuleProps> = ({ rol }) => {
    return (
        <div>
            <Provider rol={rol} />
        </div>
    )
}

export { Administration }
