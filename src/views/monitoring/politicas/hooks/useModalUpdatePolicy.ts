import { useEffect, useState } from "react"
import { ModalView } from "../Types"

const useModalUpdatePolicy = () => {
  const [showModalUpdatePolicyModal, setShowModal] = useState(false)
  const [modalViewUpdatePolicy, setModalView] = useState("")
  const [modalInformationUpdatePolicy, setModalInformation] = useState<any>()

  useEffect(() => {
    return () => {
      setModalInformation("")
    }
  }, [])

  /*Funcion para abrir la modal la cual recibe como parametros la vista a mostrar, el tamaño del modal, opcionalmente información  
  que sea pertinente para el modal*/
  const openModalUpdatePolicy = (view: ModalView, information?: any) => {
    setModalView(view)
    setShowModal(true)
    setModalInformation(information)
  }
  const closeModalUpdatePolicy = () => setShowModal(false)

  return { openModalUpdatePolicy, closeModalUpdatePolicy, showModalUpdatePolicyModal, modalViewUpdatePolicy, modalInformationUpdatePolicy }
}

export { useModalUpdatePolicy }