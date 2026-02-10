/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react'
import { ContextPolitica } from './ContextPolitica'
import { ContentPoliticasIM } from './ContentPoliticasIM'
import { FilterSection } from './FilterSection'
import { ModalPolitica } from './ModalPolitica'
import { useModal } from './hooks/useModal'
import { IOwner } from './Types'
import "../../../assets/sass/components/tabs-custom.scss"
import { usePolicy } from './hooks/usePolicy'
import { useModalParams } from './hooks/useModalParams'
import { useModalUpdatePolicy } from './hooks/useModalUpdatePolicy'
import { ContentPoliticasOT } from './ContentPoliticasOT'
import { Tab, Tabs } from '../../../components/Tabs'
import { Role } from '../../../hooks/Types'

/**
 * Provee de datos y acciones que seran usados por los componentes hijos.
 */
const ProviderPoliticas = ({ rol }: { rol: Role }) => {

  const [selectedOwner, setSelectedOwner] = useState<IOwner>({ cliente: "", proyecto: "", id_proyecto: 0 })
  const { openModal, closeModal, showModal, modalView, modalInformation, sizeModal, fullsize } = useModal()
  const { openModalParams, closeModalParams, showModalParams, modalViewParams, modalInformationParams, setModalInformationParams } = useModalParams()
  const { getListPoliciesByProject, fetchPoliciesByProjectLoading, policiesByProject, updatePolicyNewVersion, updatePolicyLoading, createPolicy, updateStateOfPolicy, updateStateOfPolicyLoading, cancelUpdatingPolicy, cancelupdatePolicyLoading,
    deleteCIsOfPolicy, deletingCIsOfPolicyLoading, updateTools, updateToolsLoading } = usePolicy()
  const { openModalUpdatePolicy, closeModalUpdatePolicy, showModalUpdatePolicyModal, modalViewUpdatePolicy, modalInformationUpdatePolicy } = useModalUpdatePolicy()

  return (
    <ContextPolitica.Provider
      value={{
        openModal,
        closeModal,
        showModal,
        modalView,
        modalInformation,
        selectedOwner,
        sizeModal,
        fullsize,
        setSelectedOwner,
        getListPoliciesByProject,
        fetchPoliciesByProjectLoading,
        policiesByProject,
        openModalParams,
        closeModalParams,
        showModalParams,
        modalViewParams,
        modalInformationParams,
        setModalInformationParams,
        openModalUpdatePolicy,
        closeModalUpdatePolicy,
        showModalUpdatePolicyModal,
        modalViewUpdatePolicy,
        modalInformationUpdatePolicy,
        updatePolicyNewVersion,
        updatePolicyLoading,
        createPolicy,
        updateStateOfPolicy,
        updateStateOfPolicyLoading,
        cancelUpdatingPolicy,
        cancelupdatePolicyLoading,
        deleteCIsOfPolicy,
        deletingCIsOfPolicyLoading,
        updateTools,
        updateToolsLoading,
        rol
      }}
    >
      <FilterSection />
      <div className='card-header rounded rounded-3'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1 '>Lista de Politicas</span>
        </h3>
      </div>
      <Tabs>
        <Tab title="Versiones de Politica">
          <ContentPoliticasIM />
        </Tab>
        <Tab title="Cambios en Proceso">
          <ContentPoliticasOT />
        </Tab>
      </Tabs>
      <ModalPolitica />
    </ContextPolitica.Provider>
  )
}

export { ProviderPoliticas }
