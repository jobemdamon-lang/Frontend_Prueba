import { ChangeEvent } from "react"
import { Button, Form, ProgressBar, Spinner } from "react-bootstrap"
import { useConfigurationItemsContext } from "../Context"
import { KTSVG } from "../../../../helpers"
import { useBulkLoad } from "../../hooks/useBulkLoad"
import { ToolTip } from "../../../../components/tooltip/ToolTip"

const BulkLoad = () => {

    const { modalHook } = useConfigurationItemsContext()
    const { file, showAlert, uploadPercent, postStatus, setForceUpdate, forceUpdate, importFile, inputRef, mmsgUpload,
        setFile, setUploadPercentage, setShowAltert, consultingStatus, successUpload } = useBulkLoad({ closeModal: modalHook.closeModal })

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        if (!file) {
            inputRef.current.focus();
            return;
        }
        importFile()
    };

    return (
        <>
            <div className='modal-header py-4'>
                <h2>Sube tu Archivo</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body pt-2 text-center'>

                <ToolTip message="El archivo seleccionado debe estar en formato (XLS.)" placement="top-start">
                    <div className="my-5">
                        <label htmlFor="file-to-upload">Sube tu archivo</label>
                        <KTSVG path='/media/icons/duotune/general/gen045.svg' className='svg-icon-1 position-absolute ms-4' />
                    </div>
                </ToolTip>
                {/* Se muestra unicamente cuando el proceso de carga esta en proceso */}
                {consultingStatus ?
                    <>
                        <div className="text-center mt-5">
                            <h4>Procesando ...</h4>
                        </div>
                        <Spinner animation="border" variant="primary" />
                    </>
                    : ""
                }
                <ProgressBar style={{ height: "25px", fontSize: "14px" }} className="my-5 display-4 w-8" variant="success" now={uploadPercent} label={`${uploadPercent}%`} animated={true} />
                <div className="my-4 p-3 rounded">
                    <Form.Label>Forzar Actualización</Form.Label>
                    <Form.Check
                        type="switch"
                        className="w-100px m-auto"
                        id="custom-switch"
                        checked={forceUpdate === "True" ? true : false}
                        label={forceUpdate === "True" ? "Si" : "No"}
                        onChange={(e) => {
                            setUploadPercentage(0)
                            setShowAltert(false)
                            if (e.target.checked) {
                                setForceUpdate("True")
                            } else {
                                setForceUpdate("False")
                            }
                        }}
                    ></Form.Check>
                </div>
                <input
                    style={{ width: "250px" }}
                    id="file-to-upload"
                    type="file"
                    ref={inputRef}
                    className="form-control"
                    onChange={handleFileChange}
                    onClick={(e) => {
                        setShowAltert(false)
                        setUploadPercentage(0)
                    }}
                    accept=".xls, application/vnd.ms-excel"
                />
                <div className={`my-5 ${showAlert ? "d-block" : "d-none"}`} >
                    {successUpload ?
                        <div>
                            <p className="text-success bi bi-check-circle-fill"> {mmsgUpload}</p>
                        </div>
                        :
                        <div className="mb-5">
                            <p className="text-danger"> {mmsgUpload}</p>
                        </div>
                    }
                </div>
                <div className="d-flex flex-row justify-content-around my-5">
                    <Button
                        variant="primary"
                        disabled={postStatus}
                        size="sm"
                        onClick={() => handleUploadClick()}
                    >
                        {postStatus ? "Cargando..." : "Cargar"}
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => modalHook.closeModal()}>
                        Cancelar
                    </Button>
                </div>
            </div>
        </>
    )

}
export { BulkLoad }