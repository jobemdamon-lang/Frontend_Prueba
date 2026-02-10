import { FC } from 'react'
import { ModuleProps } from '../../helpers/Types'
import { Provider } from './Parchado/Provider'

const WindowsPatch: FC<ModuleProps> = ({ rol }) => {
    return (
        <div>
            <Provider rol={rol} />
        </div>
    )
}

export { WindowsPatch }
