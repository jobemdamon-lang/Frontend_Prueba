import DataTable from "react-data-table-component"
import { EmptyData } from "../../../../../components/datatable/EmptyData"
import { LoadingTable } from "../../../../../components/loading/LoadingTable"
import { useContext, useEffect, useState } from "react"
import "../../../../../assets/sass/components/administrattion-styles/filters-section.scss"
import { Context } from "../../Context"
import { ProfileByAreaColumn, ProfileColumn } from "./ColumnsProfile"
import { Form } from "react-bootstrap"
import { useComboData } from "../../../Colaborador/hooks/useComboData"
import { IComboData, ModalSize, ModalView } from "../../../Types"
import { toast } from "react-toastify"
import { customStyles } from "../../../../../helpers/tableStyles"
import { InboxCompose } from "../../../../../components/modals/InboxCompose"

const GestionPerfiles = () => {

  const { openModal, fetchListprofile, profiles, profileLoading, fetchListProfileByArea, profilesByArea, 
    profileByAreaLoading, deleteProfileOfArea, deleteProfileOfAreaLoading } = useContext(Context)
  const [selectedArea, setSelectedArea] = useState("")
  const [selectedAreaID, setSelectedAreaID] = useState(0)
  const { areasData, fetchAreas } = useComboData()
    const [show, setShow] = useState(false)
  useEffect(() => {
    fetchListprofile()
    fetchAreas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="d-flex flex-column justify-content-center">
      <div style={{ position: 'relative' }}>
        <h4>Lista de Perfiles</h4>
        <InboxCompose show={show} handleClose={()=> setShow(false)}/>
        <DataTable
          columns={ProfileColumn}
          persistTableHead
          highlightOnHover
          pagination
          fixedHeader
          customStyles={customStyles}
          noDataComponent={<EmptyData loading={profileLoading} />}
          disabled={profileLoading}
          data={profiles}
        />
        {profileLoading && <LoadingTable description='Cargando' />}
      </div>
      <div className="m-5 d-flex justify-content-end">
        <div className="w-25">
          <Form.Label>Selecciona un Area</Form.Label>
          <select
            value={selectedArea}
            className="form-select combo"
            data-control="select2"
            data-placeholder="Seleccione una opcion"
            onChange={(evt) => {
              setSelectedArea(evt.target.value)
              const idx = areasData.findIndex((area: IComboData) => area.nombre === evt.target.value)
              setSelectedAreaID(areasData[idx]?.codigo)
              //Se utiliza el metodo para listar los perfiles de esa Area
              fetchListProfileByArea(areasData[idx]?.codigo.toString())
            }}
          >
            <option value="">Todas</option>
            {areasData.map((item) => (<option key={item.codigo} value={item.nombre}>{item.nombre}</option>))}
          </select>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <h4>Lista de Perfiles del Area: {selectedArea}</h4>
        <div className='d-flex justify-content-end mx-5 mb-5'>
          <button className="btn btn-info" onClick={() => {
            selectedArea === "" ?
              toast.warn(`Seleccione un Area para poder asignar un perfil.`, {
                position: toast.POSITION.TOP_RIGHT
              })
              :
              openModal(ModalView.ASSIGN_PROFILE_TO_AREA, ModalSize.SM, { area: selectedArea, idArea: selectedAreaID, fetchProfileByArea: fetchListProfileByArea })
          }}
          >Asignar Perfil</button>
        </div>
        <DataTable
          columns={ProfileByAreaColumn(deleteProfileOfArea, deleteProfileOfAreaLoading, selectedAreaID)}
          persistTableHead
          highlightOnHover
          pagination
          fixedHeader
          customStyles={customStyles}
          noDataComponent={<EmptyData loading={profileByAreaLoading} />}
          disabled={profileByAreaLoading}
          data={profilesByArea}
        />
        {profileByAreaLoading && <LoadingTable description='Cargando' />}
      </div>
    </div>
  )
}
export { GestionPerfiles }