import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type IncidenciaColumn = {
  id: string;
  fecha: string;
  fechaFormateada: string;
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
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => {
      return row.original.fechaFormateada;
    },
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.original.fecha);
      const dateB = new Date(rowB.original.fecha);
      return dateB.getTime() - dateA.getTime();
    },
    filterFn: (row, value) => {
      const fechaFormateada = row.original.fechaFormateada;
      return fechaFormateada.toLowerCase().includes(value.toLowerCase());
    },
    accessorFn: (row) => row.fechaFormateada,
    enableColumnFilter: false,
  },
  {
    accessorKey: "hora",
    header: "Hora",
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorKey: "tipoIncidencia",
    header: "Tipo de incidencia",
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "aulaNombre",
    header: "Aula",
    cell: ({ row }) => {
      const aulas = row.original.aulaNombre;
      return aulas && aulas.length > 0 ? aulas.join(", ") : "Ninguna";
    },
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => {
      const aulas = row.aulaNombre;
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
    enableSorting: false,
    enableColumnFilter: false,
    accessorFn: (row) => {
      const estudiantes = row.estudiantes;
      return estudiantes && estudiantes.length > 0
        ? estudiantes.join(", ")
        : "Ninguno";
    },
  },
  {
    accessorKey: "userFullName",
    header: "Registrado por",
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
