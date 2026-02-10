import { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify"
import { ApiManagementCCS } from "../../../services/ApiV2";
import { useTypedSelector } from "../../../store/ConfigStore";

const useBulkLoad = ({ closeModal }: { closeModal: Function }) => {

  const inputRef = useRef<any>(null)
  const [file, setFile] = useState<any>();
  const [statusUpload, setStatusUpload] = useState(false);
  const [showAlert, setShowAltert] = useState(false)
  const [forceUpdate, setForceUpdate] = useState<"False" | "True">("False");
  const [uploadPercent, setUploadPercentage] = useState<number>(0)
  const [postStatus, setPostStatus] = useState<boolean>(false)
  //Estado del endpoint de consulta de estado
  const [consultingStatus, setConsultingStatus] = useState(false)
  const [successUpload, setSuccessUpload] = useState(false)
  const [mmsgUpload, setMssgUpload] = useState("")
  const userName = useTypedSelector(({ auth }) => auth.usuario)

  const exportFile = useCallback(async function (data: any) {
    try {
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }))
      const link = document.createElement('a');
      let today = new Date();
      let date = today.getFullYear() + "" + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);;
      let time = today.getHours() + "" + today.getMinutes();
      let filename = date + '_' + time + "-fileError.xls";
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Ops.. Al parecer ocurrió un problema al extraer el archivo")
    }
  }, [])


  const importFile = useCallback(async function () {
    try {
      setPostStatus(true)
      const formData = new FormData()
      formData.append('xls_file', file)
      //Se realiza la subida del archivo excel al backend
      const response = await ApiManagementCCS.post(`/inventario/cargaMasiva/${forceUpdate}/${userName}`, formData, {
        onUploadProgress: (uploadProgressEvent) => {
          if (uploadProgressEvent.loaded !== undefined && uploadProgressEvent.total !== undefined) {
            const uploadProgress = Math.round((uploadProgressEvent.loaded / uploadProgressEvent.total) * 50);
            setUploadPercentage(uploadProgress);
          }
        },
        onDownloadProgress: (downloadProgressEvent) => {
          if (downloadProgressEvent.loaded !== undefined && downloadProgressEvent.total !== undefined) {
            const downloadProgress = Math.round((downloadProgressEvent.loaded / downloadProgressEvent.total) * 50) + 50;
            setUploadPercentage(downloadProgress);
          }
        },
      })
      setConsultingStatus(false)
      setSuccessUpload(false)
      setUploadPercentage(100)
      if (response.status === 200) {
        let ContentType = response.headers['content-type']
        if (ContentType === "application/json") {
          const arrayBuffer = response.data;
          const uint8Array = new Uint8Array(arrayBuffer);
          const textDecoder = new TextDecoder('utf-8');
          const jsonString = textDecoder.decode(uint8Array);
          const json_response = JSON.parse(jsonString);
          console.log(json_response)
          if (json_response.status === "Error") {
            setMssgUpload(json_response.mensaje)
            toast.error(`Ocurrio un Error: ${json_response.mensaje}.`, {
              position: toast.POSITION.TOP_RIGHT
            })
            setStatusUpload(false)
            setShowAltert(true)
            setFile(null)
            setPostStatus(false)
            inputRef.current.value = null
          } else {
            setStatusUpload(true)
            setShowAltert(true)
            setFile(null)
            inputRef.current.value = null
            //fetchEquipments()
            setPostStatus(false)
            toast.success(`CIs cargados correctamente! 🥳`, {
              position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => closeModal(), 1500)
          }
        } else {
          toast.warn(`Porfavor corrija los errores en el archivo.`, {
            position: toast.POSITION.TOP_RIGHT
          })
          setStatusUpload(false)
          setShowAltert(true)
          setFile(null)
          setPostStatus(false)
          inputRef.current.value = null
          //Se el enviar el archivo de errores para descargar
          exportFile(response.data)
        }
      } else {
        toast.error(`Ocurrió un error al conectarse con el servidor.`, {
          position: toast.POSITION.TOP_RIGHT
        })
        setStatusUpload(false)
        setShowAltert(true)
        setFile(null)
        setPostStatus(false)
        inputRef.current.value = null
      }
    } catch {
      toast.error(`Ocurrió un error al conectarse con el servidor.`, {
        position: toast.POSITION.TOP_RIGHT
      })
      setShowAltert(true)
      setFile(null)
      setPostStatus(false)
      inputRef.current.value = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, forceUpdate])

  return {
    file, showAlert, statusUpload, uploadPercent, postStatus, setForceUpdate, importFile, inputRef, mmsgUpload,
    setFile, setUploadPercentage, setShowAltert, forceUpdate, consultingStatus, successUpload
  }
}
export { useBulkLoad }
