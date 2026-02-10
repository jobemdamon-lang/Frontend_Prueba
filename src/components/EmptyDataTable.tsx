import { FC } from 'react'

type Props = {
   description?: string
}

const EmptyDataTable: FC<Props> = ({ description = 'Procesando' }) => {
   const styles = {
      borderRadius: '0.475rem',
      boxShadow: '0 0 50px 0 rgb(82 63 105 / 15%)',
      backgroundColor: '#f4f5fb',
      color: '#7e8299',
      fontWeight: '500',
      margin: '0',
      width: 'auto',
      padding: '1rem 2rem',
      top: 'calc(50% - 12rem)',
      left: 'calc(50% - 20rem)',
   }

   return <div style={{ ...styles, position: 'absolute', textAlign: 'center' }}>{description} ...</div>
}

export { EmptyDataTable }
