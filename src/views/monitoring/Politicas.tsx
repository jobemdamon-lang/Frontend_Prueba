/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import { ProviderPoliticas } from './politicas/ProviderPoliticas'
import { Role } from '../../hooks/Types'

type Props = {
  rol:Role
}

const Politicas: FC<Props> = ({rol}) => {
  return (
    <div className={`card`}>
      <div className='card-header py-0'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Politicas de Monitoreo</span>
        </h3>
      </div>
      <div className='card-body py-3 px-6'>
        <ProviderPoliticas rol={rol}/>
      </div>
    </div>
  )
}

export { Politicas }
