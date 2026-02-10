import { FC, useState, useMemo } from "react";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { CIRecord } from "./DetailChange";
import { usePagination } from "../../../../hooks/usePagination";
import { Pagination } from "../../../../components/datatable/Pagination";

type SelectCIModalProps = {
    show: boolean;
    setShow: (show: boolean) => void;
    availableCIs: CIRecord[];
    onSelect: (ci: CIRecord) => void;
};

const SelectCIModal: FC<SelectCIModalProps> = ({ show, setShow, availableCIs, onSelect }) => {
    const [searchParam, setSearchParam] = useState("");
    const [familiaFilter, setFamiliaFilter] = useState("");

    const uniqueFamilies = useMemo(() => {
        const families = [...new Set(availableCIs.map(ci => ci.FAMILIA).filter(fam => fam))];
        return families.sort()
    }, [availableCIs]);

    // Filtrar CIs por búsqueda
    const filteredCIs = useMemo(() => {
        return availableCIs.filter(ci => {
            const matchesSearch = ci.NOMBRE_CI.toLowerCase().includes(searchParam.toLowerCase()) ||
                                ci.NRO_IP.toLowerCase().includes(searchParam.toLowerCase());
            
            const matchesFamily = familiaFilter === '' || ci.FAMILIA === familiaFilter;
            
            return matchesSearch && matchesFamily;
        });
    }, [availableCIs, searchParam, familiaFilter]);

    // Paginación
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
        initialItemsPerPage: 5,
    });

    if (!show) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-xl"> {/* Modal más grande para las columnas */}
                <div className="modal-content rounded">
                    <div className="modal-header pb-0 border-0 justify-content-end">
                        <div
                            className='btn btn-icon btn-sm btn-active-light-primary ms-2'
                            onClick={() => setShow(false)}
                        >
                            <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-2' />
                        </div>
                    </div>
                    <div className="modal-body scroll-y px-10 px-lg-15 pt-0 pb-15">
                        <div className="text-center mb-5">
                            <h3 className="mb-3">Añadir nuevo CI</h3>
                        </div>
                        <div className="row mb-4 g-3">
                            {/* Barra de búsqueda */}
                            <div className="col-md-8">
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <KTSVG path='/media/icons/duotune/general/gen021.svg' className='svg-icon-2' />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Buscar por nombre o IP..."
                                        value={searchParam}
                                        onChange={(e) => setSearchParam(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* Filtro por Familia */}
                            <div className="col-md-4">
                                <select
                                    className="form-select"
                                    value={familiaFilter}
                                    onChange={(e) => setFamiliaFilter(e.target.value)}
                                >
                                    <option value="">Todas las familias</option>
                                    {/* Aquí puedes mapear las opciones de familia disponibles */}
                                    {uniqueFamilies.map(family => (
                                        <option key={family} value={family}>{family}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* Tabla con columnas */}
                        <div className="table-responsive mb-4">
                            <table className="table table-hover align-middle gs-2">
                                <thead>
                                    <tr className="fw-bold text-muted bg-light">
                                        <th className="ps-4 rounded-start">Nombre CI</th>
                                        <th>Familia</th>
                                        <th>IP</th>
                                        <th className="text-center rounded-end">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedCIs.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-muted text-center py-5">
                                                {filteredCIs.length === 0 && searchParam ? 
                                                    "No se encontraron CIs con ese criterio de búsqueda." :
                                                    "No hay CIs disponibles para añadir."
                                                }
                                            </td>
                                        </tr>
                                    )}
                                    {paginatedCIs.map(ci => (
                                        <tr key={ci.ID_EQUIPO}>
                                            <td className="ps-4">
                                                <div className="fw-bold text-gray-800">{ci.NOMBRE_CI}</div>
                                            </td>
                                            <td>
                                                <span className="badge badge-light-info">{ci.FAMILIA}</span>
                                            </td>
                                            <td>
                                                <span className="text-muted">{ci.NRO_IP || 'N/A'}</span>
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-sm btn-primary btn-icon"
                                                    onClick={() => onSelect(ci)}
                                                    title="Añadir CI"
                                                >
                                                    <KTSVG path='/media/icons/duotune/arrows/arr064.svg' className='svg-icon-3' />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        {filteredCIs.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                itemsPerPage={itemsPerPage}
                                totalItems={totalItems}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={setItemsPerPage}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { SelectCIModal };