import axios from "axios";
import Cookies from "js-cookie";
import { TOKEN } from "../constants";

export const request = axios.create({
  baseURL: "https://pythonjon.pythonanywhere.com/api/v1/",
  timeout: 10000,
  headers: {
    Authorization: Cookies.get(TOKEN) ? "Bearer " + Cookies.get(TOKEN) : null
  }
});
