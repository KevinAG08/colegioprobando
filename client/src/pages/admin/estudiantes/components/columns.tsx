import { ColumnDef, CellContext } from "@tanstack/react-table";
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
    id: "index",
    header: "N°",
    cell: (info: CellContext<EstudianteColumn, unknown>) =>
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
    accessorKey: "aula",
    header: "Aula",
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
