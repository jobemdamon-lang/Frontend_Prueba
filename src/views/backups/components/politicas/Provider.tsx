/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useEffect } from 'react'
import { Context } from './Context'
import { Content } from './content/Content'
import { FilterSection } from './content/filter/FilterSection'
import { useState } from 'react'
import { BackupModal } from './modal/PolliciesModal'
import { MenuComponent } from '../../../../assets/ts/components/MenuComponent'
import { usePolitics } from '../../hooks/usePolitics'
import { useRequestChanges } from '../../hooks/useRequestChanges'
import { useGroupPolitics } from '../../hooks/useGroupPolitics'
import { useModal } from '../../hooks/useModal'
import { IClientProject, IGroupPoliciesDataListFormat } from './Types'
import { OffCanvasContainer } from './OffCanvas/OffCanvasContainer'
import { useComboData } from '../../hooks/useComboData'

//Provee de datos y acciones que seran usados por los componentes hijos.
const Provider: FC = (): JSX.Element => {
   
   const { fetchPolitics , policiesData, policiesLoading } = usePolitics()
   const [selectedGroupPolicies, setSelectedGroupPolicies] = useState<IGroupPoliciesDataListFormat>({id:0,value:""})
   const { openModal, closeModal, modalView, sizeModal, showModal, modalInformation, setModalInformation, refreshTask} = useModal()
   const {groupPoliticsData, fetchGroupPolitics, groupPoliticsFetchStatus, groupPoliticsDataErrorMessage, createGroupPolitics,
          groupPoliticsCreateStatus, loadingCreateGroup, showNotification } = useGroupPolitics({closeModal})
   const {fetchRequestChanges, requestChangesData, requestChangesLoading } = useRequestChanges()
   const [selectedOwner , setSelectedOwner] = useState<IClientProject>({cliente:"", proyecto:""})
   const ComboData = useComboData()
   
   useEffect(() => {
      MenuComponent.reinitialization()
      ComboData.fetchBackupTipoTarea()
      ComboData.fetchBackupTipo()
      ComboData.fetchBackupProteccion()
      ComboData.fetchBackupFrecuencia()
      ComboData.fetchBackupHerramienta()
      ComboData.fetchBackupModo()
      ComboData.fetchBackupTipoDatoARespaldar()
      ComboData.fetchMedioData()
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   return (
      <Context.Provider value={{ 
         fetchPolitics,
         policiesData,
         policiesLoading,
         groupPoliticsData,
         fetchGroupPolitics,
         groupPoliticsCreateStatus,
         showNotification,
         loadingCreateGroup, 
         createGroupPolitics,
         groupPoliticsFetchStatus,
         groupPoliticsDataErrorMessage,
         fetchRequestChanges,
         requestChangesData,
         requestChangesLoading,
         openModal,
         closeModal,
         modalView,
         sizeModal,
         showModal,
         modalInformation,
         setModalInformation,
         refreshTask,
         selectedOwner,
         setSelectedOwner,
         selectedGroupPolicies,
         setSelectedGroupPolicies,
         ComboData
       }} >
         <FilterSection/>
         <div className='card-header rounded rounded-3 my-3'>
            <h3 className='card-title align-items-start flex-column'>
               <span className='card-label fw-bolder fs-3 mb-1 '>Lista de Backups</span>
            </h3>
         </div>
         <div className='card-body py-3 px-6'>
            <Content />
         </div>
         <BackupModal/>
         <OffCanvasContainer/>
      </Context.Provider>  
      
   )
}

export { Provider }
