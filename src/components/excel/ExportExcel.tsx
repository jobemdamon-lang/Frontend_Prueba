/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import ReactExport from 'react-export-excel-xlsx-fix'

const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn

type Props = {
   data: Array<any>
   head: Array<any>
   wrapComponent: any
   sheetName?: string
}

const ExportExcel: FC<Props> = ({ data, head, wrapComponent ,sheetName = 'libro 1' }) => {
   return (
      <ExcelFile element={wrapComponent}>
         <ExcelSheet data={data} name={sheetName}>
            {head.map((item: any, index: any) => (
               <ExcelColumn label={item.label} value={item.name} key={`col-${index}-${item.name}`} />
            ))}
         </ExcelSheet>
      </ExcelFile>
   )
}

export { ExportExcel }
