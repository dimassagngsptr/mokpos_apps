import axios from "axios";

const token = localStorage.getItem("token");
export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/v1`,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
