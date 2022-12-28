import axios from "axios";

const urls = ["192.168.0.44", "172.25.100.95"];

export const api = axios.create({
  baseURL: `http://${urls[0]}:3333`,
});
