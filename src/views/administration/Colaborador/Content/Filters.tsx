import { useContext } from "react"
import "../../../../assets/sass/components/administrattion-styles/filters-section.scss"
import { Form } from "react-bootstrap"
import { Context } from "../Context"
import { IComboData, IListCollaborators } from "../../Types"

type typesContext = {
  areasData: IComboData[],
  collabsData: Array<IListCollaborators>,
  setPreferences: React.Dispatch<React.SetStateAction<{
    nombre: string;
    area: string;
  }>>,
  preferences: {
    nombre: string;
    area: string;
  },
  nroFilteredCollabs: number
}
const Filters = () => {

  const { areasData, setPreferences, preferences, nroFilteredCollabs }: typesContext = useContext(Context)

  return (
    <div className="w-100 d-flex justify-content-around align-items-end p-5">
      <div className="w-250px">
        <Form.Label>Area:</Form.Label>
        <select
          value={preferences.area}
          className="form-select combo"
          data-control="select2"
          data-placeholder="Seleccione una opcion"
          onChange={(evt) => setPreferences((prev) => ({ ...prev, area: evt.target.value }))}
        >
          <option value="">Todas</option>
          {areasData.map((item) => (<option key={item.codigo} value={item.nombre}>{item.nombre}</option>))}
        </select>
      </div>
      <div className="w-250px">
        <Form.Label>Nombre del Colaborador: </Form.Label>
        <input
          value={preferences.nombre}
          type="text"
          className="form-control"
          placeholder="Nombre"
          onChange={(evt) => setPreferences((prev) => ({ ...prev, nombre: evt.target.value }))}
        />
      </div>
      <div>
        <h3 style={{ fontWeight: "bold" }}>TOTAL DE REGISTROS: {nroFilteredCollabs}</h3>
      </div>
    </div>
  )
}
export { Filters }