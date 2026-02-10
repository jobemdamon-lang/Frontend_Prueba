import { Behaviors, ColumnOptions, GridOptions, PdfBehavior, PdfBehaviorOptions, itemToLabel } from '@ezgrid/grid-core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type Cell = string[];

type ExportToPdf = (
    rowPositions: any[],
    colPositions: ColumnOptions[],
    orientation: "p" | "portrait" | "l" | "landscape" | undefined
) => void;

const createPdfBehavior = (options: PdfBehaviorOptions) => (gridOptions: GridOptions): PdfBehavior => {
    const exportToPdf: ExportToPdf = (rowPositions, colPositions, orientation) => {
        const doc = new jsPDF({
            orientation
        });
        const beforeTable = options.cellsBeforeBody || [];
        let ySofar = 0;
        const addLine = (line: string, maxWidth = 250) => {
            doc.setFont('helvetica');
            doc.setFontSize(10);
            const splitTitle = doc.splitTextToSize(line, maxWidth);
            doc.text(splitTitle, 15, ySofar + 10);
            ySofar += splitTitle.length * 10;
        };
        beforeTable.forEach((row: Cell) => {
            const line = row.join(' ');
            addLine(line);
        });
        let pdfColumns = colPositions.filter(column => !column.excludeFromPdf);
        if (options.columnsToInclude && options.columnsToInclude.length > 0) {
            pdfColumns = pdfColumns.filter(column => options.columnsToInclude?.includes(column.uniqueIdentifier));
        } else {
            pdfColumns = pdfColumns.slice(0, options.maxColumns || 10);
        }
        autoTable(doc, {
            startY: beforeTable.length * 10,
            head: [pdfColumns.map(column => column.headerText)],
            body: rowPositions.map(row => pdfColumns.map(column => itemToLabel(row, column)))
        });
        const afterTable = options.cellsAfterBody || [];
        if (afterTable.length > 0) {
            doc.addPage();
            ySofar = 0;
            afterTable.forEach((row: Cell) => {
                const line = row.join(' ');
                addLine(line);
            });
        }
        doc.save('table.pdf');
    };
    return {
        behaviorName: Behaviors.PdfBehavior, // Asigna el nombre correcto de tu comportamiento
        options,
        exportToPdf
    };
};

export { createPdfBehavior }
