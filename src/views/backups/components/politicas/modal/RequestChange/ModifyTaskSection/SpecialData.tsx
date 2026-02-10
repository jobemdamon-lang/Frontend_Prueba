import { TextInput } from "./TextInput"
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../../../../../../helpers/AssetHelpers"
import { ComboBoxInput } from "./ComboBoxInput"
import { FC } from "react"

type Props = {
  ComboData: any,
  taskModifiedFunctions: any
}
const SpecialData: FC<Props> = ({ ComboData, taskModifiedFunctions }) => {

  const handleDetail = (event: React.ChangeEvent<HTMLInputElement>) => {
    taskModifiedFunctions.updateDependeDeOtraTarea(event.target.checked)
    taskModifiedFunctions.updateEspecificarDetalle("")
  }
  return (
    <section className="d-flex justify-content-around align-items-start flex-wrap gap-5 p-5 flex-column">
      <div className="d-flex gap-5 justify-content-around align-items-center w-100">
        <div className="d-flex flex-column gap-5">
          <div>
            <input
              id="deleteData"
              type="checkbox"
              className="form-check-input border-dark"
              checked={taskModifiedFunctions.modifiedTask.bks_eliminar_cont === 1 ? true : false}
              onChange={(event) => taskModifiedFunctions.updateEliminarData(event.target.checked)}
            />
            <label htmlFor="deleteData" className="ps-5">Eliminar Data al Culminar</label>
          </div>
          <div>
            <input
              id="dependBackup"
              type="checkbox"
              className="form-check-input border-dark"
              checked={taskModifiedFunctions.modifiedTask.bks_depend === ("1" || 1) ? true : false}
              onChange={handleDetail}
            />
            <label htmlFor="dependBackup" className="ps-5">Depende de otra Data de Backup</label>
          </div>
        </div>
        <div className="d-flex flex-column gap-5">
          {taskModifiedFunctions.modifiedTask.bks_depend === ("1" || 1) &&
            <TextInput
              type="text"
              label="Especificar detalle de dependencia"
              value={taskModifiedFunctions.modifiedTask.detalle_dependencia}
              setNewValue={taskModifiedFunctions.updateEspecificarDetalle}
            />}
          <div className="d-flex gap-5">
            <SVG width={40} height={40} src={toAbsoluteUrl("/media/icons/duotune/electronics/elc003.svg")} className="category-item" />
            <TextInput
              type="number"
              label="Tamaño de Data a Respaldar"
              value={taskModifiedFunctions.modifiedTask.bks_tamdat}
              setNewValue={taskModifiedFunctions.updateTamañoARespaldar}
            />
            <strong style={{ fontSize: "25px" }}>MB</strong>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-around w-100">
        <ComboBoxInput value={taskModifiedFunctions.modifiedTask.herramienta} label="Herramienta" data={ComboData.HerramientaData} setNewValue={taskModifiedFunctions.updateHerramienta} dependencyFunction={ComboData.fetchBackupCellManager} />
        <ComboBoxInput value={taskModifiedFunctions.modifiedTask.cell_manager} label="CellManager" data={ComboData.cellManagerData} setNewValue={taskModifiedFunctions.updateCellmanager} />
      </div>
      <div className="d-flex gap-5 align-items-end justify-content-around w-100">
        <div>
          <h5>Tiempo estimado del Backup</h5>
          <div className="d-flex gap-5">
            <TextInput value={taskModifiedFunctions.modifiedTask.hora_estimado} type="number" label="Hora Estimado" setNewValue={taskModifiedFunctions.updateHoraEstimado} />
            <TextInput value={taskModifiedFunctions.modifiedTask.minuto_estimado} type="number" label="Minuto Estimado" setNewValue={taskModifiedFunctions.updateMinutoEstimado} />
          </div>
        </div>
        <div>
          <TextInput value={taskModifiedFunctions.modifiedTask.aclaracion} type="text" label="Aclaración" setNewValue={taskModifiedFunctions.updateAclaracion} />
        </div>
      </div>
    </section>
  )
}
export { SpecialData }