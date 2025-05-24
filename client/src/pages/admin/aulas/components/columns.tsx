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
        header: "Nombre"
    },
    {
        accessorKey: "nivel",
        header: "Nivel"
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]