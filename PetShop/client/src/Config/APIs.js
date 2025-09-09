import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;

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
  chatBot: `/chat-bot-faq/chat`,
  "csrf-token": "/csrf-token",
  getNotifications: "/notifications",
  markANotificationAsRead: (notificationId) =>
    `/notifications/${notificationId}/update`,
};

export const adminEndpoints = {
  readAll: (model) => `/admin/${model}`,
  loadDataForComboboxInForm: (model) => `/admin/${model}/all`,
  readOne: (model, id) => `/admin/${model}/${id}`,
  createOne: (model) => `/admin/${model}`,
  updateOne: (model, id) => `/admin/${model}/${id}`,
  deleteOne: (model, id) => `/admin/${model}/${id}`,
  "stats-revenue": "/admin/stats/revenue",
  "stats-best-selling-products": "/admin/stats/selling-best-products",
  "stats-most-popular-products": "/admin/stats/most-popular-products",
};

let csrfToken = null; // lưu tạm trong memory

// Hàm gọi API để lấy CSRF token
export const fetchCsrfToken = async () => {
  try {
    const res = await axios.get(`${BASE_URL}${endpoints["csrf-token"]}`, {
      withCredentials: true,
    });
    csrfToken = res.data.csrfToken; // server trả { csrfToken: "xxx" }
    return csrfToken;
  } catch (err) {
    console.error("Failed to fetch CSRF token", err);
    return null;
  }
};

export const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "content-type": "application/json",
  },
  withCredentials: true, // ✅ cookies included in all calls
});

// Request interceptor → chèn CSRF header
authApi.interceptors.request.use(
  async (config) => {
    const dangerousMethods = ["post", "put", "patch", "delete"];

    if (dangerousMethods.includes(config.method)) {
      if (!csrfToken) {
        // nếu chưa có thì gọi luôn
        csrfToken = await fetchCsrfToken();
      }
      config.headers["X-CSRF-Token"] = csrfToken;
    }
    // console.log("🚀 Sending request:", config.url);
    // console.log("Headers:", config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

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
