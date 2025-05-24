import { CellContext, ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type ProfesorColumn = {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  dni: string;
  aulas: string[];
  telefono: string;
};

export const columns: ColumnDef<ProfesorColumn>[] = [
  {
    id: "index",
    header: "N°",
    cell: (info: CellContext<ProfesorColumn, unknown>) =>
      `${info.row.index + 1}`,
  },
  {
    accessorKey: "nombres",
    header: "Nombres",
  },
  {
    accessorKey: "apellidos",
    header: "Apellidos",
  },
  {
    accessorKey: "dni",
    header: "DNI",
  },
  {
    accessorKey: "aulas",
    header: "Aulas",
    cell: ({ row }) => {
      const aulas = row.original.aulas;
      return aulas && aulas.length > 0 ? aulas.join(", ") : "Sin aulas";
    },
  },
  {
    accessorKey: "telefono",
    header: "Telefono",
    cell: ({ row }) => {
      const telefono = row.original.telefono;
      return telefono ? telefono : "-";
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
