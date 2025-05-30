import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type EstudianteColumn = {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  dni: string;
  apoderado: string;
  telefono: string;
  sexo: string;
  fechaNacimiento: string;
  aula: string;
};

export const columns: ColumnDef<EstudianteColumn>[] = [
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
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorKey: "aula",
    header: "Aula",
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorKey: "telefono",
    header: "Telefono",
    cell: ({ row }) => {
      const telefono = row.original.telefono;
      return telefono ? telefono : "-";
    },
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <CellAction data={row.original} />,
    enableColumnFilter: false,
    enableSorting: false,
  },
];
