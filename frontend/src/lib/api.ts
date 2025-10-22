import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth
export const register = (data: { email: string; password: string; first_name: string; last_name: string }) =>
  api.post("/auth/register", data);

export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

export const getCurrentUser = () => api.get("/auth/me");

// Appointments
export const getAppointments = () => api.get("/appointments/");

export const createAppointment = (data: {
  stylist_id: number;
  service_id: number;
  appointment_date: string;
  notes?: string;
}) => api.post("/appointments/", data);

export const updateAppointment = (id: number, data: Record<string, unknown>) =>
  api.put(`/appointments/${id}`, data);

export const cancelAppointment = (id: number) =>
  api.delete(`/appointments/${id}`);

// Services
export const getServices = (category?: string) =>
  api.get("/services/", { params: category ? { category } : {} });

export const getService = (id: number) => api.get(`/services/${id}`);

// Recommendations
export const getRecommendations = (profile: {
  preferred_length?: string;
  maintenance_preference?: string;
  face_shape?: string;
  preferred_category?: string;
}) => api.post("/recommendations/", profile);

export const getPriceEstimate = (data: {
  style_id: number;
  hair_length?: string;
  additional_treatments?: string[];
}) => api.post("/recommendations/price-estimate", data);

export const getStyleCatalog = () => api.get("/recommendations/styles");

export default api;
