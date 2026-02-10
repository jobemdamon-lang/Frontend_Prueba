/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useEffect, useState } from 'react'
import "../../../assets/sass/components/InventoryFilter/data-list-input-styles.scss"
import "../../../assets/sass/components/administrattion-styles/filters-section.scss"
import { Context } from './Context'
import { Content } from './Content/Content'
import { ProjectModal } from './ProjectModal'
import { useClient } from '../../../hooks/useClient'
import { useModal } from '../../../hooks/useModal'
import { useProject } from '../../../hooks/useProjects'
import { useAdministration } from './hooks/useAdministration'

//Provee de datos y acciones que seran usados por los componentes hijos.
const Provider: FC = (): JSX.Element => {

  const projectHook = useProject()
  const modalHook = useModal()
  const [isCreateClientVisible, setIsVisibility] = useState(false)
  const clientHook = useClient()
  const administrateHook = useAdministration()

  useEffect(() => {
    administrateHook.getStateProjectData()
    administrateHook.getTypeProjectData()
    clientHook.getClients()
    administrateHook.getCollabData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Context.Provider value={{
      projectHook,
      modalHook,
      isCreateClientVisible,
      setIsVisibility,
      clientHook,
      administrateHook
    }} >
      <div className='card-body py-3 px-6'>
        <div className='accordion' id='kt_accordion_backups'>
          <Content />
          <ProjectModal />
        </div>
      </div>
    </Context.Provider>

  )
}

export { Provider }