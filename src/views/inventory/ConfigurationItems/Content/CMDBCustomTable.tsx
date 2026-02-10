import type { IConfigurationItem } from "../../Types"
import React, { useState } from "react"

type Props = { dataCI: IConfigurationItem[], loading: boolean }


const CMDBCustomTable: React.FC<Props> = (prop) => {
    const { dataCI, loading } = prop
    const [expandedRows, setExpandedRows] = useState<number[]>([])
    const [filter, setFilter] = useState<{ [key: string]: string }>({})
    const [activeRow, setActiveRow] = useState<number | null>(null)

    const columns_order = [
        "ID_EQUIPO", "NOMBRE_CI", "FAMILIA", "CLASE", "NOMBRE", "IPLAN", "CLIENTE", "PROYECTO", "ALP",
        "UBICACION", "SEDE_CLIENTE", "NOMBRE_VIRTUAL", "VCENTER", "EQUIPO_ESTADO", "AMBIENTE", "ROL_USO",
        "PRIORIDAD", "TIPO_SERVICIO", "SERVICIO_NEGOCIO", "DESCRIPCION", "TIPO_EQUIPO", "CRQ_ALTA",
        "TICKET_BAJA", "ADMINISTRADOR", "TIPO_ALCANCE", "NRO_SERIE", "BACKUPS", "MONITOREO", "BACKUPS_CLOUD", "MONITOREO_CLOUD"
    ];

    const columns = React.useMemo(() => 
        columns_order.filter(col => dataCI.length > 0 && col in dataCI[0])
    , [dataCI]);

    const columns_select = [
        "ALP", "EQUIPO_ESTADO", "PRIORIDAD", "AMBIENTE", "FAMILIA", "CLASE", "TIPO_EQUIPO", "TIPO_SERVICIO"
    ]

    const getSelectOptions = (col: string) => {
        const values = dataCI.map(item => item[col as keyof IConfigurationItem])
            .filter(val => typeof val === "string" && val !== null && val !== undefined)
        return Array.from(new Set(values)) as string[]
    }

    const handleFilterChange = (col: string, value: string) => {
        setFilter((prev) => ({
            ...prev,
            [col]: value
        }))
    }

    const filteredData = React.useMemo(() => {
        return dataCI.filter(item =>
            columns.every(col => {
                const filterValue = filter[col]
                if (!filterValue) return true
                const itemValue = String(item[col as keyof IConfigurationItem] ?? "")
                return itemValue === filterValue
            })
        )
    }, [dataCI, filter, columns])  

    const toggleRowExpansion = (id: number) => {
        setExpandedRows((rows) =>
            rows.includes(id) ? rows.filter(r => r !== id) : [...rows, id]
        )
    }

    const renderRows = React.useCallback((items: IConfigurationItem[], level = 0) => {
        return items.map(item=>(
            <React.Fragment key={item.ID_EQUIPO}>
                <tr onClick={() => setActiveRow(item.ID_EQUIPO)} style={{ cursor: 'pointer' }}>
                    {columns.map((col, idx) => (
                        <td 
                            key={col}
                            className={activeRow === item.ID_EQUIPO ? 'table-active' : ''}
                            style={{
                                ...(col === "NOMBRE_CI" ? { paddingLeft: `${level * 20 + 8}px` } : {}),
                                borderRight: '1px solid #dee2e6',
                                borderBottom: '1px solid #dee2e6'
                            }}
                        >
                            {idx === 0 && item.HIJOS && item.HIJOS.length > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleRowExpansion(item.ID_EQUIPO);
                                    }}
                                    className="btn btn-sm btn-link"
                                >
                                    {expandedRows.includes(item.ID_EQUIPO) ? '-' : '+'}
                                </button>
                            )}
                            {
                                Array.isArray(item[col as keyof IConfigurationItem])
                                    ? <span>-</span>
                                    : String(item[col as keyof IConfigurationItem] ?? "")
                            }
                        </td>
                    ))}
                </tr>
                {item.HIJOS && item.HIJOS.length > 0 && expandedRows.includes(item.ID_EQUIPO) && (
                    renderRows(item.HIJOS, level + 1)
                )}
            </React.Fragment>
        ))
    }, [columns, expandedRows, activeRow]);

    return (
        <div className="p-3 bg-white rounded shadow-sm">
            <div style = { { overflowX: 'auto', maxWidth: '100%'} }>
                <table className="table table-striped table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            {columns.map((col) => (
                                <th
                                key={col}
                                style={{ 
                                    borderBottom: '2px solid #495057',
                                    textAlign: 'center'
                                }}
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col}
                                    className="text-center bg-light"
                                    style={{
                                        borderBottom: "2px solid #dee2e6"
                                    }}
                                >
                                    <div className="d-flex align-items-center gap-2">
                                        {columns_select.includes(col) ? (
                                            <select
                                                className="form-select form-select-sm"
                                                value={filter[col] || ""}
                                                onChange={(e) => handleFilterChange(col, e.target.value)}
                                                >
                                                <option value="">Todos</option>
                                                {getSelectOptions(col).map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder={`Filtrar por ${col}`}
                                                // onChange={(e) => handleFilterChange(col, e.target.value)}
                                            />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {renderRows(filteredData)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export { CMDBCustomTable }