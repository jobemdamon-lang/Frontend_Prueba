import { useCallback } from "react";
import { warningNotification } from "../../../../helpers/notifications";
import { ModalSize } from "../../../../hooks/Types";
import { IConfigurationItem, ModalViewForConfigurationItems } from "../../Types";
import { useConfigurationItemsContext } from "../Context";
import { useCI } from "../../hooks/useCI";
import { SearchInput } from "../../../../components/SearchInput/SearchInput";
import debounce from "just-debounce-it";
import { flattenCIs } from "../../hooks/utils";
import { AccessController } from "../../../../components/AccessControler";
import { AnalyticsService } from "../../../../helpers/analytics";

const Actions = () => {

    const { modalHook, owners, rol, apiRef, filterGlobalValue, setFilterGlobalValue } = useConfigurationItemsContext()
    const { getExportFile, generateFile, loadingExport, loadingGeneration } = useCI()

    const handleOpenHierarchy = () => {
        if (!apiRef.current) return;

        const arrRelationedCIs: IConfigurationItem[] = apiRef.current.api?.getSelectedObjects() as IConfigurationItem[] ?? []
        if (arrRelationedCIs.length === 0) {
            warningNotification('Seleccione un CI para visualizar el Relacionamiento.')
            return;
        }
        modalHook.openModal(ModalViewForConfigurationItems.HIERARCHY, ModalSize.XL, true, arrRelationedCIs[0])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleDebounceFilter = useCallback(
        debounce((value: string) => {
            apiRef.current?.api?.setGlobalFilter(value)
        }, 700)
        , [])

    const handleSearch = (value: string) => {
        setFilterGlobalValue(value)
        handleDebounceFilter(value)
    }

    return (
        <section className="d-flex justify-content-end align-items-end pb-4 gap-10 flex-wrap">
            <SearchInput value={filterGlobalValue} placeholder="Ingrese su busqueda" setValue={handleSearch} />
            <div className="btn-group" role="group" aria-label="Opciones para CMDB">
                <AccessController rol={rol}>
                    <button
                        onClick={() => {
                            AnalyticsService.event("create_ci", { module: "equipments" });
                            modalHook.openModal(ModalViewForConfigurationItems.CREATE_CI, ModalSize.XL, undefined, {})
                        }}
                        className="btn btn-info d-flex gap-3 align-items-center btn-sm">
                        <span> Crear CI </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                        </svg>
                    </button>
                </AccessController>
                <AccessController rol={rol}>
                    <button
                        onClick={() => {
                            AnalyticsService.event("relate_ci", { module: "equipments" });
                            modalHook.openModal(ModalViewForConfigurationItems.RELATION_CI, ModalSize.XL, undefined, {})
                        }}
                        className="btn btn-info d-flex gap-3 align-items-center btn-sm"
                    >
                        <span> Relacionar CI </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-diagram-3" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5zM8.5 5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5zM0 11.5A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm4.5.5A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm4.5.5a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z" />
                        </svg>
                    </button>
                </AccessController>
                <button
                    disabled={loadingExport}
                    onClick={() => {
                        AnalyticsService.event("export_cis", { module: "equipments" });
                        getExportFile(owners, flattenCIs((apiRef.current?.api?.getFilteredDataProvider() ?? []) as IConfigurationItem[]))
                    }}
                    className="btn btn-info d-flex gap-3 align-items-center btn-sm"
                >
                    <span>{loadingExport ? "Exportando" : "Exportar"}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                    </svg>
                </button>
                {rol === "admin" && (
                    <AccessController rol={rol}>
                        <button
                            disabled={loadingGeneration}
                            onClick={() => {
                                generateFile(owners, flattenCIs((apiRef.current?.api?.getFilteredDataProvider() ?? []) as IConfigurationItem[]))
                            }}
                            className="btn btn-info d-flex gap-3 align-items-center btn-sm">
                            <span>{loadingGeneration ? "Exportando..." : "Exportación unificada"}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                            </svg>
                        </button>
                    </AccessController>
                )}
                <AccessController rol={rol}>
                    <button
                        onClick={() => {
                            AnalyticsService.event("bulkload_cis", { module: "equipments" });
                            modalHook.openModal(ModalViewForConfigurationItems.BULKLOAD, ModalSize.SM, undefined, {})
                        }}
                        className="btn btn-info d-flex gap-3 align-items-center btn-sm"
                    >
                        <span> Carga Masiva </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-file-earmark-spreadsheet-fill" viewBox="0 0 16 16">
                            <path d="M6 12v-2h3v2z" />
                            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M3 9h10v1h-3v2h3v1h-3v2H9v-2H6v2H5v-2H3v-1h2v-2H3z" />
                        </svg>
                    </button>
                </AccessController>
                <button
                    className="btn btn-info d-flex gap-3 align-items-center btn-sm"
                    onClick={ () => {
                        AnalyticsService.event("view_hierarchy", { module: "equipments" });
                        handleOpenHierarchy();
                    }}
                >
                    <span> Ver Jerarquia </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                    </svg>
                </button>
            </div>
        </section>
    )

}
export { Actions }

/* Función para calcular la profundidad de un objeto IConfigurationItem
function calculateDeep(objeto: IConfigurationItem): number {
    if (objeto.HIJOS.length === 0) {
        return 1;
    } else {
        const profundidadesHijos = objeto.HIJOS.map(calculateDeep);
        return 1 + Math.max(...profundidadesHijos);
    }
} */