import { FC } from "react"
import { ComboBoxInput } from "../RequestChange/TaskOnlyRead/ComboBoxInput"
import { TextInput } from "../RequestChange/TaskOnlyRead/TextInput"
import { IFrecuencias, ITaksOfPolicies } from "../../Types"

type Props = {
  ComboData: any,
  selectedTask: ITaksOfPolicies
}
const WeekCircle = ({ frecuencia }: { frecuencia: string }) => {
  let f_frecuencia = frecuencia.toLocaleUpperCase().replace(/ /g, '')
  let colors: IFrecuencias = {
    DIARIO: "green",
    SEMANAL: "blue",
    MENSUAL: "violet",
    FECHAFIJA: "red",
    ADEMANDA: "yellow",
    ANUAL: "black"
  }
  return (
    <div className="rounded-circle w-15px h-15px m-auto" style={{ backgroundColor: `${colors[f_frecuencia as keyof IFrecuencias]}` }}></div>
  )
}
const TDGeneral: FC<Props> = ({ ComboData, selectedTask }) => {
  return (
    <div className="d-flex justify-content-around p-5 flex-column p-5">
      <div className="d-flex justify-content-around flex-wrap gap-5 p-5">
        <ComboBoxInput value={selectedTask.tipo_tarea} label="Tipo de Tarea" data={ComboData.tipoTareaData} disabled={true} />
        <ComboBoxInput value={selectedTask.tipo_backup} label="Tipo de Backup" data={ComboData.tipoBackupData} disabled={true} />
        <ComboBoxInput value={selectedTask.proteccion} label="Proteccion" data={ComboData.ProteccionData} disabled={true} />
        <ComboBoxInput value={selectedTask.frecuencia} label="Frecuencia" data={ComboData.FrecuenciaData} disabled={true} />
        <ComboBoxInput value={selectedTask.modo} label="Modo" data={ComboData.ModoData} disabled={true} />
        <ComboBoxInput value={selectedTask.contenido} label="Tipo de Dato a Respaldar" data={ComboData.DatoARespaldarData} disabled={true} />
        <div className="mx-5 pt-4">
          <input
            id="deleteData"
            type="checkbox"
            disabled={true}
            className="form-check-input border-dark"
            checked={selectedTask.bks_eliminar_cont === 0 ? false : true} />
          <label htmlFor="deleteData" className="ps-5">Eliminar Data al Culminar</label>
        </div>
        <div className="mx-15 pt-4">
          <input
            id="dependBackup"
            type="checkbox"
            disabled={true}
            className="form-check-input border-dark"
            checked={selectedTask.bks_depend === 0 ? false : true}
          />
          <label htmlFor="dependBackup" className="ps-5">Depende de otra Data de Backup</label>
        </div>
        <TextInput value={selectedTask.aclaracion} type="text" label="Aclaración" disabled={true} />
      </div>
      <h4>Duración</h4>
      <div className="d-flex justify-content-around flex-wrap gap-5 p-5">
        <TextInput value={selectedTask.hora_estimado} type="text" label="Duracion Estimada" disabled={true} />
        <TextInput value={""} type="text" label="Duración Real Min" disabled={true} />
        <TextInput value={""} type="text" label="Duracion Real Max" disabled={true} />
        <TextInput value={""} type="text" label="Duracion Real Prom" disabled={true} />
      </div>
      <h4>Tamaño Data</h4>
      <div className="d-flex justify-content-around flex-wrap gap-5 p-5">
        <TextInput value={selectedTask.bks_tamdat} type="text" label="Data Estimada" disabled={true} />
        <TextInput value={""} type="text" label="Data Real Min" disabled={true} />
        <TextInput value={""} type="text" label="Data Real Max" disabled={true} />
        <TextInput value={""} type="text" label="Data Real Prom" disabled={true} />
      </div>
      <h4>Ejecución</h4>
      <div className="d-flex justify-content-around flex-wrap gap-5 p-5">
        <TextInput value={selectedTask.hora_vinicio} type="text" label="Ventana Desde" disabled={true} />
        <TextInput value={selectedTask.hora_vfin} type="text" label="Ventana Hasta" disabled={true} />
        <TextInput value={""} type="text" label="Fecha Fija 1" disabled={true} />
        <TextInput value={""} type="text" label="Fecha Fija 2" disabled={true} />
      </div>
      <h4>Programación</h4>
      <div>
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
            <tr>
              <td>
                {selectedTask.bks_lun ? <WeekCircle frecuencia={selectedTask.frecuencia} /> : ""}
              </td>
              <td>
                {selectedTask.bks_mar ? <WeekCircle frecuencia={selectedTask.frecuencia} /> : ""}
              </td>
              <td>
                {selectedTask.bks_mie ? <WeekCircle frecuencia={selectedTask.frecuencia} /> : ""}
              </td>
              <td>
                {selectedTask.bks_juev ? <WeekCircle frecuencia={selectedTask.frecuencia} /> : ""}
              </td>
              <td>
                {selectedTask.bks_vie ? <WeekCircle frecuencia={selectedTask.frecuencia} /> : ""}
              </td>
              <td>
                {selectedTask.bks_sab ? <WeekCircle frecuencia={selectedTask.frecuencia} /> : ""}
              </td>
              <td>
                {selectedTask.bks_dom ? <WeekCircle frecuencia={selectedTask.frecuencia} /> : ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h4>Información de Backup</h4>
      <div className="d-flex justify-content-around align-items-end flex-wrap gap-5">
        <TextInput value={selectedTask.nombre_tarea} type="text" label="Nombre de Tarea" disabled={true} />
        <ComboBoxInput value={selectedTask.herramienta} label="Herramienta" data={ComboData.HerramientaData} disabled={true} />
        <ComboBoxInput value={selectedTask.medio} label="Medio" data={ComboData.medioData} disabled={true} />
        <ComboBoxInput value={selectedTask.bks_server} label="Servidor Backup" data={ComboData.servidoresData} disabled={true} />
      </div>
    </div>
  )
}
export { TDGeneral }