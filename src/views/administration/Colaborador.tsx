import { FC } from 'react'
import { Provider } from './Colaborador/Provider'

type Props = {
   rol:string
 }

const Colaborador: FC<Props> = ({rol}) => {
   return (
      <div className={`card`}>
         <div className='card-header py-0'>
            <h3 className='card-title align-items-start flex-column'>
               <span className='card-label fw-bolder fs-3 mb-1'>Modulo de Colaboradores</span>
            </h3>
         </div>
         <div className='card-body py-3 px-6'>
            <div>
               <Provider />
            </div>
         </div>
      </div>
   )
}

export { Colaborador }
