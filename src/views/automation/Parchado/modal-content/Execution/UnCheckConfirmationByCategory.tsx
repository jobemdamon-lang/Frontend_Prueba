import { FC, useState } from "react"
import { KTSVG } from "../../../../../helpers"
import { IModalFunctions } from "../../../../../hooks/Types"
import { unCheckPatcheByCategory } from "./transformFormat"
import { IGroupsWithServersWithPatchesFront } from "../../../Types"
import { Input } from "../../../../../components/Inputs/TextInput"

type Props = { executionModalFunctions: IModalFunctions }
type modalInfo = {
  setGroupsServersPatchesFront: React.Dispatch<React.SetStateAction<IGroupsWithServersWithPatchesFront[]>>,
  categoryName: string
}

const UnCheckConfirmationByCategory: FC<Props> = ({ executionModalFunctions }) => {

  const [reasonToUncheck, setReasonToUncheck] = useState("")
  const modalInformation: modalInfo = executionModalFunctions.modalInformation

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    modalInformation.setGroupsServersPatchesFront((prev) => (
      unCheckPatcheByCategory(prev, modalInformation.categoryName, reasonToUncheck, false)
    ))
    executionModalFunctions.closeModal()
  }

  return (
    <>
      <div className='modal-header py-4 bg-dark'>
        <h2 className="text-white">CONFIRMACIÓN DE DESELECCIÓN</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => executionModalFunctions.closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body border border-dark'>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-5">
          <div>
            <label className="form-label">Ingrese Motivo de Deselección</label>
            <Input
              required
              label="Motivo de excepción"
              value={reasonToUncheck}
              onChange={setReasonToUncheck}
            />
          </div>
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-success btn-sm"
              type="submit"
            >
              Confirmar
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => executionModalFunctions.closeModal()}
            >
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </>
  )
}
export { UnCheckConfirmationByCategory }
