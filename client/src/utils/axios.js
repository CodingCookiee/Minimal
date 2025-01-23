import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://minimalclothes.vercel.app/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
