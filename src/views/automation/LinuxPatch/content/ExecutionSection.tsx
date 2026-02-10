import { useEffect, useState } from "react"
import { LaunchSVG } from "../../../../components/SVGs/LaunchSVG"
import { ModalSize } from "../../../../hooks/Types"
import { IListExecutionsLinux, ModalViewForLinuxPatch } from "../../Types"
import { useLinuxPatchContext } from "../Context"
import { ExecutionFilter } from "./ExecutionFilters"
import { ExecutionTable } from "./ExecutionTable"
import { DataList } from "../../../../components/Inputs/DataListInput"

const ExecutionSection = () => {

    const { modalHook, executionHook, clientHook, selectedOwners, setOwners } = useLinuxPatchContext()
    const [filteredExecutions, setFilteredExecutions] = useState<IListExecutionsLinux[]>([])

    const handleChangeClient = (client: string) => {
        setOwners((prev) => ({ ...prev, clientToExecution: client }))
        executionHook.getListExecutionsLinux(client)
    }

    useEffect(() => {
        setFilteredExecutions(executionHook.executionsLinuxData.reverse())
    }, [executionHook.executionsLinuxData])

    return (
        <>
            <div className="d-flex justify-content-center align-items-end gap-5 w-100 mb-10">
                <ExecutionFilter
                    executionsData={executionHook.executionsLinuxData}
                    setFilteredExecutions={setFilteredExecutions}
                />
                <div className="d-flex gap-5 align-items-end justify-content-between">
                    <div className="d-flex flex-column gap-2">
                        {selectedOwners.clientToExecution === '' && <i className="text-center">Seleccione un Cliente</i>}
                        <button
                            disabled={selectedOwners.clientToExecution === ''}
                            onClick={() => modalHook.openModal(ModalViewForLinuxPatch.CONFIGURATION_PATCH, ModalSize.XL, undefined, {})}
                            className="btn btn-success"
                        >
                            <span className="me-2">Nueva Ejecución</span>
                            <LaunchSVG />
                        </button>
                    </div>
                    <DataList
                        onChange={handleChangeClient}
                        value={selectedOwners.clientToExecution}
                        label="Cliente"
                        loading={clientHook.loadingGetClientsWithCMDB}
                        items={clientHook.clientsWithCMDB}
                    />
                </div>
            </div>
            <ExecutionTable filteredExecutions={filteredExecutions} />
        </>
    )
}

export { ExecutionSection }