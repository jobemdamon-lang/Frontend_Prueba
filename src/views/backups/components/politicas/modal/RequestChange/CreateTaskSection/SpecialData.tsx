import { TextInput } from "./TextInput"
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../../../../../../helpers/AssetHelpers"
import { ComboBoxInput } from "./ComboBoxInput"
import { FC } from "react"

type Props = {
  ComboData: any
  taskFunctions: any
}
const SpecialData: FC<Props> = ({ ComboData, taskFunctions }) => {

  return (
    <section className="d-flex justify-content-around align-items-start flex-wrap gap-5 p-5 flex-column">
      <div className="d-flex gap-5 justify-content-around align-items-center w-100">
        <div className="d-flex flex-column gap-5">
          <div>
            <input
              id="deleteData"
              type="checkbox"
              className="form-check-input border-dark"
              checked={taskFunctions.newTask.bks_eliminar_cont === 0 ? false : true}
              onChange={(event) => taskFunctions.updateEliminarData(event.target.value)} />
            <label htmlFor="deleteData" className="ps-5">Eliminar Data al Culminar</label>
          </div>
          <div>
            <input
              id="dependBackup"
              type="checkbox"
              className="form-check-input border-dark"
              checked={taskFunctions.newTask.bks_depend === "0" ? false : true}
              onChange={(event) => taskFunctions.updateDependeDeOtraTarea(event.target.checked)} />
            <label htmlFor="dependBackup" className="ps-5">Depende de otra Data de Backup</label>
          </div>
        </div>
        <div className="d-flex flex-column gap-5">
          {taskFunctions.newTask.bks_depend === "1" &&
            <TextInput type="text" label="Especificar detalle de dependencia" setNewValue={taskFunctions.updateEspecificarDetalle} />
          }
          <div className="d-flex gap-5">
            <SVG width={40} height={40} src={toAbsoluteUrl("/media/icons/duotune/electronics/elc003.svg")} className="category-item" />
            <TextInput type="number" label="Tamaño de Data a Respaldar" value={taskFunctions.newTask.bks_tamdat} setNewValue={taskFunctions.updateTamañoARespaldar} />
            <strong style={{ fontSize: "25px" }}>MB</strong>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-around w-100">
        <ComboBoxInput value={taskFunctions.newTask.herramienta} label="Herramienta" data={ComboData.HerramientaData} setNewValue={taskFunctions.updateHerramienta} dependencyFunction={ComboData.fetchBackupCellManager}/>
        <ComboBoxInput value={taskFunctions.newTask.cell_manager} label="CellManager" data={ComboData.cellManagerData} setNewValue={taskFunctions.updateCellmanager} />
      </div>
      <div className="d-flex gap-5 align-items-end justify-content-around w-100">
        <div>
          <h5>Tiempo estimado del Backup</h5>
          <div className="d-flex gap-5">
            <TextInput type="number" label="Hora Estimado" value={taskFunctions.newTask.hora_estimado} setNewValue={taskFunctions.updateHoraEstimado} />
            <TextInput type="number" label="Minuto Estimado" value={taskFunctions.newTask.minuto_estimado} setNewValue={taskFunctions.updateMinutoEstimado} />
          </div>
        </div>
        <div>
          <TextInput type="text" label="Aclaración" value={taskFunctions.newTask.aclaracion} setNewValue={taskFunctions.updateAclaracion} />
        </div>
      </div>
    </section>
  )
}
export { SpecialData }