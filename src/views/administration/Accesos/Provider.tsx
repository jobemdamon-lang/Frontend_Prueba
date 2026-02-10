/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useState } from 'react'
import { Context } from './Context'
import { GestionModulos } from './Content/ModuloSubmodulo/GestionModulos'
import { useModal } from '../hooks/useModal'
import { AccesosModal } from './AccesosModal'
import { ModalSize, ModalView } from '../Types'
import { GestionPerfiles } from './Content/GestionPerfiles/GestionPerfiles'
import { useProfile } from './hooks/useProfile'
import { Tab, Tabs } from '../../../components/Tabs'

//Provee de datos y acciones que seran usados por los componentes hijos.
const Provider: FC = (): JSX.Element => {

   const { openModal, closeModal, showModal, modalView, modalInformation, sizeModal } = useModal()
   const { fetchListprofile, profiles, profileLoading, fetchListProfileByArea, profilesByArea, profileByAreaLoading, addNewProfile,
      creationProfileLoading, deleteProfileOfArea, deleteProfileOfAreaLoading } = useProfile()
   //Usuario seleccionado para Gestion de Permisos
   const [selectedUser, setSelectedUser] = useState<{ nombre: string, id: number }>({ nombre: "", id: 0 })

   return (
      <Context.Provider value={{
         openModal,
         closeModal,
         showModal,
         modalView,
         modalInformation,
         sizeModal,
         setSelectedUser,
         selectedUser,
         fetchListprofile,
         profiles,
         profileLoading,
         fetchListProfileByArea,
         profilesByArea,
         profileByAreaLoading,
         addNewProfile,
         creationProfileLoading,
         deleteProfileOfArea,
         deleteProfileOfAreaLoading
      }} >
         <Tabs>
            <Tab title="Configuración de Modulos - Submodulos">
               <div className='card-body py-3 px-6 my-8'>
                  <div className='d-flex justify-content-end mx-5'>
                     <button className="btn btn-info" onClick={() => openModal(ModalView.NEW_MODULE, ModalSize.XL)}>Crear Modulo</button>
                  </div>
                  <GestionModulos />
               </div>
            </Tab>
            <Tab title="Gestion de Perfiles">
               <div className='card-body py-3 px-6 my-8'>
                  <div className='d-flex justify-content-end mx-5'>
                     <button className="btn btn-info" onClick={() => openModal(ModalView.NEW_PROFILE, ModalSize.XL)}>Crear Perfil</button>
                  </div>
                  <GestionPerfiles />
               </div>
            </Tab>
         </Tabs>
         <AccesosModal />
      </Context.Provider >

   )
}

export { Provider }
