import axios from "axios";
import { endpoints } from "./APIs";
const BASE_URL =
  process.env.BASE_URL + "/api/admin";

export const adminEndpoints = {
  readAll: (model) => `/${model}`,
  loadDataForComboboxInForm: (model) => `/${model}/all`,
  readOne: (model, id) => `/${model}/${id}`,
  createOne: (model) => `/${model}`,
  updateOne: (model, id) => `/${model}/${id}`,
  deleteOne: (model, id) => `/${model}/${id}`,
};

export const authAdminApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ cookies included in all calls
});

// Add interceptor
authAdminApi.interceptors.response.use(
  (response) => response, // pass through if successful
  async (error) => {
    const originalRequest = error.config;

    // If token expired and not already retried
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Call refresh endpoint
        const refreshResponse = await axios.post(
          endpoints.refreshAccessToken,
          {},
          {
            baseURL: BASE_URL,
            withCredentials: true,
          }
        );

        if (refreshResponse.status === 200) {
          // Retry original request
          return authAdminApi(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        // Optional: redirect to login or show error
      }
    }

    return Promise.reject(error);
  }
);

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "content-type": "application/json",
  },
  timeout: 0,
  withCredentials: true, // ✅ for login/register/etc
});
