import { FC } from "react"

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems?: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (value: number) => void;
}

export const Pagination: FC<PaginationProps> = ({
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    onPageChange,
    onItemsPerPageChange,
}) => {
    const getVisiblePages = () => {
        const maxVisible = 5;
        const half = Math.floor(maxVisible / 2)
        let start = Math.max(currentPage - half, 1)
        const end = Math.min(start + maxVisible - 1, totalPages)

        if (end - start + 1 < maxVisible) {
            start = Math.max(end - maxVisible + 1, 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }

    // Calcular el rango de registros mostrados solo si totalItems está definido
    const showItemsCount = typeof totalItems !== 'undefined'
    const startItem = showItemsCount ? (currentPage - 1) * itemsPerPage + 1 : 0
    const endItem = showItemsCount ? Math.min(currentPage * itemsPerPage, totalItems) : 0

    return (
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-4 gap-3">
            <div className="d-flex align-items-center gap-3">
                {showItemsCount && (
                    <span className="text-muted fs-7">
                        Mostrando {startItem} a {endItem} de {totalItems} registros
                    </span>
                )}

                <div className="d-flex align-items-center gap-2">
                    <span className="text-muted fs-7">Mostrar:</span>
                    <select
                        className="form-select form-select-sm w-80px"
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            <div className="d-flex gap-2">
                <button
                    className="btn btn-sm btn-light"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>

                {getVisiblePages().map((page) => (
                    <button
                        key={page}
                        className={`btn btn-sm ${currentPage === page ? "btn-primary" : "btn-light"}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}

                <button
                    className="btn btn-sm btn-light"
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};