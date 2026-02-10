import { FC, useCallback, useEffect, useState } from "react"
import DataTable, { TableColumn } from "react-data-table-component"
import { EmptyData } from "../../../../../../../components/datatable/EmptyData"
import { ICreateFrecuencyProtection, IDataTableRowsFrecuencyProtection } from "../../../Types"
import uniqid from 'uniqid';
import { ComboBoxInput } from "./ComboBoxInput";
import { toast } from "react-toastify";

/* const CustomFrcuencyProtectionInput = ({ handleUpdateFrecuencyProtection, row, ComboData }: { handleUpdateFrecuencyProtection: any, row: IDataTableRowsFrecuencyProtection, ComboData:any }) => {
  return (
    <>
      <ComboBoxInput value={row.frecuencia} label="Frecuencia" data={ComboData.FrecuenciaData} required={true} setNewValue={handleUpdateFrecuencyProtection} />
      <ComboBoxInput value={row.proteccion} label="Proteccion" data={ComboData.ProteccionData} required={true} setNewValue={handleUpdateFrecuencyProtection} />
    </>
  )
} */

export const columnsFrecuencyProtection = (/* handleUpdateFrecuencyProtection: any, ComboData: any */): TableColumn<IDataTableRowsFrecuencyProtection>[] => {
  return [
    {
      name: 'FRECUENCIA',
      cell: (row: IDataTableRowsFrecuencyProtection) => row.frecuencia,
      sortable: true
    },
    /*  <CustomHourInput handleUpdateFrecuencyProtection={handleUpdateFrecuencyProtection} row={row} ComboData={ComboData}/> */
    {
      name: 'PROTECCIÓN',
      cell: (row: IDataTableRowsFrecuencyProtection) => row.proteccion,
      sortable: true
    }
  ]
}

type Props = {
  taskFunctions: any,
  isDetailVisibility: boolean,
  ComboData: any
}

const FrecuencySection: FC<Props> = ({ taskFunctions, isDetailVisibility, ComboData }) => {

  const [selectedRows, setSelectedRows] = useState<Array<IDataTableRowsFrecuencyProtection>>([])
  const [toggleCleared, setToggleCleared] = useState(false);
  const [selectedFrecuency, setSelectedFrecuency] = useState<string>("Diario")
  const [selectedProtection, setSeletedProtection] = useState<string>("")
  const [frecuencyProtectionDataWF, setFrecuencyProtection] = useState<Array<IDataTableRowsFrecuencyProtection>>([])

  //Cada vez que la vista se cambia se reincian los valores al estado inicial
  useEffect(() => {
    setSelectedRows([])
    setSelectedFrecuency("")
    setSeletedProtection("")
  }, [isDetailVisibility])

  useEffect(() => {
    const formatterData: IDataTableRowsFrecuencyProtection[] = taskFunctions.newTask.lista_proteccion_frecuencia?.map((frecProt: ICreateFrecuencyProtection) => {
      const data: IDataTableRowsFrecuencyProtection = { ...frecProt }
      return data
    })
    setFrecuencyProtection(formatterData)
  }, [taskFunctions.newTask.lista_proteccion_frecuencia])


  //Actualizar las filas seleccionadas
  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, [])

  //Añadir una frecuencia - Proteccion
  const addFrecuencyProtectionToTable = (selectedFrecuency: string, selectedProtection: string) => {
    if (selectedFrecuency === "" || selectedProtection === "") {
      toast.warn('Debe seleccionar una Frecuencia y Protección', {
        position: toast.POSITION.TOP_RIGHT
      })
    } else {
      const newCrecuencyProtection: ICreateFrecuencyProtection = {
        frecuencia: selectedFrecuency,
        proteccion: selectedProtection,
        id_soli_tarea_pf: 0,
        estado: 1,
        idRow: uniqid(),
      }
      taskFunctions.updateAgregarFrecuenciaProteccion(newCrecuencyProtection)
    }
  }

  //Funcion para eliminar una fila de la tabla
  const handleDelete = () => {
    setToggleCleared(!toggleCleared);
    taskFunctions.updateEliminarFrecuenciaProteccion(selectedRows)
  }

  //Funcion para actualizar una fila de la tabla
  /*  function handleUpdateFrecuencyProtection(id_row: string, newHour: string) {
     taskFunctions.updateModificarHora(id_row, newHour)
   } */

  return (
    <div className="d-flex gap-10 pt-5 justify-content-center align-content-center">
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-around align-items-end gap-5">
          <ComboBoxInput value={selectedFrecuency} label="Frecuencia" data={ComboData.FrecuenciaData} setNewValue={setSelectedFrecuency} />
          <ComboBoxInput value={selectedProtection} label="Proteccion" data={ComboData.ProteccionData} setNewValue={setSeletedProtection} />
          <div className="d-flex gap-5">
            <button type="button" onClick={() => addFrecuencyProtectionToTable(selectedFrecuency, selectedProtection)} className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
            </button>
            <button type="button" onClick={handleDelete} className="btn btn-danger">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
              </svg>
            </button>
          </div>
        </div>
        <div>
          <DataTable
            columns={columnsFrecuencyProtection(/* handleUpdateFrecuencyProtection, ComboData */)}
            persistTableHead
            highlightOnHover
            pagination
            selectableRows
            fixedHeader
            onSelectedRowsChange={handleRowSelected}
            noDataComponent={<EmptyData loading={false} />}
            disabled={false}
            data={frecuencyProtectionDataWF}
          />
        </div>
      </div>
    </div>
  )
}
export { FrecuencySection }