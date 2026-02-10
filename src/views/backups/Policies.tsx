import { FC, useEffect } from 'react'
import { ModuleProps } from '../../helpers/Types'
import { Provider } from './policies/Provider'
import { AnalyticsService } from '../../helpers/analytics'

const Policies: FC<ModuleProps> = ({ rol }) => {
    useEffect(() => {
        AnalyticsService.event('view_backups_policies', {
            module: 'politicas_backups',
        })
    }, []);
    return (
        <div>
            <Provider rol={rol} />
        </div>
    )
}

export { Policies }
