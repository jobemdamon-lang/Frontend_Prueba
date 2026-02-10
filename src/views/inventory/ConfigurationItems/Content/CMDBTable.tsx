import { createColumn, createEditBehavior, createFilterBehavior, FilterOperation, GridOptions, GridSelectionMode, getContext } from "@ezgrid/grid-core";
import { createMultiSelectFilterOptions, createNumericRangeFilterOptions, createTextInputFilterOptions, ReactDataGrid, SelectionCheckBoxHeaderRenderer, SelectionCheckBoxRenderer } from "@ezgrid/grid-react";
import "@ezgrid/grid-core/styles.css"
import "@ezgrid/grid-core/icons.css"
import { FC, useMemo } from "react";
import "../../../../assets/sass/components/react-data-table.scss"
import { IConfigurationItem, ModalViewForConfigurationItems } from "../../Types";
import { EditButton } from "../../../../components/buttons/EditButton";
import { useConfigurationItemsContext } from "../Context";
import { ModalSize } from "../../../../hooks/Types";
import { EditEsButton } from "../../../../components/buttons/EditEsButton";
import { IPButton } from "../../../../components/buttons/IPButton";
import { Actions } from "./Actions";
import clsx from "clsx";
import { createExcelBehavior } from "@ezgrid/grid-export";
import { createPdfBehavior } from "../../../../helpers/createPdfBehavior";
import { EmptyDataTable } from "../../../../components/EmptyDataTable";
import { AccessController } from "../../../../components/AccessControler";
import { AnalyticsService } from "../../../../helpers/analytics";

type Props = { dataCI: IConfigurationItem[], loading: boolean }

