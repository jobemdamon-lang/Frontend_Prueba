/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
/* import { PowerBIEmbed } from 'powerbi-client-react'
import { Report, models } from 'powerbi-client' */

const Eventos: FC = () => {
  return (
    <div className={`card`}>
      <div className='card-header py-0'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Dashboard de Eventos</span>
        </h3>
      </div>
      <div className='card-body py-3 px-6'>
        <iframe title="Informe centralizador de eventos" width="100%" height="720"  src="https://app.powerbi.com/reportEmbed?reportId=99433824-5934-46ca-8f4f-fa34e0663b99&autoAuth=true&ctid=0faacd36-7680-4441-817a-936a4e0244de" allowFullScreen={true}></iframe>
      </div>
    </div>
  )
}

export { Eventos }