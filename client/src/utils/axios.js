import axios from "axios";

const axiosInstance = axios.create({
<<<<<<< HEAD
  baseURL: "http://localhost:8800/api",
=======
  baseURL: "https://minimal.up.railway.app/api",
>>>>>>> 671d37e18db8a10eac83edb845ca176eed6de893
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
