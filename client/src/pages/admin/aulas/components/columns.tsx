import { CellContext, ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type AulaColumn = {
    id: string;
    nombre: string;
    nivel: string;
}

export const columns: ColumnDef<AulaColumn>[] = [
    {
        id: "index",
        header: "N°",
        cell: (info: CellContext<AulaColumn, unknown>) => `${info.row.index + 1}`
    },
    {
        accessorKey: "nombre",
        header: "Nombre",
        enableColumnFilter: false,
        enableSorting: false,
    },
    {
        accessorKey: "nivel",
        header: "Nivel",
        enableColumnFilter: false,
        enableSorting: false,
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => <CellAction data={row.original} />,
        enableColumnFilter: false,
        enableSorting: false,
    }
]