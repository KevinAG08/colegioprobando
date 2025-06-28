import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://colegio-api-3w74.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing: boolean = false;
let failedQueue: any[] = []; // eslint-disable-line

const processQueue = (error: any, token = null) => {// eslint-disable-line
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log("API Error:", error.response?.status, error.response?.data);
    console.log("Is retry:", originalRequest._retry);

    if (!error.response) {
      return Promise.reject(error);
    }

    // Si el error es 401 y no estamos en una solicitud de refreshToken
    if (
      error.response?.status === 401 &&
      (error.response.data?.message === "Token expirado" ||
        error.response.data?.message?.includes("expired")) &&
      !originalRequest._retry &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;
      console.log("Intentando refrescar el token...");

      try {
        const response = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        const { accessToken, user } = response.data;

        if (!accessToken) {
          throw new Error("No se recibió un nuevo token");
        }

        localStorage.setItem("accessToken", accessToken);
        if (user) localStorage.setItem("user", JSON.stringify(user));

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError: any) { // eslint-disable-line
        console.error("Error al refrescar el token: ", refreshError.response?.data || refreshError);
        processQueue(refreshError, null);
        isRefreshing = false;        
        // Si el refresh token falla, eliminamos los tokens y redirigimos al login
        if (refreshError.response?.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
