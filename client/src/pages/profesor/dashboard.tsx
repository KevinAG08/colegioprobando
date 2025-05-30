import { useAuth } from "@/hooks/useAuth";
import {
  useActividadRecienteProfesor,
  useAsistenciaSemanalProfesor,
  useDistribucionIncidenciaProfesor,
  useEstadisticasProfesor,
} from "@/hooks/useDashboard";
import { User, Estudiante } from "@/types";
import {
  AlertCircle,
  CalendarCheck,
  CheckCircle,
  FileText,
  School,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DashboardProfesor = () => {
  const { user } = useAuth();

  const isUser = (user: User | Estudiante | null): user is User => {
    return user !== null && typeof user === "object" && "rol" in user;
  };

  const { data: estadisticas, isLoading: estadisticasLoading } =
    useEstadisticasProfesor(user?.id);
  const {
    data: distribucionIncidenciaProfesor,
    isLoading: distribucionIncidenciaProfesorLoading,
  } = useDistribucionIncidenciaProfesor(user?.id);
  const { data: asistenciaSemanal, isLoading: asistenciaLoading } =
    useAsistenciaSemanalProfesor(user?.id);
  const { data: actividadReciente, isLoading: actividadLoading } =
    useActividadRecienteProfesor(user?.id);

  // Datos fallback en caso de carga o error
  const estadisticasFallback = {
    estudiantes: 0,
    asistenciaHoy: 0,
    incidencias: 0,
  };

  const distribucionIncidenciaProfesorFallback = [
    { name: "Acoso escolar", value: 0 },
    { name: "Agresión física", value: 0 },
    { name: "Agresión verbal", value: 0 },
    { name: "Otros", value: 0 },
  ];

  const asistenciaSemanalFallback = [
    { day: "Lun", presente: 0, falta: 0 },
    { day: "Mar", presente: 0, falta: 0 },
    { day: "Mié", presente: 0, falta: 0 },
    { day: "Jue", presente: 0, falta: 0 },
    { day: "Vie", presente: 0, falta: 0 },
  ];

  const generateColors = (count: number) => {
    const baseColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];
    const colors = [];

    for (let i = 0; i < count; i++){
      if (i < baseColors.length) {
        colors.push(baseColors[i])
      } else {
        const hue = (i * 137.508) % 360;
        colors.push(`hsl(${hue}, 70%, 60%)`);
      }
    }

    return colors;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Panel de Profesor
            </h1>
            <p className="text-gray-600">
              Bienvenido, {user?.nombres} {user?.apellidos}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Aulas asignadas */}
        {isUser(user) && user?.aulas && user.aulas.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="font-semibold mb-3 flex items-center">
              <School className="h-5 w-5 mr-2 text-blue-600" />
              Tus aulas asignadas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {user.aulas.map((aulaProfesor) => (
                <a
                  href={`/profesor/estudiantes?aulaId=${aulaProfesor.aula.id}`}
                  key={aulaProfesor.id}
                  className="bg-blue-50 hover:bg-blue-100 p-3 rounded-lg flex flex-col items-center text-center"
                >
                  <School className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="font-medium text-blue-800">
                    {aulaProfesor.aula.nombre}
                  </span>
                  <span className="text-xs text-blue-600 mt-1">
                    {aulaProfesor.aula.nivel}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Estudiantes</p>
              <h3 className="text-xl font-bold">
                {estadisticasLoading
                  ? "..."
                  : estadisticas?.estudiantes ||
                    estadisticasFallback.estudiantes}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Asistencia hoy</p>
              <h3 className="text-xl font-bold">
                {estadisticasLoading
                  ? "..."
                  : `${
                      estadisticas?.asistenciaHoy ||
                      estadisticasFallback.asistenciaHoy
                    }%`}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Incidencias</p>
              <h3 className="text-xl font-bold">
                {estadisticasLoading
                  ? "..."
                  : estadisticas?.incidencias ||
                    estadisticasFallback.incidencias}
              </h3>
            </div>
          </div>
        </div>

        {/* Gráficos y estadísticas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Distribución de incidencias */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">
              Distribución de Incidencias
            </h3>
            <div className="h-64">
              {distribucionIncidenciaProfesorLoading ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Cargando datos...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={
                        distribucionIncidenciaProfesor ||
                        distribucionIncidenciaProfesorFallback
                      }
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {(
                        distribucionIncidenciaProfesor ||
                        distribucionIncidenciaProfesorFallback
                      ).map(
                        (
                          _:number, index: number
                        ) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={generateColors((distribucionIncidenciaProfesor || distribucionIncidenciaProfesorFallback).length)[index]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Asistencia semanal */}
          <div className="bg-white rounded-lg shadow p-4 col-span-1 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Asistencia Semanal</h3>
            <div className="h-64">
              {asistenciaLoading ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Cargando datos...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={asistenciaSemanal || asistenciaSemanalFallback}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="presente" fill="#22c55e" name="Presente" />
                    <Bar dataKey="falta" fill="#ef4444" name="Falta" />
                    <Bar
                      dataKey="faltaJustificada"
                      fill="#3b82f6"
                      name="Falta Justificada"
                    />
                    <Bar dataKey="tardanza" fill="#f97316" name="Tardanza" />
                    <Bar
                      dataKey="tardanzaJustificada"
                      fill="#84cc16"
                      name="Tardanza Justificada"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Actividad reciente y accesos rápidos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Actividad reciente */}
          <div className="bg-white rounded-lg shadow p-4 col-span-1 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Actividad Reciente</h3>
            </div>
            <div className="overflow-y-auto max-h-72">
              {actividadLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-gray-500">
                    Cargando actividad reciente...
                  </p>
                </div>
              ) : actividadReciente && actividadReciente.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {actividadReciente.map(
                    (
                      actividad: any // eslint-disable-line
                    ) => (
                      <li key={actividad.id} className="py-3">
                        <div className="flex items-start">
                          <span
                            className={`rounded-full p-2 mr-3 ${
                              actividad.tipo === "incidencia"
                                ? "bg-red-100"
                                : actividad.tipo === "asistencia"
                                ? "bg-green-100"
                                : "bg-blue-100"
                            }`}
                          >
                            {actividad.tipo === "incidencia" ? (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            ) : actividad.tipo === "asistencia" ? (
                              <CalendarCheck className="h-4 w-4 text-green-500" />
                            ) : (
                              <Users className="h-4 w-4 text-blue-500" />
                            )}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {actividad.descripcion}
                            </p>
                            <p className="text-xs text-gray-500">
                              {actividad.aula && `Aula: ${actividad.aula} • `}
                              {actividad.nombre && `${actividad.nombre} • `}
                              {actividad.fechaFormateada}
                            </p>
                          </div>
                        </div>
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="text-center py-4 text-gray-500">
                  No hay actividad reciente
                </p>
              )}
            </div>
          </div>

          {/* Accesos rápidos */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Accesos Rápidos</h3>
            <div className="space-y-3">
              <a
                href="/profesor/asistencia"
                className="py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center"
              >
                <CalendarCheck className="h-5 w-5 mr-3 text-green-600" />
                <span className="font-medium">Registrar asistencia</span>
              </a>
              <a
                href="/profesor/incidencias/registrar"
                className="py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center"
              >
                <AlertCircle className="h-5 w-5 mr-3 text-red-600" />
                <span className="font-medium">Registrar incidencia</span>
              </a>
              <a
                href="/profesor/estudiantes"
                className="py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center"
              >
                <Users className="h-5 w-5 mr-3 text-blue-600" />
                <span className="font-medium">Lista de estudiantes</span>
              </a>
              <a
                href="/profesor/reportes"
                className="py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center"
              >
                <FileText className="h-5 w-5 mr-3 text-indigo-600" />
                <span className="font-medium">Informes y Reportes</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfesor;
