import { FC } from 'react'
import { Provider } from './components/politicas/Provider'

type Props = {
  rol:string
}

const Politicas: FC<Props> = ({rol}) => {
  return (
    <div className={`card`}>
      <Provider />
    </div>
  )
}

export { Politicas }
