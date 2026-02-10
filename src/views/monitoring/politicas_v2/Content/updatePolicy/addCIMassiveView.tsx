import { FC, useState, useMemo, useCallback } from "react";
import { useMonitoringPoliciesContext } from "../../Context";
import { ViewProps } from "./UpdateMain";
import { usePagination } from "../../../../../hooks/usePagination";
import { Pagination } from "../../../../../components/datatable/Pagination";
import { ModalViewForMonitoringPolicies } from "../../Types";
import { ModalSize } from '../../../../../hooks/Types';

export const AddCIMassiveView: FC<ViewProps> = ({ updates, setUpdates, setActiveView }) => {
    const { modalHook, versionHook } = useMonitoringPoliciesContext();
    
    // Estados core
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    
    // Filtros
    const [searchId, setSearchId] = useState('');
    const [searchNombre, setSearchNombre] = useState('');
    const [searchIP, setSearchIP] = useState('');
    const [searchFamilia, setSearchFamilia] = useState('');
    const [searchClase, setSearchClase] = useState('');

    const allCIs = useMemo(() => versionHook.cisInVersion || [], [versionHook.cisInVersion]);

    // Extraer opciones únicas para los dropdowns
    const familiaOptions = useMemo(() => {
        const uniqueFamilias = [...new Set(allCIs.map(ci => ci.FAMILIA).filter(f => f))].sort();
        return [{ value: '', label: 'Todas las familias' }, ...uniqueFamilias.map(f => ({ value: f, label: f }))];
    }, [allCIs]);

    const claseOptions = useMemo(() => {
        let clasesFiltradas = allCIs
        if (searchFamilia) {
            clasesFiltradas = allCIs.filter(ci => ci.FAMILIA === searchFamilia);
        }
        const uniqueClases = [...new Set(clasesFiltradas.map(ci => ci.CLASE).filter(c => c))].sort();
        return [{ value: '', label: 'Todas las clases' }, ...uniqueClases.map(c => ({ value: c, label: c }))];
    }, [allCIs, searchFamilia]);

    // Aplicar filtros
    const filteredCIs = useMemo(() => {
        return allCIs.filter(ci => {
            if (searchId && !ci.ID_EQUIPO.toString().includes(searchId)) return false;
            if (searchNombre && ci.NOMBRE_CI && !ci.NOMBRE_CI.toLowerCase().includes(searchNombre.toLowerCase())) return false;
            if (searchIP && ci.IP && !ci.IP.toLowerCase().includes(searchIP.toLowerCase())) return false;
            if (searchFamilia && ci.FAMILIA !== searchFamilia) return false;
            if (searchClase && ci.CLASE !== searchClase) return false;
            return true;
        });
    }, [allCIs, searchId, searchNombre, searchIP, searchFamilia, searchClase]);

    const {
        currentPage,
        itemsPerPage,
        currentItems: paginatedCIs,
        totalPages,
        totalItems,
        setCurrentPage,
        setItemsPerPage,
    } = usePagination({
        data: filteredCIs,
        initialPage: 1,
        initialItemsPerPage: 10,
    });

    // Funciones de selección
    const isSelected = useCallback((ciId: number) => selectedIds.has(ciId), [selectedIds]);

    const toggleSelection = useCallback((ci: any) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(ci.ID_EQUIPO)) {
                newSet.delete(ci.ID_EQUIPO);
            } else {
                newSet.add(ci.ID_EQUIPO);
            }
            return newSet;
        });
    }, []);

    const selectAllFiltered = useCallback(() => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            filteredCIs.forEach(ci => newSet.add(ci.ID_EQUIPO));
            return newSet;
        });
    }, [filteredCIs]);

    const deselectAllFiltered = useCallback(() => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            filteredCIs.forEach(ci => newSet.delete(ci.ID_EQUIPO));
            return newSet;
        });
    }, [filteredCIs]);

    const deselectAll = useCallback(() => {
        setSelectedIds(new Set());
    }, []);

    const allFilteredSelected = useMemo(() => {
        return filteredCIs.length > 0 && filteredCIs.every(ci => selectedIds.has(ci.ID_EQUIPO));
    }, [filteredCIs, selectedIds]);

    const clearFilters = () => {
        setSearchId('');
        setSearchNombre('');
        setSearchIP('');
        setSearchFamilia('');
        setSearchClase('');
        setCurrentPage(1);
    };

    const handleOpenMassiveModal = () => {
        if (selectedIds.size === 0) {
            alert('Selecciona al menos un CI para continuar.');
            return;
        }
        
        const selectedCIs = allCIs.filter(ci => selectedIds.has(ci.ID_EQUIPO));

        modalHook.openModal(
            ModalViewForMonitoringPolicies.VALIDATE_MASSIVE_CI,
            ModalSize.XL,
            undefined,
            { selectedCIs: selectedCIs, setUpdates: setUpdates, setActiveView: setActiveView }
        );
    };

    const handleFamiliaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchFamilia(e.target.value);
        setSearchClase('');
        setCurrentPage(1);
    };

    return (
        <>
            <div className="card p-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Seleccionar CIs para Configuración Masiva</h4>
                    <div className="d-flex gap-2 align-items-center">
                        {selectedIds.size > 0 && (
                            <span className="badge bg-primary fs-6">
                                {selectedIds.size} seleccionado{selectedIds.size !== 1 ? 's' : ''}
                            </span>
                        )}
                        <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={deselectAll}
                            disabled={selectedIds.size === 0}
                        >
                            <i className="bi bi-x-circle me-1"></i>
                            Limpiar Todo
                        </button>
                    </div>
                </div>

                {/* Filtros y Selección Masiva */}
                <div className="card mb-3 bg-light border-0">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="mb-0">Filtros de Búsqueda</h6>
                            <div className="d-flex gap-2">
                                {allFilteredSelected ? (
                                    <button 
                                        className="btn btn-sm btn-outline-warning"
                                        onClick={deselectAllFiltered}
                                    >
                                        <i className="bi bi-square me-1"></i>
                                        Deseleccionar Filtrados
                                    </button>
                                ) : (
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={selectAllFiltered}
                                        disabled={filteredCIs.length === 0}
                                    >
                                        <i className="bi bi-check-square me-1"></i>
                                        Seleccionar Todos los Filtrados ({filteredCIs.length})
                                    </button>
                                )}
                                {(searchId || searchNombre || searchIP || searchFamilia || searchClase) && (
                                    <button 
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={clearFilters}
                                    >
                                        <i className="bi bi-x-circle me-1"></i>
                                        Limpiar Filtros
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        <div className="row g-2">
                            <div className="col-md-2">
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Filtrar por ID..."
                                    value={searchId}
                                    onChange={(e) => {
                                        setSearchId(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Filtrar por Nombre..."
                                    value={searchNombre}
                                    onChange={(e) => {
                                        setSearchNombre(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                            <div className="col-md-2">
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Filtrar por IP..."
                                    value={searchIP}
                                    onChange={(e) => {
                                        setSearchIP(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                            <div className="col-md-2">
                                <select
                                    className="form-select form-select-sm"
                                    value={searchFamilia}
                                    onChange={ handleFamiliaChange }
                                >
                                    {familiaOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <select
                                    className="form-select form-select-sm"
                                    value={searchClase}
                                    onChange={(e) => {
                                        setSearchClase(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    {claseOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla */}
                <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <table className="table table-hover table-bordered mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '50px' }} className="text-center">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={allFilteredSelected && filteredCIs.length > 0}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                selectAllFiltered();
                                            } else {
                                                deselectAllFiltered();
                                            }
                                        }}
                                        title="Seleccionar/Deseleccionar todos"
                                    />
                                </th>
                                <th style={{ width: '80px' }}>ID</th>
                                <th>Nombre CI</th>
                                <th style={{ width: '150px' }}>IP</th>
                                <th style={{ width: '200px' }}>Familia</th>
                                <th style={{ width: '150px' }}>Clase</th>
                            </tr>
                        </thead>
                        <tbody>
                            {versionHook.cisInVersionLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedCIs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-5 text-muted">
                                        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                        {filteredCIs.length === 0 && allCIs.length > 0 
                                            ? 'No hay CIs que coincidan con los filtros'
                                            : 'No hay CIs disponibles'
                                        }
                                    </td>
                                </tr>
                            ) : (
                                paginatedCIs.map((ci) => (
                                    <tr 
                                        key={ci.ID_EQUIPO}
                                        className={isSelected(ci.ID_EQUIPO) ? 'table-primary' : ''}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => toggleSelection(ci)}
                                    >
                                        <td className="text-center" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={isSelected(ci.ID_EQUIPO)}
                                                onChange={() => toggleSelection(ci)}
                                            />
                                        </td>
                                        <td>{ci.ID_EQUIPO}</td>
                                        <td className="fw-semibold">{ci.NOMBRE_CI}</td>
                                        <td><code>{ci.IP || 'N/A'}</code></td>
                                        <td>{ci.FAMILIA}</td>
                                        <td>{ci.CLASE}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {filteredCIs.length > 0 && (
                    <Pagination
                        totalItems={totalItems}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                )}

                {/* Botón de Envío */}
                {selectedIds.size > 0 && (
                    <div className="mt-4 text-center">
                        <div className="card bg-light border-0">
                            <div className="card-body py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-1">CIs Seleccionados: {selectedIds.size}</h6>
                                        <span className="text-muted small">
                                            Listos para configuración masiva
                                        </span>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button 
                                            className="btn btn-outline-secondary"
                                            onClick={deselectAll}
                                        >
                                            <i className="bi bi-x-circle me-1"></i>
                                            Cancelar
                                        </button>
                                        <button 
                                            className="btn btn-primary"
                                            onClick={handleOpenMassiveModal}
                                        >
                                            <i className="bi bi-gear me-1"></i>
                                            Configurar Masivamente
                                            <span className="badge bg-light text-dark ms-2">
                                                {selectedIds.size}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
        </>
    )
};