import { useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../../Context';
import { ModalSize, ModalView } from '../../Types';
import { ActionButton } from './ActionButton';

const ActionsButtons = () => {

  const [ canCreateGroup , setCanCreateGroup ] = useState<boolean>(false) 
  const { groupPoliticsData, openModal, selectedOwner, selectedGroupPolicies } = useContext(Context)
  const isFirstRender = useRef(true)

  useEffect(()=>{
    setCanCreateGroup((groupPoliticsData.length !== 0 || isFirstRender.current) ? false : true)
    isFirstRender.current = false
  },[groupPoliticsData])

  return (
    <section className='d-flex flex-direction-row justify-content-end gap-8'>
      {/* <ActionButton
        tooltipInfo= "Descargar Politicas por Cliente"
        svgPath = "/media/icons/duotune/files/fil017.svg"
      />
      <ActionButton
        tooltipInfo= "Descargar Politicas por Proyecto"
        svgPath = "/media/icons/duotune/files/fil017.svg"
      /> */}
      <ActionButton
        tooltipInfo= "Crear Grupo"
        svgPath = "/media/icons/duotune/files/fil005.svg"
        disabled = {!canCreateGroup}
        onClickFunc={()=> openModal(ModalView.CREATE_GROUP,ModalSize.SM, selectedOwner )}
      />
      {/* <ActionButton
        tooltipInfo= "Eliminar Grupo"
        svgPath = "/media/icons/duotune/files/fil007.svg"
      /> */}
      <ActionButton
        tooltipInfo= "Buscar Solicitud"
        svgPath = "/media/icons/duotune/files/fil024.svg"
        onClickFunc={()=> openModal(ModalView.SEARCH_REQUEST,ModalSize.SM)}
      />
      <ActionButton
        tooltipInfo= "Solicitar Cambio"
        svgPath = "/media/icons/duotune/files/fil011.svg"
        disabled={selectedGroupPolicies.value===""}
        onClickFunc={()=> openModal(ModalView.CHANGE_REQUEST,ModalSize.SM, selectedOwner )}
      />
    </section>
  )
}
export { ActionsButtons }