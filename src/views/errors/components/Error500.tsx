import { FC } from 'react'

const Error500: FC = () => {
   return (
      <>
         <h1 className='fw-bolder fs-3x text-gray-700 mb-8'>Error del sistema</h1>
         <div className='fw-bold fs-3 text-gray-400 mb-15'>
            ¡Algo salió mal! <br /> Vuelva a intentarlo más tarde.
         </div>
      </>
   )
}

export { Error500 }
