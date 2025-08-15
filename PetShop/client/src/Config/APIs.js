import axios from "axios";
const BASE_URL = process.env.REACT_APP_PROXY_URL_RENDER_SERVER + "/v1" || "/v1";

export const endpoints = {
  getAllProducts: "/products",
  checkStock: (productId) => `/products/check-stock/${productId}`,
  getCategories: "/categories",
  createOrder: "/orders",
  createOrderDetails: "/orderDetails",
  generateOTP: "/users/generate-otp",
  getOrderDetails: (orderId, page) => `/orders/${orderId}/orderDetails`,
  getOrdersOfCustomer: (userId, page) => `/orders/user/${userId}`,
  login: "/auth/login",
  logout: "/auth/logout",
  authMe: "/auth/me",
  refreshAccessToken: "/auth/refresh",
  verifyEmail: "/auth/verify-email",
  getProductById: (type, productId) => `/products/${type}/${productId}`,
  uploadAvatarToCloudinary: (baseURLCloud, cloudName, dirCloud) =>
    `${baseURLCloud}${cloudName}${dirCloud}`,
  register: "/auth/register",
  resetPassword: "/users/reset-password",
  updateInfor: (userId) => `/users/${userId}/update-infor`,
  createOrUpdateFavorite: "/favorites",
  deleteFavorite: (favoriteId) => `/favorites/${favoriteId}`,
  getFavoriteProductOfUser: (productId, userId) =>
    `/favorites/product/${productId}/user/${userId}`,
  getFavoriteProductsList: (userId) => `/favorites/user/${userId}`,
  addComment: "/comments/",
  getCommentsByProduct: (productId) => `/comments/product/${productId}`,
  deleteComment: (commentId) => `/comments/${commentId}`,
  updateComment: (commentId) => `/comments/${commentId}`,
  deleteCommentDetails: (commentDetailsId) =>
    `/commentDetails/${commentDetailsId}`,
  getComment: (commentId) => `/comments/${commentId}`,
  createPaymentForOrder: `/payments/`,
  updateStatusOfOrder: (orderId) => `/orders/${orderId}`,
  getOrder: (orderId) => `/orders/${orderId}`,
  getPaymentOfOrder: (orderId) => `/payments/order/${orderId}`,
  getPaymentDetailsOfOrder: (paymentId) => `/payments/${paymentId}`,
  createShipment: "/shipments",
  calculateShipmentFee: "/shipments/calculate-fee",
  getShipmentOfOrder: (orderId) => `/shipments/order/${orderId}`,
};

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ cookies included in all calls
});

// Add interceptor
authApi.interceptors.response.use(
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
          return authApi(originalRequest);
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
