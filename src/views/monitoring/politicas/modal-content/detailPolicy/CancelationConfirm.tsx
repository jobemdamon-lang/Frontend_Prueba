import { FC, useContext } from "react"
import { ContextPolitica } from "../../ContextPolitica"
import { KTSVG } from "../../../../../helpers/components/KTSVG"
import { IMonitoringPolicyVersions, IOwner } from "../../Types"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../../../../../store/ConfigStore"

type Props = {
  cancelUpdatingPolicy: Function,
  cancelupdatePolicyLoading: boolean
}

const CancelationConfirm: FC<Props> = ({ cancelUpdatingPolicy, cancelupdatePolicyLoading }) => {

  const { closeModalParams, modalInformation, selectedOwner, closeModal }:
    { closeModalParams: any, modalInformation: IMonitoringPolicyVersions, selectedOwner: IOwner, closeModal: Function } = useContext(ContextPolitica)
  const username: string = useSelector<RootState>(({ auth }) => auth.usuario, shallowEqual) as string

  return (
    <>
      <div className='modal-header py-4 bg-dark'>
        <h2 className="text-white">CANCELAR VERSION {modalInformation.NRO_VERSION}</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModalParams()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body px-lg-10 border border-dark border-top-0 rounded-bottom d-flex justify-content-center flex-column gap-5'>
        <p className="fs-4 text-center">¿Esta seguro que desea cancelar?</p>
        <i className="fs-3 text-center">Esta accion eliminará todos los cambios realizados en esta versión por tí u otros usuarios en caso existan.</i>
        <div className="d-flex justify-content-center">
          <button
            disabled={cancelupdatePolicyLoading}
            className="btn btn-danger w-25"
            onClick={() => cancelUpdatingPolicy(modalInformation.ID_POLITICA.toString(), modalInformation.NRO_VERSION.toString(), username, selectedOwner.id_proyecto, closeModalParams, closeModal)}
          >
            {cancelupdatePolicyLoading ? "Cancelando..." : "Cancelar Cambios"}
          </button>
        </div>

      </div>
    </>
  )
}
export { CancelationConfirm }