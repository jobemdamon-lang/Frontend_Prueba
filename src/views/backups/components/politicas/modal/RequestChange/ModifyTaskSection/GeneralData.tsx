import { FC } from "react"
import { ComboBoxInput } from "./ComboBoxInput"
import { TextInput } from "./TextInput"
import { Form } from "react-bootstrap"

type Props = {
  ComboData: any
  taskModifiedFunctions: any
}

const GeneralData: FC<Props> = ({ ComboData, taskModifiedFunctions }) => {

  return (
    <div className="d-flex justify-content-around align-items-end flex-wrap gap-5 p-5">
      <div>
        <Form.Label>Nombre de Tarea</Form.Label>
        <TextInput value={taskModifiedFunctions.modifiedTask.nombre_tarea} label="Nombre de tarea" type="text" setNewValue={taskModifiedFunctions.updateNombreTarea}/>
      </div>
      <ComboBoxInput value={taskModifiedFunctions.modifiedTask.tipo_tarea} label="Tipo de Tarea" data={ComboData.tipoTareaData} required={true} setNewValue={taskModifiedFunctions.updateTipoTarea} />
      <ComboBoxInput value={taskModifiedFunctions.modifiedTask.tipo_backup} label="Tipo de Backup" data={ComboData.tipoBackupData} required={true} setNewValue={taskModifiedFunctions.updateTipoBackup} />
     {/*  <ComboBoxInput value={taskModifiedFunctions.modifiedTask.proteccion} label="Proteccion" data={ComboData.ProteccionData} required={true} setNewValue={taskModifiedFunctions.updateProteccion} />
      <ComboBoxInput value={taskModifiedFunctions.modifiedTask.frecuencia} label="Frecuencia" data={ComboData.FrecuenciaData} required={true} setNewValue={taskModifiedFunctions.updateFrecuencia} /> */}
      <ComboBoxInput value={taskModifiedFunctions.modifiedTask.modo} label="Modo" data={ComboData.ModoData} required={true} setNewValue={taskModifiedFunctions.updateModo} />
      <ComboBoxInput value={taskModifiedFunctions.modifiedTask.contenido} label="Tipo de Dato a Respaldar" data={ComboData.DatoARespaldarData} required={true} setNewValue={taskModifiedFunctions.updateContenido} />
      <div>
        <Form.Label>Ventana Inicio</Form.Label>
        <TextInput value={taskModifiedFunctions.modifiedTask.hora_vinicio} label="Ventana Inicio" type="time" setNewValue={taskModifiedFunctions.updateHoraInicio} />
      </div>
      <div>
        <Form.Label>Ventana Fin</Form.Label>
        <TextInput value={taskModifiedFunctions.modifiedTask.hora_vfin} label="Ventana Fin" type="time" setNewValue={taskModifiedFunctions.updateHoraFin} />
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
                checked={taskModifiedFunctions.modifiedTask.bks_lun === 0 ? false : true}
                onChange={(event) => taskModifiedFunctions.updateLunes(event.target.checked)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                className="form-check-input border border-dark"
                checked={taskModifiedFunctions.modifiedTask.bks_mar === 0 ? false : true}
                onChange={(event) => taskModifiedFunctions.updateMartes(event.target.checked)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                className="form-check-input border border-dark"
                checked={taskModifiedFunctions.modifiedTask.bks_mie === 0 ? false : true}
                onChange={(event) => taskModifiedFunctions.updateMiercoles(event.target.checked)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                className="form-check-input border border-dark"
                checked={taskModifiedFunctions.modifiedTask.bks_jue === 0 ? false : true}
                onChange={(event) => taskModifiedFunctions.updateJueves(event.target.checked)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                className="form-check-input border border-dark"
                checked={taskModifiedFunctions.modifiedTask.bks_vie === 0 ? false : true}
                onChange={(event) => taskModifiedFunctions.updateViernes(event.target.checked)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                className="form-check-input border border-dark"
                checked={taskModifiedFunctions.modifiedTask.bks_sab === 0 ? false : true}
                onChange={(event) => taskModifiedFunctions.updateSabado(event.target.checked)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                className="form-check-input border border-dark"
                checked={taskModifiedFunctions.modifiedTask.bks_dom === 0 ? false : true}
                onChange={(event) => taskModifiedFunctions.updateDomingo(event.target.checked)}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
export { GeneralData }