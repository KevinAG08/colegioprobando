import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AsistenciasExport from "./components/reportes-asistencias";
import IncidenciasExport from "./components/reportes-incidencias";

const ReportesPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Reportes</h1>
      
      <Tabs defaultValue="incidencias" className="w-full">
        <TabsList className="grid w-full md:w-80 grid-cols-2">
          <TabsTrigger value="incidencias">Incidencias</TabsTrigger>
          <TabsTrigger value="asistencias">Asistencias</TabsTrigger>
        </TabsList>
        
        <div className="mt-4">
          <TabsContent value="incidencias" className="bg-white rounded-lg shadow p-4">
            <IncidenciasExport />
          </TabsContent>
          
          <TabsContent value="asistencias" className="bg-white rounded-lg shadow p-4">
            <AsistenciasExport />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ReportesPage;