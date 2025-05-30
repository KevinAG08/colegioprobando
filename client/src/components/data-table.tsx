import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultSorting?: SortingState;
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;
  searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  defaultSorting = [],
  enableGlobalFilter = true,
  enableColumnFilters = true,
  searchPlaceholder = "Buscar...",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Función para renderizar headers con ordenamiento
  const renderSortableHeader = (
    headerProps: any, // eslint-disable-line
    originalHeader: any, // eslint-disable-line
    canSort: boolean
  ) => {
    if (!canSort) {
      return originalHeader;
    }

    return (
      <Button
        variant="ghost"
        onClick={() =>
          headerProps.column.toggleSorting(
            headerProps.column.getIsSorted() === "asc"
          )
        }
        className="h-auto p-0 font-semibold hover:bg-transparent"
      >
        {originalHeader}
        {headerProps.column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : headerProps.column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
        )}
      </Button>
    );
  };

  const table = useReactTable({
    data,
    columns, // Usar las columnas originales sin modificar
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      sorting: defaultSorting,
    },
  });

  // Obtener columnas filtrables (excluyendo acciones e índices)
  const filterableColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        column.getCanFilter() &&
        column.id !== "actions" &&
        column.id !== "index"
    );

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        {/* Búsqueda global */}
        {enableGlobalFilter && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Filtros por columna */}
        {enableColumnFilters && (
          <div className="flex flex-wrap gap-2">
            {filterableColumns.slice(0, 3).map((column) => {
              const columnMeta = column.columnDef.meta as any; // eslint-disable-line
              const filterLabel =
                columnMeta?.filterLabel ||
                (typeof column.columnDef.header === "string"
                  ? column.columnDef.header
                  : column.id);

              return (
                <Input
                  key={column.id}
                  placeholder={`Filtrar por ${filterLabel}...`}
                  value={(column.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    column.setFilterValue(event.target.value)
                  }
                  className="w-40 text-sm"
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Información de resultados */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Mostrando {table.getFilteredRowModel().rows.length} de {data.length}{" "}
          resultados
          {globalFilter && ` para "${globalFilter}"`}
        </div>
        {(globalFilter || columnFilters.length > 0) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setGlobalFilter("");
              setColumnFilters([]);
            }}
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-semibold">
                      {header.isPlaceholder
                        ? null
                        : (() => {
                            const originalHeader = flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            );

                            // Verificar si la columna puede ordenarse
                            const canSort =
                              header.column.getCanSort() &&
                              header.column.id !== "actions" &&
                              header.column.id !== "index";

                            return renderSortableHeader(
                              header,
                              originalHeader,
                              canSort
                            );
                          })()}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  {globalFilter || columnFilters.length > 0
                    ? "No se encontraron resultados con los filtros aplicados"
                    : "Sin resultados"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
