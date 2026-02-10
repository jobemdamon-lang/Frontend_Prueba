import { Form } from "react-bootstrap"
import { TextInput } from "./TextInput"
import { FC } from "react"
import { ComboBoxInput } from "./ComboBoxInput"

type Props = {
  ComboData: any,
  taskModifiedFunctions: any
}
const BackupsAdminSection: FC<Props> = ({ ComboData, taskModifiedFunctions }) => {
  return (
    <div className="d-flex justify-content-around align-items-end flex-wrap gap-5 p-5">
      <ComboBoxInput value={taskModifiedFunctions.modifiedTask.herramienta} label="Herramienta" data={ComboData.HerramientaData} setNewValue={taskModifiedFunctions.updateHerramienta} dependencyFunction={ComboData.fetchBackupCellManager}/>
      <ComboBoxInput value={taskModifiedFunctions.modifiedTask.cell_manager} label="CellManager" data={ComboData.cellManagerData} setNewValue={taskModifiedFunctions.updateCellmanager} />
      <ComboBoxInput value ={taskModifiedFunctions.modifiedTask.medio} label="Medio" data={ComboData.medioData} setNewValue={taskModifiedFunctions.updateMedio} />
      <div>
        <Form.Label>Comentario</Form.Label>
        <TextInput label="Comentario" type="text" value={taskModifiedFunctions.modifiedTask.comentario} setNewValue={taskModifiedFunctions.updateComentario}/>
      </div>
    </div>
  )
}
export { BackupsAdminSection }