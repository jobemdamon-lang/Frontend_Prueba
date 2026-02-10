import { useState, useEffect } from "react";

interface UsePaginationProps<T> {
    data: T[];
    initialPage?: number;
    initialItemsPerPage?: number;
}

interface UsePaginationReturn<T> {
    currentPage: number;
    itemsPerPage: number;
    currentItems: T[];
    totalPages: number;
    totalItems: number;
    setCurrentPage: (page: number) => void;
    setItemsPerPage: (items: number) => void;
    resetPagination: () => void;
}

export const usePagination = <T,>({
    data,
    initialPage = 1,
    initialItemsPerPage = 10,
}: UsePaginationProps<T>): UsePaginationReturn<T> => {

    const [currentPage, setCurrentPage] = useState(initialPage)
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage)

    // Calcula los índices y los items actuales
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)
    
    const totalPages = Math.ceil(data.length / itemsPerPage) || 1
    const totalItems = data.length

    // Resetear a la página 1 cuando cambian los items por página o los datos
    useEffect(() => {
        setCurrentPage(1)
    }, [itemsPerPage, data.length])

    const resetPagination = () => {
        setCurrentPage(1)
    }

    return {
        currentPage,
        itemsPerPage,
        currentItems,
        totalPages,
        totalItems,
        setCurrentPage,
        setItemsPerPage,
        resetPagination,
    }
}