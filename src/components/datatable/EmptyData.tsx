import { FC } from 'react'

const EmptyData: FC<{ loading: boolean, message?: string }> = ({ loading, message }) => {
   return (
      <div className='text-center w-100 py-4 border-bottom' style={{ height: '3.5rem', color: '#4e556e' }}>
         {loading || message ? message : 'No hay registros para mostrar'}
      </div>
   )
}

export { EmptyData }
