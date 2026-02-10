import { TextInput } from "./TextInput"
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../../../../../../helpers/AssetHelpers"
import { ComboBoxInput } from "./ComboBoxInput"
import { FC } from "react"
import { ITask } from "../../../Types"

type Props = {
  ComboData : any
  taskInfo: ITask
}

const SpecialData:FC<Props> = ({ ComboData, taskInfo }) => {
  return (
    <section className="d-flex justify-content-around align-items-start flex-wrap gap-5 p-5 flex-column">
      <div className="d-flex gap-5 justify-content-around align-items-center w-100">
        <div className="d-flex flex-column gap-5">
          <div>
            <input id="deleteData" type="checkbox" className="form-check-input border-dark" disabled={true} checked={taskInfo?.bks_eliminar_cont === 0 ? false : true }/>
            <label htmlFor="deleteData" className="ps-5">Eliminar Data al Culminar</label>
          </div>
          <div>
            <input id="dependBackup" type="checkbox" className="form-check-input border-dark" disabled={true} checked={taskInfo?.bks_depend === 0 ? false : true }/>
            <label htmlFor="dependBackup" className="ps-5">Depende de otra Data de Backup</label>
          </div>
        </div>
        <div className="d-flex flex-column gap-5">
          <TextInput type="text" label="Especificar detalle de dependencia" disabled={true} value={taskInfo?.detalle_independencia}/>
          <div className="d-flex gap-5">
            <SVG width={40} height={40} src={toAbsoluteUrl("/media/icons/duotune/electronics/elc003.svg")} className="category-item" />
            <TextInput type="number" label="Tamaño de Data a Respaldar" disabled={true} value={taskInfo?.bks_tamdat}/>
            <strong style={{ fontSize: "25px" }}>MB</strong>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-around w-100">
        <ComboBoxInput label="Herramienta" data={ComboData.HerramientaData} disabled={true} value={taskInfo?.herramienta}/>
        <ComboBoxInput label="CellManager" data={ComboData.cellManagerData} disabled={true} value={taskInfo?.cell_manager}/>
      </div>
      <div className="d-flex gap-5 align-items-end justify-content-around w-100">
        <div>
          <h5>Tiempo estimado del Backup</h5>
          <div className="d-flex gap-5">
            <TextInput type="number" label="Hora Estimado" disabled={true}  value={taskInfo?.hora_estimado}/>
            <TextInput type="number" label="Minuto Estimado" disabled={true}  value={taskInfo?.minuto_estimado}/>
          </div>
        </div>
        <div>
          <TextInput type="text" label="Aclaración" disabled={true}  value={taskInfo?.aclaracion}/>
        </div>
      </div>
    </section>
  )
}
export { SpecialData }