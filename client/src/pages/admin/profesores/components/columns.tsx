import { ColumnDef } from "@tanstack/react-table";
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
    accessorKey: "apellidos",
    header: "Apellidos",
    enableColumnFilter: false,
  },
  {
    accessorKey: "nombres",
    header: "Nombres",
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorKey: "dni",
    header: "DNI",
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "aulas",
    header: "Aulas",
    cell: ({ row }) => {
      const aulas = row.original.aulas;
      return aulas && aulas.length > 0 ? aulas.join(", ") : "Sin aulas";
    },
    enableSorting: false,
    enableColumnFilter: false,
    accessorFn: (row) => {
      const aulas = row.aulas;
      return aulas && aulas.length > 0 ? aulas.join(", ") : "Ninguna";
    },
  },
  {
    accessorKey: "telefono",
    header: "Telefono",
    cell: ({ row }) => {
      const telefono = row.original.telefono;
      return telefono ? telefono : "-";
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <CellAction data={row.original} />,
    enableSorting: false,
    enableColumnFilter: false,
  },
];
