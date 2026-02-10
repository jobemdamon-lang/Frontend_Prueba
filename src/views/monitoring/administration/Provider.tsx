import { FC, useEffect, useState } from 'react'
import { ModuleProps } from '../../../helpers/Types'

import { useModal } from '../../../hooks/useModal'
import { AdministrationProvider } from './Context'
import { AdministrationModal } from './AdministrationModal'
import { MetricView } from './Content/MetricView'
import { useMetric } from './hooks/useMetric'
import { useMetricParams } from './hooks/useMetricParam'
import { MetricCatalog } from './Types'
import { ParamView } from './Content/ParamView'

const Provider: FC<ModuleProps> = ({ rol }) => {

    const [currentView, setCurrentView] = useState<{ view: 'metric' | 'param', metric: MetricCatalog | null }>({ view: 'metric', metric: null })
    const modalHook = useModal()
    const metricHook = useMetric()
    const metricParamHook = useMetricParams()

    useEffect(() => {
        metricHook.getMetrics()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <AdministrationProvider value={{
            rol,
            currentView,
            setCurrentView,
            modalHook,
            metricHook,
            metricParamHook
        }}>
            <div className={`${currentView.view === 'metric' ? 'd-block' : 'd-none'}`}>
                <MetricView />
            </div>
            <div className={`${currentView.view === 'param' ? 'd-block' : 'd-none'}`}>
                <ParamView />
            </div>
            <AdministrationModal />
        </AdministrationProvider>
    )
}

export { Provider }