const CMDBTable: FC<Props> = (props) => {

    const { modalHook, rol, apiRef } = useConfigurationItemsContext()

    const gridOptions = useMemo<GridOptions>(() => ({
        dataProvider: props.dataCI,
        isLoading: props.loading,
        uniqueIdentifierOptions: {
            useField: "ID_EQUIPO",
        },
        behaviors: [
            createFilterBehavior({}),
            createEditBehavior({}),
            createExcelBehavior({}),
            createPdfBehavior({})
        ],
        nextLevel: {
            childrenField: "HIJOS"
        },
        enableContextMenu: true,
        enableDynamicLevels: true,
        eventBus: {
            onApiContextReady: (ctx) => {
                apiRef.current = ctx;
                if (apiRef.current.api) apiRef.current.api.expandAll()
            }
        },
        enableFooters: false,
        selectionMode: GridSelectionMode.SingleRow,
        enablePaging: true,
        toolbarOptions: {
            enableExcel: true,
            enablePdf: true,
            enableGlobalSearch: false,
        },
        contextMenuOptions: {
            contextMenuItems: (node, currentItems) => {
                return currentItems;
            }
        },
        columns: [
            {
                ...createColumn("ID_EQUIPO", "number", "ID"),
                filterOptions: createNumericRangeFilterOptions(),
                selectionCheckBoxOptions: {
                    selectionCheckBoxRenderer: SelectionCheckBoxRenderer,
                    selectionCheckboxHeaderRenderer: SelectionCheckBoxHeaderRenderer,
                }
            },
            {
                ...createColumn("NOMBRE_CI", "string", "Nombre CI"),
                filterOptions: createTextInputFilterOptions(FilterOperation.Wildcard),
                enableHierarchy: true,
                itemRenderer: ({ node }) => {
                    const ctx = getContext(node.gridOptions);
                    const activeCell = ctx.modifications.activeCell;
                    const item = node.rowPosition?.data as IConfigurationItem;
                    const isActive =
                        activeCell &&
                        activeCell.rowIdentifier === node?.rowPosition?.uniqueIdentifier;
                    return (
                        <div className="d-flex justify-content-end align-items-center">
                            <div className="btn-group" role="group">
                                <AccessController rol={rol}>
                                    <EditButton
                                        className="p-0"
                                        style={{ width: '27px', height: '30px' }}
                                        onClick={() => {
                                            AnalyticsService.event("edit_ci_general", { module: "equipments", metadata: { ciID: item.NOMBRE } });
                                            modalHook.openModal(ModalViewForConfigurationItems.UPDATE_CI_GENERAL, ModalSize.XL, undefined, item)
                                        }}
                                    />
                                </AccessController>
                                <AccessController rol={rol}>
                                    <EditEsButton
                                        className="p-0"
                                        style={{ width: '27px', height: '30px' }}
                                        onClick={() => {
                                            AnalyticsService.event("edit_ci_specific", { module: "equipments", metadata: { ciID: item.NOMBRE } });
                                            modalHook.openModal(ModalViewForConfigurationItems.UPDATE_CI_SPECIFIC, ModalSize.XL, undefined, item)
                                        }}
                                    />
                                </AccessController>
                                <IPButton
                                    className="p-0"
                                    style={{ width: '27px', height: '30px' }}
                                    onClick={() => {
                                        AnalyticsService.event("manage_ci_ip", { module: "equipments", metadata: { ciID: item.NOMBRE } });
                                        modalHook.openModal(ModalViewForConfigurationItems.ADMINISTRATE_IP, ModalSize.XL, undefined, item)
                                    }}
                                />
                            </div>
                            <div>
                                <p className="d-inline fw-bold mx-5 my-0">
                                    {item ? item.NOMBRE_CI?.toUpperCase() : ""}
                                </p>
                            </div>
                            {isActive ? (
                                <div
                                    style={{ cursor: "pointer" }}
                                    className="ezgrid-dg-info-cell"
                                    onClick={() => {
                                        AnalyticsService.event("view_ci_information", { module: "equipments", metadata: { ciID: item.NOMBRE } });
                                        modalHook.openModal(ModalViewForConfigurationItems.INFORMATION_CI, ModalSize.XL, undefined, item)
                                    }}
                                ></div>
                            ) : null}
                        </div>
                    );
                },
                width: 450,
            },
            {
                ...createColumn("FAMILIA_REAL", "string", "FAMILIA"),
                filterOptions: createMultiSelectFilterOptions(),
            },
            {
                ...createColumn("CLASE_REAL", "string", "CLASE"),
                filterOptions: createMultiSelectFilterOptions(),
            },
            {
                ...createColumn("NOMBRE", "string", "HOSTNAME"),
                filterOptions: createTextInputFilterOptions(FilterOperation.Wildcard),
            },
            {
                ...createColumn("IPLAN", "string", "IP PRINCIPAL"),
                filterOptions: createTextInputFilterOptions(FilterOperation.Wildcard),
            },
            {
                ...createColumn("CLIENTE", "string", "CLIENTE"),
                filterOptions: createMultiSelectFilterOptions(),
            },
            {
                ...createColumn("PROYECTO", "string", "PROYECTO"),
                filterOptions: createMultiSelectFilterOptions(),
            },
            {
                ...createColumn("ALP", "string", "ALP"),
                filterOptions: createMultiSelectFilterOptions(),
            },
            {
                ...createColumn("UBICACION", "string", "UBICACION"),
                filterOptions: createMultiSelectFilterOptions(),
            },
            {
                ...createColumn("SEDE_CLIENTE", "string", "SEDE DE CLIENTE"),
                filterOptions: createTextInputFilterOptions(FilterOperation.Wildcard),
            },
            {
                ...createColumn("NOMBRE_VIRTUAL", "string", "NOMBRE VIRTUAL"),
                filterOptions: createTextInputFilterOptions(FilterOperation.Wildcard),
            }, {
                ...createColumn("VCENTER", "string", "CONSOLA DE ADMINISTRACIÓN"),
                filterOptions: createTextInputFilterOptions(FilterOperation.Wildcard),
            }
            ,
            {
                ...createColumn("EQUIPO_ESTADO", "string", "ESTADO DEL EQUIPO"),
                filterOptions: createMultiSelectFilterOptions(),
                itemRenderer: ({ node }) => {
                    const item = node.rowPosition?.data as IConfigurationItem;
                    return (
                        <span className={clsx('text-bold fs-7', equipment_status[item.EQUIPO_ESTADO?.toLowerCase() ?? ""])}>
                            {item.EQUIPO_ESTADO?.toUpperCase() ?? ""}
                        </span>
                    )

                }
            },
            {
                ...createColumn("AMBIENTE", "string", "AMBIENTE"),
                filterOptions: createMultiSelectFilterOptions(),
            },
            {
                ...createColumn("ROL_USO", "string", "ROL DE USO"),
                filterOptions: createMultiSelectFilterOptions(),
            },
            {
                ...createColumn("PRIORIDAD", "string", "CRITICIDAD"),
                filterOptions: createMultiSelectFilterOptions(),
                itemRenderer: ({ node }) => {
                    const item = node.rowPosition?.data as IConfigurationItem;
                    return (
                        <span className={clsx('text-bold fs-7', priority[item.PRIORIDAD?.toLocaleLowerCase() ?? ""])}>
                            {item.PRIORIDAD?.toUpperCase()}
                        </span>
                    )

                }
            },
            {
                ...createColumn("TIPO_SERVICIO", "string", "TIPO DE SERVICIO "),
                filterOptions: createTextInputFilterOptions(FilterOperation.Wildcard),
            },
            {
                ...createColumn("SERVICIO_NEGOCIO", "string", "SERVICIO DE NEGOCIO"),
                filterOptions: createTextInputFilterOptions(FilterOperation.Wildcard),
            },
            {
                ...createColumn("DESCRIPCION", "string", "DESCRIPCION"),
                filterOptions: createTextInputFilterOptions(FilterOperation.Wildcard),
            },
            {
                ...createColumn("TIPO_EQUIPO", "string", "TIPO DE EQUIPO"),
                filterOptions: createTextInputFilterOptions(FilterOperation.Wildcard),
            },
            {
                ...createColumn("CRQ_ALTA", "string", "TICKET DE ALTA "),
                filterOptions: createTextInputFilterOptions(FilterOperation.Wildcard),
            },
            {
                ...createColumn("TICKET_BAJA", "string", "TICKET DE BAJA "),
                filterOptions: createTextInputFilterOptions(FilterOperation.Wildcard),
            },
            {
                ...createColumn("ADMINISTRADOR", "string", "ADMINISTRADOR TORRE "),
                filterOptions: createMultiSelectFilterOptions(),
            },
            {
                ...createColumn("TIPO_ALCANCE", "string", "TIPO DE ALCANCE"),
                filterOptions: createMultiSelectFilterOptions(),
            },
            {
                ...createColumn("NRO_SERIE", "string", "NRO_SERIE"),
                filterOptions: createTextInputFilterOptions(FilterOperation.Wildcard),
            },
            {
                ...createColumn("BACKUPS", "string", "BACKUPS"),
                filterOptions: createMultiSelectFilterOptions(),
            }
            ,
            {
                ...createColumn("MONITOREO", "string", "MONITOREO"),
                filterOptions: createMultiSelectFilterOptions(),
            }
            ,
            {
                ...createColumn("BACKUPS_CLOUD", "string", "BACKUPS NUBE "),
                filterOptions: createMultiSelectFilterOptions(),
            }
            ,
            {
                ...createColumn("MONITOREO_CLOUD", "string", "MONITOREO NUBE"),
                filterOptions: createMultiSelectFilterOptions(),
            }
        ],
    }), [props.loading, props.dataCI, modalHook, rol, apiRef]);

    return (
        <div className="card p-5">
            <Actions />
            <div className="position-relative">
                <ReactDataGrid
                    style={{ height: "800px", width: "100%" }}
                    gridOptions={gridOptions}
                />
                {
                    props.dataCI.length === 0 &&
                    !props.loading &&
                    <EmptyDataTable description="Ingrese un filtro y realice la búsqueda para mostrar resultados" />
                }
            </div>
        </div>

    )
}

export { CMDBTable }

const equipment_status: any = {
    encendido: 'badge badge-light-success',
    apagado: 'badge badge-light-dark',
    mantenimiento: 'badge badge-light-warning',
    baja: 'badge badge-light-danger'
}

const priority: any = {
    "1 - alto": 'badge badge-light-danger',
    "2 - medio": 'badge badge-light-warning',
    "3 - bajo": 'badge badge-light-info',
}