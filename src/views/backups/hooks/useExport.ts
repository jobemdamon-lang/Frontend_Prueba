import { useCallback } from "react"
import { BackupService } from "../../../services/Backup.service"

const useExport = () => {

  const getExportPolicy = useCallback(async function (id:number, version:number){
    try {
      const response = await BackupService.exportPolicy(id.toString(),version.toString())
      const url = URL.createObjectURL(new Blob([response], { type: 'application/vnd.ms-excel' }))
      const link = document.createElement('a');
      link.href = url;
      let today = new Date();   
      let date = today.getFullYear()+ "" +("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);;
      let time = today.getHours() + ""+ today.getMinutes();
      let filename = date+'_'+time+`-politica${id}-version${version}.xls`;
      link.setAttribute('download',filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Ops.. Al parecer ocurrió un problema al extraer el archivo")
    }
  },[])
  return { getExportPolicy }
}

export { useExport }