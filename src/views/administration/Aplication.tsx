import { FC } from 'react'
import { ModuleProps } from '../../helpers/Types'
import { Provider } from './Aplication/Provider'

const Aplication: FC<ModuleProps> = ({ rol }) => {
    return (
        <Provider rol={rol} />
    )
}
export { Aplication }