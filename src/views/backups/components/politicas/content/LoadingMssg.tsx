import { FC } from 'react'

type Props = {
   description?: string
}

const LoadingMssg: FC<Props> = ({ description = 'Procesando' }) => {
   const styles = {
      borderRadius: '0.475rem',
      boxShadow: '0 0 50px 0 rgb(82 63 105 / 15%)',
      backgroundColor: '#fff',
      color: '#7e8299',
      fontWeight: '500',
      margin: '10px',
      width: 'auto',
      padding: '1rem 2rem',
      top: 'calc(50% - 2rem)',
      left: 'calc(50% - 4rem)',
   }

   return <div style={{ ...styles, textAlign: 'center' }}>{description} ...</div>
}

export { LoadingMssg }
