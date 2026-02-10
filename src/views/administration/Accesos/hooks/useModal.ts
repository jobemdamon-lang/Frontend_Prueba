import { useState } from "react"
import { ModalView, ModalSize } from "../../Types"

const useModal = () => {
  const [showModal, setShowModal] = useState(false)
  const [modalView, setModalView] = useState("")
  const [modalInformation, setModalInformation] = useState()
  const [sizeModal, setSize] = useState<ModalSize>(ModalSize.XL)

  const openModal = (view:ModalView , size:ModalSize, information?:any ) => {
    setSize(size)
    setModalView(view)
    setShowModal(true)
    setModalInformation(information)
  }
  const closeModal = () => setShowModal(false)
  
  return { openModal, closeModal, showModal, modalView, modalInformation, sizeModal }
}

export { useModal }