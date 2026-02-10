import { FC } from 'react'

import { ModuleProps } from '../../helpers/Types'
import { Provider } from './ConfigurationItems/Provider'

const ConfigurationItems: FC<ModuleProps> = ({ rol }) => {
  return (
    <div>
      <Provider rol={rol} />
    </div>
  )
}

export { ConfigurationItems }
