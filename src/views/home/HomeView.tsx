import { Navigate, Outlet, Route, Routes, Link } from "react-router-dom"
import { PageLink, PageTitle } from '../../layout/core'
import { useEffect } from "react"
import { identifyUserInInstana } from "../../helpers/instana"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../../store/ConfigStore"
import { IChildrenModule, IParentModule } from "../../store/auth/Types"
import { useAutoLogout } from "../../hooks/useAutoLogout"
import { AnalyticsService } from "../../helpers/analytics"

import '@fortawesome/fontawesome-free/css/all.min.css'

const MonitoringBreadCrumbs: Array<PageLink> = [
  {
    title: 'Inicio',
    path: '/home',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const HomeView = ()=> {

  useAutoLogout()

  const usuario = useSelector<RootState>(({ auth }) => auth.usuario, shallowEqual) as string

   // permisos con los paths reales (vienen del backend)
  const permissionsAccess = useSelector<RootState>(({ auth }) => auth.permission, shallowEqual) as Array<IParentModule>

  const getRouteForModule = (moduleKey: string) => {
    if (!permissionsAccess || !Array.isArray(permissionsAccess)) return undefined

    const sanitize = (s?: string) => {
      if (!s) return ''
      // quitar asteriscos y slashes innecesarios
      return s.replace(/\*/g, '').replace(/^\/+|\/+$/g, '')
    }

    for (const parent of permissionsAccess) {
      const parentPath = sanitize(parent.Route_path)
      const children = parent.subModule || []
      const child = children.find((c: IChildrenModule) => c.Route_module === moduleKey)
      if (child) {
        const childPath = sanitize(child.Route_path)
        const parts = []
        if (parentPath) parts.push(parentPath)
        if (childPath) parts.push(childPath)
        if (parts.length === 0) return undefined
        return `/${parts.join('/')}`
      }
    }
    return undefined
  }

   // módulos que queremos como "atajos"
  const rutaPoliticasV2 = getRouteForModule('politicas_monitoreo_v2') || getRouteForModule('politicas_monitoreo') || undefined
  const rutaIncidencias = getRouteForModule('incident_center') || undefined
  const rutaAdministrateCMDB = getRouteForModule('equipments') || undefined

  useEffect(() => {
    if (process.env.REACT_APP_ENV === 'PROD' && usuario) {
        identifyUserInInstana(usuario);
    }
  }, [usuario])

  return (
    <Routes>
        <Route element={<Outlet />}>
            <Route
              path='menu'
              element={
                <>
                  <PageTitle breadcrumbs={MonitoringBreadCrumbs}>Menú</PageTitle>

                  <div style={{margin: "0 auto 40px auto", textAlign: "center", fontWeight: 700, fontSize: 32, maxWidth: 600}}>
                    Bienvenido al Nuevo Portal
                  </div>

                  {/* Shortcut cards: aparecen solo si resolvimos ruta desde permisos */}
                  <div style={{ display: 'flex', gap: 48, justifyContent: 'center', marginTop: 24, alignItems: 'stretch', flexWrap: 'wrap' }}>
                    {rutaPoliticasV2 && (
                      <Link to={rutaPoliticasV2} style={{ textDecoration: 'none', flex: '1 1 260px', maxWidth: 320 }} onClick={() => {AnalyticsService.event("click_shortcut_politicas", { module: "politicas_monitoreo" })}}>
                        <div style={{
                          minHeight: 180,
                          height: '100%',
                          borderRadius: 8,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                          padding: 20,
                          background: '#fff',
                          display: 'flex',
                          flexDirection: 'column',
                          color: '#222',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          justifyContent: 'flex-start'
                        }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                              <i className="fas fa-desktop" style={{ fontSize: 28, color: '#1976d2', marginRight: 12, minWidth: 32, textAlign: 'center' }}></i>
                              <span style={{ fontSize: 18, fontWeight: 600 }}>Monitoreo</span>
                            </div>
                            <div style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>Gestión de Políticas</div>
                            <div style={{ fontSize: 12, color: '#888', lineHeight: '1.4' }}>
                              Configure y administre las políticas de monitoreo para sus equipos y servicios. 
                              Defina umbrales y métricas para sus equipos.
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}

                    {rutaIncidencias && (
                      <Link to={rutaIncidencias} style={{ textDecoration: 'none', flex: '1 1 260px', maxWidth: 320 }} onClick={() => {AnalyticsService.event("click_shorcut_incidentes", { module: "incident_center" })}}>
                        <div style={{
                          minHeight: 180,
                          height: '100%',
                          borderRadius: 8,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                          padding: 20,
                          background: '#fff',
                          display: 'flex',
                          flexDirection: 'column',
                          color: '#222',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          justifyContent: 'flex-start'
                        }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                              <i className="fas fa-exclamation-triangle" style={{ fontSize: 28, color: '#e65100', marginRight: 12, minWidth: 32, textAlign: 'center' }}></i>
                              <span style={{ fontSize: 18, fontWeight: 600 }}>Centro de Incidencias</span>
                            </div>
                            <div style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>Gestión de incidencias</div>
                            <div style={{ fontSize: 12, color: '#888', lineHeight: '1.4' }}>
                              Gestione y resuelva incidencias de manera eficiente. Consulte el estado 
                              y realice seguimiento completo.
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}

                    {rutaAdministrateCMDB && (
                      <Link to={rutaAdministrateCMDB} style={{ textDecoration: 'none', flex: '1 1 260px', maxWidth: 320 }} onClick={() => {AnalyticsService.event("click_shortcut_administrar_cmbd", { module: "administrate_cmdb" }); }}>
                        <div style={{
                          minHeight: 180,
                          height: '100%',
                          borderRadius: 8,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                          padding: 20,
                          background: '#fff',
                          display: 'flex',
                          flexDirection: 'column',
                          color: '#222',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          justifyContent: 'flex-start'
                        }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                              <i className="fas fa-boxes" style={{ fontSize: 28, color: '#388e3c', marginRight: 12, minWidth: 32, textAlign: 'center' }}></i>
                              <span style={{ fontSize: 18, fontWeight: 600 }}>Inventario</span>
                            </div>
                            <div style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>Elementos de Configuración</div>
                            <div style={{ fontSize: 12, color: '#888', lineHeight: '1.4' }}>
                              Administre el inventario completo de equipos y activos. Consulte, 
                              actualice y mantenga la base de datos de configuración.
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                </>
              }
            />
            <Route index element={<Navigate to='/home/menu' />} />
            <Route path='*' element={<Navigate to='/error/404' />} />
        </Route>
      </Routes>
  )
}
export { HomeView }