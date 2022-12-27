import axios from "axios";

export const api = axios.create({
  baseURL: "http://172.25.100.95:3333",
});
