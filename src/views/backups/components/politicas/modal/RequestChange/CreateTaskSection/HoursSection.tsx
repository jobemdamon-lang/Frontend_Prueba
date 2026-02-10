import { FC, useCallback, useEffect, useState } from "react"
import DataTable, { TableColumn } from "react-data-table-component"
import { EmptyData } from "../../../../../../../components/datatable/EmptyData"
import { ICreateHours, IDataTableRowsHours } from "../../../Types"
import uniqid from 'uniqid';

const CustomHourInput = ({ handleUpdateHour, row }: { handleUpdateHour: any, row: IDataTableRowsHours }) => {
  return (
    <input
      type="time"
      value={row.hora_inicio}
      className="form-control border-secondary"
      onChange={(event) => {
        handleUpdateHour(row.idRow, event.target.value)
      }} />
  )
}

export const columnshours = (handleUpdateHour: any): TableColumn<IDataTableRowsHours>[] => {
  return [
    {
      name: 'HORAS DE INICIOS',
      cell: (row: IDataTableRowsHours) => <CustomHourInput handleUpdateHour={handleUpdateHour} row={row} />,
      sortable: true
    }
  ]
}

type Props = {
  taskFunctions: any,
  isDetailVisibility: boolean
}

const HoursSection: FC<Props> = ({ taskFunctions, isDetailVisibility }) => {

  const [selectedRows, setSelectedRows] = useState<Array<IDataTableRowsHours>>([])
  const [toggleCleared, setToggleCleared] = useState(false);
  const [selectedHour, setSelectedHour] = useState<string>("")
  const [hoursDataWF, setHours] = useState<Array<IDataTableRowsHours>>([])

  //Cada vez que la vista se cambia se reincian los valores al estado inicial
  useEffect(() => {
    setSelectedRows([])
    setSelectedHour("")
  }, [isDetailVisibility])

  useEffect(() => {
    const formatterData: IDataTableRowsHours[] = taskFunctions.newTask.lista_hora?.map((hour: ICreateHours) => {
      const data: IDataTableRowsHours = {
        ...hour,
        hora_inicio: hour.descripcion
      }
      return data
    })
    setHours(formatterData)
  }, [taskFunctions.newTask.lista_hora])


  //Actualizar las filas seleccionadas
  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, [])

  //Añadir una hora de Inicio
  const addHourToTable = (selectedHour: string) => {
    const newHour: ICreateHours = {
      descripcion: selectedHour,
      estado: 1,
      id_soli_hora: 0,
      idRow: uniqid(),
      observacion: ""
    }
    taskFunctions.updateAgregarHora(newHour)
  }

  //Funcion para eliminar una fila de la tabla
  const handleDelete = () => {
    setToggleCleared(!toggleCleared);
    taskFunctions.updateEliminarHora(selectedRows)
  }

  //Funcion para actualizar una fila de la tabla
  function handleUpdateHour(id_row: string, newHour: string) {
    taskFunctions.updateModificarHora(id_row, newHour)
  }

  return (
    <div className="d-flex flex-column p-8 gap-5">
      <div className="d-flex justify-content-around align-items-end">
        <input type="time" className="form-control w-200px" value={selectedHour} onChange={(event) => setSelectedHour(event.target.value)} />
        <div className="d-flex gap-5">
          <button type="button" onClick={() => addHourToTable(selectedHour)} className="btn btn-primary h-43px">Agregar</button>
          <button type="button" onClick={handleDelete} className="btn btn-danger h-43px">Eliminar</button>
        </div>
      </div>
      <div>
        <DataTable
          columns={columnshours(handleUpdateHour)}
          persistTableHead
          highlightOnHover
          pagination
          selectableRows
          fixedHeader
          onSelectedRowsChange={handleRowSelected}
          noDataComponent={<EmptyData loading={false} />}
          disabled={false}
          data={hoursDataWF}
        />
      </div>
    </div>
  )
}
export { HoursSection }