/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'

const Spinner: FC = () => {
   return (
      <div className='spinner-border spinner-border-md' role='status' style={{ width: '18px', height: '18px' }}></div>
   )
}

export { Spinner }
