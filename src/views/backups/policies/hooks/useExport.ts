import { useCallback, useState } from "react"
import { BackupService } from "../../../../services/Backup.service"

export const useExport = () => {
    const [loadingExport, setLoadingExport] = useState(false);

    const getExportPolicy = useCallback(async function (id:number, version:number){
        setLoadingExport(true);
        try {
            const response = await BackupService.exportPolicyV2(id.toString(),version.toString())
            const url = URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.ms-excel' }))
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
        } finally {
            setLoadingExport(false);
        }
    },[])

    return { getExportPolicy, loadingExport }
}