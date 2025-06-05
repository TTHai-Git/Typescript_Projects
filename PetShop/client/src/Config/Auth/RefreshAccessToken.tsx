import axios from "axios";
import { endpoints } from "../APIs";

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(endpoints.refreshAccessToken, {}, {
      withCredentials: true, // Required to send cookies
    });

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return false;
  }
};

export default refreshAccessToken;
