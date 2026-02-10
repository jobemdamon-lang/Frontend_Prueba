import { FC } from 'react'

const Error404: FC = () => {
   return (
      <>
         <h1 className='fw-bolder fs-3x text-gray-700 mb-8'>Página no encontrada</h1>
         <div className='fw-bold fs-3 text-gray-400 mb-15'>¡La página que buscaste no se encuentra!</div>
      </>
   )
}

export { Error404 }
