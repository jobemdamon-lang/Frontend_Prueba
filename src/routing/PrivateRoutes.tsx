import { lazy, FC, Suspense, ReactNode } from 'react'
import { Route, Routes, Navigate, Outlet } from 'react-router-dom'
import { MasterLayout } from '../layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import { getCSSVariableValue } from '../assets/ts/_utils'
import { HomeView } from '../views/home/HomeView'
import { RootState } from '../store/ConfigStore'
import { IChildrenModule, IParentModule } from '../store/auth/Types'
import { shallowEqual, useSelector } from 'react-redux'
import { PageLink, PageTitle } from '../layout/core'
import React from 'react'
import { ModuleProps } from '../helpers/Types'

const PrivateRoutes = () => {

   const permissionsAccess: Array<IParentModule> = useSelector<RootState>(({ auth }) => auth.permission, shallowEqual) as Array<IParentModule>

   /* const InventoryView = lazy(() => import('../views/inventory/InventoryView'))
      const MonitoringView = lazy(() => import('../views/monitoring/MonitoringView'))
      const BackupsView = lazy(() => import('../views/backups/BackupView')) */
   const AutoTicket = lazy(() => import('../views/monitoring/AutoTicket').then((module) => ({ default: module.AutoTicket })))
   const General = lazy(() => import('../views/monitoring/General').then((module) => ({ default: module.General })))
   const Eventos = lazy(() => import('../views/monitoring/Eventos').then((module) => ({ default: module.Eventos })))
   const Administracion = lazy(() => import('../views/monitoring/Administration').then((module) => ({ default: module.Administration })))
   const PoliticasV2 = lazy(() => import('../views/monitoring/Policies').then((module) => ({ default: module.Policies })))
   const PoliticasMonitoreo = lazy(() => import('../views/monitoring/Politicas').then((module) => ({ default: module.Politicas })))
   const ConfigurationItems = lazy(() => import('../views/inventory/ConfigurationItems').then((module) => ({ default: module.ConfigurationItems })))
   const AdministrateCMDB = lazy(() => import('../views/inventory/AdministrateCMDB').then((module) => ({ default: module.AdministrateCMDB })))
   const PoliticasBackups = lazy(() => import('../views/backups/Politicas').then((module) => ({ default: module.Politicas })))
   const Ejecuciones = lazy(() => import('../views/backups/Ejecuciones').then((module) => ({ default: module.Ejecuciones })))
   const Proyecto = lazy(() => import('../views/administration/Project').then((module) => ({ default: module.Project })))
   const Colaborador = lazy(() => import('../views/administration/UserAdministration').then((module) => ({ default: module.UserAdministration })))
   const Accesos = lazy(() => import('../views/administration/Accesos').then((module) => ({ default: module.Accesos })))
   const Incidencias = lazy(() => import('../views/IncidentCenter/Incidencias').then((module) => ({ default: module.Incidencias })))
   const Parchado = lazy(() => import('../views/automation/ParchadoWindows').then((module) => ({ default: module.WindowsPatch })))
   const Aplication = lazy(() => import('../views/administration/Aplication').then((module) => ({ default: module.Aplication })))
   const ParchadoLinux = lazy(() => import('../views/automation/ParchadoLinux').then((module) => ({ default: module.LinuxPatch })))
   const ServerProvisioning = lazy(() => import('../views/provisioning/ServerProvisioning').then((module) => ({ default: module.ProvisioningServer })))
   const PoliticasBackupsV2 = lazy(() => import('../views/backups/Policies').then((module) => ({ default: module.Policies })))

   interface IauthSubRouteList {
      autoticket: any,
      general: any,
      eventos_monitoreo: React.LazyExoticComponent<FC<ModuleProps>>,
      politicas_monitoreo: React.LazyExoticComponent<FC<ModuleProps>>,
      politicas_monitoreo_v2: React.LazyExoticComponent<FC<ModuleProps>>,
      equipments: React.LazyExoticComponent<FC<ModuleProps>>,
      politicas_backups: any,
      ejecuciones_backups: React.LazyExoticComponent<FC<ModuleProps>>,
      proyectos: any,
      colaborador: any,
      accesos: any,
      incident_center: React.LazyExoticComponent<FC<ModuleProps>>,
      parchado: React.LazyExoticComponent<FC<ModuleProps>>,
      administrate_cmdb: React.LazyExoticComponent<FC<ModuleProps>>,
      aplication_configuration: React.LazyExoticComponent<FC<ModuleProps>>,
      parchado_linux: React.LazyExoticComponent<FC<ModuleProps>>,
      aprovisionamiento_solicitudes: React.LazyExoticComponent<FC<ModuleProps>>,
      monitoreo_administracion: React.LazyExoticComponent<FC<ModuleProps>>,
      politicas_backups_v2: React.LazyExoticComponent<FC<ModuleProps>>
   }

   const authSubRouteList: IauthSubRouteList = {
      autoticket: AutoTicket,
      general: General,
      equipments: ConfigurationItems,
      politicas_backups: PoliticasBackups,
      accesos: Accesos,
      colaborador: Colaborador,
      ejecuciones_backups: Ejecuciones,
      eventos_monitoreo: Eventos,
      politicas_monitoreo: PoliticasMonitoreo,
      politicas_monitoreo_v2: PoliticasV2,
      proyectos: Proyecto,
      incident_center: Incidencias,
      parchado: Parchado,
      administrate_cmdb: AdministrateCMDB,
      aplication_configuration: Aplication,
      parchado_linux: ParchadoLinux,
      aprovisionamiento_solicitudes: ServerProvisioning,
      monitoreo_administracion: Administracion,
      politicas_backups_v2: PoliticasBackupsV2
   }

   const buildBreadCrumbs = (submodules: Array<IChildrenModule>): Array<PageLink> => {
      return submodules.map((item: IChildrenModule) => {
         return {
            title: item.RouteTitle,
            path: item.Aside_to,
            isSeparator: false,
            isActive: false,
         }
      })
   }

   return (
      <Routes>
         <Route element={<MasterLayout />}>
            {/* Redirect to Dashboard after success login/registartion */}
            <Route path='auth/*' element={<Navigate to='/home' />} />
            {/* Pages */}
            <Route
               path='home/*'
               element={
                  <SuspensedView>
                     <HomeView />
                  </SuspensedView>
               }
            />
            {permissionsAccess.map((mainRoute, index) => (
               <Route
                  key={index}
                  path={mainRoute.Route_path}
                  element={
                     <Routes>
                        <Route element={<Outlet />}>
                           {mainRoute.subModule.map((childrenRoute, index) => (
                              <Route
                                 key={index}
                                 path={childrenRoute.Route_path}
                                 element={
                                    <SuspensedView>
                                       <PageTitle breadcrumbs={buildBreadCrumbs(mainRoute.subModule)}>{childrenRoute.RouteTitle}</PageTitle>
                                       {React.createElement(authSubRouteList[childrenRoute.Route_module as keyof IauthSubRouteList],
                                          {
                                             key: index,
                                             rol: childrenRoute.Rol
                                          })}
                                    </SuspensedView>
                                 }
                              />
                           ))}
                           <Route index element={<Navigate to={mainRoute.Route_defaultRoute} />} />
                           <Route path='*' element={<Navigate to='/error/404' />} />
                        </Route>
                     </Routes>
                  }
               />
            ))}

            {/* Lazy Modules */}
            {/* <Route
               path='monitoring/*'
               element={
                  <SuspensedView>
                     <MonitoringView />
                  </SuspensedView>
               }
            />
            <Route
               path='inventories/*'
               element={
                  <SuspensedView>
                     <InventoryView />
                  </SuspensedView>
               }
            />
            <Route
               path='backups/*'
               element={
                  <SuspensedView>
                     <BackupsView />
                  </SuspensedView>
               }
            />
            <Route
               path='administration/*'
               element={
                  <SuspensedView>
                     <AdministrationView />
                  </SuspensedView>
               }
            /> */}
            {/* Page Not Found */}
            <Route path='*' element={<Navigate to='/error/404' />} />
         </Route>
      </Routes>
   )
}

const SuspensedView: FC<{ children?: ReactNode }> = ({ children }) => {
   const baseColor = getCSSVariableValue('--kt-primary')
   TopBarProgress.config({
      barColors: {
         '0': baseColor,
      },
      barThickness: 1,
      shadowBlur: 5,
   })
   return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export { PrivateRoutes }
