import axios from "axios";
const BASE_URL = "/v1";

export const endpoints = {
  getAllProducts: "/products",
  getCategories: "/categories",
  createOrder: "/orders",
  createOrderDetails: "/orderDetails",
  generateOTP: "/users/generate-otp",
  getOrderDetails: (orderId, page) => `/orders/${orderId}/orderDetails/${page}`,
  getOrdersOfCustomer: (userId, page) => `/orders/${userId}/${page}`,
  login: "/auth/login",
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
};

export const authApi = (accessToken) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    timeout: 0,
    withCredentials: false,
  });
};

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "content-type": "application/json",
  },
  timeout: 0,
  withCredentials: false,
});
