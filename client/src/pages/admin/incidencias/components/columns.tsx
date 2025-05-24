import { CellContext, ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type IncidenciaColumn = {
  id: string;
  fecha: string;
  hora: string;
  lugar: string;
  tipoIncidencia: string;
  descripcion: string;
  medidasAdoptadas: string;
  userFullName: string;
  estudiantes: string[];
  aulaId: string[];
  aulaNombre: string[];
};

export const columns: ColumnDef<IncidenciaColumn>[] = [
  {
    id: "index",
    header: "N°",
    cell: (info: CellContext<IncidenciaColumn, unknown>) =>
      `${info.row.index + 1}`,
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
  },
  {
    accessorKey: "hora",
    header: "Hora",
  },
  {
    accessorKey: "tipoIncidencia",
    header: "Tipo de incidencia",
  },
  {
    accessorKey: "aulaNombre",
    header: "Aula",
    cell: ({ row }) => {
      const aulas = row.original.aulaNombre;
      return aulas && aulas.length > 0 ? aulas.join(", ") : "Ninguna";
    },
  },
  {
    accessorKey: "estudiantes",
    header: "Estudiantes involucrados",
    cell: ({ row }) => {
      const estudiantes = row.original.estudiantes;
      return estudiantes && estudiantes.length > 0
        ? estudiantes.join(", ")
        : "Ninguno";
    },
  },
  {
    accessorKey: "userFullName",
    header: "Registrado por",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
