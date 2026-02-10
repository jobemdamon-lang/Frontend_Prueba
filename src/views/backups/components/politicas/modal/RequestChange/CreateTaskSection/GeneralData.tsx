import { FC } from "react"
import { ComboBoxInput } from "./ComboBoxInput"
import { TextInput } from "./TextInput"
import { Form } from "react-bootstrap"

type Props = {
  ComboData: any
  taskFunctions: any
}

const GeneralData: FC<Props> = ({ ComboData, taskFunctions }) => {

  return (
    <div className="d-flex justify-content-around align-items-end flex-wrap gap-5 p-5">
      <ComboBoxInput value={taskFunctions.newTask.tipo_tarea} label="Tipo de Tarea" data={ComboData.tipoTareaData} required={true} setNewValue={taskFunctions.updateTipoTarea} />
      <ComboBoxInput value={taskFunctions.newTask.tipo_backup} label="Tipo de Backup" data={ComboData.tipoBackupData} required={true} setNewValue={taskFunctions.updateTipoBackup} />
     {/*  <ComboBoxInput value={taskFunctions.newTask.proteccion} label="Proteccion" data={ComboData.ProteccionData} required={true} setNewValue={taskFunctions.updateProteccion} />
      <ComboBoxInput value={taskFunctions.newTask.frecuencia} label="Frecuencia" data={ComboData.FrecuenciaData} required={true} setNewValue={taskFunctions.updateFrecuencia} /> */}
      <ComboBoxInput value={taskFunctions.newTask.modo} label="Modo" data={ComboData.ModoData} required={true} setNewValue={taskFunctions.updateModo} />
      <ComboBoxInput value={taskFunctions.newTask.contenido} label="Tipo de Dato a Respaldar" data={ComboData.DatoARespaldarData} required={true} setNewValue={taskFunctions.updateContenido} />
      <div>
        <Form.Label>Ventana Inicio</Form.Label>
        <TextInput value={taskFunctions.newTask.hora_vinicio} label="Ventana Inicio" type="time" setNewValue={taskFunctions.updateHoraInicio} />
      </div>
      <div>
        <Form.Label>Ventana Fin</Form.Label>
        <TextInput value={taskFunctions.newTask.hora_vfin} label="Ventana Fin" type="time" setNewValue={taskFunctions.updateHoraFin} />
      </div>
      <table className="table mt-2">
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
                className="form-check-input border border-dark "
                checked={taskFunctions.newTask.bks_lun === 0 ? false : true}
                onChange={(event) => taskFunctions.updateLunes(event.target.checked)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                className="form-check-input border border-dark"
                checked={taskFunctions.newTask.bks_mar === 0 ? false : true}
                onChange={(event) => taskFunctions.updateMartes(event.target.checked)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                className="form-check-input border border-dark"
                checked={taskFunctions.newTask.bks_mie === 0 ? false : true}
                onChange={(event) => taskFunctions.updateMiercoles(event.target.checked)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                className="form-check-input border border-dark"
                checked={taskFunctions.newTask.bks_jue === 0 ? false : true}
                onChange={(event) => taskFunctions.updateJueves(event.target.checked)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                className="form-check-input border border-dark"
                checked={taskFunctions.newTask.bks_vie === 0 ? false : true}
                onChange={(event) => taskFunctions.updateViernes(event.target.checked)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                className="form-check-input border border-dark"
                checked={taskFunctions.newTask.bks_sab === 0 ? false : true}
                onChange={(event) => taskFunctions.updateSabado(event.target.checked)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                className="form-check-input border border-dark"
                checked={taskFunctions.newTask.bks_dom === 0 ? false : true}
                onChange={(event) => taskFunctions.updateDomingo(event.target.checked)}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
export { GeneralData }