/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import { Provider } from './components/Provider'

type Props = {
   rol:string
}

const AutoTicket: FC<Props> = ({rol}) => {
   return (
      <div className={`card`}>
         <div className='card-header py-0'>
            <h3 className='card-title align-items-start flex-column'>
               <span className='card-label fw-bolder fs-3 mb-1'>Lista de registros</span>
            </h3>
         </div>
         <div className='card-body py-3 px-6'>
            <div>
               <Provider itipo={1} />
            </div>
         </div>
      </div>
   )
}

export { AutoTicket }
