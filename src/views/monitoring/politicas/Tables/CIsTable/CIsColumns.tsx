import { TableColumn } from "react-data-table-component";
import { IEquipmentsRestantes } from "../../Types";

/* const DinamicSubCategories = (setCategories: any, subcategories: ICatalog2CIForClient[], categoryOwnerID: string): TableColumn<any>[] => {
  useEffect(() => {
    console.log(subcategories)
  }, [subcategories])

  return subcategories.map((subCategory: ICatalog2CIForClient, index): TableColumn<any> => {
    return {
      name: subCategory.CATEGORIA_2,
      cell: (row: any) => (
        <input
          id={`checkTo${subCategory.CATEGORIA_2.replace(/\s/g, '')}`}
          className="form-check-input"
          type="checkbox"
          checked={false}
          style={{ border: "1px solid #9DB2BF", cursor: "pointer" }}
          onChange={(event) => {
             setCategories((prev: any) => {
               const newCat: ICatalogForCLient[] = [...prev]
               const actualElement: ICatalogForCLient = newCat.filter(category_ => category_.LISTA.some(objchild => objchild.CATEGORIA_2 === subCategory.CATEGORIA_2))[0]
               const idx = actualElement.LISTA.findIndex((subCategory_: ICategory2ForClient) => subCategory_.ID === subCategory.ID)
               if (newCat[index].LISTA[idx].LISTA_SERVER.includes(subCategory.ID)) {
                 console.log(newCat[index].LISTA[idx].LISTA_SERVER.indexOf(subCategory.CATEGORIA_2))
                 const idxOfElement = newCat[index].LISTA[idx].LISTA_SERVER.indexOf(subCategory.CATEGORIA_2)
                 newCat.splice(idxOfElement, 1)
                 return newCat
               } else {
                 console.log(row.ID_EQUIPO.toString())
                 newCat[index].LISTA[idx].LISTA_SERVER.push(row.ID_EQUIPO.toString())
                 return newCat
               }
             })
          }}
        />
      ),
      sortable: true
    }
  })
} */
/* 
type Props = { ci: ICatalog2CIForClient }
const SubCategoriesSelects: FC<Props> = ({ ci }) => {
  let propiedades = Object.keys(ci);
  return (
    <div>

      {propiedades.map((propiedad) => (
        <div>
          <label key={propiedad}>{propiedad}: {ci[propiedad]}</label>
          <input
            id={`checkTo${ci[propiedad].replace(/\s/g, '')}`}
            className="form-check-input"
            type="checkbox"
            checked={false}
            style={{ border: "1px solid #9DB2BF", cursor: "pointer" }}
            onChange={(event) => {
               setCategories((prev: any) => {
                 const newCat: ICatalogForCLient[] = [...prev]
                 const actualElement: ICatalogForCLient = newCat.filter(category_ => category_.LISTA.some(objchild => objchild.CATEGORIA_2 === subCategory.CATEGORIA_2))[0]
                 const idx = actualElement.LISTA.findIndex((subCategory_: ICategory2ForClient) => subCategory_.ID === subCategory.ID)
                 if (newCat[index].LISTA[idx].LISTA_SERVER.includes(subCategory.ID)) {
                   console.log(newCat[index].LISTA[idx].LISTA_SERVER.indexOf(subCategory.CATEGORIA_2))
                   const idxOfElement = newCat[index].LISTA[idx].LISTA_SERVER.indexOf(subCategory.CATEGORIA_2)
                   newCat.splice(idxOfElement, 1)
                   return newCat
                 } else {
                   console.log(row.ID_EQUIPO.toString())
                   newCat[index].LISTA[idx].LISTA_SERVER.push(row.ID_EQUIPO.toString())
                   return newCat
                 }
               })
            }}
          />
        </div>
      ))}

    </div>
  )
} */
export const CIsColumns = (): TableColumn<IEquipmentsRestantes>[] => [
  {
    name: 'NOMBRE DE CI',
    cell: (row: IEquipmentsRestantes) => row.NOMBRE_CI ?? "Sin registro",
    sortable: true
  },
  {
    name: 'HOSTNAME',
    cell: (row: IEquipmentsRestantes) => row.NOMBRE ?? "Sin registro",
    sortable: true
  },
]
