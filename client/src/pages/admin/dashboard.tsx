import { useAuth } from "@/hooks/useAuth";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, UserPlus, School, CalendarCheck, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { useEstadisticas, useAsistenciaSemanal, useActividadReciente, useDistribucionAula } from "@/hooks/useDashboard";

const DashboardAdmin = () => {
  const { user } = useAuth();
  
  // Obtener datos usando los hooks personalizados con React Query
  const { data: estadisticas, isLoading: estadisticasLoading } = useEstadisticas();
  const { data: distribucionAula, isLoading: distribucionAulaLoading } = useDistribucionAula();
  const { data: asistenciaSemanal, isLoading: asistenciaLoading } = useAsistenciaSemanal();
  const { data: actividadReciente, isLoading: actividadLoading } = useActividadReciente();
  
  console.log(asistenciaSemanal)
  console.log(actividadReciente);
  // Datos fallback en caso de carga o error
  const estadisticasFallback = {
    estudiantes: 0,
    profesores: 0,
    aulas: 0,
    asistenciaHoy: 0,
    incidencias: 0
  };
  
  const distribucionAulaFallback = [
    { name: '1°A', value: 0 },
    { name: '1°B', value: 0 },
    { name: '2°A', value: 0 },
    { name: '2°B', value: 0 },
    { name: '3°A', value: 0 },
    { name: '3°B', value: 0 }
  ];

  const asistenciaSemanalFallback = [
    { day: 'Lun', presente: 0, falta: 0 },
    { day: 'Mar', presente: 0, falta: 0 },
    { day: 'Mié', presente: 0, falta: 0 },
    { day: 'Jue', presente: 0, falta: 0 },
    { day: 'Vie', presente: 0, falta: 0 }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
            <p className="text-gray-600">
              Bienvenido, {user?.nombres} {user?.apellidos}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
        
        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Estudiantes</p>
              <h3 className="text-xl font-bold">
                {estadisticasLoading ? '...' : estadisticas?.estudiantes || estadisticasFallback.estudiantes}
              </h3>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <UserPlus className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Profesores</p>
              <h3 className="text-xl font-bold">
                {estadisticasLoading ? '...' : estadisticas?.profesores || estadisticasFallback.profesores}
              </h3>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <School className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Aulas</p>
              <h3 className="text-xl font-bold">
                {estadisticasLoading ? '...' : estadisticas?.aulas || estadisticasFallback.aulas}
              </h3>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-amber-100 p-3 mr-4">
              <CalendarCheck className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Asistencia hoy</p>
              <h3 className="text-xl font-bold">
                {estadisticasLoading ? '...' : `${estadisticas?.asistenciaHoy || estadisticasFallback.asistenciaHoy}%`}
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
                {estadisticasLoading ? '...' : estadisticas?.incidencias || estadisticasFallback.incidencias}
              </h3>
            </div>
          </div>
        </div>
        
        {/* Gráficos y estadísticas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Distribución por nivel */}
           <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Distribución por Aula</h3>
            <div className="h-64">
              {distribucionAulaLoading ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Cargando datos...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribucionAula || distribucionAulaFallback}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {(distribucionAula || distribucionAulaFallback).map((index: any) => (      // eslint-disable-line
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> 
                      ))}
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
                    <Bar dataKey="presente" fill="#4ade80" name="Presente" />
                    <Bar dataKey="falta" fill="#f87171" name="Falta" />
                    <Bar dataKey="faltaJustificada" fill="#facc15" name="Falta Justificada" />
                    <Bar dataKey="tardanza" fill="#fb923c" name="Tardanza" />
                    <Bar dataKey="tardanzaJustificada" fill="#60a5fa" name="Tardanza Justificada" />
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
              <button className="text-blue-600 text-sm font-medium flex items-center">
                Ver todo
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-72">
              {actividadLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-gray-500">Cargando actividad reciente...</p>
                </div>
              ) : actividadReciente && actividadReciente.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {actividadReciente.map((actividad: any) => ( // eslint-disable-line
                    <li key={actividad.id} className="py-3">
                      <div className="flex items-start">
                        <span className={`rounded-full p-2 mr-3 ${
                          actividad.tipo === 'incidencia' ? 'bg-red-100' : 
                          actividad.tipo === 'asistencia' ? 'bg-green-100' : 
                          'bg-blue-100'
                        }`}>
                          {actividad.tipo === 'incidencia' ? <AlertCircle className="h-4 w-4 text-red-500" /> : 
                          actividad.tipo === 'asistencia' ? <CalendarCheck className="h-4 w-4 text-green-500" /> : 
                          <Users className="h-4 w-4 text-blue-500" />}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{actividad.descripcion}</p>
                          <p className="text-xs text-gray-500">
                            {actividad.aula && `Aula: ${actividad.aula} • `}
                            {actividad.nombre && `${actividad.nombre} • `}
                            {actividad.fechaFormateada}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center py-4 text-gray-500">No hay actividad reciente</p>
              )}
            </div>
          </div>
          
          {/* Accesos rápidos */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Accesos Rápidos</h3>
            <div className="space-y-3">
              <a href="/admin/profesores" className="py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center">
                <Users className="h-5 w-5 mr-3 text-blue-600" />
                <span className="font-medium">Gestionar profesores</span>
              </a>
              <a href="/admin/estudiantes" className="py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center">
                <UserPlus className="h-5 w-5 mr-3 text-green-600" />
                <span className="font-medium">Gestionar estudiantes</span>
              </a>
              <a href="/admin/aulas" className="py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center">
                <School className="h-5 w-5 mr-3 text-purple-600" />
                <span className="font-medium">Gestionar aulas</span>
              </a>
              <a href="/admin/incidencias" className="py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-3 text-red-600" />
                <span className="font-medium">Gestionar incidencias</span>
              </a>
              <a href="/admin/reportes" className="py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center">
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

export default DashboardAdmin;
