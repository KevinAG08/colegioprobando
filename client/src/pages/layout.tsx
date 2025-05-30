import { useAuth } from "@/hooks/useAuth";
import React, { useState } from "react";
import logo from "@/assets/logo.png";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  AlertTriangle,
  FileText,
  UserRoundPen,
  LogOut,
  Menu,
  School,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  let navItems: { name: string; ruta: string; icon: React.ReactNode }[] = [];

  {
    /* OPCIONES BARRA DE NAVEGACIÓN CON ICONOS */
  }
  if (user?.rol === "admin") {
    navItems = [
      {
        name: "Dashboard",
        ruta: "/admin/dashboard",
        icon: <LayoutDashboard size={20} />,
      },
      {
        name: "Aulas",
        ruta: "/admin/aulas",
        icon: <School size={20} />,
      },
      {
        name: "Profesores",
        ruta: "/admin/profesores",
        icon: <Users size={20} />,
      },
      {
        name: "Estudiantes",
        ruta: "/admin/estudiantes",
        icon: <GraduationCap size={20} />,
      },
      {
        name: "Incidencias",
        ruta: "/admin/incidencias",
        icon: <AlertTriangle size={20} />,
      },
      {
        name: "Reportes",
        ruta: "/admin/reportes",
        icon: <FileText size={20} />,
      },
      {
        name: "Editar Perfil",
        ruta: "/admin/editar-perfil",
        icon: <UserRoundPen size={20} />,
      },
    ];
  } else if (user?.rol === "profesor") {
    navItems = [
      {
        name: "Dashboard",
        ruta: "/profesor/dashboard",
        icon: <LayoutDashboard size={20} />,
      },
      {
        name: "Incidencias",
        ruta: "/profesor/incidencias",
        icon: <AlertTriangle size={20} />,
      },
      {
        name: "Asistencia",
        ruta: "/profesor/asistencia",
        icon: <AlertTriangle size={20} />,
      },
      {
        name: "Estudiantes",
        ruta: "/profesor/estudiantes",
        icon: <GraduationCap size={20} />
      },
      {
        name: "Reportes",
        ruta: "/profesor/reportes",
        icon: <FileText size={20} />,
      },
      {
        name: "Editar Perfil",
        ruta: "/profesor/editar-perfil",
        icon: <UserRoundPen size={20} />,
      },
    ];
  }

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary/10 to-background/95">
      {/* Header*/}
      <header className="bg-white shadow-md relative z-30">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex flex-wrap justify-between items-center py-3 sm:py-4">
            {/* Logo y Nombre*/}
            <div className="flex items-center gap-1 sm:gap-2 w-auto max-w-full pr-2">
              <img
                src={logo}
                alt="Logo institución"
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full object-cover flex-shrink-0"
              />
              <h1 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold whitespace-normal">
                I.E. José María Arguedas Altamirano
              </h1>
            </div>

            {/* Botón de menú para móvil*/}
            <div className="lg:hidden flex-shrink-0 order-3 sm:order-2">
              <button
                onClick={toggleMenu}
                className="p-1 sm:p-2 rounded-md hover:bg-gray-100 focus:outline-none"
                aria-label="Toggle menu"
              >
                <Menu size={20} />
              </button>
            </div>

            {/* Menú para desktop */}
            <nav className="hidden lg:flex lg:flex-wrap items-center justify-end space-x-1 xl:space-x-2 order-2 w-auto">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.ruta}
                  className="px-2 py-1 my-1 lg:px-2 xl:px-3 lg:py-1 xl:py-2 rounded text-gray-700 hover:bg-blue-500 hover:text-white transition-colors duration-300 flex items-center gap-1 lg:gap-1 xl:gap-2 whitespace-nowrap text-xs lg:text-xs xl:text-sm"
                >
                  {item.icon}
                  <span className="hidden md:inline">{item.name}</span>
                </a>
              ))}
              <a
                key="logout"
                className="px-2 py-1 my-1 lg:px-2 xl:px-3 lg:py-1 xl:py-2 rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300 cursor-pointer flex items-center gap-1 lg:gap-1 xl:gap-2 whitespace-nowrap text-xs lg:text-xs xl:text-sm"
                onClick={logout}
              >
                <LogOut size={18} />
                <span className="hidden md:inline">Cerrar Sesión</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Menú móvil desplegable con animación */}
        <div
          className={`lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-40 transform transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="flex flex-col py-2 container mx-auto px-4">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.ruta}
                className="px-4 py-2 sm:py-3 text-gray-700 hover:bg-blue-500 hover:text-white transition-colors duration-300 flex items-center gap-2 sm:gap-3"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                {item.name}
              </a>
            ))}
            <a
              key="logout-mobile"
              className="px-4 py-2 sm:py-3 text-white bg-red-600 hover:bg-red-700 transition-colors duration-300 cursor-pointer mt-2 flex items-center gap-2 sm:gap-3"
              onClick={() => {
                setIsMenuOpen(false);
                logout();
              }}
            >
              <LogOut size={20} />
              Cerrar Sesión
            </a>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 p-2 sm:p-4 relative z-10">
        <div className="container mx-auto">{children}</div>
      </main>

      {/* Footer Responsive */}
      <footer className="bg-gray-800 text-white py-3 sm:py-4 relative z-10 mt-auto">
        <div className="text-center container mx-auto px-2 sm:px-4 text-xs sm:text-sm">
          <p>
            &copy; 2025 I.E. José María Arguedas Altamirano. Todos los derechos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
