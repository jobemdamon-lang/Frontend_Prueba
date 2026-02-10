import { FC } from "react"
import { Form } from "react-bootstrap"
import { ITask } from "../../../Types"
import { ComboBoxInput } from "./ComboBoxInput"
import { TextInput } from "./TextInput"

type Props = {
  ComboData: any
  taskInfo: ITask | undefined
}

const GeneralData: FC<Props> = ({ ComboData, taskInfo }) => {

  return (
    <div className="d-flex justify-content-around align-items-end flex-wrap gap-5 p-5">
      <div>
        <Form.Label>Nombre de Tarea</Form.Label>
        <TextInput value={taskInfo?.nombre_tarea} label="Nombre de la Tarea" disabled={true} />
      </div>
      <ComboBoxInput value={taskInfo?.tipo_tarea} label="Tipo de Tarea" data={ComboData.tipoTareaData} disabled={true} />
      <ComboBoxInput value={taskInfo?.tipo_backup} label="Tipo de Backup" data={ComboData.tipoBackupData} disabled={true} />
      <ComboBoxInput value={taskInfo?.proteccion} label="Proteccion" data={ComboData.ProteccionData} disabled={true} />
      <ComboBoxInput value={taskInfo?.frecuencia} label="Frecuencia" data={ComboData.FrecuenciaData} disabled={true} />
      <ComboBoxInput value={taskInfo?.modo} label="Modo" data={ComboData.ModoData} disabled={true} />
      <ComboBoxInput value={taskInfo?.contenido} label="Tipo de Dato a Respaldar" data={ComboData.DatoARespaldarData} disabled={true} />
      <div>
        <Form.Label>Ventana de Inicio</Form.Label>
        <TextInput value={taskInfo?.hora_vinicio} label="Ventana Inicio" disabled={true} type="time" />
      </div>
      <div>
        <Form.Label>Ventana Fin</Form.Label>
        <TextInput value={taskInfo?.hora_vfin} label="Ventana Fin" disabled={true} type="time" />
      </div>
      <table className="table">
        <thead className="bg-primary text-white text-center">
          <tr>
            <th scope="col" className="rounded-start">Lunes</th>
            <th scope="col" >Martes</th>
            <th scope="col" >Miercoles</th>
            <th scope="col" >Jueves</th>
            <th scope="col" >Viernes</th>
            <th scope="col" >Sabado</th>
            <th scope="col" className="rounded-end">Domingo</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td>
              <input type="checkbox" className="form-check-input border border-dark " disabled={true} checked={taskInfo?.bks_lun === 0 ? false : true} />
            </td>
            <td>
              <input type="checkbox" className="form-check-input border border-dark" disabled={true} checked={taskInfo?.bks_mar === 0 ? false : true} />
            </td>
            <td>
              <input type="checkbox" className="form-check-input border border-dark" disabled={true} checked={taskInfo?.bks_mie === 0 ? false : true} />
            </td>
            <td>
              <input type="checkbox" className="form-check-input border border-dark" disabled={true} checked={taskInfo?.bks_jue === 0 ? false : true} />
            </td>
            <td>
              <input type="checkbox" className="form-check-input border border-dark" disabled={true} checked={taskInfo?.bks_vie === 0 ? false : true} />
            </td>
            <td>
              <input type="checkbox" className="form-check-input border border-dark" disabled={true} checked={taskInfo?.bks_sab === 0 ? false : true} />
            </td>
            <td>
              <input type="checkbox" className="form-check-input border border-dark" disabled={true} checked={taskInfo?.bks_dom === 0 ? false : true} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
export { GeneralData }