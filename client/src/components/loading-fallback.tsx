export const LoadingFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      {/* Spinner principal */}
      <div className="relative">
        {/* Círculo exterior */}
        <div className="w-16 h-16 border-4 border-blue-200 dark:border-gray-600 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
        </div>

        {/* Círculo interior */}
        <div className="absolute top-2 left-2 w-12 h-12 border-2 border-indigo-300 dark:border-gray-500 rounded-full animate-pulse"></div>

        {/* Punto central */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
      </div>

      {/* Texto de carga */}
      <div className="mt-8 text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Cargando aplicación
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          Por favor espera un momento...
        </p>
      </div>

      {/* Puntos animados */}
      <div className="flex space-x-1 mt-4">
        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>

      {/* Barra de progreso simulada */}
      <div className="w-full max-w-xs mt-8">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full w-full origin-left transform scale-x-0 animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
};
