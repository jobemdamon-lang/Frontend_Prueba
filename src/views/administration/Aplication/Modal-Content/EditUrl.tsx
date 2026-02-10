import { Input } from "../../../../components/Inputs/TextInput"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useAplicationContext } from "../Context"
import { Button } from "react-bootstrap"
import { IUrls } from "../../Types"
import { useState } from "react"



const EditUrl = () => {
    const { modalHook, integrationHook } = useAplicationContext()
    const modalInformation: IUrls = modalHook.modalInformation

    const [actualurl, setActualURL] = useState<IUrls>(modalInformation)


    return (

        <>
            <div className='modal-header px-5 py-3'>
                <h2 className="text-dark">EDITAR URL DE INTEGRACIÓN</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>

            <div className="d-flex justify-content-center align-items-end mb-5 gap-10 bg-Light" style={{ borderRadius: '10px', border: '1px gray' }}>
                <div className="d-flex align-items-end gap-3">

                    <Input
                        label='URL'
                        value={actualurl.URL ?? ""}
                        onChange={(value: string) => setActualURL(prev => ({ ...prev, URL: value }))}
                        className="w-200px" />

                    <Button
                        disabled={integrationHook.loadingUpdateUrl}
                        className="btn btn-success"
                        onClick={() => {
                            integrationHook.updateUrl(modalInformation.ID.toString(), {
                                url: actualurl.URL

                            })

                        }} >
                        {integrationHook.loadingUpdateUrl ? 'Actualizando...' : 'ACTUALIZAR'}
                    </Button>
                </div>
            </div>


        </>
    )
}
export { EditUrl }


