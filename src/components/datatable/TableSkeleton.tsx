import { FC } from "react";

interface TableSkeletonProps {
    size: number;
    columns: number;
}

export const TableSkeleton: FC<TableSkeletonProps> = ({ size, columns }) => (
    <>
        {Array(size)
            .fill(0)
            .map((_, index) => (
                <tr key={index} aria-hidden="true">
                    {Array(columns)
                        .fill(0)
                        .map((_, colIndex) => (
                            <td key={colIndex}>
                                <span className="placeholder w-100 rounded bg-gray-500"></span>
                            </td>
                        ))}
                </tr>
            ))}
    </>
);