/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import "../../../../../assets/sass/components/backups-styles/_policies_general.scss"
import { PoliciesTable } from './TableData/PoliciesTable';
import { ChangesTable } from './TableData/RequestChangeOR/ChangesTable';
import { Tab, Tabs } from '../../../../../components/Tabs';

const Content: FC = () => {

   return (
      <Tabs>
         <Tab title="Politicas">
            <PoliciesTable />
         </Tab>
         <Tab title="Solicitudes de Cambios">
            <ChangesTable />
         </Tab>
      </Tabs>
   )
}

export { Content }
