import { useContext } from "react"
import { ContextPolitica } from "../../ContextPolitica"
import { KTSVG } from "../../../../../helpers/components/KTSVG"
import { IOwner } from "../../Types"
import { ProcessContainer } from "./ProcessContainer"

type Props = {
  selectedOwner: IOwner,
  closeModal: any
}

const CreateNewPolicy = () => {

  const { closeModal, selectedOwner } = useContext<Props>(ContextPolitica)

  return (
    <>
      <div className='modal-header py-4'>
        <h2>Nueva Politica de Monitoreo | {selectedOwner.proyecto}</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body px-lg-10'>
        <ProcessContainer/>
      </div>
    </>
  )
}
export { CreateNewPolicy }