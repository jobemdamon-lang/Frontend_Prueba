/* eslint-disable react/jsx-no-target-blank */
import { FC } from 'react'
import { AsideMenuItemWithSub } from './AsideMenuItemWithSub'
import { AsideMenuItem } from './AsideMenuItem'
import { IParentModule } from '../../../store/auth/Types'
import { shallowEqual, useSelector } from 'react-redux'
import { RootState } from '../../../store/ConfigStore'


const AsideMenuMain: FC = () => {
   const permissionsAccess: Array<IParentModule> = useSelector<RootState>(({ auth }) => auth.permission, shallowEqual) as Array<IParentModule>

   return (
      <>
         <AsideMenuItem
            to='/home'
            icon='/media/icons/duotune/art/art002.svg'
            title='Inicio'
            fontIcon='bi-app-indicator'
         />
         <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
               <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Módulos</span>
            </div>
         </div>
         {permissionsAccess.map((itemNav, index) => (
            <AsideMenuItemWithSub
               key={index}
               to={itemNav.Aside_to}
               title={itemNav.Aside_title}
               icon={`/media/icons/duotune/asideIcons/${itemNav.logo}`}
               fontIcon='bi-layers'
            >
               {itemNav.subModule.map((childrenNav, index) => (
                  <AsideMenuItem key={index} to={childrenNav.Aside_to} title={childrenNav.Aside_title} hasBullet={true} />
               ))}
            </AsideMenuItemWithSub>
         ))}

         {/* <AsideMenuItemWithSub
            to='/monitoring'
            title='Monitoreo'
            icon='/media/icons/duotune/general/gen025.svg'
            fontIcon='bi-layers'
         >
            <AsideMenuItem to='/monitoring/autoticket' title='Monitoreo autoticket' hasBullet={true} />
            <AsideMenuItem to='/monitoring/general' title='Monitoreo general' hasBullet={true} />
            <AsideMenuItem to='/monitoring/politicas' title='Politicas' hasBullet={true} />
            <AsideMenuItem to='/monitoring/eventos' title='Eventos' hasBullet={true} />
         </AsideMenuItemWithSub>
         <AsideMenuItemWithSub
            to='/inventories'
            title='Inventarios'
            icon='/media/icons/duotune/abstract/abs027.svg'
            fontIcon='bi-layers'
         >
            <AsideMenuItem to='/inventories/equipments' title='Elementos de Configuración' hasBullet={true} />
         </AsideMenuItemWithSub>
         <AsideMenuItemWithSub
            to='/backups'
            title='Backups'
            icon='/media/icons/duotune/abstract/abs039.svg'
            fontIcon='bi-layers'
         >
            <AsideMenuItem to='/backups/politicas' title='Politicas' hasBullet={true} />
            <AsideMenuItem to='/backups/ejecuciones' title='Ejecuciones' hasBullet={true} />
         </AsideMenuItemWithSub>
         <AsideMenuItemWithSub
            to='/administration'
            title='Administración'
            icon='/media/icons/duotune/communication/com014.svg'
            fontIcon='bi-layers'
         >
            <AsideMenuItem to='/administration/proyectos' title='Proyectos' hasBullet={true} />
            <AsideMenuItem to='/administration/colaborador' title='Colaboradores' hasBullet={true} />
         </AsideMenuItemWithSub> */}
      </>
   )
}

export { AsideMenuMain }
