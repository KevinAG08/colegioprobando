import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import IncidenciasExportProfesor from "./components/reportes-incidencias";
import AsistenciasExportProfesor from "./components/reportes-asistencias";

const ReportesProfesor = () => {
    return(
        <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">Reportes</h1>

            <Tabs defaultValue="incidencias" className="w-full">
                <TabsList className="grid w-full md:w-80 grid-cols-2">
                    <TabsTrigger value="incidencias">Incidencias</TabsTrigger>
                    <TabsTrigger value="asistencias">Asistencias</TabsTrigger>
                </TabsList>

                <div className="mt-4">
                    <TabsContent value="incidencias" className="bg-white rounded-lg shadow p-4">
                        <IncidenciasExportProfesor />
                    </TabsContent>

                    <TabsContent value="asistencias" className="bg-white rounded-lg shadow p-4">
                        <AsistenciasExportProfesor />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

export default ReportesProfesor;