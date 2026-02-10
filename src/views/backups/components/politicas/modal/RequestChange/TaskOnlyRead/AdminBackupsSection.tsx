import { FC } from "react"
import { ITask } from "../../../Types"
import { TextInput } from "./TextInput"
import { ComboBoxInput } from "./ComboBoxInput"

type Props = {
  taskInfo: ITask | undefined,
  ComboData: any
}

const AdminBackupSection:FC<Props> = ({taskInfo, ComboData}) => {
  return (
    <div className="d-flex flex-column gap-5  w-100 p-10">
      <div className="d-flex gap-5 justify-content-around">
        <ComboBoxInput label="Herramienta" data={ComboData.HerramientaData} disabled={true} value={taskInfo?.herramienta}/>
        <ComboBoxInput label="CellManager" data={ComboData.cellManagerData} disabled={true} value={taskInfo?.cell_manager}/>
      </div>
      <div className="d-flex gap-5 justify-content-around">
        <ComboBoxInput value ={taskInfo?.medio} label="Medio" data={ComboData.medioData} disabled={true}/>
        <TextInput value={taskInfo?.comentario} type="text" label="Comentario" disabled={true} />
      </div>
    </div>
  )
}
export { AdminBackupSection }