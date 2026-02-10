import { ApiContext, GridOptions, GridSelectionMode, createColumn, createFilterBehavior } from "@ezgrid/grid-core";
import { ReactDataGrid, createMultiSelectFilterOptions } from "@ezgrid/grid-react";
import { useMemo, useRef } from "react";
import "@ezgrid/grid-core/styles.css"
import "@ezgrid/grid-core/icons.css"
import "../../../../assets/sass/components/react-data-table.scss"
import { IFamilyClase, ModalViewForAdministrateCMDB } from "../../Types";
import { useAdministrateCMDBContext } from "../Context";
import { ModalSize } from "../../../../hooks/Types";
import { AnalyticsService } from "../../../../helpers/analytics";

const FamilyClaseTable = () => {

    const { modalHook, familyclaseHook } = useAdministrateCMDBContext()
    const FamilyClaseTableRef = useRef<ApiContext<IFamilyClase> | null>(null)

    const gridOptions = useMemo<GridOptions<IFamilyClase>>(() => ({

        //dataProvider: construitArbolFamiliaClases(familyclaseHook.familyClaseData, 3894),
        dataProvider: familyclaseHook.familyClaseData,
        isLoading: familyclaseHook.loadingGetFamilyClase,
        uniqueIdentifierOptions: {
            useField: "ID",
        },
        enableDynamicLevels: true,
        behaviors: [
            createFilterBehavior({})
        ],
        selectionMode: GridSelectionMode.None,
        eventBus: {
            onApiContextReady: (ctx) => {
                FamilyClaseTableRef.current = ctx;
                if (FamilyClaseTableRef.current.api) {
                    console.log('entro a expandir')
                    FamilyClaseTableRef.current.api.expandAll();
                }
            }
        },
        nextLevel: {
            childrenField: "HIJOS",
        },
        columns: [
            {
                ...createColumn("FAMILIA", "string", "FAMILIA"),
                filterOptions: createMultiSelectFilterOptions(),
                enableHierarchy: true,
            },
            {
                ...createColumn("CLASE", "string", "CLASE"),
                filterOptions: createMultiSelectFilterOptions(),
            }
        ],
    }), [familyclaseHook.familyClaseData, familyclaseHook.loadingGetFamilyClase]);

    return (
        <div className="card">
            <header className="p-8 pb-0 d-flex justify-content-between">
                <div>
                    <h4 className="text-start text-uppercase m-0">Relación de Familia y Clases</h4>
                    <p className="fw-light m-0">Añada, actualice y liste las Familias y sus respectivas clases.</p>
                </div>
                <div className="d-flex gap-10">
                    <button
                        onClick={() => {
                            AnalyticsService.event("create_relation",
                                { module: "administrate_cmdb" }
                            );
                            modalHook.openModal(ModalViewForAdministrateCMDB.CREATE_RELATION, ModalSize.XL, undefined, {})
                        }}
                        className="btn btn-primary">
                        Crear Relacion
                    </button>
                    <button
                        onClick={() => {
                            AnalyticsService.event("delete_relation",
                                { module: "administrate_cmdb" }
                            );
                            modalHook.openModal(ModalViewForAdministrateCMDB.DELETE_RELATION, ModalSize.XL, undefined, {})
                        }}
                        className="btn btn-primary">
                        Eliminar Relacion
                    </button>
                    <button
                        onClick={() => {
                            AnalyticsService.event("update_relation",
                                { module: "administrate_cmdb" }
                            );
                            modalHook.openModal(ModalViewForAdministrateCMDB.UPDATE_FAMILY_CLASE, ModalSize.XL, undefined, {})
                        }}
                        className="btn btn-primary">
                        Actualizar Familia - Clase
                    </button>
                    <button
                        onClick={() => {
                            AnalyticsService.event("create_family",
                                { module: "administrate_cmdb" }
                            );
                            modalHook.openModal(ModalViewForAdministrateCMDB.CREATE_FAMILY, ModalSize.XL, undefined, {})
                        }}
                        className="btn btn-primary">
                        Crear Familia - Clase
                    </button>
                    <button
                        onClick={() => {
                            AnalyticsService.event("view_hierarchy",
                                { module: "administrate_cmdb" }
                            );
                            modalHook.openModal(ModalViewForAdministrateCMDB.HIERARCHY_FAMILYCLASE, ModalSize.XL, true, {})
                        }}
                        className="btn btn-primary">
                        Ver Jerarquia
                    </button>
                    <button
                        onClick={() => {
                            if (FamilyClaseTableRef.current?.api) {
                                FamilyClaseTableRef.current?.api.expandAll();
                            }
                        }}
                        className="btn btn-primary">
                        Expandir todo
                    </button>
                </div>

            </header>
            <hr className="text-dark w-100 mb-3" style={{ opacity: "0.1" }} />
            <div className="px-8">
                <ReactDataGrid
                    style={{ height: "100vh" }}
                    gridOptions={gridOptions}
                />
            </div>
        </div>
    )
}
export { FamilyClaseTable }