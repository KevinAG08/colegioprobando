import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4 text-center"
    >
      <div className="max-w-md w-full space-y-6">
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            className="w-40 h-40 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-gray-800">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            ¡Ups! La página que estás buscando no existe.
          </h2>
          <p className="text-gray-500">
            Lo sentimos, la página que estás buscando no se encuentra disponible
            o ha sido eliminada.
          </p>
        </div>

        <Button
          onClick={() => navigate("/")}
          className="w-full max-w-xs mx-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          Volver al inicio
        </Button>

        <p className="text-sm text-gray-400 mt-6">
          ¿Necesitas ayuda?{" "}
          <a
            href="mailto:soporte@colegio.com"
            className="text-indigo-500 hover:underline"
          >
            Contáctanos
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;
