import { useEffect, useState } from "react"
import { ModalView } from "../Types"

const useModalParams = () => {
  const [showModalParams, setShowModalParams] = useState(false)
  const [modalViewParams, setModalViewParams] = useState("")
  const [modalInformationParams, setModalInformationParams] = useState<any>()

   useEffect(()=>{
    return ()=>{
      setModalInformationParams("")
    }
  },[])

  /*Funcion para abrir la modal la cual recibe como parametros la vista a mostrar, el tamaño del modal, opcionalmente información  
  que sea pertinente para el modal*/
  const openModalParams = (view:ModalView , information?:any) => {
    setModalViewParams(view)
    setShowModalParams(true)
    setModalInformationParams(information)
  }
  const closeModalParams = () => setShowModalParams(false)
  
  return { openModalParams, closeModalParams, showModalParams, modalViewParams, modalInformationParams , setModalInformationParams }
}

export { useModalParams }