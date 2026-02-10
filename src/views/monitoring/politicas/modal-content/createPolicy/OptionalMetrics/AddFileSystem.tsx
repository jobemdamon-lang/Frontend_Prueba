import { KTSVG } from "../../../../../../helpers/components/KTSVG"
import { useContext, useState } from "react"
import { ContextPolitica } from "../../../ContextPolitica"
import { ICreateFileSystemMetric, IListEquipments } from "../../../Types"
//import { shallowEqual, useSelector } from "react-redux"
//import { RootState } from "../../../../../../store/ConfigStore"

type Props = {
  closeModalParams: any,
  modalInformationParams: {
    row: IListEquipments,
    idPolitica: string,
    idEquipo: number
  }
}
const AddFilesystem = ({ nro_version_ = 0 }: { nro_version_?: number }) => {

  //const user: string = useSelector<RootState>(({ auth }) => auth.usuario, shallowEqual) as string
  const { closeModalParams/*, modalInformationParams*/ }: Props = useContext(ContextPolitica)
  const [newFileSystemMetric, setFileSystemMetric] = useState<ICreateFileSystemMetric>({
    intervalo: 0,
    ruta_disco: ""
  })

  return (
    <>
      <div className='modal-header py-4 bg-dark' >
        <h2 className="text-white">Agregar Metrica de FileSystem</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => { closeModalParams() }}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body px-lg-10 border border-dark border-top-0 rounded-bottom'>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div className="d-flex justify-content-around my-10 flex-wrap gap-5">
            <div>
              <label>Ruta de Disco</label>
              <input
                value={newFileSystemMetric.ruta_disco}
                type="text"
                className="form-control w-250px my-2 bg-secondary"
                onChange={(event) => setFileSystemMetric((prev) => ({ ...prev, nro_puerto: event.target.value }))}
              />
            </div>
            <div>
              <label>Intervalo de Captura</label>
              <input
                value={newFileSystemMetric.intervalo}
                type="number"
                className="form-control w-250px my-2 bg-secondary"
                onChange={(event) => setFileSystemMetric((prev) => ({ ...prev, intervalo: parseInt(event.target.value) }))}
              />
            </div>
          </div>
          <button
            onClick={() => {

            }}
            className="btn btn-success my-5 w-50"
            disabled={false}>
            Crear Metrica
          </button>
        </div>
      </div>
    </>
  )
}

export { AddFilesystem }