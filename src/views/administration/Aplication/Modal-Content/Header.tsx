import { useEffect, useState } from "react"
import { ModalViewForAplication } from "../../Types"
import { ModalSize } from "../../../../hooks/Types"
import { useAplicationContext } from "../Context"
import { DataList } from "../../../../components/Inputs/DataListInput"
import { useProject } from "../../../../hooks/useProjects"
import { warningNotification } from "../../../../helpers/notifications"


const Header = () => {
    const { modalHook, integrationHook } = useAplicationContext()
    const { getProjects } = useProject()
    const [selectedIntegration, setSelectedIntegration] = useState('')

    useEffect(() => {
        getProjects()
        integrationHook.getLisAlltIntegration()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleInsert = () => {
        modalHook.openModal(ModalViewForAplication.INSERT_TOKEN, ModalSize.LG, undefined, {})
    }


    return (
        <div className="d-flex justify-content-center align-items-end gap-10 bg-Light" style={{ borderRadius: '10px', border: '1px gray' }}>


            <div className="d-flex align-items-end gap-3">
                <DataList
                    items={integrationHook.integrationsList.map((integration) => ({ id: integration.ID_INTEGRACION, value: integration.NOMBRE }))}
                    label="INTEGRACIÓN"
                    value={selectedIntegration}
                    onChange={setSelectedIntegration}
                    loading={integrationHook.loadingListAllIntegrations}
                />


                <button className="btn btn-primary"
                    onClick={() => {
                        const integration = integrationHook.integrationsList.find((integration) => integration.NOMBRE === selectedIntegration)
                        if (!integration) {
                            warningNotification('La integracion selecionada no es valida');
                            return
                        }
                        integrationHook.generateTokenIntegration(integration.ID_INTEGRACION.toString())
                        .then((success) => {
                            if (success) {
                                integrationHook.getLisAlltIntegration()
                            }
                        })
                    }}  
                    disabled={integrationHook.loadingGenerationToken}>
                    {integrationHook.loadingGenerationToken ? 'Generando...' : 'GENERAR TOKEN'}
                </button>
            </div>

            <div className="d-flex  align-items-end gap-5" style={{ borderRadius: '10px' }}
            >
                <button className="btn btn-success" onClick={handleInsert}>
                    AGREGAR INTEGRACIÓN
                </button>


            </div>


        </div>
    )
}
export { Header }


