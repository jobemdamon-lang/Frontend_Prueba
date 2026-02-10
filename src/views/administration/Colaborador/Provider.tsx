/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useEffect, useState } from 'react'
import { Context } from './Context'
import { Filters } from './Content/Filters'
import { Content } from './Content/Content'
import { ColabModal } from './ColabModal'
import { useModal } from '../hooks/useModal'
import { useComboData } from './hooks/useComboData'
import { useCollaborator } from './hooks/useCollaborator'


//Provee de datos y acciones que seran usados por los componentes hijos.
const Provider: FC = (): JSX.Element => {

   const { openModal, closeModal, modalView, sizeModal, showModal, modalInformation, setModalInformation } = useModal()
   const { areasData, fetchAreas } = useComboData()
   const { fetchCollabs, collabsData, loadingCollab } = useCollaborator({})
   const [preferences, setPreferences] = useState({ nombre: "", area: "" })
   const [nroFilteredCollabs, setNroCollabs] = useState(collabsData.length)

   useEffect(() => {
      fetchAreas()
      fetchCollabs()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   return (
      <Context.Provider value={{
         fetchCollabs,
         openModal,
         closeModal,
         modalView,
         sizeModal,
         showModal,
         modalInformation,
         setModalInformation,
         areasData,
         collabsData,
         setPreferences,
         preferences,
         setNroCollabs,
         nroFilteredCollabs,
         loadingCollab
      }} >
         <Filters />
         <div className='card-header rounded rounded-3 my-3'>
            <h3 className='card-title align-items-start flex-column'>
               <span className='card-label fw-bolder fs-3 mb-1 '>Lista de Colaboradores</span>
            </h3>
         </div>
         <div className='card-body py-3 px-6'>
            <Content />
         </div>
         <ColabModal />
      </Context.Provider>

   )
}

export { Provider }
