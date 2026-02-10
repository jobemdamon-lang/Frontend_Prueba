import { FC } from "react"
import { ComboBoxInput } from "./ComboBoxInput"
import { TextInput } from "./TextInput"
import { Form } from "react-bootstrap"

type Props = {
  ComboData: any
  taskCloneFunctions: any
}

const GeneralData: FC<Props> = ({ ComboData, taskCloneFunctions }) => {

  return (
    <div className="d-flex justify-content-around align-items-end flex-wrap gap-5 p-5">
      <div>
        <Form.Label>Nombre de Tarea</Form.Label>
        <TextInput value={taskCloneFunctions.clonedTask.nombre_tarea} label="Nombre de tarea" type="text" disabled={true} />
      </div>
      <ComboBoxInput value={taskCloneFunctions.clonedTask.tipo_tarea} label="Tipo de Tarea" data={ComboData.tipoTareaData} required={true} setNewValue={taskCloneFunctions.updateTipoTarea} />
      <ComboBoxInput value={taskCloneFunctions.clonedTask.tipo_backup} label="Tipo de Backup" data={ComboData.tipoBackupData} required={true} setNewValue={taskCloneFunctions.updateTipoBackup} />
      {/* <ComboBoxInput value={taskCloneFunctions.clonedTask.proteccion} label="Proteccion" data={ComboData.ProteccionData} required={true} setNewValue={taskCloneFunctions.updateProteccion} />
      <ComboBoxInput value={taskCloneFunctions.clonedTask.frecuencia} label="Frecuencia" data={ComboData.FrecuenciaData} required={true} setNewValue={taskCloneFunctions.updateFrecuencia} /> */}
      <ComboBoxInput value={taskCloneFunctions.clonedTask.modo} label="Modo" data={ComboData.ModoData} required={true} setNewValue={taskCloneFunctions.updateModo} />
      <ComboBoxInput value={taskCloneFunctions.clonedTask.contenido} label="Tipo de Dato a Respaldar" data={ComboData.DatoARespaldarData} required={true} setNewValue={taskCloneFunctions.updateContenido} />
      <div>
        <Form.Label>Ventana Inicio</Form.Label>
        <TextInput value={taskCloneFunctions.clonedTask.hora_vinicio} label="Ventana Inicio" type="time" setNewValue={taskCloneFunctions.updateHoraInicio} />
      </div>
      <div>
        <Form.Label>Ventana Fin</Form.Label>
        <TextInput value={taskCloneFunctions.clonedTask.hora_vfin} label="Ventana Fin" type="time" setNewValue={taskCloneFunctions.updateHoraFin} />
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
              <input
                type="checkbox"
                className="form-check-input border border-dark"
                checked={taskCloneFunctions.clonedTask.bks_lun === 0 ? false : true}
                onChange={(event) => taskCloneFunctions.updateLunes(event.target.checked)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                className="form-check-input border border-dark"
                checked={taskCloneFunctions.clonedTask.bks_mar === 0 ? false : true}
                onChange={(event) => taskCloneFunctions.updateMartes(event.target.checked)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                className="form-check-input border border-dark"
                checked={taskCloneFunctions.clonedTask.bks_mie === 0 ? false : true}
                onChange={(event) => taskCloneFunctions.updateMiercoles(event.target.checked)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                className="form-check-input border border-dark"
                checked={taskCloneFunctions.clonedTask.bks_jue === 0 ? false : true}
                onChange={(event) => taskCloneFunctions.updateJueves(event.target.checked)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                className="form-check-input border border-dark"
                checked={taskCloneFunctions.clonedTask.bks_vie === 0 ? false : true}
                onChange={(event) => taskCloneFunctions.updateViernes(event.target.checked)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                className="form-check-input border border-dark"
                checked={taskCloneFunctions.clonedTask.bks_sab === 0 ? false : true}
                onChange={(event) => taskCloneFunctions.updateSabado(event.target.checked)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                className="form-check-input border border-dark"
                checked={taskCloneFunctions.clonedTask.bks_dom === 0 ? false : true}
                onChange={(event) => taskCloneFunctions.updateDomingo(event.target.checked)}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
export { GeneralData }