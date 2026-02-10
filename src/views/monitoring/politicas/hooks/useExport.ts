import { useCallback, useState } from "react";
import { MonitoringService } from "../../../../services/Monitoring.service";

const useExport = () => {

  const [loadingExport, setLoadindExport] = useState(false)

  const getExportFile = useCallback(async function (idPolicy: string, nr_version: string) {
    setLoadindExport(true)
    try {
      const response = await MonitoringService.exportPolicy(idPolicy, nr_version)
      const url = URL.createObjectURL(new Blob([response], { type: 'application/vnd.ms-excel' }))
      const link = document.createElement('a');
      link.href = url;
      let today = new Date();
      let date = today.getFullYear() + "" + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);;
      let time = today.getHours() + "" + today.getMinutes();
      let filename = date + '_' + time + "-politica.xls";
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setLoadindExport(false)
    } catch (error) {
      alert("Ops.. Al parecer ocurrió un problema al extraer el archivo")
      setLoadindExport(false)
    }
  }, [])
  return { getExportFile, loadingExport }
}

export { useExport }