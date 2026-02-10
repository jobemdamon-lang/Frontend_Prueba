import { useCallback, useState} from "react"
import { BackupService } from "../../../services/Backup.service"
import { ICreateGroup, IGroupPolicies, IGroupPoliciesDataListFormat } from "../components/politicas/Types"

//Custom hook que contiene 2 metodos (Grupos) para consumir la API ::GET Listar Politicas y ::POST Crear Politica
const useGroupPolitics = ({closeModal}:{closeModal:any}) => {

  //Estados para el manejo de la peticion Listar Grupos
  const [ groupPoliticsData, setFetchData ] = useState<Array<IGroupPoliciesDataListFormat>>([])
  const [ groupPoliticsFetchStatus, setgroupPoliticsFetchStatus ] = useState(false)
  const [ loadingStatus, setLoadingStatus ] = useState(false)
  const [ groupPoliticsDataErrorMessage, setgroupPoliticsDataErrorMessage ] = useState("")

  //Estados para el manejo de la peticion Listar Crear Grupo
  const [ groupPoliticsCreateStatus, setgroupPoliticsCreateStatus ] = useState(false)
  const [ loadingCreateGroup , setLoadingCreateGroup ] = useState(false)
  const [ showNotification , setShowNotification ] = useState(false)

  //Metodo para llamar a la API ::GET Listar Grupos
  const fetchGroupPolitics = useCallback(async function (idProject:string){
    try {
      setLoadingStatus(true)
      const response = await BackupService.listGroupsPolicies(idProject)
      if (response.status === "Error"){
        setgroupPoliticsFetchStatus(false)
        setLoadingStatus(false)
        setgroupPoliticsDataErrorMessage(response.mensaje)
        setFetchData([])
      }else{ 
        //Se modifica el contrato de estructura de la Data debido a que el componente DatalistInput requiere ese formato
        let groupsPoliciesData = response.lista.map((groupPolitic:IGroupPolicies) => ({ id: groupPolitic.codigo, value: groupPolitic.nombre }))
        setFetchData(groupsPoliciesData)
        setLoadingStatus(false)
        setgroupPoliticsFetchStatus(true)
      }
    } catch (error) {
      setLoadingStatus(false)
      setFetchData([])
    }
  },[])

    //Metodo para llamar a la API ::POST Crear Grupo
  const createGroupPolitics = useCallback(async function (createInformation:ICreateGroup){
    try {
      setLoadingCreateGroup(true)
      const response = await BackupService.createGroup(createInformation)
      if (response.status === "Correcto"){
        setgroupPoliticsCreateStatus(true)
        setLoadingCreateGroup(false)
        setShowNotification(true)
        fetchGroupPolitics(createInformation.id_proyecto.toString())
        setTimeout(()=>{closeModal()},1500)
      }else{
        setLoadingCreateGroup(false)
        setgroupPoliticsCreateStatus(false)
        setShowNotification(true)
      }
    } catch (error) {
      setLoadingCreateGroup(false)
      setgroupPoliticsCreateStatus(false)
      setShowNotification(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

    return {groupPoliticsData, fetchGroupPolitics, groupPoliticsFetchStatus, groupPoliticsDataErrorMessage, loadingStatus,
            createGroupPolitics, groupPoliticsCreateStatus, loadingCreateGroup, showNotification}
}

export { useGroupPolitics }