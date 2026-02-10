import { FC, useEffect } from 'react'
import { Provider } from './components/ejecuciones/Provider'
import { AnalyticsService } from '../../helpers/analytics';


const Ejecuciones: FC = () => {
  useEffect(() => {
    AnalyticsService.event('view_backups_ejecucion', {
      module: 'ejecuciones_backups',
    })
  }, []);
  return (
    <div className={`card`}>
      <Provider />
    </div>
  )
}

export { Ejecuciones }
