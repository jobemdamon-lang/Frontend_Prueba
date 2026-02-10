import { createRoot } from 'react-dom/client'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import configStore, { persistor } from './store/ConfigStore'
import { Chart, registerables } from 'chart.js'
import { AppRoutes } from './routing/AppRoutes'
import reportWebVitals from './reportWebVitals'

import './assets/sass/style.scss'
import './assets/sass/plugins.scss'
import './assets/sass/style.react.scss'

Chart.register(...registerables)

const container = document.getElementById('root')
if (container) {
   createRoot(container).render(
      <Provider store={configStore}>
         {/* Asynchronously persist redux stores and show `SplashScreen` while it's loading. */}
         <PersistGate persistor={persistor} loading={<div>Loading...</div>}>
            <AppRoutes />
         </PersistGate>
      </Provider>
   )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
