import axios from "axios";
const BASE_URL = "http://localhost:8080";

export const endpoints = {};

export const authApi = (accessToken) => {
  axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
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
