import { TableColumn } from "react-data-table-component"
import { IDataTableRowsRoutes } from "../../Types"

const CustomUnidad = ({handleUpdateItem, row}:{handleUpdateItem:any, row: IDataTableRowsRoutes})=> {
  return (
    <input 
    type="text" 
    className="form-control border-secondary"
    value={row.unidad}
    onChange={(event)=>{
      handleUpdateItem(row.idRow, {unidad:event.target.value})
    }}/>
  )
}
const CustomDescripcion = ({handleUpdateItem, row}:{handleUpdateItem:any, row: IDataTableRowsRoutes})=> {
  return (
    <input 
    type="text" 
    value={row.descripcion}
    className="form-control border-secondary"
    onChange={(event)=>{
      handleUpdateItem(row.idRow, {descripcion:event.target.value})
    }}/>
  )
}
const CustomExcepcion = ({handleUpdateItem, row}:{handleUpdateItem:any, row: IDataTableRowsRoutes})=> {
  return (
    <input 
    type="text" 
    value={row.excepcion}
    className="form-control border-secondary"
    onChange={(event)=>{
      handleUpdateItem(row.idRow, {excepcion:event.target.value})
    }}/>
  )
}
const CustomParametros = ({handleUpdateItem, row}:{handleUpdateItem:any, row: IDataTableRowsRoutes})=> {
  return (
    <input 
    type="text" 
    className="form-control border-secondary"
    value={row.parametro}
    onChange={(event)=>{
      handleUpdateItem(row.idRow, {parametro :event.target.value})
    }}/>
  )
}


export const columnsRoutesRW = (handleUpdateItem:any): TableColumn<IDataTableRowsRoutes>[] => { return [
  {
    name: 'SERVIDOR - CI',
    selector: (row: IDataTableRowsRoutes) => row.nombreci ?? "Sin registro",
    sortable: true
  },
  {
    name: 'UNIDAD',
    cell: (row: IDataTableRowsRoutes) => <CustomUnidad handleUpdateItem={handleUpdateItem} row={row} />,
    selector: (row: IDataTableRowsRoutes) => row.unidad ?? "Sin registro"
  },
  {
    name: 'DESCRIPCION',
    cell: (row: IDataTableRowsRoutes) => <CustomDescripcion handleUpdateItem={handleUpdateItem}  row={row} />,
    selector: (row: IDataTableRowsRoutes) => row.descripcion ?? "Sin registro"
  },
  {
    name: 'EXCEPCION',
    cell: (row: IDataTableRowsRoutes) => <CustomExcepcion handleUpdateItem={handleUpdateItem}  row={row} />,
    selector: (row: IDataTableRowsRoutes) => row.excepcion  ?? "Sin registro"
  },
  {
    name: 'PARAMETROS',
    cell: (row: IDataTableRowsRoutes) => <CustomParametros handleUpdateItem={handleUpdateItem}  row={row} />,
    selector: (row: IDataTableRowsRoutes) => row.parametro  ?? "Sin registro"

  }
]
}

